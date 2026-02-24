"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SITE_ORIGIN, SOURCE } from "@/lib/constants"

type JSONData = DataTimestamped<BaseTvlData>

export type BaseTvlData = { baseTvl: number }

export const fetchBaseTvl = async (): Promise<DataTimestamped<BaseTvlData>> => {
  // Call internal trimmed endpoint and let Next cache the small response.
  const secret = process.env.INTERNAL_API_SECRET || ""

  if (!secret) throw new Error("Internal API secret not found")

  const internalUrl = new URL("/api/growthepie-v1-export-tvl/base", SITE_ORIGIN)

  internalUrl.searchParams.set("secret", secret)

  const url = internalUrl.toString()

  try {
    const response = await fetch(url, {
      next: {
        revalidate: every("day"),
        tags: ["internal:growthepie:v1:export:tvl:base-current"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${url}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    return {
      data: json.data,
      lastUpdated: json.lastUpdated,
      sourceInfo: SOURCE.GROWTHEPIE,
    }
  } catch (error: unknown) {
    console.error("fetchBaseTvl failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    return {
      data: { baseTvl: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.GROWTHEPIE,
    }
  }
}

export default fetchBaseTvl
