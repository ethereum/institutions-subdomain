"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

type JSONData = {
  chart: {
    data: [
      number, // timestamp, e.g., 1760313600 (seconds, daily x 1 month, ascending)
      number, // native minted, e.g., 12_527_885_542.3945 (USD)
      number, // canonical bridge, e.g., 21_966_306_078.2627 (USD)
      number, // externally bridged, e.g., 21_104_738_337.5352 (USD)
      number, // ethPrice, e.g., 1234.5678 (USD)
    ][] // Most recent last
    syncedUntil: number // timestamp (Unix seconds)
  }
  projects: Record<
    "soneium" | string /* network-id */,
    {
      id: string // "arbitrum"
      name: string // "Arbitrum One"
      slug: string // "arbitrum"
      type: string // "layer2"
      hostChain: string // "Ethereum"
      category: string // "Optimistic Rollup"
      providers: string[] // ["Arbitrum"]
      purposes: string[] // ["Universal"]
      isArchived: boolean // false
      isUpcoming: boolean // false
      isUnderReview: boolean // false
      badges: {
        id: string // "EVM"
        type: string // "VM"
        name: string // "EVM"
        description: string // "This project uses the Ethereum Virtual Machine to run its smart contracts and supports the Solidity programming language"
        action: {
          type: string // "scalingFilter",
          id: string // "vm",
          value: string // "EVM"
        }
      }[]
      stage: string // "Stage 1"
      risks: {
        name: string // "Data Availability"
        value: string // "Onchain"
        sentiment: string // "good"
        description: string // "All of the data needed for proof construction is published on Ethereum L1."
      }[]
      tvs: {
        breakdown: {
          total: number // 20010035000
          native: number // 3636037600
          canonical: number // 6024360400
          external: number // 10349637000
          ether: number // 4429969400
          stablecoin: number // 9685455000
          btc: number // 1123925900
          other: number // 4770684000
          associated: number // 2247438000
        }
        change7d: number // 0.0247121106830532
        associatedTokens: {
          symbol: string // "ARB"
          icon: string // "https://coin-images.coingecko.com/coins/images/16547/large/arb.jpg?1721358242"
        }[]
      }
    }
  >
}

export type SoneiumTvsData = {
  soneiumTvs: number
}

export const fetchSoneiumTvs = async (): Promise<
  DataTimestamped<SoneiumTvsData>
> => {
  const url = "https://l2beat.com/api/scaling/summary"

  try {
    const response = await fetch(url, {
      next: {
        revalidate: every("hour", 6),
        tags: ["l2beat:scaling:summary:soneium-tvs"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${url}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    const soneiumTvs = json.projects.soneium.tvs.breakdown.total

    if (!soneiumTvs) throw new Error(`Empty Soneium TVS data from ${url}`)

    return {
      data: { soneiumTvs },
      lastUpdated:
        new Date(json.chart.syncedUntil * 1e3).getTime() || Date.now(),
      sourceInfo: SOURCE.L2BEAT,
    }
  } catch (error: unknown) {
    console.error("fetchSoneiumTvs failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    throw error
  }
}

export default fetchSoneiumTvs
