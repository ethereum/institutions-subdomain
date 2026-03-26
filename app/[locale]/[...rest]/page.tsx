import { notFound } from "next/navigation"

/**
 * Catch-all route to trigger the localized not-found page for unknown paths.
 *
 * Next.js only renders [locale]/not-found.tsx when notFound() is explicitly
 * called from within a route, not for unmatched routes in general.
 *
 * @see https://next-intl.dev/docs/environments/error-files
 */
export default function CatchAllPage() {
  notFound()
}
