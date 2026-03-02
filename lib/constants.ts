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
    sourceHref: "https://www.rwa.xyz",
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
    sourceHref: "https://www.growthepie.com/",
  },
  COINGECKO: {
    source: "coingecko.com",
    sourceHref: "https://coingecko.com",
  },
} as const satisfies Record<string, SourceInfo>

/**
 * Site navigation
 */

// Navigation structure using translation keys for i18n support
export const DA_NAV_ITEMS = [
  { href: "/rwa", translationKey: "rwa" },
  { href: "/defi", translationKey: "defi" },
  { href: "/privacy", translationKey: "privacy" },
  { href: "/layer-2", translationKey: "layer2" },
] as const

export const NAV_ITEMS = [
  { href: "/data-hub", translationKey: "dataHub" },
  { href: "/library", translationKey: "library" },
] as const

/**
 * RWA.xyz API usage
 */

export const RWA_API_STABLECOINS_GROUP_ID = 28

/**
 * Enterprise/permissioned chains to exclude from public RWA market share calculations.
 * These chains are excluded in rwa.xyz "Distributed" view.
 */
export const RWA_API_EXCLUDED_NETWORK_IDS = [
  68, // Canton - enterprise blockchain
  13, // Provenance - enterprise blockchain
  74, // Intain - enterprise blockchain
]

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
