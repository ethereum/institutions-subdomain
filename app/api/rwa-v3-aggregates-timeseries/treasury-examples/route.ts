import { type NextRequest, NextResponse } from "next/server"

import type { RwaApiTimeseriesResponse } from "@/lib/types"

import { getRwaApiEthereumNetworksFilter } from "@/lib/utils/data"
import { dateNDaysAgo } from "@/lib/utils/date"

import { RWA_API_MEASURE_ID_BY_CATEGORY } from "@/lib/constants"

export const RWA_XYZ_TREASURIES_ASSET_IDS = {
  BUIDL: 2331,
  BENJI: 63,
  OUSG: 57,
  mF_ONE: 15152,
} as const satisfies Record<string, number>

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

  const upstream = new URL(
    "https://api.rwa.xyz/v3/assets/aggregates/timeseries"
  )

  const apiKey = process.env.RWA_API_KEY || ""

  if (!apiKey) {
    throw new Error(`No API key available for ${upstream.toString()}`)
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

  // Build a reverse mapping from assetID to key
  const assetIdToKey = Object.entries(RWA_XYZ_TREASURIES_ASSET_IDS).reduce<
    Record<number, string>
  >((acc, [key, id]) => {
    acc[id] = key
    return acc
  }, {})

  const data: Record<string, number> = {}
  let lastUpdated: string | null = null

  json.results.forEach((result) => {
    const key = assetIdToKey[result.group.id]
    if (result.points.length > 0) {
      const lastPoint = result.points[result.points.length - 1]
      const lastDate = lastPoint[0]
      if (!lastUpdated || lastDate > lastUpdated) lastUpdated = lastDate
      if (key) data[key] = lastPoint[1]
    }
  })

  return new Response(JSON.stringify({ data, lastUpdated }), {
    headers: { "content-type": "application/json" },
  })
}
