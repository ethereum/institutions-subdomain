import { NextRequest, NextResponse } from "next/server"

import { sanitizeInput } from "@/lib/utils/sanitize"
import { CONSUMER_DOMAINS } from "@/lib/constants"

import PostHogClient from "@/lib/posthog-server"

const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET
const HCAPTCHA_VERIFY_URL = "https://api.hcaptcha.com/siteverify"

const HUBSPOT_PORTAL_ID = "147481544"
const HUBSPOT_FORM_ID = "46696f5b-47a4-4ee5-ac76-8597d4155e79"
// EU region endpoint -- must match the portal's data hosting region
const HUBSPOT_SUBMIT_URL = `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`

const MAX_INPUT_LENGTH = 2 ** 6 // 64
const MAX_MESSAGE_LENGTH = 2 ** 12 // 4,096

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isConsumerEmail(email: string): boolean {
  const domain = email.toLowerCase().split("@")[1]
  return CONSUMER_DOMAINS.includes(domain)
}

async function verifyCaptcha(token: string, secret: string): Promise<boolean> {
  const params = new URLSearchParams({
    secret,
    response: token,
  })

  const res = await fetch(HCAPTCHA_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  })

  const data = await res.json()
  return data.success === true
}

export async function POST(request: NextRequest) {
  const posthog = PostHogClient()

  if (!HCAPTCHA_SECRET) {
    console.error("HCAPTCHA_SECRET is not configured")
    posthog.capture({
      distinctId: "anonymous",
      event: "contact_form_error",
      properties: { error: "captcha_not_configured" },
    })
    await posthog.shutdown()
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      company,
      jobTitle,
      country,
      message,
      captchaToken,
    } = body

    // Verify hCaptcha token
    if (!captchaToken) {
      posthog.capture({
        distinctId: "anonymous",
        event: "contact_form_error",
        properties: { error: "missing_captcha" },
      })
      await posthog.shutdown()
      return NextResponse.json(
        { error: "CAPTCHA verification required" },
        { status: 400 }
      )
    }

    const captchaValid = await verifyCaptcha(captchaToken, HCAPTCHA_SECRET)
    if (!captchaValid) {
      posthog.capture({
        distinctId: "anonymous",
        event: "contact_form_error",
        properties: { error: "captcha_failed" },
      })
      await posthog.shutdown()
      return NextResponse.json(
        { error: "CAPTCHA verification failed" },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!email || !firstName || !lastName || !message) {
      posthog.capture({
        distinctId: "anonymous",
        event: "contact_form_error",
        properties: { error: "missing_required_fields" },
      })
      await posthog.shutdown()
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      )
    }

    // Sanitize all inputs
    const sanitized = {
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      email: sanitizeInput(email),
      company: sanitizeInput(company || ""),
      jobTitle: sanitizeInput(jobTitle || ""),
      country: sanitizeInput(country || ""),
      message: sanitizeInput(message),
    }

    // Validate email format
    if (!validateEmail(sanitized.email)) {
      posthog.capture({
        distinctId: "anonymous",
        event: "contact_form_error",
        properties: { error: "invalid_email_format" },
      })
      await posthog.shutdown()
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Enforce business email requirement
    if (isConsumerEmail(sanitized.email)) {
      posthog.capture({
        distinctId: "anonymous",
        event: "contact_form_error",
        properties: { error: "consumer_email_blocked" },
      })
      await posthog.shutdown()
      return NextResponse.json(
        { error: "Business email required" },
        { status: 400 }
      )
    }

    // Validate lengths
    if (
      sanitized.firstName.length > MAX_INPUT_LENGTH ||
      sanitized.lastName.length > MAX_INPUT_LENGTH ||
      sanitized.email.length > MAX_INPUT_LENGTH ||
      sanitized.company.length > MAX_INPUT_LENGTH ||
      sanitized.jobTitle.length > MAX_INPUT_LENGTH ||
      sanitized.country.length > MAX_INPUT_LENGTH
    ) {
      await posthog.shutdown()
      return NextResponse.json(
        { error: "Field exceeds maximum length" },
        { status: 400 }
      )
    }

    if (sanitized.message.length > MAX_MESSAGE_LENGTH) {
      await posthog.shutdown()
      return NextResponse.json(
        { error: "Message exceeds maximum length" },
        { status: 400 }
      )
    }

    // Submit to HubSpot Forms API
    const hubspotRes = await fetch(HUBSPOT_SUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: [
          { name: "firstname", value: sanitized.firstName },
          { name: "lastname", value: sanitized.lastName },
          { name: "email", value: sanitized.email },
          { name: "company", value: sanitized.company },
          { name: "jobtitle", value: sanitized.jobTitle },
          { name: "country", value: sanitized.country },
          {
            name: "inbound_form_request_text",
            value: sanitized.message,
          },
        ],
      }),
    })

    if (!hubspotRes.ok) {
      console.error("HubSpot submission failed:", hubspotRes.status)
      posthog.capture({
        distinctId: sanitized.email,
        event: "contact_form_error",
        properties: { error: "hubspot_submission_failed" },
      })
      await posthog.shutdown()
      return NextResponse.json(
        { error: "Failed to submit. Please try again later." },
        { status: 502 }
      )
    }

    posthog.capture({
      distinctId: sanitized.email,
      event: "contact_form_submitted",
    })
    await posthog.shutdown()

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Contact form error:", error)

    posthog.capture({
      distinctId: "anonymous",
      event: "contact_form_error",
      properties: { error: "internal_server_error" },
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
