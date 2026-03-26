"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

type JSONData = { sum: number; securityRatio: number }

export type TotalValueSecuredData = JSONData

export const fetchTotalValueSecured = async (): Promise<
  DataTimestamped<TotalValueSecuredData>
> => {
  const url = "https://ultrasound.money/api/fees/total-value-secured"

  try {
    const response = await fetch(url, {
      next: {
        revalidate: every("minute", 5),
        tags: ["ultrasound:fees:total-value-secured"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${url}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    return {
      data: json,
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.ULTRASOUND,
    }
  } catch (error: unknown) {
    console.error("fetchTotalValueSecured failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    return {
      data: { sum: 0, securityRatio: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.ULTRASOUND,
    }
  }
}

export default fetchTotalValueSecured
