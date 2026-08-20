"use server"

import type { DataTimestamped, DateArg, RwaApiTimeseriesResponse } from "@/lib/types"

import { getRwaApiEthereumNetworksFilter } from "@/lib/utils/data"
import { dateNDaysAgo, isValidDate } from "@/lib/utils/date"
import { fetchWithRetry } from "@/lib/utils/fetch"
import { every } from "@/lib/utils/time"

import { RWA_API_MEASURE_ID_BY_CATEGORY, SOURCE } from "@/lib/constants"

const RWA_XYZ_STABLECOIN_ASSET_IDS = {
  FIDD: 25640,
} as const satisfies Record<string, number>

type JSONData = RwaApiTimeseriesResponse

type StablecoinSupplyData = Record<
  keyof typeof RWA_XYZ_STABLECOIN_ASSET_IDS,
  number
>

export const fetchStablecoinSupply = async (): Promise<
  DataTimestamped<StablecoinSupplyData>
> => {
  const url = new URL("https://api.rwa.xyz/v4/tokens/aggregates/timeseries")

  const apiKey = process.env.RWA_API_KEY || ""

  if (!apiKey) {
    throw new Error(`No API key available for ${url.toString()}`)
  }

  const myQuery = {
    aggregate: {
      groupBy: "asset",
      aggregateFunction: "sum",
      interval: "day",
    },
    filter: {
      operator: "and",
      filters: [
        {
          field: "date",
          operator: "onOrAfter",
          value: dateNDaysAgo(),
        },
        {
          field: "measure_id",
          operator: "equals",
          value: RWA_API_MEASURE_ID_BY_CATEGORY.STABLECOINS,
        },
        {
          operator: "or",
          filters: Object.values(RWA_XYZ_STABLECOIN_ASSET_IDS).map((id) => ({
            field: "asset_id",
            operator: "equals",
            value: id,
          })),
        },
        getRwaApiEthereumNetworksFilter(["mainnet", "layer-2"]),
      ],
    },
    sort: {
      direction: "asc",
      field: "date",
    },
    pagination: {
      page: 1,
      perPage: 25,
    },
  }

  url.searchParams.set("query", JSON.stringify(myQuery))

  try {
    const response = await fetchWithRetry(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      next: {
        revalidate: every("day"),
        tags: ["rwa:v4:tokens:aggregates:timeseries:stablecoin-supply"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${decodeURIComponent(url.toString())}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    const assetIdToKey = Object.entries(RWA_XYZ_STABLECOIN_ASSET_IDS).reduce<
      Record<number, string>
    >((acc, [key, id]) => {
      acc[id] = key
      return acc
    }, {})

    const dataTemplate = Object.keys(RWA_XYZ_STABLECOIN_ASSET_IDS).reduce(
      (acc, k) => {
        acc[k as keyof typeof RWA_XYZ_STABLECOIN_ASSET_IDS] = 0
        return acc
      },
      {} as StablecoinSupplyData
    )

    let lastUpdated: string | null = null

    const data = json.results.reduce<StablecoinSupplyData>(
      (acc, result) => {
        const key = assetIdToKey[result.group.id] as
          | keyof typeof RWA_XYZ_STABLECOIN_ASSET_IDS
          | undefined

        if (result.points.length > 0) {
          const lastPoint = result.points[result.points.length - 1]
          const lastDate = lastPoint[0]
          if (!lastUpdated || lastDate > lastUpdated) lastUpdated = lastDate
          if (key) acc[key] = lastPoint[1]
        }

        return acc
      },
      dataTemplate
    )

    return {
      data,
      lastUpdated:
        lastUpdated && isValidDate(lastUpdated)
          ? new Date(lastUpdated as DateArg).getTime()
          : Date.now(),
      sourceInfo: SOURCE.RWA,
    }
  } catch (error: unknown) {
    console.error("fetchStablecoinSupply failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url: url,
    })
    throw error
  }
}

export default fetchStablecoinSupply
