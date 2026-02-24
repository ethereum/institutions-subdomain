"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

type JSONData = { timestamp: string; ethMarketCap: number }

export type EtherMarketDetailsData = {
  etherMarketCap: number
}

export const fetchEtherMarketDetails = async (): Promise<
  DataTimestamped<EtherMarketDetailsData>
> => {
  const url = "https://ultrasound.money/api/fees/market-caps"

  try {
    const response = await fetch(url, {
      next: {
        revalidate: every("minute", 5),
        tags: ["ultrasound:fees:market-caps"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${decodeURIComponent(url.toString())}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    return {
      data: {
        etherMarketCap: json.ethMarketCap,
      },
      lastUpdated: new Date(json.timestamp).getTime() || Date.now(),
      sourceInfo: SOURCE.ULTRASOUND,
    }
  } catch (error: unknown) {
    console.error("fetchEtherMarketDetails failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    return {
      data: { etherMarketCap: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.ULTRASOUND,
    }
  }
}

export default fetchEtherMarketDetails
