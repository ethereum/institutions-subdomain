"use server"

import type { DataTimestamped, GrowthepieApiResult } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

type JSONData = GrowthepieApiResult[]

export type L2MedianTxCostData = {
  latestWeightedMedianTxCostUsd: number
}

export const fetchL2MedianTxCost = async (): Promise<
  DataTimestamped<L2MedianTxCostData>
> => {
  const url = "https://api.growthepie.com/v1/fundamentals_7d.json"

  try {
    const response = await fetch(url, {
      next: {
        revalidate: every("day"),
        tags: ["growthepie:fundamentals_7d"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${url}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    const filteredResponses = json.filter((item) =>
      ["txcosts_median_usd", "txcount"].includes(item.metric_key)
    )

    // TODO: Confirm usage of most recent day
    const latestDate = filteredResponses.reduce((latest, item) => {
      const itemDate = new Date(item.date)
      return itemDate > new Date(latest) ? item.date : latest
    }, filteredResponses[0].date)

    const latestDayData = filteredResponses.filter(
      (item) => item.date === latestDate
    )

    const collated: Record<
      string,
      {
        txCount?: number
        medianTxCost?: number
      }
    > = {}

    latestDayData.forEach(({ metric_key, origin_key, value }) => {
      // Skip Mainnet
      if (origin_key === "ethereum") return
      // Add key if not yet initialized
      if (!collated[origin_key]) collated[origin_key] = {}
      // Update values
      if (metric_key === "txcount") collated[origin_key].txCount = value
      if (metric_key === "txcosts_median_usd")
        collated[origin_key].medianTxCost = value
    })

    const { weightedSum, totalTxCount } = Object.values(collated).reduce(
      (acc, { txCount, medianTxCost }) => {
        if (typeof txCount === "number" && typeof medianTxCost === "number") {
          acc.weightedSum += medianTxCost * txCount
          acc.totalTxCount += txCount
        }
        return acc
      },
      { weightedSum: 0, totalTxCount: 0 }
    )

    // const latestWeightedMedianTxCostUsd =

    return {
      data: {
        latestWeightedMedianTxCostUsd:
          totalTxCount > 0 ? weightedSum / totalTxCount : 0,
      },
      lastUpdated: new Date(latestDate).getTime() || Date.now(),
      sourceInfo: SOURCE.GROWTHEPIE,
    }
  } catch (error: unknown) {
    console.error("fetchL2MedianTxCost failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    throw error
  }
}

export default fetchL2MedianTxCost
