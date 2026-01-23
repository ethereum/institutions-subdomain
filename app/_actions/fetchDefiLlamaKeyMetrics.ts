"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

/**
 * DefiLlama API response types
 */
type DefiLlamaProtocol = {
  name: string
  chains?: string[]
  total24h?: number
  totalAllTime?: number
}

type DefiLlamaOverviewResponse = {
  protocols?: DefiLlamaProtocol[]
  total24h?: number
}

type DefiLlamaBridgeChain = {
  name: string
  id: string
  volumePrevDay?: number
  netFlow?: number
}

type DefiLlamaBridgesResponse = {
  chains?: DefiLlamaBridgeChain[]
}

type DefiLlamaRaise = {
  chains?: string[]
  amount?: number
}

type DefiLlamaRaisesResponse = {
  raises?: DefiLlamaRaise[]
}

type DefiLlamaFeesProtocol = {
  name: string
  chains?: string[]
  total24h?: number
  dailyRevenue?: number
}

type DefiLlamaFeesResponse = {
  protocols?: DefiLlamaFeesProtocol[]
  total24h?: number
  totalDataChart?: [number, number][]
}

/**
 * Output data types
 */
export type DefiLlamaKeyMetricsData = {
  perpsVolume24h: number
  bridgeTvl: number
  bridgeInflows24h: number
  nftVolume24h: number
  totalRaised: number
  appFees24h: number
  appRevenue24h: number
}

const ENDPOINTS = {
  derivatives:
    "https://api.llama.fi/overview/derivatives?excludeTotalDataChartBreakdown=true&excludeTotalDataChart=true",
  bridges: "https://bridges.llama.fi/bridges?includeChains=true",
  nfts: "https://api.llama.fi/overview/nfts?excludeTotalDataChartBreakdown=true&excludeTotalDataChart=true",
  raises: "https://api.llama.fi/raises",
  fees: "https://api.llama.fi/overview/fees?excludeTotalDataChartBreakdown=true&excludeTotalDataChart=true",
}

async function fetchWithCache<T>(
  url: string,
  tag: string,
  revalidate: number
): Promise<T> {
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

export const fetchDefiLlamaKeyMetrics = async (): Promise<
  DataTimestamped<DefiLlamaKeyMetricsData>
> => {
  try {
    const cacheTime = every("minute", 5)

    // Fetch all endpoints in parallel
    const [derivativesData, bridgesData, nftsData, raisesData, feesData] =
      await Promise.all([
        fetchWithCache<DefiLlamaOverviewResponse>(
          ENDPOINTS.derivatives,
          "llama:overview:derivatives",
          cacheTime
        ),
        fetchWithCache<DefiLlamaBridgesResponse>(
          ENDPOINTS.bridges,
          "llama:bridges",
          cacheTime
        ),
        fetchWithCache<DefiLlamaOverviewResponse>(
          ENDPOINTS.nfts,
          "llama:overview:nfts",
          cacheTime
        ),
        fetchWithCache<DefiLlamaRaisesResponse>(
          ENDPOINTS.raises,
          "llama:raises",
          every("day") // Raises don't change often
        ),
        fetchWithCache<DefiLlamaFeesResponse>(
          ENDPOINTS.fees,
          "llama:overview:fees",
          cacheTime
        ),
      ])

    // Calculate perps volume (Ethereum protocols only)
    const perpsVolume24h =
      derivativesData.protocols
        ?.filter((p) => p.chains?.includes("Ethereum"))
        .reduce((sum, p) => sum + (p.total24h || 0), 0) ?? 0

    // Calculate bridge stats for Ethereum
    const ethereumBridge = bridgesData.chains?.find(
      (c) => c.name === "Ethereum"
    )
    const bridgeTvl = 0 // Bridge TVL requires different endpoint
    const bridgeInflows24h = ethereumBridge?.netFlow ?? 0

    // NFT volume for Ethereum
    const nftVolume24h =
      nftsData.protocols
        ?.filter((p) => p.chains?.includes("Ethereum"))
        .reduce((sum, p) => sum + (p.total24h || 0), 0) ?? 0

    // Total raised (Ethereum projects all time)
    const totalRaised =
      raisesData.raises
        ?.filter((r) => r.chains?.includes("Ethereum"))
        .reduce((sum, r) => sum + (r.amount || 0), 0) ?? 0

    // App fees and revenue (Ethereum protocols)
    const ethereumFeeProtocols =
      feesData.protocols?.filter((p) => p.chains?.includes("Ethereum")) ?? []
    const appFees24h = ethereumFeeProtocols.reduce(
      (sum, p) => sum + (p.total24h || 0),
      0
    )
    const appRevenue24h = ethereumFeeProtocols.reduce(
      (sum, p) => sum + (p.dailyRevenue || 0),
      0
    )

    return {
      data: {
        perpsVolume24h,
        bridgeTvl,
        bridgeInflows24h,
        nftVolume24h,
        totalRaised,
        appFees24h,
        appRevenue24h,
      },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.LLAMA,
    }
  } catch (error: unknown) {
    console.error("fetchDefiLlamaKeyMetrics failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

export default fetchDefiLlamaKeyMetrics
