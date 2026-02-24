"use server"

import type {
  DataSeries,
  DataSeriesWithCurrent,
  DataTimestamped,
  RwaApiTimeseriesResponse,
} from "@/lib/types"

import {
  getDataSeriesWithCurrent,
  getRwaApiEthereumNetworksFilter,
} from "@/lib/utils/data"
import { fetchWithRetry } from "@/lib/utils/fetch"
import { every } from "@/lib/utils/time"

import { RWA_API_MEASURE_ID_BY_CATEGORY, SOURCE } from "@/lib/constants"

type JSONData = RwaApiTimeseriesResponse

export type SecuritizeAumData = DataSeriesWithCurrent

export const fetchSecuritizeAum = async (): Promise<
  DataTimestamped<SecuritizeAumData>
> => {
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
          value: RWA_API_MEASURE_ID_BY_CATEGORY.RWAS,
        },
        {
          field: "protcolID",
          operator: "equals",
          value: 10,
        },
        getRwaApiEthereumNetworksFilter(["mainnet", "layer-2"]),
      ],
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
        tags: ["rwa:v3:assets:aggregates:timeseries:securitize"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${decodeURIComponent(url.toString())}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    const ethereumStablecoinData = json.results[0]

    const seriesMapped: DataSeries = ethereumStablecoinData?.points?.length
      ? ethereumStablecoinData?.points.map(([dateString, mktCapValue]) => ({
          date: dateString,
          value: mktCapValue,
        }))
      : []

    return {
      ...getDataSeriesWithCurrent(seriesMapped),
      sourceInfo: SOURCE.RWA,
    }
  } catch (error: unknown) {
    console.error("fetchSecuritizeAum failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    return {
      data: { series: [], currentValue: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.RWA,
    }
  }
}

export default fetchSecuritizeAum
