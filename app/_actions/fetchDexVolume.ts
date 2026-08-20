"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

type JSONData = { total1y: number }

export type DexVolumeData = { trailing12moAvgDexVolume: number }

export const fetchDexVolume = async (): Promise<
  DataTimestamped<DexVolumeData>
> => {
  const url =
    "https://api.llama.fi/overview/dexs/ethereum?excludeTotalDataChartBreakdown=true"

  try {
    const response = await fetch(url, {
      next: {
        revalidate: every("week"),
        tags: ["llama:overview:dexs:ethereum"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${url}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    return {
      data: { trailing12moAvgDexVolume: json.total1y / 365 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.LLAMA,
    }
  } catch (error: unknown) {
    console.error("fetchDexVolume failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    return {
      data: { trailing12moAvgDexVolume: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.LLAMA,
    }
  }
}

export default fetchDexVolume
