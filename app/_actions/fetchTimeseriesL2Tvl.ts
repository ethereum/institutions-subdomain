"use server"

import type {
  DataSeries,
  DataSeriesWithCurrent,
  DataTimestamped,
  InternalGrowthepieApiTimeseriesData,
} from "@/lib/types"

import { getDataSeriesWithCurrent } from "@/lib/utils/data"
import { every } from "@/lib/utils/time"

import { SITE_ORIGIN, SOURCE } from "@/lib/constants"

type JSONData = { data: InternalGrowthepieApiTimeseriesData }

export type TimeseriesL2TvlData = DataSeriesWithCurrent

export const fetchTimeseriesL2Tvl = async (): Promise<
  DataTimestamped<TimeseriesL2TvlData>
> => {
  // Call internal trimmed endpoint and let Next cache the small response.
  const secret = process.env.INTERNAL_API_SECRET || ""

  if (!secret) throw new Error("Internal API secret not found")

  const internalUrl = new URL("/api/growthepie-v1-export-tvl", SITE_ORIGIN)

  internalUrl.searchParams.set("secret", secret)

  const url = internalUrl.toString()

  try {
    const response = await fetch(url, {
      next: {
        revalidate: every("day"),
        tags: ["internal:growthepie:v1:export:tvl:timeseries"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${url}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    const seriesMapped: DataSeries = json.data.map(({ value, date }) => ({
      value,
      date: new Date(date).toUTCString(),
    }))

    return {
      ...getDataSeriesWithCurrent(seriesMapped, true),
      sourceInfo: SOURCE.GROWTHEPIE,
    }
  } catch (error: unknown) {
    console.error("fetchTimeseriesL2Tvl failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    throw error
  }
}

export default fetchTimeseriesL2Tvl
