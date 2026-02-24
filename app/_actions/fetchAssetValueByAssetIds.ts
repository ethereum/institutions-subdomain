"use server"

import type {
  DataTimestamped,
  DateArg,
  RwaApiTimeseriesResponse,
} from "@/lib/types"

import { getRwaApiEthereumNetworksFilter } from "@/lib/utils/data"
import { dateNDaysAgo, isValidDate } from "@/lib/utils/date"
import { fetchWithRetry } from "@/lib/utils/fetch"
import { every } from "@/lib/utils/time"

import { RWA_API_MEASURE_ID_BY_CATEGORY, SOURCE } from "@/lib/constants"

const RWA_XYZ_TREASURIES_ASSET_IDS = {
  BUIDL: 2331,
  USTB: 1385,
  OUSG: 57,
  mF_ONE: 15152,
} as const satisfies Record<string, number>

type JSONData = RwaApiTimeseriesResponse

type AssetValueByAssetIdsData = Record<
  keyof typeof RWA_XYZ_TREASURIES_ASSET_IDS,
  number
>

export const fetchAssetValueByAssetIds = async (): Promise<
  DataTimestamped<AssetValueByAssetIdsData>
> => {
  const url = new URL("https://api.rwa.xyz/v3/assets/aggregates/timeseries")

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
          field: "measureID",
          operator: "equals",
          value: RWA_API_MEASURE_ID_BY_CATEGORY.RWAS,
        },
        {
          operator: "or",
          filters: Object.values(RWA_XYZ_TREASURIES_ASSET_IDS).map((id) => ({
            field: "assetID",
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
        tags: ["rwa:v3:assets:aggregates:timeseries:by-asset-ids"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${decodeURIComponent(url.toString())}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    // Build a reverse mapping from assetID to key
    const assetIdToKey = Object.entries(RWA_XYZ_TREASURIES_ASSET_IDS).reduce<
      Record<number, string>
    >((acc, [key, id]) => {
      acc[id] = key
      return acc
    }, {})

    const dataTemplate = Object.keys(RWA_XYZ_TREASURIES_ASSET_IDS).reduce(
      (acc, k) => {
        acc[k as keyof typeof RWA_XYZ_TREASURIES_ASSET_IDS] = 0
        return acc
      },
      {} as AssetValueByAssetIdsData
    )

    let lastUpdated: string | null = null

    const data = json.results.reduce<AssetValueByAssetIdsData>(
      (acc, result) => {
        const key = assetIdToKey[result.group.id] as
          | keyof typeof RWA_XYZ_TREASURIES_ASSET_IDS
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
    console.error("fetchAssetValueByAssetIds failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url: url,
    })
    return {
      data: { BUIDL: 0, USTB: 0, OUSG: 0, mF_ONE: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.RWA,
    }
  }
}

export default fetchAssetValueByAssetIds
