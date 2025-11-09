import type { Metadata } from "next/types"

import { Metric } from "@/lib/types"

import DefiTimeseriesTvlEthereumLineChart from "@/components/data/defi-timeseries-tvl-ethereum-line-chart"
import L2TimeseriesTvlLineChart from "@/components/data/l2-timeseries-tvl-line-chart"
import StablecoinMarketSharePieChart from "@/components/data/stablecoin-marketshare-pie-chart"
import Hero from "@/components/Hero"
import { SourceInfoTooltip } from "@/components/InfoTooltip"
import { AnimatedNumberInView } from "@/components/ui/animated-number"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardLabel,
  CardSmallText,
  CardSource,
  CardTitle,
  CardValue,
} from "@/components/ui/card"
import Link from "@/components/ui/link"

import { formatDateMonthDayYear } from "@/lib/utils/date"
import { getMetadata } from "@/lib/utils/metadata"
import {
  formatLargeCurrency,
  formatLargeNumber,
  formatMultiplier,
  formatPercent,
} from "@/lib/utils/number"

import fetchAssetMarketShare from "../_actions/fetchAssetMarketShare"
import fetchBeaconChain from "../_actions/fetchBeaconChain"
import fetchEtherMarketDetails from "../_actions/fetchEtherMarketDetails"
import fetchL2ScalingSummary from "../_actions/fetchL2ScalingSummary"
import fetchTimeseriesAssetsValue from "../_actions/fetchTimeseriesAssetsValue"
import fetchTimeseriesDefiTvlEthereum from "../_actions/fetchTimeseriesDefiTvlEthereum"
import fetchTimeseriesL2Tvl from "../_actions/fetchTimeseriesL2Tvl"
import fetchTotalValueSecured from "../_actions/fetchTotalValueSecured"
import fetchDefiTvlAllCurrent from "../_actions/fetchTvlDefiAllCurrent"

import RwaChartCard from "./_components/rwa-chart-card"
import StablecoinChartCard from "./_components/stablecoin-chart-card"
import { stablecoinMarketShareToPieChartData } from "./utils"

