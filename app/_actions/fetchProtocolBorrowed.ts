"use server"

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

export const fetchProtocolBorrowed = async (
  keys?: ProtocolKey[]
): Promise<DataTimestamped<ProtocolBorrowedData>> => {
  const selectedKeys = keys?.length
    ? keys
    : (Object.keys(DEFILLAMA_PROTOCOLS) as ProtocolKey[])

  try {
    const entries = await Promise.all(
      selectedKeys.map(async (key) => {
        const slug = DEFILLAMA_PROTOCOLS[key]
        const url = `https://api.llama.fi/protocol/${slug}`
        const response = await fetchWithRetry(url, {
          next: {
            revalidate: every("hour"),
            tags: [`llama:protocol:${slug}`],
          },
        })

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

    return {
      data: { ...dataTemplate, ...Object.fromEntries(entries) },
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
