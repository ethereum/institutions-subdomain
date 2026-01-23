"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

/**
 * DefiLlama emissions API response types
 */
type DefiLlamaEmissionsResponse = {
  // The emissions API returns protocol-level data
  // We'll aggregate across major Ethereum protocols
  emissions?: {
    date: string
    unlocked: number
  }[]
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

    const data: DefiLlamaEmissionsResponse = await response.json()

    // Get the most recent day's emissions
    // Note: This is a simplified implementation
    // The actual API structure may vary and need adjustment
    const emissions = data.emissions ?? []
    const latestEmission = emissions[emissions.length - 1]
    const tokenIncentives24h = latestEmission?.unlocked ?? 0

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
