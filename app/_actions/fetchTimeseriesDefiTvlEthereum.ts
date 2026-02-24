"use server"

import type {
  DataSeries,
  DataSeriesWithCurrent,
  DataTimestamped,
} from "@/lib/types"

import { getDataSeriesWithCurrent } from "@/lib/utils/data"
import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

type JSONData = { date: number; tvl: number }[]

export type TimeseriesDefiTvlEthereumData = DataSeriesWithCurrent

export const fetchTimeseriesDefiTvlEthereum = async (): Promise<
  DataTimestamped<TimeseriesDefiTvlEthereumData>
> => {
  const url = "https://api.llama.fi/v2/historicalChainTvl/ethereum"

  try {
    const response = await fetch(url, {
      next: {
        revalidate: every("day"),
        tags: ["llama:v2:historicalChainTvl:ethereum"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${url}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    const seriesMapped: DataSeries = json.map(({ tvl, date }) => ({
      value: tvl,
      date: new Date(date * 1e3).toUTCString(),
    }))

    return {
      ...getDataSeriesWithCurrent(seriesMapped),
      sourceInfo: SOURCE.LLAMA,
    }
  } catch (error: unknown) {
    console.error("fetchHistoricalChainTvlEthereum failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    return {
      data: { series: [], currentValue: 0 },
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.LLAMA,
    }
  }
}

export default fetchTimeseriesDefiTvlEthereum
