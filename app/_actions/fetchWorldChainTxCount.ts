"use server"

import { unstable_cache } from "next/cache"

import type { DataTimestamped, GrowthepieApiResult } from "@/lib/types"

type JSONData = GrowthepieApiResult[]

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

export type WorldChainTxCountData = { worldChainTxCount: number }

const fetchWorldChainTxCountData =
  async (): Promise<WorldChainTxCountData> => {
    const url = "https://api.growthepie.com/v1/export/txcount.json"

    // No Next cache -- avoids caching the large (~5MB) upstream response
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok)
      throw new Error(
        `Fetch response not OK from ${url}: ${res.status} ${res.statusText}`
      )

    const json: JSONData = await res.json()

    const dataWorldTxCount = json.filter(
      ({ origin_key }) => origin_key.toLowerCase() === "worldchain"
    )
    const sortedDescendingDate = dataWorldTxCount.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    if (!sortedDescendingDate.length)
      throw new Error(`No data found for origin_key === "worldchain"`)

    return { worldChainTxCount: sortedDescendingDate[0].value }
  }

const getCachedWorldChainTxCountData = () =>
  unstable_cache(
    fetchWorldChainTxCountData,
    ["growthepie-worldchain-txcount"],
    { revalidate: every("day") }
  )()

export const fetchWorldChainTxCount = async (): Promise<
  DataTimestamped<WorldChainTxCountData>
> => {
  try {
    const data = await getCachedWorldChainTxCountData()

    return {
      data,
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.GROWTHEPIE,
    }
  } catch (error: unknown) {
    console.error("fetchWorldChainTxCount failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
    })
    return {
      data: { worldChainTxCount: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.GROWTHEPIE,
    }
  }
}

export default fetchWorldChainTxCount
