"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

type JSONData = {
  beaconBalancesSum: string // in Gwei, as string to handle large integers
}

export type BeaconChainData = {
  totalStakedEther: number
}

export const fetchBeaconChain = async (): Promise<
  DataTimestamped<BeaconChainData>
> => {
  const url = "https://ultrasound.money/api/v2/fees/supply-parts"

  try {
    const response = await fetch(url, {
      next: {
        revalidate: every("hour"),
        tags: ["ultrasound:v2:fees:supply-parts"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${url}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    return {
      data: {
        totalStakedEther: Number(json.beaconBalancesSum) * 1e-9,
      },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.ULTRASOUND,
    }
  } catch (error: unknown) {
    console.error("fetchBeaconChain failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    throw error
  }
}

export default fetchBeaconChain