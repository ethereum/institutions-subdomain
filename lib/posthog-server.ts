import { PostHog } from "posthog-node"

const noopClient = {
  capture: () => {},
  shutdown: () => Promise.resolve(),
} as unknown as PostHog

export default function PostHogClient(): PostHog {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return noopClient

  return new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })
}
