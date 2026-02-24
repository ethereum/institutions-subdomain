"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SITE_ORIGIN, SOURCE } from "@/lib/constants"

type JSONData = DataTimestamped<WorldChainTxCountData>

export type WorldChainTxCountData = { worldChainTxCount: number }

export const fetchWorldChainTxCount = async (): Promise<
  DataTimestamped<WorldChainTxCountData>
> => {
  // Call internal trimmed endpoint and let Next cache the small response.
  const secret = process.env.INTERNAL_API_SECRET || ""

  if (!secret) throw new Error("Internal API secret not found")

  const internalUrl = new URL(
    "/api/growthepie-v1-export-txcount/worldchain",
    SITE_ORIGIN
  )

  internalUrl.searchParams.set("secret", secret)

  const url = internalUrl.toString()

  try {
    const response = await fetch(url, {
      next: {
        revalidate: every("day"),
        tags: ["internal:growthepie:v1:export:txcount:worldchain-current"],
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
    console.error("fetchWorldChainTxCount failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    return {
      data: { worldChainTxCount: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.GROWTHEPIE,
    }
  }
}

export default fetchWorldChainTxCount
