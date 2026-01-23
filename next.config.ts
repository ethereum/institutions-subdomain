import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  /* config options here */
}

export default withSentryConfig(withNextIntl(nextConfig), {
  silent: !process.env.CI,
})
