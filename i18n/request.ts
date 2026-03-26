import { getRequestConfig } from "next-intl/server"

import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    locale = routing.defaultLocale
  }

  const base = (await import(`../messages/${locale}.json`)).default
  const sp = (await import(`../messages/solution-providers/${locale}.json`)).default

  return {
    locale,
    messages: { ...base, ...sp },
  }
})
