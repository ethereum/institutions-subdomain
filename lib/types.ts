import { ReactNode } from "react"

import { RWA_API_MEASURE_ID_BY_CATEGORY } from "./constants"

/**
 * General
 */

export type DateArg = ConstructorParameters<typeof Date>[0]

export type SourceInfo = {
  source?: string
  sourceHref?: string
}

export type LastUpdated<T extends string | number = string> = {
  lastUpdated?: T
}

export type Metric = SourceInfo &
  LastUpdated & {
    label: ReactNode
    value: string | number
  }

export type DataTimestamped<T> = {
  data: T
  sourceInfo: Required<SourceInfo>
} & Required<LastUpdated<number>>

export type DataSeries = {
  date: string
  value: number
}[]

export type DataSeriesWithCurrent = {
  series: DataSeries
  currentValue: number
}

export type NumberParts = {
  prefix: string
  value: number
  suffix: string
  fractionDigits: number
}

export type NetworkPieChartData = {
  network: string
  marketShare: number
  fill: string
}[]

/**
 * RWA.xyz API usage
 */

export type AssetCategory = keyof typeof RWA_API_MEASURE_ID_BY_CATEGORY

export type NetworkNameId = { id: number; name: string }

export type RwaApiAssetValueMetrics = {
  val: number
  val_7d: number
  val_30d: number
  val_90d: number
  chg_7d_amt: number
  chg_7d_pct: number
  chg_30d_amt: number
  chg_30d_pct: number
  chg_90d_amt: number
  chg_90d_pct: number
}

export type RwaApiNetworkResult = {
  id: number
  name: string
  description: string
  icon_url: string
  color_hex: string
  website: string
  founded_date: unknown | null
  architecture_type_description: unknown | null
  layer_description: "L1" | "L2"
  parent_network_id: number | null
  virtual_machine_type: string
  token_id: number
  _updated_at: string
  slug: string
  token: Record<string, unknown>
  asset_count: number
  token_count: number
  asset_class_ids: number[]
  issuer_ids: number[]
  protocol_ids: number[]
  jurisdiction_country_ids: number[]
  asset_class_stats: ({
    id: number
    name: string
    slug:
      | "corporate-bonds"
      | "cryptocurrencies"
      | "public-equity"
      | "us-treasury-debt"
      | "non-us-government-debt"
      | "stablecoins"
      | "actively-managed-strategies"
      | "commodities"
      | "private-credit"
      | "institutional-alternative-funds"
    icon_url?: string | null
    color_hex?: string
    asset_count: number
    description?: string | null
  } & Record<
    | "daily_mints_token"
    | "daily_mints_dollar"
    | "holding_addresses_count"
    | "bridged_token_value_dollar"
    | "circulating_asset_value_dollar"
    | "bridged_token_market_cap_dollar"
    | "trailing_30_day_transfer_volume"
    | "trailing_30_day_active_addresses_count",
    RwaApiAssetValueMetrics
  >)[]
  issuer_stats: unknown[]
  protocol_stats: unknown[]
  jurisdiction_country_stats: unknown[]
  network_id: number
  daily_mints_token: Record<string, unknown>
  bridged_token_value_dollar: Record<string, unknown>
  daily_mints_dollar: Record<string, unknown>
  trailing_30_day_active_addresses_count: Record<string, unknown>
  bridged_token_market_cap_dollar: Record<string, unknown>
  holding_addresses_count: Record<string, unknown>
  trailing_30_day_transfer_volume: Record<string, unknown>
}

export type RwaApiTimeseriesResponse = {
  results: {
    measure: {
      id: number
      slug: string
      name: string
      unit: string
    }
    group: {
      id: number
      type: string
      name: string
      color: string
    }
    points: [string, number][]
  }[]
}

/**
 * growthepie.com API usage
 */

export type GrowthepieApiResult = {
  metric_key: "tvl" | "txcosts_median_usd" | "txcount"
  origin_key: string // Network, e.g., "ethereum" | "base" etc.
  date: string // '2025-07-30'
  value: number // USD (metric_key: "tvl" | "txcosts_median_usd")
}

export type InternalGrowthepieApiTimeseriesData = {
  date: number
  value: number
}[]
