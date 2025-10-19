"use server"

import type {
  AssetCategory,
  DataSeriesWithCurrent,
  DataTimestamped,
  RwaApiTimeseriesResponse,
} from "@/lib/types"

import {
  getRwaApiEthereumNetworksFilter,
  getSeriesWithCurrent,
} from "@/lib/utils/data"
import { every } from "@/lib/utils/time"

import {
  RWA_API_MEASURE_ID_BY_CATEGORY,
  RWA_API_STABLECOINS_GROUP_ID,
  SOURCE,
} from "@/lib/constants"

type JSONData = RwaApiTimeseriesResponse

export type TimeseriesAssetsValueData = {
  mainnet: DataSeriesWithCurrent
  layer2: DataSeriesWithCurrent
}

export const fetchTimeseriesAssetsValue = async (
  category: AssetCategory
): Promise<DataTimestamped<TimeseriesAssetsValueData>> => {
  const url = new URL("https://api.rwa.xyz/v3/assets/aggregates/timeseries")

  const apiKey = process.env.RWA_API_KEY || ""

  if (!apiKey) {
    throw new Error(`No API key available for ${url.toString()}`)
  }

  const myQuery = {
    sort: {
      direction: "asc",
      field: "date",
    },
    pagination: {
      page: 1,
      perPage: 25,
    },
    aggregate: {
      groupBy: "network",
      aggregateFunction: "sum",
      interval: "day",
    },
    filter: {
      operator: "and",
      filters: [
        {
          field: "measureID",
          operator: "equals",
          value: RWA_API_MEASURE_ID_BY_CATEGORY[category],
        },
        {
          field: "assetClassID",
          operator: category === "STABLECOINS" ? "equals" : "notEquals",
          value: RWA_API_STABLECOINS_GROUP_ID, // Stablecoins (Else, real-world assets)
        },
        getRwaApiEthereumNetworksFilter(["mainnet", "layer-2"]),
      ],
    },
  }

  url.searchParams.set("query", JSON.stringify(myQuery))

  try {
    const response = await fetch(url, {
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

    const mainnetAssetData = json.results[0]
    const layer2AssetDataArray = json.results.slice(1)

    const mainnetSeriesMapped = mainnetAssetData?.points?.length
      ? mainnetAssetData?.points.map(([dateString, mktCapValue]) => ({
          date: dateString,
          value: mktCapValue,
        }))
      : []

    const layer2SeriesMapped = layer2AssetDataArray.length
      ? Object.values(
          layer2AssetDataArray.reduce<
            Record<string, { date: string; value: number }>
          >((acc, assetData) => {
            assetData.points.forEach(([dateString, mktCapValue]) => {
              if (!acc[dateString]) {
                acc[dateString] = { date: dateString, value: mktCapValue }
              } else {
                acc[dateString].value += mktCapValue
              }
            })
            return acc
          }, {})
        )
      : []

    return {
      data: {
        mainnet: getSeriesWithCurrent(mainnetSeriesMapped),
        layer2: getSeriesWithCurrent(layer2SeriesMapped),
      },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.RWA,
    }
  } catch (error: unknown) {
    console.error("fetchTimeseriesAssetsValue failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    throw error
  }
}

export default fetchTimeseriesAssetsValue
