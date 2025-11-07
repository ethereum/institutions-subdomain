"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

type JSONData = {
  data: {
    validatorscount: number
    eligibleether: number // in gwei
    ts: string // timestamp, e.g., "2025-10-14T19:47:35Z"
  }
}

export type BeaconChainData = {
  validatorsCount: number
  totalStakedEther: number
}

export const fetchBeaconChain = async (): Promise<
  DataTimestamped<BeaconChainData>
> => {
  const url = "https://beaconcha.in/api/v1/epoch/latest"

  try {
    const response = await fetch(url, {
      next: {
        revalidate: every("minute", 5),
        tags: ["beaconchain:v1:epoch:latest"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${url}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    const { validatorscount, eligibleether: eligibleGwei, ts } = json.data

    return {
      data: {
        validatorsCount: validatorscount,
        totalStakedEther: eligibleGwei * 1e-9,
      },
      lastUpdated: new Date(ts).getTime() || Date.now(),
      sourceInfo: SOURCE.BEACONCHAIN,
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
