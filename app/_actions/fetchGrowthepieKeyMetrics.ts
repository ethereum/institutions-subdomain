"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

/**
 * growthepie API response types for individual metric endpoints
 */
type GrowthepieMetricResponse = {
  data: {
    metric_id: string
    metric_name: string
    chains: {
      [chainKey: string]: {
        daily: {
          types: string[]
          data: (number | null)[][]
        }
      }
    }
  }
}

/**
 * Output data types
 */
export type GrowthepieKeyMetricsData = {
  activeAddresses24h: number
  chainFees24h: number
  chainRevenue24h: number
}

const ENDPOINTS = {
  daa: "https://api.growthepie.xyz/v1/metrics/daa.json",
  fees: "https://api.growthepie.xyz/v1/metrics/fees.json",
}

async function fetchMetric(
  url: string,
  tag: string,
  revalidate: number
): Promise<GrowthepieMetricResponse> {
  const response = await fetch(url, {
    next: { revalidate, tags: [tag] },
  })

  if (!response.ok) {
    throw new Error(
      `Fetch response not OK from ${url}: ${response.status} ${response.statusText}`
    )
  }

  return response.json()
}

function getLatestEthereumValue(data: GrowthepieMetricResponse): number {
  const ethereumData = data.data.chains?.ethereum?.daily?.data
  if (!ethereumData || ethereumData.length === 0) return 0
  // Data format: [timestamp, value, ...] - get the last entry's value (index 1)
  const lastEntry = ethereumData[ethereumData.length - 1]
  return (lastEntry?.[1] as number) ?? 0
}

export const fetchGrowthepieKeyMetrics = async (): Promise<
  DataTimestamped<GrowthepieKeyMetricsData>
> => {
  try {
    const cacheTime = every("minute", 5)

    // Fetch metrics in parallel with graceful failure handling
    const results = await Promise.allSettled([
      fetchMetric(ENDPOINTS.daa, "growthepie:daa", cacheTime),
      fetchMetric(ENDPOINTS.fees, "growthepie:fees", cacheTime),
    ])

    const [daaResult, feesResult] = results

    // Extract values from successful fetches, default to 0 on failure
    const activeAddresses24h =
      daaResult.status === "fulfilled"
        ? getLatestEthereumValue(daaResult.value)
        : 0

    // Fees data format: [timestamp, usd_value, eth_value]
    const chainFees24h =
      feesResult.status === "fulfilled"
        ? getLatestEthereumValue(feesResult.value)
        : 0

    // Chain revenue for Ethereum L1 isn't directly available - fees are the revenue
    // For L2s, profit = fees - costs, but for Ethereum L1, revenue ≈ fees
    const chainRevenue24h = chainFees24h

    // Log any failures for debugging
    if (daaResult.status === "rejected") {
      console.error("growthepie DAA fetch failed:", daaResult.reason)
    }
    if (feesResult.status === "rejected") {
      console.error("growthepie fees fetch failed:", feesResult.reason)
    }

    return {
      data: {
        activeAddresses24h,
        chainFees24h,
        chainRevenue24h,
      },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.GROWTHEPIE,
    }
  } catch (error: unknown) {
    console.error("fetchGrowthepieKeyMetrics failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

export default fetchGrowthepieKeyMetrics
