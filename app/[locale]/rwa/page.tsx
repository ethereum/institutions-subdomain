import Image, { StaticImageData } from "next/image"
import type { Metadata } from "next/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { LastUpdated, Metric, SourceInfo } from "@/lib/types"

import Hero from "@/components/Hero"
import { SourceInfoTooltip } from "@/components/InfoTooltip"
import { AnimatedNumberInView } from "@/components/ui/animated-number"
import { Card, CardLabel, CardSource } from "@/components/ui/card"
import { InlineText } from "@/components/ui/inline-text"
import Link, { LinkWithArrow } from "@/components/ui/link"

import { formatDateMonthDayYear } from "@/lib/utils/date"
import { getMetadata } from "@/lib/utils/metadata"
import { formatLargeCurrency } from "@/lib/utils/number"

import fetchAssetMarketShare from "@/app/_actions/fetchAssetMarketShare"
import fetchAssetValueByAssetIds from "@/app/_actions/fetchAssetValueByAssetIds"
import fetchProtocolsValueBySlug from "@/app/_actions/fetchProtocolsValueBySlug"
import fetchProtocolsValueTotal from "@/app/_actions/fetchProtocolsValueTotal"
import fetchTokenizedTreasuries from "@/app/_actions/fetchTokenizedTreasuries"
import fetchTotalValueSecured from "@/app/_actions/fetchTotalValueSecured"
import { type Locale, routing } from "@/i18n/routing"
import buildings from "@/public/images/banners/buildings.png"
import buidlUsd from "@/public/images/logos/tokens/buidl-usd.svg"
import eurc from "@/public/images/logos/tokens/eurc.svg"
import fidd from "@/public/images/logos/tokens/fidd.svg"
import pyusd from "@/public/images/logos/tokens/pyusd.svg"
import usdc from "@/public/images/logos/tokens/usdc.svg"
import usde from "@/public/images/logos/tokens/usde.svg"
import usds from "@/public/images/logos/tokens/usds.svg"
import usdt from "@/public/images/logos/tokens/usdt.svg"
import usdtb from "@/public/images/logos/tokens/usdtb.svg"

