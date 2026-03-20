"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { HeartHandshake, TriangleAlert } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import posthog from "posthog-js"
import HCaptcha from "@hcaptcha/react-hcaptcha"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

import { cn } from "@/lib/utils"
import { sanitizeInput } from "@/lib/utils/sanitize"

import { CONSUMER_DOMAINS, ENTERPRISE_EMAIL } from "@/lib/constants"

import Link from "../ui/link"

const MAX_INPUT_LENGTH = 2 ** 6 // 64
const MAX_MESSAGE_LENGTH = 2 ** 12 // 4,096

type FormState = {
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle: string
  country: string
  message: string
}

type FormErrors = {
  [K in keyof FormState]?: React.ReactNode
} & {
  general?: React.ReactNode
}

type SubmissionState = "idle" | "submitting" | "success" | "error"

const EnterpriseContactForm = () => {
  const t = useTranslations("contactForm")
  const pathname = usePathname()
  const prevPathname = useRef(pathname)
  const captchaRef = useRef<HCaptcha>(null)

  const [formData, setFormData] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    country: "",
    message: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle")

  // Reset form errors and submission state on page transition--keep any progress
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
      const validator = fieldValidators[field]
      if (validator) {
        const error = validator(value)
        if (error) setErrors((prev) => ({ ...prev, [field]: error }))
      }
    }

  const validateRequired = (
    value: string,
    maxLength = MAX_INPUT_LENGTH
  ): React.ReactNode | undefined => {
    const sanitized = sanitizeInput(value)
    if (!sanitized) return t("errors.required")
    if (sanitized.length > maxLength)
      return t("errors.fieldTooLong", { max: maxLength })
    return undefined
  }

  const validateEmail = (email: string): React.ReactNode | undefined => {
    const sanitized = sanitizeInput(email)

    if (!sanitized) return t("errors.required")

    if (sanitized.length > MAX_INPUT_LENGTH)
      return t("errors.emailTooLong", { max: MAX_INPUT_LENGTH })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitized)) return t("errors.invalidEmail")

    const domain = sanitized.toLowerCase().split("@")[1]
    if (CONSUMER_DOMAINS.includes(domain))
      return t("errors.businessEmailRequired")

    return undefined
  }

  const validateMessage = (message: string): React.ReactNode | undefined => {
    const sanitized = sanitizeInput(message)
    if (!sanitized) return t("errors.required")
    if (sanitized.length > MAX_MESSAGE_LENGTH)
      return t("errors.messageTooLong", { max: MAX_MESSAGE_LENGTH })
    return undefined
  }

  const fieldValidators = useMemo<
    Partial<
      Record<keyof FormState, (value: string) => React.ReactNode | undefined>
    >
  >(
    () => ({
      firstName: (v) => validateRequired(v),
      lastName: (v) => validateRequired(v),
      email: validateEmail,
      company: (v) => validateRequired(v),
      jobTitle: (v) => validateRequired(v),
      country: (v) => validateRequired(v),
      message: validateMessage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  )

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    for (const [field, validator] of Object.entries(fieldValidators)) {
      const error = validator!(formData[field as keyof FormState])
      if (error) newErrors[field as keyof FormState] = error
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    if (!captchaToken) return

    setSubmissionState("submitting")
    setErrors({})

    posthog.capture("contact_form_attempt")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: sanitizeInput(formData.firstName),
          lastName: sanitizeInput(formData.lastName),
          email: sanitizeInput(formData.email),
          company: sanitizeInput(formData.company),
          jobTitle: sanitizeInput(formData.jobTitle),
          country: sanitizeInput(formData.country),
          message: sanitizeInput(formData.message),
          captchaToken,
        }),
      })

      if (!response.ok) throw new Error(`Server error: ${response.status}`)

      posthog.capture("contact_form_submitted")
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
    } finally {
      setCaptchaToken(null)
      captchaRef.current?.resetCaptcha()
    }
  }

  const getCharacterCountClasses = (currentLength: number, maxLength: number) =>
    cn(
      currentLength >= Math.floor(maxLength * 0.9) && "flex",
      currentLength > maxLength - 64 && "text-warning-border",
      currentLength > maxLength && "text-destructive [&_svg]:inline"
    )

  const isDisabled =
    submissionState === "submitting" ||
    !captchaToken ||
    !formData.firstName ||
    !formData.lastName ||
    !formData.email ||
    !formData.company ||
    !formData.jobTitle ||
    !formData.country ||
    !formData.message

  if (submissionState === "success")
    return (
      <div className="border-border/50 bg-primary flex w-full max-w-prose flex-col items-center gap-y-6 rounded border p-6 text-center">
        <div className="mb-2 flex items-center gap-4">
          <HeartHandshake className="text-primary-foreground size-8" />
          <h4 className="text-xl font-semibold">{t("successTitle")}</h4>
        </div>
        <p className="text-body-medium">{t("successMessage")}</p>
      </div>
    )

  const renderField = (
    field: keyof FormState,
    placeholder: string,
    props?: Partial<React.ComponentProps<typeof Input>>
  ) => (
    <>
      <Input
        name={field}
        type={props?.type ?? "text"}
        autoComplete={props?.autoComplete}
        className="w-full"
        placeholder={placeholder}
        value={formData[field]}
        onChange={handleInputChange(field)}
        onBlur={handleBlur(field)}
        hasError={!!errors[field]}
        disabled={submissionState === "submitting"}
      />
      {errors[field] && (
        <p className="text-destructive text-sm" role="alert">
          {errors[field]}
        </p>
      )}
    </>
  )

  return (
    <div className="w-full max-w-[440px] space-y-6">
      <div className="space-y-2">
        {renderField("firstName", t("firstNamePlaceholder"), {
          autoComplete: "given-name",
        })}
        {renderField("lastName", t("lastNamePlaceholder"), {
          autoComplete: "family-name",
        })}
        {renderField("email", t("emailPlaceholder"), {
          type: "email",
          autoComplete: "email",
        })}
        {renderField("company", t("companyPlaceholder"), {
          autoComplete: "organization",
        })}
        {renderField("jobTitle", t("jobTitlePlaceholder"), {
          autoComplete: "organization-title",
        })}
        {renderField("country", t("countryPlaceholder"), {
          autoComplete: "country-name",
        })}
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

      <HCaptcha
        sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
        theme="dark"
        ref={captchaRef}
        onVerify={setCaptchaToken}
        onExpire={() => setCaptchaToken(null)}
        reCaptchaCompat={false}
      />

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
