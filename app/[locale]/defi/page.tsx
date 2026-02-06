import Image from "next/image"
import type { Metadata } from "next/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { Metric } from "@/lib/types"

import Hero from "@/components/Hero"
import { SourceInfoTooltip } from "@/components/InfoTooltip"
import { AnimatedNumberInView } from "@/components/ui/animated-number"
import {
  Card,
  CardContent,
  CardLabel,
  CardSource,
  CardValue,
} from "@/components/ui/card"
import Link from "@/components/ui/link"

import { formatDateMonthDayYear } from "@/lib/utils/date"
import { getMetadata } from "@/lib/utils/metadata"
import {
  formatLargeCurrency,
  formatMultiplier,
  formatPercent,
} from "@/lib/utils/number"

import AppGrid from "./_components/AppGrid"

import fetchDexVolume from "@/app/_actions/fetchDexVolume"
import fetchDefiTvlAllCurrent from "@/app/_actions/fetchTvlDefiAllCurrent"
import { type Locale, routing } from "@/i18n/routing"
import buildings from "@/public/images/banners/buildings2.png"

type Props = {
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("defi")
  const tCommon = await getTranslations("common")

  const defiTvlAllCurrentData = await fetchDefiTvlAllCurrent()
  const dexVolume = await fetchDexVolume()

  const metrics: Metric[] = [
    {
      label: (
        <>
          {t("metrics.defiTvl")} <span title="Total Value Locked">TVL</span>
        </>
      ),
      value: formatLargeCurrency(locale, defiTvlAllCurrentData.data.mainnetDefiTvl),
      lastUpdated: formatDateMonthDayYear(locale, defiTvlAllCurrentData.lastUpdated),
      ...defiTvlAllCurrentData.sourceInfo,
    },
    {
      label: (
        <>
          {t("metrics.shareGlobal")} <span title="Total Value Locked">TVL</span>
        </>
      ),
      value: formatPercent(locale, defiTvlAllCurrentData.data.mainnetDefiMarketshare),
      lastUpdated: formatDateMonthDayYear(locale, defiTvlAllCurrentData.lastUpdated),
      ...defiTvlAllCurrentData.sourceInfo,
    },
    {
      value: formatLargeCurrency(locale, dexVolume.data.trailing12moAvgDexVolume),
      label: (
        <>
          {t("metrics.dexVolume")} <span title="Decentralized Exchange">DEX</span> {t("metrics.dexVolumeSuffix")}
        </>
      ),
      lastUpdated: formatDateMonthDayYear(locale, dexVolume.lastUpdated),
      ...dexVolume.sourceInfo,
    },
    {
      label: (
        <>
          <span title="Total Value Locked">TVL</span> {t("metrics.tvlVsNext")}
        </>
      ),
      value: formatMultiplier(locale, defiTvlAllCurrentData.data.runnerUpMultiplier),
      lastUpdated: formatDateMonthDayYear(locale, defiTvlAllCurrentData.lastUpdated),
      ...defiTvlAllCurrentData.sourceInfo,
    },
  ]

  const innovations: {
    heading: string
    description: string
    year: string | number
    href: string
  }[] = [
    {
      heading: t("innovations.mas.heading"),
      description: t("innovations.mas.description"),
      year: "2022",
      href: "https://www.jpmorgan.com/insights/payments/wallets/institutional-defi",
    },
    {
      heading: t("innovations.siemens.heading"),
      description: t("innovations.siemens.description"),
      year: "2023",
      href: "https://press.siemens.com/global/en/pressrelease/siemens-issues-first-digital-bond-blockchain",
    },
    {
      heading: t("innovations.visa.heading"),
      description: t("innovations.visa.description"),
      year: "2024",
      href: "https://investor.visa.com/news/news-details/2024/Visa-Introduces-the-Visa-Tokenized-Asset-Platform/default.aspx",
    },
    {
      heading: t("innovations.socgen.heading"),
      description: t("innovations.socgen.description"),
      year: "2025",
      href: "https://www.dlnews.com/articles/defi/societe-generale-taps-uniswap-and-morpho-in-defi-lending-push/",
    },
  ]

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero heading={t("hero.heading")} shape="coins">
        <p>
          {t("hero.description1")}
        </p>
        <p>
          {t("hero.description2")}
        </p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-10 px-4 py-20 sm:px-10 sm:py-20 md:space-y-40">
        <section
          id="metrics"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-12 xl:grid-cols-4"
        >
          <h2 className="sr-only">{t("metrics.srHeading")}</h2>
          {metrics.map(
            ({ label, value, source, sourceHref, lastUpdated }, idx) => (
              <Card key={idx} variant="flex-height">
                <CardContent className="space-between flex flex-1 flex-col">
                  <CardLabel className="text-base font-medium tracking-[0.02rem]">
                    {label}
                  </CardLabel>
                  <CardValue asChild>
                    <AnimatedNumberInView className="mt-auto">
                      {value}
                    </AnimatedNumberInView>
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
        </section>

        <section
          id="primitives"
          className="flex gap-x-32 gap-y-14 max-lg:flex-col"
        >
          <div className="flex-1 space-y-7">
            <h2 className="text-h3-mobile sm:text-h3 max-w-xl tracking-[0.055rem]">
              {t("primitives.heading")}
            </h2>
            <p className="text-muted-foreground max-w-xl font-medium">
              {t("primitives.description")}
            </p>
            <ul className="max-w-prose space-y-4 font-medium">
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("primitives.openStandards")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("primitives.openStandardsDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("primitives.deepLiquidity")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("primitives.deepLiquidityDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("primitives.composable")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("primitives.composableDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("primitives.permissionless")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("primitives.permissionlessDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("primitives.onchainYield")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("primitives.onchainYieldDesc")}
                </p>
              </li>
            </ul>
          </div>
          <div className="relative min-h-80 flex-1">
            <Image
              src={buildings}
              alt=""
              fill
              placeholder="blur"
              className="object-cover object-center grayscale"
              sizes="(max-width: 1024px) 100vw, 536px"
            />
          </div>
        </section>

        <section id="innovation" className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-h3-mobile sm:text-h3">
              {t("innovation.heading")}
            </h2>
            <p className="text-muted-foreground font-medium">
              {t("innovation.description")}
            </p>
          </div>

          <div className="sm:grid-col-2 grid grid-cols-1 gap-4 lg:grid-cols-4">
            {innovations
              .sort((a, b) => Number(b.year) - Number(a.year))
              .map(({ heading, description, year, href }) => (
                <div key={heading} className="bg-card space-y-2 p-6">
                  <p className="text-muted-foreground font-bold">{year}</p>
                  <Link href={href} className="css-secondary block">
                    <h3 className="text-h5">{heading}</h3>
                  </Link>
                  <p className="text-muted-foreground font-medium">
                    {description}
                  </p>
                </div>
              ))}
          </div>
        </section>

        <section id="ecosystem" className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-h3-mobile sm:text-h3">
              {t("ecosystem.heading")}
            </h2>
            <p className="text-muted-foreground font-medium">
              {t("ecosystem.description")}
            </p>
          </div>

          <hr className="border-muted" />

          <AppGrid />
        </section>
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "defi" })

  return getMetadata({
    slug: "defi",
    title: t("metadata.title"),
    description: t("metadata.description"),
    image: "/images/og/defi.png",
    locale,
  })
}
