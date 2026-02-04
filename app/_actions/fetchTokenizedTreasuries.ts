"use server"

import type { DataTimestamped, RwaApiTimeseriesResponse } from "@/lib/types"

import { getRwaApiEthereumNetworksFilter } from "@/lib/utils/data"
import { dateNDaysAgo } from "@/lib/utils/date"
import { fetchWithRetry } from "@/lib/utils/fetch"
import { every } from "@/lib/utils/time"

import { RWA_API_MEASURE_ID_BY_CATEGORY, SOURCE } from "@/lib/constants"

type JSONData = RwaApiTimeseriesResponse

export type TokenizedTreasuriesData = {
  totalTreasuries: number
}

export const fetchTokenizedTreasuries = async (): Promise<
  DataTimestamped<TokenizedTreasuriesData>
> => {
  const url = new URL("https://api.rwa.xyz/v3/assets/aggregates/timeseries")

  const apiKey = process.env.RWA_API_KEY || ""

  if (!apiKey) {
    throw new Error(`No API key available for ${url.toString()}`)
  }

  const myQuery = {
    aggregate: {
      groupBy: "network",
      aggregateFunction: "sum",
      interval: "day",
    },
    filter: {
      operator: "and",
      filters: [
        {
          field: "assetClassID",
          operator: "equals",
          value: 27,
        },
        {
          field: "date",
          operator: "onOrAfter",
          value: dateNDaysAgo(),
        },
        {
          field: "isInvestable",
          operator: "equals",
          value: true,
        },
        {
          field: "measureID",
          operator: "equals",
          value: RWA_API_MEASURE_ID_BY_CATEGORY.RWAS,
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
    const response = await fetchWithRetry(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      next: {
        revalidate: every("day"),
        tags: ["rwa:v3:assets:aggregates:timeseries"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${decodeURIComponent(url.toString())}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    const { results } = json

    const totalTreasuries = results.reduce((sum, { points }) => {
      const [, value] = points[points.length - 1]
      return sum + value
    }, 0)

    const firstResultPoints = results[0].points
    const [latestDate] = firstResultPoints[firstResultPoints.length - 1]

    return {
      data: { totalTreasuries: totalTreasuries },
      lastUpdated: new Date(latestDate).getTime(),
      sourceInfo: SOURCE.RWA,
    }
  } catch (error: unknown) {
    console.error("fetchTokenizedTreasuries failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    throw error
  }
}

export default fetchTokenizedTreasuries
