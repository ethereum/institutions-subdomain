import { type NextRequest, NextResponse } from "next/server"

import type { RwaApiTimeseriesResponse } from "@/lib/types"

import { getRwaApiEthereumNetworksFilter } from "@/lib/utils/data"
import { dateNDaysAgo } from "@/lib/utils/date"

export const RWA_XYZ_PROTOCOL_SLUGS = ["centrifuge", "maple"] as const

type JSONData = RwaApiTimeseriesResponse

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const secret = searchParams.get("secret")

  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json(
      { message: "Invalid internal API secret" },
      { status: 401 } // 401 Unauthorized
    )
  }

  const upstream = new URL("https://api.rwa.xyz/v3/protocols/timeseries")

  const apiKey = process.env.RWA_API_KEY || ""

  if (!apiKey) {
    throw new Error(`No API key available for ${upstream.toString()}`)
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

  upstream.searchParams.append("query", JSON.stringify(myQuery))

  // Fetch upstream without letting Next cache the raw >2MB payload
  const res = await fetch(upstream, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  })

  if (!res.ok) return new Response("Upstream error", { status: res.status })

  const json: JSONData = await res.json()

  const data: Record<string, number> = {}
  let lastUpdated: string | null = null

  RWA_XYZ_PROTOCOL_SLUGS.forEach((key) => {
    const result = json.results.find((r) =>
      r.group.name?.toLowerCase().includes(key)
    )
    if (result && result.points.length > 0) {
      const lastPoint = result.points[result.points.length - 1]
      const lastDate = lastPoint[0]
      if (!lastUpdated || lastDate > lastUpdated) lastUpdated = lastDate
      data[key] = lastPoint[1]
    }
  })

  return new Response(JSON.stringify({ data, lastUpdated }), {
    headers: { "content-type": "application/json" },
  })
}
