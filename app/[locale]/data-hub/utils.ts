import type { DataTimestamped, NetworkPieChartData } from "@/lib/types"

import type { AssetMarketShareData } from "@/app/_actions/fetchAssetMarketShare"

export const stablecoinMarketShareToPieChartData = (
  apiData: DataTimestamped<AssetMarketShareData>
): DataTimestamped<NetworkPieChartData> => {
  return {
    ...apiData,
    data: [
      {
        network: "ethereum",
        marketShare: apiData.data.marketShare.mainnet,
        fill: "var(--color-ethereum)",
      },
      {
        network: "ethereum-l2s",
        marketShare: apiData.data.marketShare.layer2,
        fill: "var(--color-ethereum-l2s)",
      },
      {
        network: "alt-2nd",
        marketShare: apiData.data.marketShare.altNetwork2nd,
        fill: "var(--color-alt-2nd)",
      },
      {
        network: "alt-3rd",
        marketShare: apiData.data.marketShare.altNetwork3rd,
        fill: "var(--color-alt-3rd)",
      },
      {
        network: "alt-rest",
        marketShare: apiData.data.marketShare.altNetworksRest,
        fill: "var(--color-alt-rest)",
      },
    ],
  }
}
