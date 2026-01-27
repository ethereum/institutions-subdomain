import { join } from "path"

import type { Metadata } from "next"

import { DEFAULT_OG_IMAGE } from "../constants"

import { type Locale,locales } from "@/i18n/routing"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://institutions.ethereum.org"
const SITE_NAME = "Ethereum for Institutions"

export const getMetadata = async ({
  title,
  description,
  slug,
  image,
  locale,
}: {
  title: string
  description: string
  slug: string[] | string
  image?: string
  locale?: Locale
}): Promise<Metadata> => {
  const path = Array.isArray(slug) ? join(...slug) : join(slug)
  const url = new URL(path, SITE_URL).href
  const ogImage = image || DEFAULT_OG_IMAGE

  // Generate alternate language links for hreflang
  const languages: Record<string, string> = {}
  for (const loc of locales) {
    // For default locale (en), use the path without locale prefix
    // For other locales, prefix with locale
    const localePath = loc === "en" ? path : `${loc}/${path}`
    languages[loc] = new URL(localePath, SITE_URL).href
  }
  // Add x-default pointing to English version
  languages["x-default"] = new URL(path, SITE_URL).href

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: locale && locale !== "en" ? new URL(`${locale}/${path}`, SITE_URL).href : url,
      languages,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: locale && locale !== "en" ? new URL(`${locale}/${path}`, SITE_URL).href : url,
      siteName: SITE_NAME,
      locale: locale || "en",
      images: [{ url: ogImage }],
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      site: SITE_NAME,
      images: [{ url: ogImage }],
    },
  }
}
