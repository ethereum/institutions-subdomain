"use server"

import type { DataTimestamped, RwaApiAssetValueMetrics } from "@/lib/types"

import { every } from "@/lib/utils/time"

import { SOURCE } from "@/lib/constants"

type JSONData = {
  results: {
    slug: string // e.g., 'ethereum'
    price_dollar: RwaApiAssetValueMetrics
    market_cap_dollar: RwaApiAssetValueMetrics
    _updated_at: string // e.g., '2025-10-15T16:50:10.901
  }[]
}

export type EtherMarketDetailsData = {
  etherMarketCap: number
  etherPrice: number
}

export const fetchEtherMarketDetails = async (): Promise<
  DataTimestamped<EtherMarketDetailsData>
> => {
  const url = new URL("https://api.rwa.xyz/v4/assets")

  const apiKey = process.env.RWA_API_KEY || ""

  if (!apiKey) {
    throw new Error(`No API key available for ${url.toString()}`)
  }

  const myQuery = {
    sort: {
      direction: "asc",
      field: "name",
    },
    pagination: {
      page: 1,
      perPage: 25,
    },
    filter: {
      operator: "and",
      filters: [
        {
          field: "network_ids",
          operator: "includes",
          value: 1,
        },
        {
          field: "ticker",
          operator: "equals",
          value: "ETH",
        },
      ],
    },
  }

  url.searchParams.set("query", JSON.stringify(myQuery))

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      next: {
        revalidate: every("minute"),
        tags: ["rwa:v4:assets:ether-market"],
      },
    })

    if (!response.ok)
      throw new Error(
        `Fetch response not OK from ${decodeURIComponent(url.toString())}: ${response.status} ${response.statusText}`
      )

    const json: JSONData = await response.json()

    if (
      json.results[0].slug !== "ethereum" ||
      !json.results[0].market_cap_dollar.val
    )
      throw new Error("Failed to find ether market cap data")

    const { market_cap_dollar, price_dollar, _updated_at } = json.results[0]

    return {
      data: {
        etherMarketCap: market_cap_dollar.val,
        etherPrice: price_dollar.val,
      },
      lastUpdated: new Date(_updated_at).getTime() || Date.now(),
      sourceInfo: SOURCE.RWA,
    }
  } catch (error: unknown) {
    console.error("fetchEtherMarketDetails failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      url,
    })
    throw error
  }
}

export default fetchEtherMarketDetails
