import type { Metadata } from "next/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

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
import { formatLargeCurrency, formatMultiplier } from "@/lib/utils/number"

import RwaChartCard from "./_components/rwa-chart-card"
import StablecoinChartCard from "./_components/stablecoin-chart-card"
import { stablecoinMarketShareToPieChartData } from "./utils"

import fetchAssetMarketShare from "@/app/_actions/fetchAssetMarketShare"
import fetchBeaconChain from "@/app/_actions/fetchBeaconChain"
import fetchEtherMarketDetails from "@/app/_actions/fetchEtherMarketDetails"
import fetchEtherPrice from "@/app/_actions/fetchEtherPrice"
import fetchL2ScalingSummary from "@/app/_actions/fetchL2ScalingSummary"
import fetchTimeseriesAssetsValue from "@/app/_actions/fetchTimeseriesAssetsValue"
import fetchTimeseriesDefiTvlEthereum from "@/app/_actions/fetchTimeseriesDefiTvlEthereum"
import fetchTimeseriesL2Tvl from "@/app/_actions/fetchTimeseriesL2Tvl"
import fetchTotalValueSecured from "@/app/_actions/fetchTotalValueSecured"
import fetchDefiTvlAllCurrent from "@/app/_actions/fetchTvlDefiAllCurrent"
import { type Locale, routing } from "@/i18n/routing"

