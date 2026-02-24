"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

type JSONData = {
  data: {
    chart: {
      data: [
        number, // timestamp, e.g., 1760313600 (seconds, daily x 1 month, ascending)
        number, // count, e.g., 39404445
        number, // uopsCount, e.g., 43021589 (user operations per second)
      ][]
    }
  }
}

export type L2ScalingActivityData = { uops: number }

export const fetchL2ScalingActivity = async (): Promise<
  DataTimestamped<L2ScalingActivityData>
> => {
  const url = "https://l2beat.com/api/scaling/activity"

  try {
    const response = await fetch(url, {
      next: {
        revalidate: every("day"),
        tags: ["l2beat:scaling:activity"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${url}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    const chartData = json.data.chart.data // ascending array by timestamp

    if (!chartData.length) throw new Error(`Empty chart data array from ${url}`)

    const [timestamp, , uopsCount] = chartData[chartData.length - 1]

    return {
      data: {
        uops: uopsCount,
      },
      lastUpdated: new Date(timestamp * 1e3).getTime() || Date.now(),
      sourceInfo: SOURCE.L2BEAT,
    }
  } catch (error: unknown) {
    console.error("fetchL2ScalingActivity failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    return {
      data: { uops: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.L2BEAT,
    }
  }
}

export default fetchL2ScalingActivity
