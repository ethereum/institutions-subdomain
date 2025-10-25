import { join } from "path"

import type { Metadata } from "next"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://institutions.ethereum.org"
const DEFAULT_OG_IMAGE = "/images/og/home.png"
const SITE_NAME = "Ethereum for Institutions"

export const getMetadata = async ({
  title,
  description,
  slug,
  image,
}: {
  title: string
  description: string
  slug: string[] | string
  image?: string
}): Promise<Metadata> => {
  const path = Array.isArray(slug) ? join(...slug) : join(slug)
  const url = new URL(path, SITE_URL).href
  const ogImage = image || DEFAULT_OG_IMAGE

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: SITE_NAME,
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
