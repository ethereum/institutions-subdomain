import { NextRequest, NextResponse } from "next/server"
import { SendRawEmailCommand, SESClient } from "@aws-sdk/client-ses"

import { sanitizeInput } from "@/lib/utils/sanitize"

import PostHogClient from "@/lib/posthog-server"

const ENTERPRISE_EMAIL = "enterprise@ethereum.org"
const SES_FROM_EMAIL = "enterprise-contact@ethereum.org"

// Configure SES client
const sesClient = new SESClient({
  region: process.env.SES_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY!,
  },
})

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function createRawEmail(
  fromEmail: string,
  toEmail: string,
  replyToEmail: string,
  subject: string,
  textBody: string
): string {
  const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36)}`

  return [
    `From: ${fromEmail}`,
    `To: ${toEmail}`,
    `Reply-To: ${replyToEmail}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    textBody,
    ``,
    `--${boundary}--`,
  ].join("\r\n")
}

async function sendEmail(
  name: string,
  userEmail: string,
  message: string
): Promise<void> {
  const subject = "Enterprise Inquiry from institutions.ethereum.org"
  const textBody = `
New enterprise inquiry received:

From: ${name}<${userEmail}>
Timestamp: ${new Date().toISOString()}

Message:
${message}

---
This message was sent via the enterprise contact form on institution.ethereum.org.
Reply to this email to respond directly to the sender.
  `.trim()

  const rawEmail = createRawEmail(
    SES_FROM_EMAIL,
    ENTERPRISE_EMAIL,
    userEmail,
    subject,
    textBody
  )

  const command = new SendRawEmailCommand({
    RawMessage: {
      Data: new TextEncoder().encode(rawEmail),
    },
  })

  await sesClient.send(command)
}

export async function POST(request: NextRequest) {
  const posthog = PostHogClient()

  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate input
    if (!email || !message) {
      posthog.capture({
        distinctId: "anonymous",
        event: "contact_form_error",
        properties: {
          error: "missing_required_fields",
        },
      })
      await posthog.shutdown()

      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name)
    const sanitizedEmail = sanitizeInput(email)
    const sanitizedMessage = sanitizeInput(message)

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      posthog.capture({
        distinctId: "anonymous",
        event: "contact_form_error",
        properties: {
          error: "invalid_email_format",
        },
      })
      await posthog.shutdown()

      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Send email via AWS SES
    try {
      await sendEmail(sanitizedName, sanitizedEmail, sanitizedMessage)

      // Track successful submission
      posthog.capture({
        distinctId: sanitizedEmail,
        event: "contact_form_submitted",
        properties: {
          name: sanitizedName,
        },
      })
      await posthog.shutdown()

      return NextResponse.json(
        { message: "Message sent successfully" },
        { status: 200 }
      )
    } catch (emailError) {
      console.error("AWS SES email sending failed:", emailError)

      posthog.capture({
        distinctId: sanitizedEmail,
        event: "contact_form_error",
        properties: {
          error: "email_send_failed",
        },
      })
      await posthog.shutdown()

      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Enterprise contact form error:", error)

    posthog.capture({
      distinctId: "anonymous",
      event: "contact_form_error",
      properties: {
        error: "internal_server_error",
      },
    })
    await posthog.shutdown()

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
