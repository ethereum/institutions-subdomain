"use server"

import type {
  DataTimestamped,
  DateArg,
  RwaApiTimeseriesResponse,
} from "@/lib/types"

import { getRwaApiEthereumNetworksFilter } from "@/lib/utils/data"
import { dateNDaysAgo, isValidDate } from "@/lib/utils/date"
import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

const RWA_XYZ_PROTOCOL_SLUGS = ["centrifuge", "maple"] as const

type JSONData = RwaApiTimeseriesResponse

export type ProtocolsValueBySlugData = Record<
  (typeof RWA_XYZ_PROTOCOL_SLUGS)[number],
  number
>

export const fetchProtocolsValueBySlug = async (): Promise<
  DataTimestamped<ProtocolsValueBySlugData>
> => {
  const url = new URL("https://api.rwa.xyz/v3/protocols/timeseries")

  const apiKey = process.env.RWA_API_KEY || ""

  if (!apiKey) {
    throw new Error(`No API key available for ${url.toString()}`)
  }

  const myQuery = {
    aggregate: {
      groupBy: "protocol",
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
          field: "measureSlug",
          operator: "equals",
          value: "outstanding_capital_dollar",
        },
        {
          operator: "or",
          filters: RWA_XYZ_PROTOCOL_SLUGS.map((slug) => ({
            field: "protocolSlug",
            operator: "equals",
            value: slug,
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
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      next: {
        revalidate: every("day"),
        tags: ["rwa:v3:protocols:timeseries:by-slug"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${decodeURIComponent(url.toString())}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    let lastUpdated: string | null = null

    const data = RWA_XYZ_PROTOCOL_SLUGS.reduce((acc, key) => {
      const result = json.results.find((r) =>
        r.group.name?.toLowerCase().includes(key)
      )
      if (result && result.points.length > 0) {
        const lastPoint = result.points[result.points.length - 1]
        const lastDate = lastPoint[0]
        if (!lastUpdated || lastDate > lastUpdated) lastUpdated = lastDate
        acc[key] = lastPoint[1]
      } else {
        acc[key] = 0
      }
      return acc
    }, {} as ProtocolsValueBySlugData)

    return {
      data,
      lastUpdated:
        lastUpdated && isValidDate(lastUpdated)
          ? new Date(lastUpdated as DateArg).getTime()
          : Date.now(),
      sourceInfo: SOURCE.RWA,
    }
  } catch (error: unknown) {
    console.error("fetchProtocolsValueBySlug failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url: url,
    })
    throw error
  }
}

export default fetchProtocolsValueBySlug
