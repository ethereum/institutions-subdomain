import { redirect } from "next/navigation"

/**
 * Root-level not-found for requests that bypass the [locale] middleware
 * matcher (e.g., paths with file extensions like /unknown.txt).
 *
 * Redirects to the default locale's 404 page so it renders within the
 * full [locale] layout with i18n, navigation, and styling.
 *
 * @see https://next-intl.dev/docs/environments/error-files
 */
export default function RootNotFound() {
  redirect("/not-found")
}
