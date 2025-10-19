import { type NextRequest, NextResponse } from "next/server"

import type {
  GrowthepieApiResult,
  InternalGrowthepieApiTimeseriesData,
} from "@/lib/types"

import { filterFirstAndFifteenth } from "@/lib/utils/data"

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

  // Trim/aggregate to { date, value } for metric_key === "tvl"
  const dataAllUSD = json.filter(({ metric_key }) => metric_key === "tvl")
  const dataSummed: InternalGrowthepieApiTimeseriesData = Object.values(
    dataAllUSD.reduce<Record<string, { date: number; value: number }>>(
      (acc, { date, value }) => {
        const numericalDate = new Date(date).getTime()
        acc[numericalDate] = acc[numericalDate]
          ? { date: numericalDate, value: acc[numericalDate].value + value }
          : { date: numericalDate, value: value }
        return acc
      },
      {}
    )
  )
  const dataSorted = dataSummed.sort((a, b) => a.date - b.date)

  const data = filterFirstAndFifteenth(dataSorted)

  return new Response(JSON.stringify({ data, lastUpdated: Date.now() }), {
    headers: { "content-type": "application/json" },
  })
}
