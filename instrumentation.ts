export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.CONTEXT === "production"
  ) {
    await import("./sentry.server.config")
  }
}

// Only capture errors on Netlify production deploys
export const onRequestError =
  process.env.CONTEXT === "production"
    ? (await import("@sentry/nextjs")).captureRequestError
    : undefined
