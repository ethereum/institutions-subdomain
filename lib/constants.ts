import { LinkProps } from "@/components/ui/link"

import type { NetworkNameId, SourceInfo } from "./types"

/**
 * General
 */

export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000"

export const MAINNET_GENESIS = "2015-07-30T15:26:13Z"

export const ENTERPRISE_EMAIL = "enterprise@ethereum.org"

export const DEFAULT_OG_IMAGE = "/images/og/home.png"

/**
 * Source information for API utilized
 */

export const SOURCE = {
  RWA: {
    source: "rwa.xyz",
    sourceHref: "https://rwa.xyz",
  },
  BEACONCHAIN: {
    source: "beaconcha.in",
    sourceHref: "https://beaconcha.in",
  },
  LLAMA: {
    source: "defillama.com",
    sourceHref: "https://defillama.com/",
  },
  ULTRASOUND: {
    source: "ultrasound.money",
    sourceHref: "https://ultrasound.money",
  },
  L2BEAT: {
    source: "l2beat.com",
    sourceHref: "https://l2beat.com",
  },
  GROWTHEPIE: {
    source: "growthepie.com",
    sourceHref: "https://growthepie.com",
  },
  COINGECKO: {
    source: "coingecko.com",
    sourceHref: "https://coingecko.com",
  },
} as const satisfies Record<string, SourceInfo>

/**
 * Site navigation
 */

export const DA_NAV_ITEM_LINKS: LinkProps[] = [
  {
    children: "RWAs & Stablecoins",
    href: "/rwa",
  },
  {
    children: "Decentralized Finance",
    href: "/defi",
  },
  {
    children: "Compliant Privacy",
    href: "/privacy",
  },
  {
    children: "L2 Ecosystem",
    href: "/layer-2",
  },
]

export const NAV_ITEM_LINKS: LinkProps[] = [
  { children: "Live Data", href: "/data-hub" },
  { children: "Library", href: "/library" },
]

/**
 * RWA.xyz API usage
 */

export const RWA_API_STABLECOINS_GROUP_ID = 28

export const RWA_API_MEASURE_ID_BY_CATEGORY = {
  RWAS: 71, // Bridged Token Value (Dollar)
  STABLECOINS: 70, // Bridged Token Market Cap (Dollar)
} as const satisfies Record<string, number>

export const RWA_API_MAINNET = {
  id: 1,
  name: "Ethereum",
} as const satisfies NetworkNameId

/**
 * Hard-coded list of included Ethereum L2s;
 * RWA.xyz API does not distinguish between Ethereum L2s vs L2s of other networks
 */
export const RWA_API_LAYER_2S = [
  { id: 3, name: "Polygon" },
  { id: 4, name: "Optimism" },
  { id: 7, name: "Celo" },
  { id: 10, name: "Base" },
  { id: 11, name: "Arbitrum" },
  { id: 17, name: "Polygon zkEVM" },
  { id: 31, name: "ZKsync Era" },
  { id: 33, name: "Mantle" },
  { id: 35, name: "Blast" },
  { id: 36, name: "Manta Pacific" },
  { id: 41, name: "Linea" },
] as const satisfies NetworkNameId[]

export const RWA_API_LAYER_2S_IDS = RWA_API_LAYER_2S.map(
  ({ id }) => id as number
)
