"use server"

import type { DataTimestamped, RwaApiTimeseriesResponse } from "@/lib/types"

import { getRwaApiEthereumNetworksFilter } from "@/lib/utils/data"
import { dateNDaysAgo } from "@/lib/utils/date"
import { fetchWithRetry } from "@/lib/utils/fetch"
import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

type JSONData = RwaApiTimeseriesResponse

export type ProtocolsValueTotalData = {
  totalPrivateCredit: number
}

export const fetchProtocolsValueTotal = async (): Promise<
  DataTimestamped<ProtocolsValueTotalData>
> => {
  const url = new URL("https://api.rwa.xyz/v3/protocols/timeseries")

  const apiKey = process.env.RWA_API_KEY || ""

  if (!apiKey) {
    throw new Error(`No API key available for ${url.toString()}`)
  }

  const myQuery = {
    filter: {
      operator: "and",
      filters: [
        {
          field: "measureSlug",
          operator: "equals",
          value: "outstanding_capital_dollar",
        },
        {
          field: "date",
          operator: "onOrAfter",
          value: dateNDaysAgo(),
        },
        getRwaApiEthereumNetworksFilter(["mainnet", "layer-2"]),
      ],
    },
    aggregate: {
      groupBy: "measure",
      aggregateFunction: "sum",
      interval: "day",
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
        tags: ["rwa:v3:protocols:timeseries:total-value"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${decodeURIComponent(url.toString())}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    const { results } = json

    const totalPrivateCredit = results.reduce((sum, { points }) => {
      const [, value] = points[points.length - 1]
      return sum + value
    }, 0)

    const firstResultPoints = results[0].points
    const [latestDate] = firstResultPoints[firstResultPoints.length - 1]

    return {
      data: { totalPrivateCredit },
      lastUpdated: new Date(latestDate).getTime(),
      sourceInfo: SOURCE.RWA,
    }
  } catch (error: unknown) {
    console.error("fetchProtocolsValueAll failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    return {
      data: { totalPrivateCredit: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.RWA,
    }
  }
}

export default fetchProtocolsValueTotal
