import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import { withSentryConfig } from "@sentry/nextjs"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  /* config options here */
}

// Only load Sentry on Netlify production builds
export default process.env.CONTEXT === "production"
  ? withSentryConfig(withNextIntl(nextConfig), {
      silent: !process.env.CI,
    })
  : withNextIntl(nextConfig)
