import { type NextRequest, NextResponse } from "next/server"

import type { GrowthepieApiResult } from "@/lib/types"

type JSONData = GrowthepieApiResult

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const secret = searchParams.get("secret")

  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json(
      { message: "Invalid internal API secret" },
      { status: 401 } // 401 Unauthorized
    )
  }

  const upstream = "https://api.growthepie.com/v1/export/tvl.json"

  // Fetch upstream without letting Next cache the raw ~5MB payload
  const res = await fetch(upstream, { cache: "no-store" })
  if (!res.ok) return new Response("Upstream error", { status: res.status })

  const json: JSONData[] = await res.json()

  // Trim/aggregate to { date, value } for metric_key === "tvl" and Base network
  const dataBaseUSD = json.filter(
    ({ metric_key, origin_key }) =>
      metric_key === "tvl" && origin_key.toLowerCase() === "base"
  )
  const sortedDescendingDate = dataBaseUSD.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  if (!sortedDescendingDate.length)
    throw new Error(
      `No data found for metric_key === "tvl" && origin_key === "base"`
    )

  return new Response(
    JSON.stringify({
      data: { baseTvl: sortedDescendingDate[0].value },
      lastUpdated: new Date(sortedDescendingDate[0].date),
    }),
    {
      headers: { "content-type": "application/json" },
    }
  )
}
