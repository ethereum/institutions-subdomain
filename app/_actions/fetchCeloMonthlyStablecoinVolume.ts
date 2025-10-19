"use server"

import type { DataTimestamped, RwaApiTimeseriesResponse } from "@/lib/types"

import { every } from "@/lib/utils/time"

import {
  RWA_API_LAYER_2S,
  RWA_API_STABLECOINS_GROUP_ID,
  SOURCE,
} from "@/lib/constants"

type JSONData = RwaApiTimeseriesResponse

export type CeloMonthlyStablecoinVolumeData = {
  celoMonthlyStablecoinVolume: number
}

export const fetchCeloMonthlyStablecoinVolume = async (): Promise<
  DataTimestamped<CeloMonthlyStablecoinVolumeData>
> => {
  const url = new URL("https://api.rwa.xyz/v3/assets/aggregates/timeseries")

  const apiKey = process.env.RWA_API_KEY || ""

  if (!apiKey) {
    throw new Error(`No API key available for ${url.toString()}`)
  }

  const celoNetworkId = RWA_API_LAYER_2S.find(({ name }) => name === "Celo")!.id // Force unwrapped due to type safety

  const myQuery = {
    aggregate: {
      groupBy: "assetClass",
      aggregateFunction: "sum",
    },
    sort: {
      direction: "asc",
      field: "date",
    },
    pagination: {
      page: 1,
      perPage: 25,
    },
    filter: {
      operator: "and",
      filters: [
        {
          field: "measureID",
          operator: "equals",
          value: 1003, // Monthly transfer volume
        },
        {
          field: "assetClassID",
          operator: "equals",
          value: RWA_API_STABLECOINS_GROUP_ID,
        },
        {
          field: "networkID",
          operator: "equals",
          value: celoNetworkId,
        },
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
        revalidate: every("week"),
        tags: ["rwa:v3:assets:aggregates:timeseries:celo"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${decodeURIComponent(url.toString())}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    if (!json.results.length || !json.results[0].points.length)
      throw new Error("No results for Celo monthly volume fetch")

    const celoData = json.results[0].points

    const [latestDate, celoMonthlyStablecoinVolume] =
      celoData[celoData.length - 1]

    return {
      data: {
        celoMonthlyStablecoinVolume,
      },
      lastUpdated: new Date(latestDate).getTime(),
      sourceInfo: SOURCE.RWA,
    }
  } catch (error: unknown) {
    console.error("fetchCeloMonthlyStablecoinVolume failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    throw error
  }
}

export default fetchCeloMonthlyStablecoinVolume
