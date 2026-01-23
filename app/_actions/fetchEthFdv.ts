"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

/**
 * CoinGecko API response types
 */
type CoinGeckoMarketData = {
  market_data?: {
    fully_diluted_valuation?: {
      usd?: number
    }
  }
}

/**
 * Output data types
 */
export type EthFdvData = {
  fullyDilutedValuation: number
}

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false"

export const fetchEthFdv = async (): Promise<DataTimestamped<EthFdvData>> => {
  try {
    const response = await fetch(COINGECKO_URL, {
      next: {
        revalidate: every("minute", 5),
        tags: ["coingecko:coins:ethereum"],
      },
    })

    if (!response.ok) {
      throw new Error(
        `Fetch response not OK from CoinGecko: ${response.status} ${response.statusText}`
      )
    }

    const data: CoinGeckoMarketData = await response.json()

    const fullyDilutedValuation =
      data.market_data?.fully_diluted_valuation?.usd ?? 0

    return {
      data: {
        fullyDilutedValuation,
      },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.COINGECKO,
    }
  } catch (error: unknown) {
    console.error("fetchEthFdv failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

export default fetchEthFdv
