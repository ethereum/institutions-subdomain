"use server"

import { every } from "@/lib/utils/time"

type FeedItem = {
  title: string
  href: string
  date: string
  imgSrc: string
}

const FEED_URL = "https://enterpriseonchain.substack.com/feed"
const DEFAULT_IMAGE = "/images/library/etherealize-1.png"

function parseXML(xml: string): FeedItem[] {
  const items: FeedItem[] = []

  // Match all <item>...</item> blocks
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g)

  for (const match of itemMatches) {
    const itemXml = match[1]

    // Extract title (handle CDATA)
    const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)
    const title = titleMatch?.[1]?.trim() || ""

    // Extract link
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/)
    const href = linkMatch?.[1]?.trim() || ""

    // Extract pubDate
    const dateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)
    const pubDate = dateMatch?.[1]?.trim() || ""

    // Extract enclosure image URL
    const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/)
    const imgSrc = enclosureMatch?.[1] || DEFAULT_IMAGE

    if (title && href) {
      items.push({
        title,
        href,
        date: pubDate ? new Date(pubDate).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }) : "",
        imgSrc,
      })
    }
  }

  return items
}

export async function fetchEnterpriseOnchainFeed(): Promise<FeedItem[]> {
  try {
    const response = await fetch(FEED_URL, {
      next: {
        revalidate: every("day"),
        tags: ["enterprise-onchain-feed"],
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status}`)
    }

    const xml = await response.text()
    return parseXML(xml)
  } catch (error) {
    console.error("fetchEnterpriseOnchainFeed failed:", error)
    return []
  }
}

export default fetchEnterpriseOnchainFeed
