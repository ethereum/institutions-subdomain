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

import { SOURCE } from "@/lib/constants"

const RWA_XYZ_PROTOCOLS = {
  centrifuge: "Centrifuge",
  maple: "Maple",
} as const satisfies Record<string, string>

type JSONData = RwaApiTimeseriesResponse

export type ProtocolsValueBySlugData = Record<
  keyof typeof RWA_XYZ_PROTOCOLS,
  number
>

export const fetchProtocolsValueBySlug = async (): Promise<
  DataTimestamped<ProtocolsValueBySlugData>
> => {
  const url = new URL("https://api.rwa.xyz/v4/tokens/aggregates/timeseries")

  const apiKey = process.env.RWA_API_KEY || ""

  if (!apiKey) {
    console.warn(`No API key available for ${url.toString()}`)
    return {
      data: { centrifuge: 0, maple: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.RWA,
    }
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
          field: "measure_id",
          operator: "equals",
          value: 63,
        },
        {
          field: "date",
          operator: "onOrAfter",
          value: dateNDaysAgo(),
        },
        {
          operator: "or",
          filters: Object.values(RWA_XYZ_PROTOCOLS).map((name) => ({
            field: "protocol_name",
            operator: "equals",
            value: name,
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
        tags: ["rwa:v4:tokens:aggregates:timeseries:by-slug"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${decodeURIComponent(url.toString())}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    // Build reverse mapping from protocol name to key
    const nameToKey = Object.entries(RWA_XYZ_PROTOCOLS).reduce<
      Record<string, keyof typeof RWA_XYZ_PROTOCOLS>
    >((acc, [key, name]) => {
      acc[name] = key as keyof typeof RWA_XYZ_PROTOCOLS
      return acc
    }, {})

    let lastUpdated: string | null = null

    const data = Object.keys(RWA_XYZ_PROTOCOLS).reduce((acc, key) => {
      const protocolKey = key as keyof typeof RWA_XYZ_PROTOCOLS
      const result = json.results.find(
        (r) => r.group.name && nameToKey[r.group.name] === protocolKey
      )
      if (result && result.points.length > 0) {
        const lastPoint = result.points[result.points.length - 1]
        const lastDate = lastPoint[0]
        if (!lastUpdated || lastDate > lastUpdated) lastUpdated = lastDate
        acc[protocolKey] = lastPoint[1]
      } else {
        acc[protocolKey] = 0
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
    return {
      data: { centrifuge: 0, maple: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.RWA,
    }
  }
}

export default fetchProtocolsValueBySlug
