import * as Sentry from "@sentry/nextjs"

// Only initialize Sentry on Netlify production deploys
if (process.env.CONTEXT === "production" && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.CONTEXT,
    sampleRate: 0.1, // 10% sampling to stay under free tier
  })
}