export default async function Page() {
  const timeseriesDefiTvlEthereumData = await fetchTimeseriesDefiTvlEthereum()
  const timeseriesStablecoinsValueData =
    await fetchTimeseriesAssetsValue("STABLECOINS")
  const timeseriesRwaValueData = await fetchTimeseriesAssetsValue("RWAS")
  const timeseriesL2TvlData = await fetchTimeseriesL2Tvl()

  const beaconChainData = await fetchBeaconChain()
  const defiTvlAllCurrentData = await fetchDefiTvlAllCurrent()
  const totalValueSecuredData = await fetchTotalValueSecured()
  const stablecoinAssetMarketShareData =
    await fetchAssetMarketShare("STABLECOINS")
  const stablecoinMarketShareData = stablecoinMarketShareToPieChartData(
    stablecoinAssetMarketShareData
  )
  const l2ScalingSummaryData = await fetchL2ScalingSummary()
  const rwaAssetMarketShareData = await fetchAssetMarketShare("RWAS")
  const etherMarketDetailsData = await fetchEtherMarketDetails()

  const metrics: Metric[] = [
    {
      label: "Market Cap",
      value: formatLargeCurrency(etherMarketDetailsData.data.etherMarketCap),
      lastUpdated: formatDateMonthDayYear(etherMarketDetailsData.lastUpdated),
      ...etherMarketDetailsData.sourceInfo,
    },
    {
      label: "Total Value Secured (TVS)",
      value: formatLargeCurrency(totalValueSecuredData.data.sum),
      lastUpdated: formatDateMonthDayYear(totalValueSecuredData.lastUpdated),
      ...totalValueSecuredData.sourceInfo,
    },
    {
      label: "Validator Count",
      value: formatLargeNumber(beaconChainData.data.validatorsCount),
      lastUpdated: formatDateMonthDayYear(beaconChainData.lastUpdated),
      ...beaconChainData.sourceInfo,
    },
    {
      label: "Security Ratio",
      value: formatMultiplier(totalValueSecuredData.data.securityRatio),
      lastUpdated: formatDateMonthDayYear(totalValueSecuredData.lastUpdated),
      ...totalValueSecuredData.sourceInfo,
    },
  ]

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero
        heading="Data Hub: Real-Time Intelligence"
        shape="chart-no-axes-combined"
      >
        <p>
          Ethereum&apos;s onchain data provides an immutable and transparent
          foundation for institutional analysis and reporting.
        </p>
        <p>
          Track live, real-time data for mainnet activity, Layer 2 scaling,
          tokenized assets, and DeFi markets.
        </p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-10 px-4 py-10 sm:px-10 sm:py-20 md:space-y-20">
        <section id="overview" className="space-y-4">
          <h2 className="text-h3-mobile sm:text-h3 lg:w-lg lg:max-w-lg lg:shrink-0">
            Overview
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-12 xl:grid-cols-4">
            {metrics.map(
              (
                { label, value, source, sourceHref, lastUpdated, tooltip },
                idx
              ) => (
                <Card key={idx} variant="flex-height">
                  <CardContent>
                    <CardLabel className="text-base font-medium tracking-[0.02rem]">
                      {label}
                    </CardLabel>
                    <CardValue asChild>
                      <AnimatedNumberInView>{value}</AnimatedNumberInView>
                    </CardValue>
                  </CardContent>
                  {source && (
                    <CardSource>
                      Source:{" "}
                      {sourceHref ? (
                        <Link
                          href={sourceHref}
                          className="text-muted-foreground hover:text-foreground"
                          inline
                        >
                          {source}
                        </Link>
                      ) : (
                        source
                      )}
                      {lastUpdated && (
                        <SourceInfoTooltip
                          lastUpdated={formatDateMonthDayYear(lastUpdated)}
                        >
                          {tooltip}
                        </SourceInfoTooltip>
                      )}
                    </CardSource>
                  )}
                </Card>
              )
            )}
          </div>
        </section>

        <section id="defi" className="space-y-4">
          <h2 className="text-h3-mobile sm:text-h3 lg:w-lg lg:max-w-lg lg:shrink-0">
            Decentralized Finance
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1fr_23rem]">
            <Card variant="flex-column">
              <CardHeader className="flex gap-2 !px-0 max-sm:flex-col sm:items-center">
                <CardContent className="flex-1 gap-4">
                  <CardTitle className="text-xl">TVL in DeFi</CardTitle>
                  <CardDescription className="font-medium">
                    Sum of funds deposited into DeFi applications on Ethereum
                  </CardDescription>
                </CardContent>
                <div className="text-h4 font-bold tracking-[0.04rem]">
                  <AnimatedNumberInView>
                    {formatLargeCurrency(
                      timeseriesDefiTvlEthereumData.data.currentValue
                    )}
                  </AnimatedNumberInView>
                </div>
              </CardHeader>

              <CardContent variant="flex-1-height-between">
                <DefiTimeseriesTvlEthereumLineChart
                  chartData={timeseriesDefiTvlEthereumData}
                />
                <div className="flex justify-between">
                  <CardSource>
                    Source:{" "}
                    <Link
                      inline
                      href={timeseriesDefiTvlEthereumData.sourceInfo.sourceHref}
                    >
                      {timeseriesDefiTvlEthereumData.sourceInfo.source}
                    </Link>
                    <SourceInfoTooltip
                      lastUpdated={formatDateMonthDayYear(
                        timeseriesDefiTvlEthereumData.lastUpdated
                      )}
                    />
                  </CardSource>
                </div>
              </CardContent>
            </Card>

            <Card variant="flex-column">
              <CardTitle className="text-h5">
                DeFi TVL vs. Next-Largest Blockchain Ecosystem
              </CardTitle>

              <CardContent variant="flex-1-height-between">
                <div className="my-10 flex flex-col items-center gap-y-6 sm:my-14">
                  <AnimatedNumberInView className="text-6xl font-bold tracking-[0.08rem] sm:text-7xl">
                    {formatMultiplier(
                      defiTvlAllCurrentData.data.runnerUpMultiplier
                    )}
                  </AnimatedNumberInView>
                  <CardSmallText className="text-center text-sm">
                    Larger
                  </CardSmallText>
                </div>
                <div className="flex justify-between">
                  <CardSource>
                    Source:{" "}
                    <Link
                      inline
                      href={defiTvlAllCurrentData.sourceInfo.sourceHref}
                    >
                      {defiTvlAllCurrentData.sourceInfo.source}
                    </Link>
                    <SourceInfoTooltip
                      lastUpdated={formatDateMonthDayYear(
                        defiTvlAllCurrentData.lastUpdated
                      )}
                    />
                  </CardSource>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="stablecoins" className="space-y-4">
          <h2 className="text-h3-mobile sm:text-h3 lg:w-lg lg:max-w-lg lg:shrink-0">
            Stablecoins
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <StablecoinChartCard data={timeseriesStablecoinsValueData} />

            <Card variant="flex-column">
              <CardContent>
                <CardTitle className="text-xl">
                  Stablecoin Market Share
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  Stablecoin TVL distribution by blockchain
                </CardDescription>
              </CardContent>

              <CardContent variant="flex-1-height-between">
                <StablecoinMarketSharePieChart
                  chartData={stablecoinMarketShareData}
                />

                <CardSource>
                  Source:{" "}
                  <Link
                    inline
                    href={stablecoinMarketShareData.sourceInfo.sourceHref}
                  >
                    {stablecoinMarketShareData.sourceInfo.source}
                  </Link>
                  <SourceInfoTooltip
                    lastUpdated={formatDateMonthDayYear(
                      stablecoinMarketShareData.lastUpdated
                    )}
                  />
                </CardSource>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="rwa" className="space-y-4">
          <h2 className="text-h3-mobile sm:text-h3 lg:w-lg lg:max-w-lg lg:shrink-0">
            Real-World Assets
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_16rem]">
            <RwaChartCard data={timeseriesRwaValueData} />

            <div className="flex flex-col gap-y-4">
              <Card variant="flex-column" className="flex-1">
                <CardContent variant="flex-1-height-between">
                  <CardContent>
                    <h3 className="text-base font-medium tracking-[0.02rem]">
                      Ethereum L1 Market Share
                    </h3>
                    <AnimatedNumberInView className="text-big font-bold tracking-[0.055rem]">
                      {formatPercent(
                        rwaAssetMarketShareData.data.marketShare.mainnet
                      )}
                    </AnimatedNumberInView>
                  </CardContent>
                  <CardSource>
                    Source:{" "}
                    <Link
                      inline
                      href={rwaAssetMarketShareData.sourceInfo.sourceHref}
                    >
                      {rwaAssetMarketShareData.sourceInfo.source}
                    </Link>
                    <SourceInfoTooltip
                      lastUpdated={formatDateMonthDayYear(
                        rwaAssetMarketShareData.lastUpdated
                      )}
                    />
                  </CardSource>
                </CardContent>
              </Card>

              <Card variant="flex-column" className="flex-1">
                <CardContent variant="flex-1-height-between">
                  <CardContent>
                    <h3 className="text-base font-medium tracking-[0.02rem]">
                      Ethereum L1 + L2 Market Share
                    </h3>
                    <AnimatedNumberInView className="text-big font-bold tracking-[0.055rem]">
                      {formatPercent(
                        rwaAssetMarketShareData.data.marketShare.mainnet +
                          rwaAssetMarketShareData.data.marketShare.layer2
                      )}
                    </AnimatedNumberInView>
                  </CardContent>
                  <CardSource>
                    Source:{" "}
                    <Link
                      inline
                      href={rwaAssetMarketShareData.sourceInfo.sourceHref}
                    >
                      {rwaAssetMarketShareData.sourceInfo.source}
                    </Link>
                    <SourceInfoTooltip
                      lastUpdated={formatDateMonthDayYear(
                        rwaAssetMarketShareData.lastUpdated
                      )}
                    />
                  </CardSource>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="layer-2" className="space-y-4">
          <h2 className="text-h3-mobile sm:text-h3 lg:w-lg lg:max-w-lg lg:shrink-0">
            Layer 2 Ecosystem
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[16rem_1fr]">
            <Card variant="flex-column">
              <CardContent variant="flex-1-height-between">
                <CardContent>
                  <h3 className="text-base font-medium tracking-[0.02rem]">
                    Number of Live Ethereum L2 Networks
                  </h3>
                  <AnimatedNumberInView className="text-big font-bold tracking-[0.055rem]">
                    {l2ScalingSummaryData.data.allProjectsCount}
                  </AnimatedNumberInView>
                </CardContent>

                <CardSource>
                  Source:{" "}
                  <Link
                    inline
                    href={l2ScalingSummaryData.sourceInfo.sourceHref}
                  >
                    {l2ScalingSummaryData.sourceInfo.source}
                  </Link>
                  <SourceInfoTooltip
                    lastUpdated={formatDateMonthDayYear(
                      l2ScalingSummaryData.lastUpdated
                    )}
                  />
                </CardSource>
              </CardContent>
            </Card>

            <Card variant="flex-column">
              <CardHeader className="flex gap-2 !px-0 max-sm:flex-col sm:items-center">
                <CardContent className="flex-1 gap-4">
                  <CardTitle className="text-xl">
                    Daily Average L2 TVL
                  </CardTitle>
                  <CardDescription className="font-medium">
                    Total value locked on Ethereum&apos;s L2 networks
                  </CardDescription>
                </CardContent>
                <div className="text-h4 font-bold tracking-[0.04rem]">
                  <AnimatedNumberInView>
                    {formatLargeCurrency(timeseriesL2TvlData.data.currentValue)}
                  </AnimatedNumberInView>
                </div>
              </CardHeader>

              <CardContent variant="flex-1-height-between" className="gap-y-4">
                <L2TimeseriesTvlLineChart chartData={timeseriesL2TvlData} />

                <CardSource>
                  Source:{" "}
                  <Link inline href={timeseriesL2TvlData.sourceInfo.sourceHref}>
                    {timeseriesL2TvlData.sourceInfo.source}
                  </Link>
                  <SourceInfoTooltip
                    lastUpdated={formatDateMonthDayYear(
                      timeseriesL2TvlData.lastUpdated
                    )}
                  />
                </CardSource>
              </CardContent>
            </Card>
          </div>
        </section>
      </article>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({
    slug: "data-hub",
    title: "Live Ethereum Network Data | Institutional Onchain Data Hub",
    description:
      "Get live intelligence for the onchain economy. Explore curated metrics for mainnet activity, L2 scaling, DeFi markets, tokenized assets, and more.",
    image: "/images/og/data-hub.png",
  })
}
