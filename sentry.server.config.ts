import * as Sentry from "@sentry/nextjs"

// Only initialize Sentry in production
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    sampleRate: 0.1, // 10% sampling to stay under free tier
  })
}
