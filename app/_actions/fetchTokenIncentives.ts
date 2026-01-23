"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

/**
 * DefiLlama emissions API response types
 * Returns array of protocols with daily unlock amounts
 */
type DefiLlamaEmissionsProtocol = {
  name: string
  unlocksPerDay: number
  mcap?: number
  token?: string
}

/**
 * Output data types
 */
export type TokenIncentivesData = {
  tokenIncentives24h: number
}

// Using the general emissions endpoint for all protocols
const EMISSIONS_URL = "https://api.llama.fi/emissions"

export const fetchTokenIncentives = async (): Promise<
  DataTimestamped<TokenIncentivesData>
> => {
  try {
    const response = await fetch(EMISSIONS_URL, {
      next: {
        revalidate: every("hour"),
        tags: ["llama:emissions"],
      },
    })

    if (!response.ok) {
      throw new Error(
        `Fetch response not OK from ${EMISSIONS_URL}: ${response.status} ${response.statusText}`
      )
    }

    const data: DefiLlamaEmissionsProtocol[] = await response.json()

    // Sum unlocksPerDay across all protocols
    // Note: This is total emissions across all chains as API doesn't filter by chain
    const tokenIncentives24h = data.reduce(
      (sum, protocol) => sum + (protocol.unlocksPerDay || 0),
      0
    )

    return {
      data: {
        tokenIncentives24h,
      },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.LLAMA,
    }
  } catch (error: unknown) {
    console.error("fetchTokenIncentives failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

export default fetchTokenIncentives
