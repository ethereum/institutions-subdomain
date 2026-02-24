"use server"

import { unstable_cache } from "next/cache"

import type {
  AssetCategory,
  DataTimestamped,
  RwaApiTimeseriesResponse,
} from "@/lib/types"

import { fetchWithRetry } from "@/lib/utils/fetch"
import { every } from "@/lib/utils/time"

import {
  RWA_API_EXCLUDED_NETWORK_IDS,
  RWA_API_LAYER_2S_IDS,
  RWA_API_MAINNET,
  RWA_API_MEASURE_ID_BY_CATEGORY,
  RWA_API_STABLECOINS_GROUP_ID,
  SOURCE,
} from "@/lib/constants"

type JSONData = RwaApiTimeseriesResponse

type NetworkBreakdown = {
  mainnet: number
  layer2: number
  altNetwork2nd: number
  altNetwork3rd: number
  altNetworksRest: number
}

export type AssetMarketShareData = {
  assetValue: NetworkBreakdown
  marketShare: NetworkBreakdown
  assetValueSumAll: number
}

// Random delay to stagger API requests across build workers (0-30s)
const randomDelay = () =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 30000))

// Stable date for caching (start of day, 2 days ago)
const getStableDateNDaysAgo = (n: number = 2) => {
  const date = new Date()
  date.setDate(date.getDate() - n)
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}

const fetchMarketShareData = async (category: AssetCategory) => {
  await randomDelay()

  const url = new URL("https://api.rwa.xyz/v3/assets/aggregates/timeseries")

  const apiKey = process.env.RWA_API_KEY || ""

  if (!apiKey) {
    throw new Error(`No API key available for ${url.toString()}`)
  }

  const myQuery = {
    filter: {
      operator: "and",
      filters: [
        {
          field: "measureID",
          operator: "equals",
          value: RWA_API_MEASURE_ID_BY_CATEGORY[category],
        },
        {
          field: "date",
          operator: "onOrAfter",
          value: getStableDateNDaysAgo(),
        },
        {
          field: "assetClassID",
          operator: category === "STABLECOINS" ? "equals" : "notEquals",
          value: RWA_API_STABLECOINS_GROUP_ID,
        },
      ],
    },
    aggregate: {
      groupBy: "network",
      aggregateFunction: "sum",
    },
    sort: {
      direction: "asc",
      field: "date",
    },
    pagination: {
      page: 1,
      perPage: 100,
    },
  }

  url.searchParams.set("query", JSON.stringify(myQuery))

  const response = await fetchWithRetry(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    next: {
      revalidate: every("day"),
      tags: [`rwa:v3:assets:aggregates:timeseries:${category}`],
    },
  })

  if (!response.ok)
    throw new Error(
      `Fetch response not OK from ${decodeURIComponent(url.toString())}: ${response.status} ${response.statusText}`
    )

  const json: JSONData = await response.json()

  // Filter out enterprise/permissioned chains for "distributed" market share
  const distributedResults = json.results.filter(
    ({ group: { id } }) => !RWA_API_EXCLUDED_NETWORK_IDS.includes(id)
  )

  const assetValueSumAll = distributedResults.reduce((prev, { points }) => {
    const [, latestValue] = points[points.length - 1]
    return prev + latestValue
  }, 0)

  const mainnetAssetValue = distributedResults
    .filter(({ group: { id } }) => RWA_API_MAINNET.id === id)
    .reduce((prev, { points }) => {
      const [, latestValue] = points[points.length - 1]
      return prev + latestValue
    }, 0)

  const layer2AssetValue = distributedResults
    .filter(({ group: { id } }) => RWA_API_LAYER_2S_IDS.includes(id))
    .reduce((prev, { points }) => {
      const [, latestValue] = points[points.length - 1]
      return prev + latestValue
    }, 0)

  const nonEthereumNetworksValueSorted = distributedResults
    .filter(
      ({ group: { id } }) =>
        !RWA_API_LAYER_2S_IDS.includes(id) && id !== RWA_API_MAINNET.id
    )
    .sort((a, b) => {
      const [, aLatest] = a.points[a.points.length - 1]
      const [, bLatest] = b.points[b.points.length - 1]
      return bLatest - aLatest
    })

  const [
    altNetwork2ndAssetResult,
    altNetwork3rdAssetResult,
    ...altNetworksRestAssetResults
  ] = nonEthereumNetworksValueSorted
  const [, altNetwork2ndAssetValue] =
    altNetwork2ndAssetResult.points[altNetwork2ndAssetResult.points.length - 1]
  const [, altNetwork3rdAssetValue] =
    altNetwork3rdAssetResult.points[altNetwork3rdAssetResult.points.length - 1]
  const altNetworksRestAssetValue = altNetworksRestAssetResults.reduce(
    (prev, { points }) => {
      const [, latestValue] = points[points.length - 1]
      return prev + latestValue
    },
    0
  )

  return {
    assetValue: {
      mainnet: mainnetAssetValue,
      layer2: layer2AssetValue,
      altNetwork2nd: altNetwork2ndAssetValue,
      altNetwork3rd: altNetwork3rdAssetValue,
      altNetworksRest: altNetworksRestAssetValue,
    },
    marketShare: {
      mainnet: mainnetAssetValue / assetValueSumAll,
      layer2: layer2AssetValue / assetValueSumAll,
      altNetwork2nd: altNetwork2ndAssetValue / assetValueSumAll,
      altNetwork3rd: altNetwork3rdAssetValue / assetValueSumAll,
      altNetworksRest: altNetworksRestAssetValue / assetValueSumAll,
    },
    assetValueSumAll,
  }
}

const getCachedMarketShareData = (category: AssetCategory) =>
  unstable_cache(
    () => fetchMarketShareData(category),
    ["rwa-market-share", category],
    { revalidate: every("day") }
  )()

export const fetchAssetMarketShare = async (
  category: AssetCategory
): Promise<DataTimestamped<AssetMarketShareData>> => {
  try {
    const data = await getCachedMarketShareData(category)

    return {
      data,
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.RWA,
    }
  } catch (error: unknown) {
    console.error("fetchAssetMarketShare failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
    })
    return {
      data: {
        assetValue: {
          mainnet: 0,
          layer2: 0,
          altNetwork2nd: 0,
          altNetwork3rd: 0,
          altNetworksRest: 0,
        },
        marketShare: {
          mainnet: 0,
          layer2: 0,
          altNetwork2nd: 0,
          altNetwork3rd: 0,
          altNetworksRest: 0,
        },
        assetValueSumAll: 0,
      },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.RWA,
    }
  }
}

export default fetchAssetMarketShare