type Props = {
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("dataHub")
  const tCommon = await getTranslations("common")

  const [
    ethPrice,
    timeseriesDefiTvlEthereumData,
    timeseriesStablecoinsValueData,
    timeseriesRwaValueData,
    timeseriesL2TvlData,
    beaconChainData,
    defiTvlAllCurrentData,
    totalValueSecuredData,
    stablecoinAssetMarketShareData,
    l2ScalingSummaryData,
    etherMarketDetailsData,
  ] = await Promise.all([
    fetchEtherPrice(),
    fetchTimeseriesDefiTvlEthereum(),
    fetchTimeseriesAssetsValue("STABLECOINS"),
    fetchTimeseriesAssetsValue("RWAS"),
    fetchTimeseriesL2Tvl(),
    fetchBeaconChain(),
    fetchDefiTvlAllCurrent(),
    fetchTotalValueSecured(),
    fetchAssetMarketShare("STABLECOINS"),
    fetchL2ScalingSummary(),
    fetchEtherMarketDetails(),
  ])

  const stablecoinMarketShareData = stablecoinMarketShareToPieChartData(
    stablecoinAssetMarketShareData
  )

  const metrics: Metric[] = [
    {
      label: t("metrics.marketCap"),
      value: formatLargeCurrency(locale,etherMarketDetailsData.data.etherMarketCap),
      lastUpdated: formatDateMonthDayYear(locale,etherMarketDetailsData.lastUpdated),
      ...etherMarketDetailsData.sourceInfo,
    },
    {
      label: t("metrics.tvs"),
      value: formatLargeCurrency(locale,totalValueSecuredData.data.sum),
      lastUpdated: formatDateMonthDayYear(locale,totalValueSecuredData.lastUpdated),
      ...totalValueSecuredData.sourceInfo,
    },
    {
      label: t("metrics.ethStaked"),
      value: formatLargeCurrency(locale,
        beaconChainData.data.totalStakedEther * ethPrice.data.usd
      ),
      lastUpdated: formatDateMonthDayYear(locale,beaconChainData.lastUpdated),
      ...beaconChainData.sourceInfo,
    },
    {
      label: t("metrics.securityRatio"),
      value: formatMultiplier(locale,totalValueSecuredData.data.securityRatio),
      lastUpdated: formatDateMonthDayYear(locale,totalValueSecuredData.lastUpdated),
      ...totalValueSecuredData.sourceInfo,
    },
  ]

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero
        heading={t("hero.heading")}
        shape="chart-no-axes-combined"
      >
        <p>
          {t("hero.description1")}
        </p>
        <p>
          {t("hero.description2")}
        </p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-10 px-4 py-10 sm:px-10 sm:py-20 md:space-y-20">
        <section id="overview" className="space-y-4">
          <h2 className="text-h3-mobile sm:text-h3 lg:w-lg lg:max-w-lg lg:shrink-0">
            {t("sections.overview")}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-12 xl:grid-cols-4">
            {metrics.map(
              ({ label, value, source, sourceHref, lastUpdated }, idx) => (
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
                      {tCommon("source")}:{" "}
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
                          lastUpdated={lastUpdated}
                        />
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
            {t("sections.defi")}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1fr_23rem]">
            <Card variant="flex-column">
              <CardHeader className="flex gap-2 !px-0 max-sm:flex-col sm:items-center">
                <CardContent className="flex-1 gap-4">
                  <CardTitle className="text-xl">{t("defi.tvl.title")}</CardTitle>
                  <CardDescription className="font-medium">
                    {t("defi.tvl.description")}
                  </CardDescription>
                </CardContent>
                <div className="text-h4 font-bold tracking-[0.04rem]">
                  <AnimatedNumberInView>
                    {formatLargeCurrency(locale,
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
                    {tCommon("source")}:{" "}
                    <Link
                      inline
                      href={timeseriesDefiTvlEthereumData.sourceInfo.sourceHref}
                    >
                      {timeseriesDefiTvlEthereumData.sourceInfo.source}
                    </Link>
                    <SourceInfoTooltip
                      lastUpdated={formatDateMonthDayYear(locale,
                        timeseriesDefiTvlEthereumData.lastUpdated
                      )}
                    />
                  </CardSource>
                </div>
              </CardContent>
            </Card>

            <Card variant="flex-column">
              <CardTitle className="text-h5">
                {t("defi.vsNext.title")}
              </CardTitle>

              <CardContent variant="flex-1-height-between">
                <div className="my-10 flex flex-col items-center gap-y-6 sm:my-14">
                  <AnimatedNumberInView className="text-6xl font-bold tracking-[0.08rem] sm:text-7xl">
                    {formatMultiplier(locale,
                      defiTvlAllCurrentData.data.runnerUpMultiplier
                    )}
                  </AnimatedNumberInView>
                  <CardSmallText className="text-center text-sm">
                    {t("defi.vsNext.larger")}
                  </CardSmallText>
                </div>
                <div className="flex justify-between">
                  <CardSource>
                    {tCommon("source")}:{" "}
                    <Link
                      inline
                      href={defiTvlAllCurrentData.sourceInfo.sourceHref}
                    >
                      {defiTvlAllCurrentData.sourceInfo.source}
                    </Link>
                    <SourceInfoTooltip
                      lastUpdated={formatDateMonthDayYear(locale,
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
            {t("sections.stablecoins")}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <StablecoinChartCard data={timeseriesStablecoinsValueData} />

            <Card variant="flex-column">
              <CardContent>
                <CardTitle className="text-xl">
                  {t("stablecoins.marketShare.title")}
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  {t("stablecoins.marketShare.description")}
                </CardDescription>
              </CardContent>

              <CardContent variant="flex-1-height-between">
                <StablecoinMarketSharePieChart
                  chartData={stablecoinMarketShareData}
                />

                <CardSource>
                  {tCommon("source")}:{" "}
                  <Link
                    inline
                    href={stablecoinMarketShareData.sourceInfo.sourceHref}
                  >
                    {stablecoinMarketShareData.sourceInfo.source}
                  </Link>
                  <SourceInfoTooltip
                    lastUpdated={formatDateMonthDayYear(locale,
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
            {t("sections.rwa")}
          </h2>
          <RwaChartCard data={timeseriesRwaValueData} />
          {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_16rem]">
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
                    {tCommon("source")}:{" "}
                    <Link
                      inline
                      href={rwaAssetMarketShareData.sourceInfo.sourceHref}
                    >
                      {rwaAssetMarketShareData.sourceInfo.source}
                    </Link>
                    <SourceInfoTooltip
                      lastUpdated={formatDateMonthDayYear(locale,
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
                    {tCommon("source")}:{" "}
                    <Link
                      inline
                      href={rwaAssetMarketShareData.sourceInfo.sourceHref}
                    >
                      {rwaAssetMarketShareData.sourceInfo.source}
                    </Link>
                    <SourceInfoTooltip
                      lastUpdated={formatDateMonthDayYear(locale,
                        rwaAssetMarketShareData.lastUpdated
                      )}
                    />
                  </CardSource>
                </CardContent>
              </Card>
            </div>
          </div> */}
        </section>

        <section id="layer-2" className="space-y-4">
          <h2 className="text-h3-mobile sm:text-h3 lg:w-lg lg:max-w-lg lg:shrink-0">
            {t("sections.layer2")}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[16rem_1fr]">
            <Card variant="flex-column">
              <CardContent variant="flex-1-height-between">
                <CardContent>
                  <h3 className="text-base font-medium tracking-[0.02rem]">
                    {t("layer2.networks.title")}
                  </h3>
                  <AnimatedNumberInView className="text-big font-bold tracking-[0.055rem]">
                    {l2ScalingSummaryData.data.allProjectsCount}
                  </AnimatedNumberInView>
                </CardContent>

                <CardSource>
                  {tCommon("source")}:{" "}
                  <Link
                    inline
                    href={l2ScalingSummaryData.sourceInfo.sourceHref}
                  >
                    {l2ScalingSummaryData.sourceInfo.source}
                  </Link>
                  <SourceInfoTooltip
                    lastUpdated={formatDateMonthDayYear(locale,
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
                    {t("layer2.tvl.title")}
                  </CardTitle>
                  <CardDescription className="font-medium">
                    {t("layer2.tvl.description")}
                  </CardDescription>
                </CardContent>
                <div className="text-h4 font-bold tracking-[0.04rem]">
                  <AnimatedNumberInView>
                    {formatLargeCurrency(locale,timeseriesL2TvlData.data.currentValue)}
                  </AnimatedNumberInView>
                </div>
              </CardHeader>

              <CardContent variant="flex-1-height-between" className="gap-y-4">
                <L2TimeseriesTvlLineChart chartData={timeseriesL2TvlData} />

                <CardSource>
                  {tCommon("source")}:{" "}
                  <Link inline href={timeseriesL2TvlData.sourceInfo.sourceHref}>
                    {timeseriesL2TvlData.sourceInfo.source}
                  </Link>
                  <SourceInfoTooltip
                    lastUpdated={formatDateMonthDayYear(locale,
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "dataHub" })
  return getMetadata({
    slug: "data-hub",
    title: t("metadata.title"),
    description: t("metadata.description"),
    image: "/images/og/data-hub.png",
    locale,
  })
}