type Props = {
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("rwa")
  const tCommon = await getTranslations("common")

  const [
    stablecoinAssetMarketShareData,
    rwaAssetMarketShareData,
    protocolsValueTotal,
    tokenizedTreasuriesData,
    assetValueByAssetIdsData,
    protocolsValueBySlugData,
    totalValueSecuredData,
  ] = await Promise.all([
    fetchAssetMarketShare("STABLECOINS"),
    fetchAssetMarketShare("RWAS"),
    fetchProtocolsValueTotal(),
    fetchTokenizedTreasuries(),
    fetchAssetValueByAssetIds(),
    fetchProtocolsValueBySlug(),
    fetchTotalValueSecured(),
  ])

  const metrics: Metric[] = [
    {
      label: t("overview.stablecoinsL1"),
      value: formatLargeCurrency(
        locale,
        stablecoinAssetMarketShareData.data.assetValue.mainnet
      ),
      lastUpdated: formatDateMonthDayYear(
        locale,
        stablecoinAssetMarketShareData.lastUpdated
      ),
      ...stablecoinAssetMarketShareData.sourceInfo,
    },
    {
      label: t("overview.stablecoinsL2"),
      value: formatLargeCurrency(
        locale,
        stablecoinAssetMarketShareData.data.assetValue.layer2
      ),
      lastUpdated: formatDateMonthDayYear(
        locale,
        stablecoinAssetMarketShareData.lastUpdated
      ),
      ...stablecoinAssetMarketShareData.sourceInfo,
    },
    {
      label: t("overview.commoditiesShare"),
      value: "70%",
      lastUpdated: "",
      source: "",
      sourceHref: "",
    },
    {
      label: t("overview.valueSecured"),
      value: formatLargeCurrency(
        locale,
        totalValueSecuredData.data.sum
      ),
      lastUpdated: formatDateMonthDayYear(
        locale,
        totalValueSecuredData.lastUpdated
      ),
      ...totalValueSecuredData.sourceInfo,
    },
  ]

  const stablecoins: {
    ticker: string
    issuer: string
    imgSrc: StaticImageData
    href: string
  }[] = [
    {
      ticker: "FIDD",
      issuer: "Fidelity",
      imgSrc: fidd,
      href: "https://www.fidelitydigitalassets.com/stablecoin",
    },
    {
      ticker: "USDT",
      issuer: "Tether",
      imgSrc: usdt,
      href: "https://tether.to/",
    },
    {
      ticker: "USDC",
      issuer: "Circle",
      imgSrc: usdc,
      href: "https://www.usdc.com/",
    },
    {
      ticker: "USDE",
      issuer: "Ethena",
      imgSrc: usde,
      href: "https://ethena.fi/",
    },
    {
      ticker: "USDS",
      issuer: "Sky",
      imgSrc: usds,
      href: "https://sky.money/",
    },
    {
      ticker: "PYUSD",
      issuer: "PayPal",
      imgSrc: pyusd,
      href: "https://www.paypal.com/us/digital-wallet/manage-money/crypto/pyusd",
    },
    {
      ticker: "EURC",
      issuer: "Circle",
      imgSrc: eurc,
      href: "https://www.circle.com/eurc",
    },
    {
      ticker: "USDtb",
      issuer: "Ethena",
      imgSrc: usdtb,
      href: "https://usdtb.money/",
    },
    {
      ticker: "BUIDL USD",
      issuer: "BlackRock & Securitize",
      imgSrc: buidlUsd,
      href: "https://securitize.io/blackrock/buidl",
    },
  ]

  type AssetDetails = {
    header: string
    valuation: string
    description: string
    issuer?: string
    metricHref: string
    visitHref: string
  } & Partial<LastUpdated & SourceInfo>

  const cashEquivalents: AssetDetails[] = [
    {
      header: "BUIDL",
      valuation: formatLargeCurrency(
        locale,
        assetValueByAssetIdsData.data.BUIDL
      ),
      description: t("cards.buidlDesc", { brand: "BlackRock" }),
      issuer: "BlackRock & Securitize",
      metricHref: "https://app.rwa.xyz/assets/BUIDL",
      visitHref: "https://securitize.io/blackrock/buidl",
      ...assetValueByAssetIdsData.sourceInfo,
      lastUpdated: formatDateMonthDayYear(
        locale,
        assetValueByAssetIdsData.lastUpdated
      ),
    },
    {
      header: "USTB",
      valuation: formatLargeCurrency(
        locale,
        assetValueByAssetIdsData.data.USTB
      ),
      description: t("cards.ustbDesc", { brand: "Superstate" }),
      issuer: "Superstate",
      metricHref: "https://app.rwa.xyz/assets/USTB",
      visitHref: "https://superstate.com/assets/ustb",
      ...assetValueByAssetIdsData.sourceInfo,
      lastUpdated: formatDateMonthDayYear(
        locale,
        assetValueByAssetIdsData.lastUpdated
      ),
    },
    {
      header: "MONY",
      valuation: formatLargeCurrency(
        locale,
        assetValueByAssetIdsData.data.MONY
      ),
      description: t("cards.monyDesc", { brand: "JPMorgan" }),
      issuer: "JPMorgan",
      metricHref: "https://app.rwa.xyz/assets/MONY",
      visitHref: "https://www.jpmorgan.com/kinexys/digital-assets",
      ...assetValueByAssetIdsData.sourceInfo,
      lastUpdated: formatDateMonthDayYear(
        locale,
        assetValueByAssetIdsData.lastUpdated
      ),
    },
    {
      header: "FDIT",
      valuation: formatLargeCurrency(
        locale,
        assetValueByAssetIdsData.data.FDIT
      ),
      description: t("cards.fditDesc", { brand: "Fidelity" }),
      issuer: "Fidelity",
      metricHref: "https://app.rwa.xyz/assets/FDIT",
      visitHref: "https://institutional.fidelity.com/app/funds-and-products/9053/fidelity-treasury-digital-fund-onchain-class-fyoxx.html",
      ...assetValueByAssetIdsData.sourceInfo,
      lastUpdated: formatDateMonthDayYear(
        locale,
        assetValueByAssetIdsData.lastUpdated
      ),
    },
  ]

  const categoryExamples: Record<string, { name: string; href: string }[]> = {
    treasuries: [
      { name: "BlackRock BUIDL", href: "https://securitize.io/blackrock/buidl" },
      { name: "Ondo", href: "https://ondo.finance/" },
      { name: "Franklin Templeton", href: "https://digitalassets.franklintempleton.com/benji/" },
    ],
    credit: [
      { name: "Centrifuge", href: "https://centrifuge.io/" },
      { name: "Maple", href: "https://maple.finance/" },
      { name: "Securitize", href: "https://securitize.io/" },
    ],
    commodities: [
      { name: "Tether Gold", href: "https://gold.tether.to/" },
      { name: "Paxos Gold", href: "https://paxos.com/paxgold/" },
    ],
    equities: [
      { name: "Ondo", href: "https://ondo.finance/" },
      { name: "Backed", href: "https://backed.fi/" },
    ],
    realEstate: [],
  }

  const creditPlatforms: AssetDetails[] = [
    {
      header: "Aave",
      valuation: "",
      description: t("rwas.activeLoans"),
      metricHref: "https://defillama.com/protocol/aave",
      visitHref: "https://aave.com/",
    },
    {
      header: "Morpho",
      valuation: "",
      description: t("rwas.activeLoans"),
      metricHref: "https://defillama.com/protocol/morpho",
      visitHref: "https://morpho.org/",
    },
    {
      header: "Centrifuge",
      valuation: formatLargeCurrency(
        locale,
        protocolsValueBySlugData.data.centrifuge
      ),
      description: t("rwas.activeLoans"),
      metricHref: "https://app.rwa.xyz/platforms/centrifuge",
      visitHref: "https://centrifuge.io/",
      ...protocolsValueBySlugData.sourceInfo,
      lastUpdated: formatDateMonthDayYear(
        locale,
        protocolsValueBySlugData.lastUpdated
      ),
    },
    {
      header: "Maple Finance",
      valuation: formatLargeCurrency(
        locale,
        protocolsValueBySlugData.data.maple
      ),
      description: t("rwas.activeLoans"),
      metricHref: "https://app.rwa.xyz/platforms/maple",
      visitHref: "https://maple.finance/",
      ...protocolsValueBySlugData.sourceInfo,
      lastUpdated: formatDateMonthDayYear(
        locale,
        protocolsValueBySlugData.lastUpdated
      ),
    },
    {
      header: "Midas mF-ONE",
      valuation: formatLargeCurrency(
        locale,
        assetValueByAssetIdsData.data.mF_ONE
      ),
      description: t("rwas.activeLoans"),
      metricHref: "https://app.rwa.xyz/assets/mF-ONE",
      visitHref: "https://midas.app/mfone",
      ...assetValueByAssetIdsData.sourceInfo,
      lastUpdated: formatDateMonthDayYear(
        locale,
        assetValueByAssetIdsData.lastUpdated
      ),
    },
  ]

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero heading={t("hero.heading")} shape="badge-dollar-sign">
        <p>{t("hero.description1")}</p>
        <p>{t("hero.description2")}</p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-20 px-4 py-10 sm:px-10 sm:py-20 md:space-y-40">
        <section id="overview">
          <h2 className="sr-only">{t("overview.srHeading")}</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {metrics.map(({ label, value, ...sourceInfo }, idx) => {
              const { source, sourceHref } = sourceInfo
              return (
                <Card key={idx} className="space-y-2 py-8">
                  <CardLabel className="text-base font-medium tracking-normal">
                    {label}
                  </CardLabel>
                  <AnimatedNumberInView className="text-big font-bold tracking-[0.055rem]">
                    {value}
                  </AnimatedNumberInView>
                  <CardSource>
                    {tCommon("source")}:{" "}
                    {sourceHref ? (
                      <Link
                        href={sourceHref}
                        className="css-secondary"
                        inline
                      >
                        {source}
                      </Link>
                    ) : (
                      source
                    )}
                    <SourceInfoTooltip {...sourceInfo} />
                  </CardSource>
                </Card>
              )
            })}
          </div>
        </section>

        <section
          id="infrastructure"
          className="flex gap-x-32 gap-y-14 max-lg:flex-col"
        >
          <div className="flex-1 space-y-7">
            <h2 className="sm:text-h3 text-h3-mobile max-w-lg tracking-[0.055rem]">
              {t("infrastructure.heading")}
            </h2>
            <p className="text-muted-foreground font-medium">
              {t("infrastructure.description")}
            </p>
            <ul className="max-w-prose space-y-4 font-medium">
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("infrastructure.depth")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("infrastructure.depthDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("infrastructure.scale")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("infrastructure.scaleDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("infrastructure.settlement")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("infrastructure.settlementDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("infrastructure.compliance")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("infrastructure.complianceDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("infrastructure.yield")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("infrastructure.yieldDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("infrastructure.networkEffects")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("infrastructure.networkEffectsDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("infrastructure.costSavings")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("infrastructure.costSavingsDesc")}
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
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 536px"
            />
          </div>
        </section>

        <section id="comparison" className="space-y-12">
          <h2 className="text-center">{t("comparison.heading")}</h2>

          {/* Desktop: CSS Grid table */}
          <div className="hidden md:block">
            {/* Column headers */}
            <div className="grid grid-cols-[200px_repeat(4,1fr)] gap-x-px bg-white">
              <div className="bg-[#F3F3F3] px-4 py-4">
                <span className="text-foreground font-bold">
                  {t("comparison.functions")}
                </span>
              </div>
              <div className="bg-secondary-foreground px-4 py-4">
                <span className="font-bold text-white">
                  {t("comparison.ethereum")}
                </span>
              </div>
              <div className="bg-[#ECECEC] px-4 py-4">
                <span className="text-foreground font-bold">
                  {t("comparison.l1Alt")}
                </span>
              </div>
              <div className="bg-[#ECECEC] px-4 py-4">
                <span className="text-foreground font-bold">
                  {t("comparison.privateDlt")}
                </span>
              </div>
              <div className="bg-[#ECECEC] px-4 py-4">
                <span className="text-foreground font-bold">
                  {t("comparison.traditional")}
                </span>
              </div>
            </div>

            {/* Data rows */}
            {(
              [
                "settlement",
                "resilience",
                "security",
                "devBase",
                "liquidity",
                "auditability",
                "neutrality",
                "geoRisk",
                "composability",
              ] as const
            ).map((row) => (
              <div
                key={row}
                className="grid grid-cols-[200px_repeat(4,1fr)] gap-x-px border-t bg-white"
              >
                <div className="flex items-center bg-[#F3F3F3] px-4 py-4">
                  <span className="text-foreground font-bold">
                    {t(`comparison.${row}`)}
                  </span>
                </div>
                <div className="bg-secondary-foreground/10 px-4 py-4">
                  <p className="text-foreground font-medium">
                    {t(`comparison.ethereum_${row}`)}
                  </p>
                </div>
                <div className="bg-white px-4 py-4">
                  <p className="text-muted-foreground font-medium">
                    {t(`comparison.l1Alt_${row}`)}
                  </p>
                </div>
                <div className="bg-white px-4 py-4">
                  <p className="text-muted-foreground font-medium">
                    {t(`comparison.privateDlt_${row}`)}
                  </p>
                </div>
                <div className="bg-white px-4 py-4">
                  <p className="text-muted-foreground font-medium">
                    {t(`comparison.traditional_${row}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Stacked cards per dimension */}
          <div className="space-y-3 md:hidden">
            {(
              [
                "settlement",
                "resilience",
                "security",
                "devBase",
                "liquidity",
                "auditability",
                "neutrality",
                "geoRisk",
                "composability",
              ] as const
            ).map((row) => (
              <div key={row} className="bg-card p-5">
                <p className="text-sm font-bold">
                  {t(`comparison.${row}`)}
                </p>
                <div className="mt-3 bg-secondary-foreground/10 px-4 py-3">
                  <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-secondary-foreground">
                    {t("comparison.ethereum")}
                  </p>
                  <p className="text-foreground text-sm font-medium">
                    {t(`comparison.ethereum_${row}`)}
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-muted-foreground mb-0.5 text-xs font-bold uppercase tracking-widest">
                    {t("comparison.l1Alt")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {t(`comparison.l1Alt_${row}`)}
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-muted-foreground mb-0.5 text-xs font-bold uppercase tracking-widest">
                    {t("comparison.privateDlt")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {t(`comparison.privateDlt_${row}`)}
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-muted-foreground mb-0.5 text-xs font-bold uppercase tracking-widest">
                    {t("comparison.traditional")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {t(`comparison.traditional_${row}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="stablecoins" className="space-y-8">
          <div className="space-y-2">
            <h2>{t("stablecoins.heading")}</h2>
            <p className="text-muted-foreground font-medium">
              {t("stablecoins.marketCap")}{" "}
              <InlineText className="text-foreground font-bold">
                {formatLargeCurrency(
                  locale,
                  stablecoinAssetMarketShareData.data.assetValue.mainnet
                )}
                <SourceInfoTooltip
                  lastUpdated={formatDateMonthDayYear(
                    locale,
                    stablecoinAssetMarketShareData.lastUpdated
                  )}
                  {...stablecoinAssetMarketShareData.sourceInfo}
                />
              </InlineText>
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
            {stablecoins.map(({ imgSrc, ticker, issuer, href }) => (
              <Link
                key={ticker}
                href={href}
                className="bg-card group w-full space-y-2 p-6 transition-transform hover:scale-105 hover:transition-transform"
              >
                <Image src={imgSrc} alt="" sizes="48px" className="size-12" />
                <h3 className="text-h5">{ticker}</h3>
                <p className="font-medium">{t("stablecoins.by", { issuer })}</p>
                <p className="text-secondary-foreground mt-6 mb-0">
                  {tCommon("visit")}{" "}
                  <span className="group-hover:animate-x-bounce inline-block">
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section id="category-breakdown" className="space-y-8">
          <div className="space-y-2">
            <h2>{t("categoryBreakdown.heading")}</h2>
            <p className="text-muted-foreground font-medium">
              {t("categoryBreakdown.description")}
            </p>
          </div>

          {/* Desktop: CSS Grid table */}
          <div className="hidden md:block">
            {/* Column headers */}
            <div className="grid grid-cols-[160px_repeat(4,1fr)] gap-x-px bg-white">
              <div className="bg-[#F3F3F3] px-4 py-4">
                <span className="text-foreground font-bold">
                  {t("categoryBreakdown.category")}
                </span>
              </div>
              <div className="bg-[#ECECEC] px-4 py-4">
                <span className="text-foreground font-bold">
                  {t("categoryBreakdown.tvlEth")}
                </span>
              </div>
              <div className="bg-[#ECECEC] px-4 py-4">
                <span className="text-foreground font-bold">
                  {t("categoryBreakdown.tvlTotal")}
                </span>
              </div>
              <div className="bg-secondary-foreground px-4 py-4">
                <span className="font-bold text-white">
                  {t("categoryBreakdown.ethShare")}
                </span>
              </div>
              <div className="bg-[#ECECEC] px-4 py-4">
                <span className="text-foreground font-bold">
                  {t("categoryBreakdown.examples")}
                </span>
              </div>
            </div>

            {/* Data rows */}
            {(
              [
                "treasuries",
                "credit",
                "commodities",
                "equities",
                "realEstate",
              ] as const
            ).map((cat) => (
              <div
                key={cat}
                className="grid grid-cols-[160px_repeat(4,1fr)] gap-x-px border-t bg-white"
              >
                <div className="flex items-center bg-[#F3F3F3] px-4 py-4">
                  <span className="text-foreground font-bold">
                    {t(`categoryBreakdown.${cat}`)}
                  </span>
                </div>
                <div className="bg-white px-4 py-4">
                  <p className="text-foreground font-medium">
                    {t(`categoryBreakdown.${cat}Tvl`)}
                  </p>
                </div>
                <div className="bg-white px-4 py-4">
                  <p className="text-muted-foreground font-medium">
                    {t(`categoryBreakdown.${cat}Total`)}
                  </p>
                </div>
                <div className="bg-secondary-foreground/10 px-4 py-4">
                  <p className="text-foreground font-semibold">
                    {t(`categoryBreakdown.${cat}Share`)}
                  </p>
                </div>
                <div className="bg-white px-4 py-4">
                  <p className="text-muted-foreground font-medium">
                    {categoryExamples[cat]?.length > 0
                      ? categoryExamples[cat].map((example, i) => (
                          <span key={example.name}>
                            {i > 0 && ", "}
                            <Link
                              href={example.href}
                              inline
                              className="css-secondary"
                            >
                              {example.name}
                            </Link>
                          </span>
                        ))
                      : t(`categoryBreakdown.${cat}Examples`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Stacked cards per category */}
          <div className="space-y-3 md:hidden">
            {(
              [
                "treasuries",
                "credit",
                "commodities",
                "equities",
                "realEstate",
              ] as const
            ).map((cat) => (
              <div key={cat} className="bg-card p-5">
                <p className="text-sm font-bold">
                  {t(`categoryBreakdown.${cat}`)}
                </p>
                <div className="mt-3">
                  <p className="text-muted-foreground mb-0.5 text-xs font-bold uppercase tracking-widest">
                    {t("categoryBreakdown.tvlEth")}
                  </p>
                  <p className="text-foreground text-sm font-medium">
                    {t(`categoryBreakdown.${cat}Tvl`)}
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-muted-foreground mb-0.5 text-xs font-bold uppercase tracking-widest">
                    {t("categoryBreakdown.tvlTotal")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {t(`categoryBreakdown.${cat}Total`)}
                  </p>
                </div>
                <div className="mt-3 bg-secondary-foreground/10 px-4 py-3">
                  <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-secondary-foreground">
                    {t("categoryBreakdown.ethShare")}
                  </p>
                  <p className="text-foreground text-sm font-semibold">
                    {t(`categoryBreakdown.${cat}Share`)}
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-muted-foreground mb-0.5 text-xs font-bold uppercase tracking-widest">
                    {t("categoryBreakdown.examples")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {categoryExamples[cat]?.length > 0
                      ? categoryExamples[cat].map((example, i) => (
                          <span key={example.name}>
                            {i > 0 && ", "}
                            <Link
                              href={example.href}
                              inline
                              className="css-secondary"
                            >
                              {example.name}
                            </Link>
                          </span>
                        ))
                      : t(`categoryBreakdown.${cat}Examples`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="rwas" className="space-y-8">
          <div className="space-y-2">
            <h2>{t("rwas.heading")}</h2>
            <p className="text-muted-foreground font-medium">
              {t("rwas.totalSector")}{" "}
              <InlineText className="text-foreground font-bold">
                {formatLargeCurrency(
                  locale,
                  rwaAssetMarketShareData.data.assetValue.mainnet
                )}
                <SourceInfoTooltip
                  lastUpdated={formatDateMonthDayYear(
                    locale,
                    rwaAssetMarketShareData.lastUpdated
                  )}
                  {...rwaAssetMarketShareData.sourceInfo}
                />
              </InlineText>
            </p>
          </div>

          {/* Tokenized Treasuries & Cash-Equivalents */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="bg-secondary-foreground text-secondary space-y-2 p-8">
              <h3 className="text-xl font-bold tracking-[0.025rem]">
                {t("rwas.treasuries")}
              </h3>
              <p className="text-big font-bold tracking-[0.055rem]">
                {formatLargeCurrency(
                  locale,
                  tokenizedTreasuriesData.data.totalTreasuries
                )}
              </p>
              <InlineText className="text-muted font-medium">
                {t("rwas.treasuriesSector")}
                <SourceInfoTooltip
                  lastUpdated={formatDateMonthDayYear(
                    locale,
                    tokenizedTreasuriesData.lastUpdated
                  )}
                  {...tokenizedTreasuriesData.sourceInfo}
                />
              </InlineText>
            </div>

            {cashEquivalents.map(
              ({
                header,
                valuation,
                description,
                issuer,
                metricHref,
                visitHref,
                ...tooltipProps
              }) => (
                <Card
                  className="flex flex-col justify-between gap-y-6 p-8"
                  key={header}
                >
                  <div className="space-y-2">
                    <h4 className="text-h5 font-bold tracking-[0.03rem]">
                      {header}
                    </h4>
                    {valuation && (
                      <InlineText>
                        <Link
                          href={metricHref}
                          inline
                          className="css-secondary font-bold tracking-[0.055rem]"
                        >
                          {valuation}
                        </Link>
                        <SourceInfoTooltip {...tooltipProps} />
                      </InlineText>
                    )}
                    <p className="text-muted-foreground font-medium">
                      {description}
                    </p>
                    {issuer && (
                      <p className="text-muted-foreground mt-6 font-medium">
                        {t("cards.by", { issuer })}
                      </p>
                    )}
                  </div>
                  <LinkWithArrow
                    href={visitHref}
                    className="css-secondary block"
                  >
                    {tCommon("visit")}
                  </LinkWithArrow>
                </Card>
              )
            )}
          </div>

          {/* Private Credit & Structured Credit */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-secondary-foreground text-secondary space-y-2 p-8">
              <h3 className="text-xl font-bold tracking-[0.025rem]">
                {t("rwas.privateCredit")}
              </h3>
              <p className="text-big font-bold tracking-[0.055rem]">
                {formatLargeCurrency(
                  locale,
                  protocolsValueTotal.data.totalPrivateCredit
                )}
              </p>
              <InlineText className="text-muted font-medium">
                {t("rwas.activeLoans")}
                <SourceInfoTooltip
                  lastUpdated={formatDateMonthDayYear(
                    locale,
                    protocolsValueTotal.lastUpdated
                  )}
                  {...protocolsValueTotal.sourceInfo}
                />
              </InlineText>
            </div>

            {creditPlatforms.map(
              ({
                header,
                valuation,
                description,
                issuer,
                metricHref,
                visitHref,
                ...tooltipProps
              }) => (
                <Card
                  className="flex flex-col justify-between gap-y-6 p-8"
                  key={header}
                >
                  <div className="space-y-2">
                    <h4 className="text-h5 font-bold tracking-[0.03rem]">
                      {header}
                    </h4>
                    {valuation && (
                      <InlineText>
                        <Link
                          href={metricHref}
                          inline
                          className="css-secondary font-bold tracking-[0.055rem]"
                        >
                          {valuation}
                        </Link>
                        <SourceInfoTooltip {...tooltipProps} />
                      </InlineText>
                    )}
                    <p className="text-muted-foreground font-medium">
                      {description}
                    </p>
                    {issuer && (
                      <p className="text-muted-foreground mt-6 font-medium">
                        {t("cards.by", { issuer })}
                      </p>
                    )}
                  </div>
                  <LinkWithArrow
                    href={visitHref}
                    className="css-secondary block"
                  >
                    {tCommon("visit")}
                  </LinkWithArrow>
                </Card>
              )
            )}
          </div>
        </section>

        <section id="why-ethereum" className="bg-primary text-primary-foreground -mx-4 px-4 py-16 sm:-mx-10 sm:px-10 md:py-24">
          <div className="max-w-8xl mx-auto grid grid-cols-1 gap-x-32 gap-y-8 md:grid-cols-2 md:items-center">
            <h2 className="text-h3-mobile sm:text-h2 tracking-[0.055rem]">
              {t("why.heading")}
            </h2>
            <div className="space-y-6 text-lg font-medium leading-relaxed text-white/85">
              <p className="text-2xl font-bold text-white">
                {t("why.tagline")}
              </p>
              <p>
                {t("why.desc1")}
              </p>
              <p>
                {t("why.desc2")}
              </p>
            </div>
          </div>
        </section>

        <section
          id="l2-section"
          className="flex gap-x-32 gap-y-14 max-lg:flex-col"
        >
          <div className="flex-1 space-y-7">
            <h2 className="sm:text-h3 text-h3-mobile tracking-[0.055rem]">
              {t("l2Section.heading")}
            </h2>
            <p className="text-muted-foreground font-medium">
              {t("l2Section.description")}
            </p>
            <LinkWithArrow href="/layer-2" className="css-secondary block">
              {t("l2Section.cta")}
            </LinkWithArrow>
          </div>
          <div className="flex-1">
            <ul className="space-y-4 font-medium">
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("l2Section.throughput")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("l2Section.throughputDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("l2Section.configurable")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("l2Section.configurableDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("l2Section.specialization")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("l2Section.specializationDesc")}
                </p>
              </li>
            </ul>
          </div>
        </section>
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "rwa" })

  return getMetadata({
    slug: "rwa",
    title: t("metadata.title"),
    description: t("metadata.description"),
    image: "/images/og/rwa.png",
    locale,
  })
}
