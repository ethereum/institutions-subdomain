"use server"

import type {
  AssetCategory,
  DataTimestamped,
  RwaApiTimeseriesResponse,
} from "@/lib/types"

import { dateNDaysAgo } from "@/lib/utils/date"
import { every } from "@/lib/utils/time"

import {
  RWA_API_LAYER_2S_IDS,
  RWA_API_MAINNET,
  RWA_API_MEASURE_ID_BY_CATEGORY,
  RWA_API_STABLECOINS_GROUP_ID,
  SOURCE,
  TRAILING_7_DAY_TRANSFER_COUNT_MEASURE_ID,
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

export const fetchAssetMarketShare = async (
  category: AssetCategory
): Promise<DataTimestamped<AssetMarketShareData>> => {
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
          operator: "or",
          filters: [
            {
              field: "measureID",
              operator: "equals",
              value: RWA_API_MEASURE_ID_BY_CATEGORY[category],
            },
            {
              field: "measureID",
              operator: "equals",
              value: TRAILING_7_DAY_TRANSFER_COUNT_MEASURE_ID,
            },
          ],
        },
        {
          field: "date",
          operator: "onOrAfter",
          value: dateNDaysAgo(),
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
      perPage: 50,
    },
  }

  url.searchParams.set("query", JSON.stringify(myQuery))

  try {
    const response = await fetch(url.toString(), {
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

    const transferableGroupIdSet = new Set<
      RwaApiTimeseriesResponse["results"][number]["group"]["id"]
    >()

    const transferCountResults = json.results.filter(
      ({ measure: { id } }) => id === TRAILING_7_DAY_TRANSFER_COUNT_MEASURE_ID
    )

    for (const result of transferCountResults) {
      const [, latestTransferCount] = result.points[result.points.length - 1]
      if (latestTransferCount > 0) transferableGroupIdSet.add(result.group.id)
    }

    const transferableGroupIds = Array.from(transferableGroupIdSet)

    const valueResults = json.results
      .filter(({ group: { id } }) => transferableGroupIds.includes(id))
      .filter(
        ({ measure: { id } }) => id === RWA_API_MEASURE_ID_BY_CATEGORY[category]
      )

    const assetValueSumAll = valueResults.reduce((prev, { points }) => {
      const [, latestValue] = points[points.length - 1]
      return prev + latestValue
    }, 0)

    const mainnetAssetValue = valueResults
      .filter(({ group: { id } }) => RWA_API_MAINNET.id === id)
      .reduce((prev, { points }) => {
        const [, latestValue] = points[points.length - 1]
        return prev + latestValue
      }, 0)

    const layer2AssetValue = valueResults
      .filter(({ group: { id } }) => RWA_API_LAYER_2S_IDS.includes(id))
      .reduce((prev, { points }) => {
        const [, latestValue] = points[points.length - 1]
        return prev + latestValue
      }, 0)

    const nonEthereumNetworksValueSorted = valueResults
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
      altNetwork2ndAssetResult.points[
        altNetwork2ndAssetResult.points.length - 1
      ]
    const [, altNetwork3rdAssetValue] =
      altNetwork3rdAssetResult.points[
        altNetwork3rdAssetResult.points.length - 1
      ]
    const altNetworksRestAssetValue = altNetworksRestAssetResults.reduce(
      (prev, { points }) => {
        const [, latestValue] = points[points.length - 1]
        return prev + latestValue
      },
      0
    )

    return {
      data: {
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
      },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.RWA,
    }
  } catch (error: unknown) {
    console.error("fetchAssetMarketShare failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url: url,
    })
    throw error
  }
}

export default fetchAssetMarketShare
