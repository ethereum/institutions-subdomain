/**
 * Fetch utility with timeout and retry logic for external API calls.
 * Helps prevent build failures from slow or unresponsive APIs.
 */

const DEFAULT_TIMEOUT_MS = 10_000 // 10 seconds
const DEFAULT_RETRIES = 2
const RETRY_DELAY_MS = 1000 // 1 second base delay

/**
 * Creates an AbortSignal that times out after the specified duration.
 */
const createTimeoutSignal = (timeoutMs: number): AbortSignal => {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), timeoutMs)
  return controller.signal
}

/**
 * Delays execution for the specified duration.
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export type FetchWithRetryOptions = {
  /** Timeout in milliseconds for each request attempt (default: 10000) */
  timeoutMs?: number
  /** Number of retry attempts on failure (default: 2) */
  retries?: number
  /** Initial delay between retries in ms, doubles with each attempt (default: 1000) */
  retryDelayMs?: number
}

/**
 * Fetch wrapper with timeout and exponential backoff retry logic.
 *
 * @param url - The URL to fetch
 * @param init - Standard fetch RequestInit options
 * @param options - Retry and timeout configuration
 * @returns The fetch Response
 * @throws Error if all retry attempts fail
 *
 * @example
 * ```typescript
 * const response = await fetchWithRetry(url, {
 *   headers: { Authorization: `Bearer ${apiKey}` },
 *   next: { revalidate: 86400 },
 * })
 * ```
 */
export const fetchWithRetry = async (
  url: URL | string,
  init?: RequestInit,
  options?: FetchWithRetryOptions
): Promise<Response> => {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = DEFAULT_RETRIES,
    retryDelayMs = RETRY_DELAY_MS,
  } = options ?? {}

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: createTimeoutSignal(timeoutMs),
      })

      // Don't retry on client errors (4xx), only on server errors (5xx) or network issues
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response
      }

      // Server error - will retry if attempts remain
      lastError = new Error(
        `Fetch response not OK from ${decodeURIComponent(url.toString())}: ${response.status} ${response.statusText}`
      )
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        lastError = new Error(
          `Fetch timeout after ${timeoutMs}ms from ${decodeURIComponent(url.toString())}`
        )
      } else {
        lastError = error instanceof Error ? error : new Error(String(error))
      }
    }

    // If we have more retries, wait before the next attempt
    if (attempt < retries) {
      const backoffDelay = retryDelayMs * Math.pow(2, attempt)
      console.warn(
        `Fetch attempt ${attempt + 1} failed for ${url.toString()}, retrying in ${backoffDelay}ms...`
      )
      await delay(backoffDelay)
    }
  }

  throw lastError ?? new Error(`Fetch failed after ${retries + 1} attempts`)
}
