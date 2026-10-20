"use server"

import { unstable_cache } from "next/cache"

import type { DataTimestamped, GrowthepieApiResult } from "@/lib/types"

type JSONData = GrowthepieApiResult[]

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

export type BaseTvlData = { baseTvl: number }

const fetchBaseTvlData = async (): Promise<BaseTvlData> => {
  const url = "https://api.growthepie.com/v1/export/tvl.json"

  // No Next cache -- avoids caching the large (~5MB) upstream response
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok)
    throw new Error(
      `Fetch response not OK from ${url}: ${res.status} ${res.statusText}`
    )

  const json: JSONData = await res.json()

  const dataBaseUSD = json.filter(
    ({ metric_key, origin_key }) =>
      metric_key === "tvl" && origin_key.toLowerCase() === "base"
  )
  const sortedDescendingDate = dataBaseUSD.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  if (!sortedDescendingDate.length)
    throw new Error(
      `No data found for metric_key === "tvl" && origin_key === "base"`
    )

  return { baseTvl: sortedDescendingDate[0].value }
}

const getCachedBaseTvlData = () =>
  unstable_cache(fetchBaseTvlData, ["growthepie-base-tvl"], {
    revalidate: every("day"),
  })()

export const fetchBaseTvl = async (): Promise<
  DataTimestamped<BaseTvlData>
> => {
  try {
    const data = await getCachedBaseTvlData()

    return {
      data,
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.GROWTHEPIE,
    }
  } catch (error: unknown) {
    console.error("fetchBaseTvl failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
    })
    return {
      data: { baseTvl: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.GROWTHEPIE,
    }
  }
}

export default fetchBaseTvl
