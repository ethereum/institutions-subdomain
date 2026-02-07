import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

const nextConfig: NextConfig = {
  /* config options here */
}

// Only load Sentry on Netlify production builds
export default process.env.CONTEXT === "production"
  ? withSentryConfig(nextConfig, {
      silent: !process.env.CI,
    })
  : nextConfig
