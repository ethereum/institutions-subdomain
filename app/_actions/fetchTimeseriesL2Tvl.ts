"use server"

import { unstable_cache } from "next/cache"

import type {
  DataSeries,
  DataSeriesWithCurrent,
  DataTimestamped,
  GrowthepieApiResult,
  InternalGrowthepieApiTimeseriesData,
} from "@/lib/types"

type JSONData = GrowthepieApiResult[]

import { filterFirstAndFifteenth, getDataSeriesWithCurrent } from "@/lib/utils/data"
import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

export type TimeseriesL2TvlData = DataSeriesWithCurrent

const fetchTimeseriesL2TvlData = async () => {
  const url = "https://api.growthepie.com/v1/export/tvl.json"

  // No Next cache -- avoids caching the large (~5MB) upstream response
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok)
    throw new Error(
      `Fetch response not OK from ${url}: ${res.status} ${res.statusText}`
    )

  const json: JSONData = await res.json()

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

  const seriesMapped: DataSeries = data.map(({ value, date }) => ({
    value,
    date: new Date(date).toUTCString(),
  }))

  return getDataSeriesWithCurrent(seriesMapped, true)
}

const getCachedTimeseriesL2TvlData = () =>
  unstable_cache(fetchTimeseriesL2TvlData, ["growthepie-l2-tvl-timeseries"], {
    revalidate: every("day"),
  })()

export const fetchTimeseriesL2Tvl = async (): Promise<
  DataTimestamped<TimeseriesL2TvlData>
> => {
  try {
    return {
      ...(await getCachedTimeseriesL2TvlData()),
      sourceInfo: SOURCE.GROWTHEPIE,
    }
  } catch (error: unknown) {
    console.error("fetchTimeseriesL2Tvl failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
    })
    return {
      data: { series: [], currentValue: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.GROWTHEPIE,
    }
  }
}

export default fetchTimeseriesL2Tvl
