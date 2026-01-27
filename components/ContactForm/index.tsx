"use client"

import React, { useEffect, useRef, useState } from "react"
import { HeartHandshake, TriangleAlert } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import posthog from "posthog-js"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

import { cn } from "@/lib/utils"
import { sanitizeInput } from "@/lib/utils/sanitize"

import { ENTERPRISE_EMAIL } from "@/lib/constants"

import Link from "../ui/link"

// Consumer email domains to block
const CONSUMER_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "protonmail.com",
  "proton.me",
  "pm.me",
  "aol.com",
  "mail.com",
  "yandex.com",
  "tutanota.com",
  "fastmail.com",
  "zoho.com",
  "gmx.com",
  "live.com",
  "msn.com",
  "me.com",
  "mac.com",
  "rocketmail.com",
  "yahoo.co.uk",
  "googlemail.com",
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
]

const MAX_INPUT_LENGTH = 2 ** 6 // 64
const MAX_MESSAGE_LENGTH = 2 ** 12 // 4,096

type FormState = {
  name: string
  email: string
  message: string
}

type FormErrors = {
  name?: React.ReactNode
  email?: React.ReactNode
  message?: React.ReactNode
  general?: React.ReactNode
}

type SubmissionState = "idle" | "submitting" | "success" | "error"

const EnterpriseContactForm = () => {
  const t = useTranslations("contactForm")
  const pathname = usePathname()
  const prevPathname = useRef(pathname)

  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle")

  // Reset form errors and submission state on page transition—keep any progress
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setErrors({})
      setSubmissionState("idle")
      prevPathname.current = pathname
    }
  }, [pathname])

  const handleInputChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      setFormData((prev) => ({ ...prev, [field]: value }))

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }

  const handleBlur =
    (field: keyof FormState) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value

      if (field === "name") {
        const nameError = validateName(value)
        if (nameError) setErrors((prev) => ({ ...prev, name: nameError }))
        return
      }
      if (field === "email") {
        const emailError = validateEmail(value)
        if (emailError) setErrors((prev) => ({ ...prev, email: emailError }))
        return
      }
      if (field === "message") {
        const messageError = validateMessage(value)
        if (messageError)
          setErrors((prev) => ({ ...prev, message: messageError }))
        return
      }
    }

  const validateName = (name: string): React.ReactNode | undefined => {
    const sanitized = sanitizeInput(name)

    if (!sanitized) return t("errors.required")

    if (sanitized.length > MAX_INPUT_LENGTH)
      return t("errors.nameTooLong", { max: MAX_MESSAGE_LENGTH })

    return undefined
  }

  const validateEmail = (email: string): React.ReactNode | undefined => {
    const sanitized = sanitizeInput(email)

    if (!sanitized) return t("errors.required")

    if (sanitized.length > MAX_INPUT_LENGTH)
      return t("errors.emailTooLong", { max: MAX_MESSAGE_LENGTH })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitized)) return t("errors.invalidEmail")

    const domain = sanitized.toLowerCase().split("@")[1]
    if (CONSUMER_DOMAINS.includes(domain))
      return t("errors.businessEmailRequired")

    return undefined
  }

  const validateMessage = (
    message: string
  ): React.ReactNode | string | undefined => {
    const sanitized = sanitizeInput(message)

    if (!sanitized) return t("errors.required")

    if (sanitized.length > MAX_MESSAGE_LENGTH)
      return t("errors.messageTooLong", { max: MAX_MESSAGE_LENGTH })

    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    const nameError = validateName(formData.name)
    if (nameError) newErrors.name = nameError

    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError

    const messageError = validateMessage(formData.message)
    if (messageError) newErrors.message = messageError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setSubmissionState("submitting")
    setErrors({})

    // Track form submission attempt
    posthog.capture("contact_form_attempt")

    try {
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        message: sanitizeInput(formData.message),
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedData),
      })

      if (!response.ok) throw new Error(`Server error: ${response.status}`)

      setSubmissionState("success")
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmissionState("error")
      setErrors({
        general: (
          <>
            {t("errors.generalError")}{" "}
            <Link
              href={`mailto:${ENTERPRISE_EMAIL}?subject=Enterprise%20inquiry`}
              inline
              showDecorator
              className="text-nowrap text-current hover:text-current/80"
            >
              {ENTERPRISE_EMAIL}
            </Link>
          </>
        ),
      })
    }
  }

  const getCharacterCountClasses = (currentLength: number, maxLength: number) =>
    cn(
      currentLength >= Math.floor(maxLength * 0.9) && "flex", // Show char count when within 10% remaining to limit
      currentLength > maxLength - 64 && "text-warning-border", // Warning color within 64 chars (border version for proper contrast ratio),
      currentLength > maxLength && "text-destructive [&_svg]:inline" // Error color over limit
    )

  const isDisabled =
    submissionState === "submitting" ||
    !formData.email ||
    !formData.name ||
    !formData.message

  if (submissionState === "success")
    return (
      <div className="border-border/50 bg-primary flex w-full max-w-prose flex-col items-center gap-y-6 rounded border p-6 text-center">
        <div className="mb-2 flex items-center gap-4">
          <HeartHandshake className="text-primary-foreground size-8" />
          <h4 className="text-xl font-semibold">{t("successTitle")}</h4>
        </div>
        <p className="text-body-medium">
          {t("successMessage")}
        </p>
      </div>
    )

  return (
    <div className="w-full max-w-[440px] space-y-6">
      <div className="space-y-2">
        <Input
          name="name"
          autoComplete="name"
          type="text"
          className="w-full"
          placeholder={t("namePlaceholder")}
          value={formData.name}
          onChange={handleInputChange("name")}
          onBlur={handleBlur("name")}
          hasError={!!errors.name}
          disabled={submissionState === "submitting"}
        />
        {errors.name && (
          <p className="text-destructive text-sm" role="alert">
            {errors.name}
          </p>
        )}
        <Input
          name="email"
          autoComplete="email"
          type="email"
          className="w-full"
          placeholder={t("emailPlaceholder")}
          value={formData.email}
          onChange={handleInputChange("email")}
          onBlur={handleBlur("email")}
          hasError={!!errors.email}
          disabled={submissionState === "submitting"}
        />
        {errors.email && (
          <p className="text-destructive text-sm" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Textarea
            name="message"
            placeholder={t("messagePlaceholder")}
            value={formData.message}
            onChange={handleInputChange("message")}
            onBlur={handleBlur("message")}
            hasError={!!errors.message}
            disabled={submissionState === "submitting"}
            className="min-h-[120px]"
          />
          <div
            className={cn(
              "bg-background absolute end-3 bottom-1 hidden items-center rounded px-1 py-0.5 text-xs shadow",
              getCharacterCountClasses(
                formData.message.length,
                MAX_MESSAGE_LENGTH
              )
            )}
          >
            <TriangleAlert className="me-1 mb-px hidden size-3" />
            {formData.message.length}/{MAX_MESSAGE_LENGTH}
          </div>
        </div>
        {errors.message && (
          <p className="text-destructive text-sm" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {errors.general && (
        <div className="bg-error-light rounded-lg p-4">
          <p className="text-destructive text-sm" role="alert">
            {errors.general}
          </p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        size="lg"
        variant="link"
        disabled={isDisabled}
        className="text-primary-foreground hover:text-primary-foreground/70 flex items-center justify-center gap-2"
      >
        {submissionState === "submitting" ? (
          <>
            <Spinner className="text-lg" />
            {t("sending")}
          </>
        ) : (
          <>{t("send")}</>
        )}
      </Button>
    </div>
  )
}

export default EnterpriseContactForm
