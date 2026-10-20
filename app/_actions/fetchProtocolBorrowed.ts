"use server"

import { unstable_cache } from "next/cache"

import type { DataTimestamped } from "@/lib/types"

import { fetchWithRetry } from "@/lib/utils/fetch"
import { every } from "@/lib/utils/time"

import { DEFILLAMA_L2_CHAIN_NAMES, SOURCE } from "@/lib/constants"

const DEFILLAMA_PROTOCOLS = {
  aave: "aave",
  morpho: "morpho",
} as const satisfies Record<string, string>

type ProtocolKey = keyof typeof DEFILLAMA_PROTOCOLS

type JSONData = {
  name: string
  currentChainTvls: Record<string, number>
}

export type ProtocolBorrowedData = Record<ProtocolKey, number>

const fetchProtocolBorrowedData = async (
  keys: ProtocolKey[]
): Promise<ProtocolBorrowedData> => {
  const entries = await Promise.all(
    keys.map(async (key) => {
      const slug = DEFILLAMA_PROTOCOLS[key]
      const url = `https://api.llama.fi/protocol/${slug}`

      // No `next.revalidate` here -- avoids caching the large (~12MB) response
      const response = await fetchWithRetry(url, { cache: "no-store" })

      if (!response.ok)
        throw new Error(
          `Fetch response not OK from ${url}: ${response.status} ${response.statusText}`
        )

      const json: JSONData = await response.json()

      // Sum Ethereum mainnet + L2 borrowed amounts
      const borrowed = Object.entries(json.currentChainTvls).reduce(
        (sum, [chain, value]) => {
          if (chain === "Ethereum-borrowed") return sum + value
          const chainName = chain.replace("-borrowed", "")
          if (
            chain.endsWith("-borrowed") &&
            DEFILLAMA_L2_CHAIN_NAMES.includes(chainName)
          )
            return sum + value
          return sum
        },
        0
      )

      return [key, borrowed] as const
    })
  )

  const dataTemplate = Object.keys(DEFILLAMA_PROTOCOLS).reduce(
    (acc, k) => {
      acc[k as ProtocolKey] = 0
      return acc
    },
    {} as ProtocolBorrowedData
  )

  return { ...dataTemplate, ...Object.fromEntries(entries) }
}

// Cache only the small result, not the large upstream response
const getCachedBorrowedData = (keys: ProtocolKey[]) =>
  unstable_cache(
    () => fetchProtocolBorrowedData(keys),
    ["protocol-borrowed", ...keys],
    { revalidate: every("hour") }
  )()

export const fetchProtocolBorrowed = async (
  keys?: ProtocolKey[]
): Promise<DataTimestamped<ProtocolBorrowedData>> => {
  const selectedKeys = keys?.length
    ? keys
    : (Object.keys(DEFILLAMA_PROTOCOLS) as ProtocolKey[])

  try {
    const data = await getCachedBorrowedData(selectedKeys)

    return {
      data,
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.LLAMA,
    }
  } catch (error: unknown) {
    console.error("fetchProtocolBorrowed failed", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
    })
    return {
      data: Object.keys(DEFILLAMA_PROTOCOLS).reduce(
        (acc, k) => {
          acc[k as ProtocolKey] = 0
          return acc
        },
        {} as ProtocolBorrowedData
      ),
      lastUpdated: Date.now(),
      sourceInfo: SOURCE.LLAMA,
    }
  }
}

export default fetchProtocolBorrowed
