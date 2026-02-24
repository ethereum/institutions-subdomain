"use server"

import type { DataTimestamped } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

import fetchL2ScalingSummary from "./fetchL2ScalingSummary"

type JSONData = { name: string; tvl: number }[]

export type DefiTvlAllCurrentData = {
  mainnetDefiTvl: number
  mainnetDefiMarketshare: number
  layer2DefiMarketshare: number
  runnerUpMultiplier: number
}

export const fetchDefiTvlAllCurrent = async (): Promise<
  DataTimestamped<DefiTvlAllCurrentData>
> => {
  const url = "https://api.llama.fi/v2/chains"

  try {
    const response = await fetch(url, {
      next: {
        revalidate: every("hour"),
        tags: ["llama:v2:chains"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${url}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    const sortedData = json.sort((a, b) => (b.tvl || 0) - (a.tvl || 0))
    const ethereumData = sortedData.find(
      ({ name }) => name.toLowerCase() === "ethereum"
    )

    if (!ethereumData?.tvl)
      throw new Error(`Missing Ethereum or runner-up TVL data from ${url}`)

    const otherNetworkData = sortedData.filter(
      ({ name }) => name.toLowerCase() !== "ethereum"
    )

    // Fetch list of all L2 network slugs from L2Beat
    const {
      data: { allL2Slugs },
    } = await fetchL2ScalingSummary()

    const layer2Data = sortedData.filter((item) =>
      allL2Slugs.includes(item.name.toLowerCase())
    )
    const totalLayer2DefiTvl = layer2Data.reduce(
      (sum, item) => sum + (item.tvl || 0),
      0
    )

    const [networkRunnerUpData] = otherNetworkData

    const runnerUpMultiplier = ethereumData.tvl / networkRunnerUpData.tvl

    const totalDefiTvl = sortedData.reduce(
      (sum, item) => sum + (item.tvl || 0),
      0
    )
    const mainnetDefiMarketshare = ethereumData.tvl / totalDefiTvl
    const layer2DefiMarketshare = totalLayer2DefiTvl / totalDefiTvl

    return {
      data: {
        mainnetDefiTvl: ethereumData.tvl,
        runnerUpMultiplier,
        mainnetDefiMarketshare,
        layer2DefiMarketshare,
      },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.LLAMA,
    }
  } catch (error: unknown) {
    console.error("fetchDefiTvlAllCurrent failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    return {
      data: {
        mainnetDefiTvl: 0,
        mainnetDefiMarketshare: 0,
        layer2DefiMarketshare: 0,
        runnerUpMultiplier: 0,
      },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.LLAMA,
    }
  }
}

export default fetchDefiTvlAllCurrent
