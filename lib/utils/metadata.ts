import { join } from "path"

import type { Metadata } from "next"

import { DEFAULT_OG_IMAGE } from "../constants"

import { type Locale, locales } from "@/i18n/routing"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://institutions.ethereum.org"
const SITE_NAME = "Ethereum for Institutions"

/**
 * Build a locale-prefixed path without trailing slashes.
 * `join("")` returns `"."` which causes `new URL("zh/.", base)` to produce
 * a trailing-slash URL that mismatches the actual page URL served by Next.js.
 */
const buildPath = (locale: string, path: string): string => {
  if (locale === "en") return path
  return path ? `${locale}/${path}` : locale
}

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
  const rawPath = Array.isArray(slug) ? join(...slug) : slug
  // Normalize: join("") returns "." which breaks URL construction
  const path = rawPath === "." ? "" : rawPath
  const url = new URL(path, SITE_URL).href
  const ogImage = image || DEFAULT_OG_IMAGE

  // Generate alternate language links for hreflang
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    languages[locale] = new URL(buildPath(locale, path), SITE_URL).href
  }
  // Add x-default pointing to English version
  languages["x-default"] = new URL(path, SITE_URL).href

  const canonicalUrl =
    locale && locale !== "en"
      ? new URL(buildPath(locale, path), SITE_URL).href
      : url

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
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
