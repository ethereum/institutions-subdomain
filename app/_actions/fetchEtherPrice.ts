"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

type JSONData = { ethereum: { usd: number } }

export type EthPriceData = { usd: number }

export const fetchEtherPrice = async (): Promise<
  DataTimestamped<EthPriceData>
> => {
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"

  try {
    const response = await fetch(url, {
      next: {
        revalidate: every("minute", 5),
        tags: ["coingecko:v3:simple:price"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${url}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    return {
      data: json.ethereum,
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.COINGECKO,
    }
  } catch (error: unknown) {
    console.error("fetchEtherPrice failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    return {
      data: { usd: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.COINGECKO,
    }
  }
}

export default fetchEtherPrice
