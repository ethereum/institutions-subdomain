"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

/**
 * growthepie API response types
 */
type GrowthepieMetricData = {
  metric_key: string
  origin_key: string
  date: string
  value: number
}

type GrowthepieFundamentalsResponse = GrowthepieMetricData[]

/**
 * Output data types
 */
export type GrowthepieKeyMetricsData = {
  activeAddresses24h: number
  chainFees24h: number
  chainRevenue24h: number
}

const FUNDAMENTALS_URL = "https://api.growthepie.xyz/v1/fundamentals/full.json"

export const fetchGrowthepieKeyMetrics = async (): Promise<
  DataTimestamped<GrowthepieKeyMetricsData>
> => {
  try {
    const response = await fetch(FUNDAMENTALS_URL, {
      next: {
        revalidate: every("minute", 5),
        tags: ["growthepie:fundamentals:full"],
      },
    })

    if (!response.ok) {
      throw new Error(
        `Fetch response not OK from ${FUNDAMENTALS_URL}: ${response.status} ${response.statusText}`
      )
    }

    const data: GrowthepieFundamentalsResponse = await response.json()

    // Filter for Ethereum mainnet and get latest values
    const ethereumData = data.filter((d) => d.origin_key === "ethereum")

    // Get latest date for each metric
    const getLatestValue = (metricKey: string): number => {
      const metricData = ethereumData
        .filter((d) => d.metric_key === metricKey)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      return metricData[0]?.value ?? 0
    }

    // Map growthepie metrics to our output
    // daa = Daily Active Addresses
    // fees_paid_usd = fees in USD
    // profit_usd = revenue (fees - costs)
    const activeAddresses24h = getLatestValue("daa")
    const chainFees24h = getLatestValue("fees_paid_usd")
    const chainRevenue24h = getLatestValue("profit_usd")

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
