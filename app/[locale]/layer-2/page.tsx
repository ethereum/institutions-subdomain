import { ReactNode } from "react"
import { Check } from "lucide-react"
import Image, { type StaticImageData } from "next/image"
import type { Metadata } from "next/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { LastUpdated, SourceInfo } from "@/lib/types"

import L2UopsAreaChart from "@/components/data/l2-uops-area-chart"
import Hero from "@/components/Hero"
import { SourceInfoTooltip } from "@/components/InfoTooltip"
import { L2BenefitsPanel } from "@/components/L2BenefitsPanel"
import { AnimatedNumberInView } from "@/components/ui/animated-number"
import {
  Card,
  CardContent,
  CardHeader,
  CardLabel,
  CardSource,
  CardTitle,
  CardValue,
} from "@/components/ui/card"
import { InlineText } from "@/components/ui/inline-text"
import Link from "@/components/ui/link"

import { formatDateMonthDayYear } from "@/lib/utils/date"
import { getMetadata } from "@/lib/utils/metadata"
import { formatLargeCurrency, formatLargeNumber } from "@/lib/utils/number"

import fetchBaseTvl from "@/app/_actions/fetchBaseTvl"
import fetchBeaconChain from "@/app/_actions/fetchBeaconChain"
import fetchCeloMonthlyStablecoinVolume from "@/app/_actions/fetchCeloMonthlyStablecoinVolume"
import fetchEtherPrice from "@/app/_actions/fetchEtherPrice"
import fetchL2ScalingActivity from "@/app/_actions/fetchL2ScalingActivity"
import fetchL2ScalingSummary from "@/app/_actions/fetchL2ScalingSummary"
import fetchWorldChainTxCount from "@/app/_actions/fetchWorldChainTxCount"
import { type Locale, routing } from "@/i18n/routing"
import blackGlyphBanner from "@/public/images/banners/black-glyph-banner.png"
import coinbase from "@/public/images/logos/apps/coinbase.png"
import deutscheBank from "@/public/images/logos/apps/deutsche-bank.png"
import ey from "@/public/images/logos/apps/ey.png"
import antGroup from "@/public/images/logos/institutions/ant-group.png"
import robinhood from "@/public/images/logos/institutions/robinhood.png"
import soneium from "@/public/images/logos/institutions/soneium.png"
import arbitrum from "@/public/images/logos/networks/arbitrum.png"
import base from "@/public/images/logos/networks/base.png"
import celo from "@/public/images/logos/networks/celo.png"
import ink from "@/public/images/logos/networks/ink.webp"
import linea from "@/public/images/logos/networks/linea.png"
import optimism from "@/public/images/logos/networks/optimism.png"
import scroll from "@/public/images/logos/networks/scroll.png"
import starknet from "@/public/images/logos/networks/starknet.png"
import unichain from "@/public/images/logos/networks/unichain.png"
import worldChain from "@/public/images/logos/networks/world-chain.png"
import zksync from "@/public/images/logos/networks/zksync.png"

type CardItem = {
  heading: string
  description: string
  href: string
  imgSrc: StaticImageData
  ctaLabel?: ReactNode
}

type Props = {
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("layer2")
  const tCommon = await getTranslations("common")

  const l2ScalingSummaryData = await fetchL2ScalingSummary()
  const l2ScalingActivityData = await fetchL2ScalingActivity()
  const beaconChainData = await fetchBeaconChain()
  const ethPrice = await fetchEtherPrice()
  const baseTvlData = await fetchBaseTvl()
  const worldChainTxCountData = await fetchWorldChainTxCount()
  const celoMonthlyStablecoinVolumeData =
    await fetchCeloMonthlyStablecoinVolume()

  const frameworks: CardItem[] = [
    {
      heading: "Arbitrum",
      description: t("frameworks.arbitrum"),
      href: "https://arbitrum.io/",
      imgSrc: arbitrum,
    },
    {
      heading: "Optimism",
      description: t("frameworks.optimism"),
      href: "https://www.optimism.io/",
      imgSrc: optimism,
    },
    {
      heading: "ZKSync",
      description: t("frameworks.zksync"),
      href: "https://www.zksync.io/",
      imgSrc: zksync,
    },
  ]

  const networks: CardItem[] = [
    {
      heading: "Linea",
      description: t("networks.linea"),
      href: "https://linea.build/",
      imgSrc: linea,
    },
    {
      heading: "Starknet",
      description: t("networks.starknet"),
      href: "https://www.starknet.io/",
      imgSrc: starknet,
    },
    {
      heading: "Base",
      description: t("networks.base"),
      href: "https://www.base.org/",
      imgSrc: base,
    },
    {
      heading: "Ink",
      description: t("networks.ink"),
      href: "https://inkonchain.com/",
      imgSrc: ink,
    },
    {
      heading: "Unichain",
      description: t("networks.unichain"),
      href: "https://www.unichain.org/",
      imgSrc: unichain,
    },
    {
      heading: "Scroll",
      description: t("networks.scroll"),
      href: "https://scroll.io/",
      imgSrc: scroll,
    },
  ]

  const caseStudies: (Omit<CardItem, "ctaLabel"> &
    Required<Pick<CardItem, "ctaLabel">> &
    Partial<SourceInfo & LastUpdated>)[] = [
    {
      heading: "Ernst & Young",
      description: t("case-studies.ey.description"),
      href: "https://blockchain.ey.com/technology",
      imgSrc: ey,
      ctaLabel: (
        <>
          90%
          <br />
          {t("case-studies.ey.cta-label")}
        </>
      ),
      lastUpdated: formatDateMonthDayYear(locale, new Date("2024-04-06")),
      source: "EY Nightfall FAQ",
      sourceHref: "https://blockchain.ey.com/uploads/Nightfall_FAQ.pdf",
    },
    {
      heading: "Coinbase",
      description: t("case-studies.coinbase.description"),
      href: "https://www.base.org/",
      imgSrc: coinbase,
      ctaLabel: (
        <>
          {formatLargeCurrency(locale, baseTvlData.data.baseTvl)}
          <br />
          {t("case-studies.coinbase.cta-label")}
        </>
      ),
      lastUpdated: formatDateMonthDayYear(locale, baseTvlData.lastUpdated),
      ...baseTvlData.sourceInfo,
    },
    {
      heading: "Deutsche Bank",
      description: t("case-studies.deutsche-bank.description"),
      href: "https://www.db.com/news/detail/20250618-dama-2-litepaper-institutional-blueprint-for-asset-tokenisation-and-servicing-on-ethereum-layer-2?language_id=1",
      imgSrc: deutscheBank,
      ctaLabel: (
        <>
          $84T
          <br />
          {t("case-studies.deutsche-bank.cta-label")}
        </>
      ),
      lastUpdated: formatDateMonthDayYear(locale, new Date("2025-06-18")),
      source: "DAMA 2 litepaper",
      sourceHref:
        "https://www.db.com/news/detail/20250618-dama-2-litepaper-institutional-blueprint-for-asset-tokenisation-and-servicing-on-ethereum-layer-2?language_id=1",
    },
    {
      heading: "Celo",
      description: t("case-studies.celo.description"),
      href: "https://celo.org/",
      imgSrc: celo,
      ctaLabel: (
        <>
          {formatLargeCurrency(
            locale,
            celoMonthlyStablecoinVolumeData.data.celoMonthlyStablecoinVolume
          )}
          <br />
          {t("case-studies.celo.cta-label")}
        </>
      ),
      lastUpdated: formatDateMonthDayYear(
        locale,
        celoMonthlyStablecoinVolumeData.lastUpdated
      ),
      ...celoMonthlyStablecoinVolumeData.sourceInfo,
    },
    {
      heading: "World",
      description: t("case-studies.world.description"),
      href: "https://world.org/world-chain",
      imgSrc: worldChain,
      ctaLabel: (
        <>
          {formatLargeNumber(
            locale,
            worldChainTxCountData.data.worldChainTxCount
          )}
          <br />
          {t("case-studies.world.cta-label")}
        </>
      ),
      lastUpdated: formatDateMonthDayYear(
        locale,
        worldChainTxCountData.lastUpdated
      ),
      ...worldChainTxCountData.sourceInfo,
    },
    {
      heading: "Sony (Soneium)",
      description: t("case-studies.sony.description"),
      href: "https://soneium.org/",
      imgSrc: soneium,
      ctaLabel: (
        <>
          500K+
          <br />
          {t("case-studies.sony.cta-label")}
        </>
      ),
      lastUpdated: formatDateMonthDayYear(locale, new Date("2025-01-01")),
      source: "Soneium",
      sourceHref: "https://soneium.org/",
    },
    {
      heading: "Ant Group (Jovay)",
      description: t("case-studies.ant-group.description"),
      href: "https://www.antgroup.com/",
      imgSrc: antGroup,
      ctaLabel: <>{t("case-studies.ant-group.cta-label")}</>,
      lastUpdated: formatDateMonthDayYear(locale, new Date("2025-01-01")),
      source: "Ant Group",
      sourceHref: "https://www.antgroup.com/",
    },
    {
      heading: "Robinhood",
      description: t("case-studies.robinhood.description"),
      href: "https://docs.robinhood.com/chain/",
      imgSrc: robinhood,
      ctaLabel: <>{t("case-studies.robinhood.cta-label")}</>,
      lastUpdated: formatDateMonthDayYear(locale, new Date("2025-05-01")),
      source: "Robinhood",
      sourceHref: "https://robinhood.com/",
    },
  ]

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero heading={t("hero.heading")} shape="layers-2">
        <p>{t("hero.description1")}</p>
        <p>{t("hero.description2")}</p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-20 px-4 py-10 sm:px-10 sm:py-20 md:space-y-40">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_3fr]">
          <h2 className="sr-only">{t("metrics.sr-heading")}</h2>
          <Card variant="flex-height">
            <CardContent>
              <CardLabel className="text-base font-medium tracking-[0.02rem]">
                <span title={t("abbreviations.tvl")}>{t("metrics.tvl-across")}</span>
              </CardLabel>
              <CardValue asChild>
                <AnimatedNumberInView>
                  {formatLargeCurrency(
                    locale,
                    l2ScalingSummaryData.data.totalTvl
                  )}
                </AnimatedNumberInView>
              </CardValue>
            </CardContent>
            {l2ScalingSummaryData.sourceInfo.source && (
              <CardSource>
                {tCommon("source")}:{" "}
                {l2ScalingSummaryData.sourceInfo.sourceHref ? (
                  <Link
                    href={l2ScalingSummaryData.sourceInfo.sourceHref}
                    className="text-muted-foreground hover:text-foreground"
                    inline
                  >
                    {l2ScalingSummaryData.sourceInfo.source}
                  </Link>
                ) : (
                  l2ScalingSummaryData.sourceInfo.source
                )}
                {l2ScalingSummaryData.lastUpdated && (
                  <SourceInfoTooltip
                    lastUpdated={formatDateMonthDayYear(
                      locale,
                      l2ScalingSummaryData.lastUpdated
                    )}
                  />
                )}
              </CardSource>
            )}
          </Card>
          <Card variant="flex-column">
            <CardHeader className="flex gap-2 !px-0 max-sm:flex-col sm:items-center">
              <CardContent className="flex-1 gap-4">
                <CardTitle className="text-xl">
                  {t("metrics.avg-uops")}{" "}
                  <span title={t("abbreviations.uops")}>UOPS</span>
                </CardTitle>
              </CardContent>
              <div className="text-h4 font-bold tracking-[0.04rem]">
                <AnimatedNumberInView>
                  {formatLargeNumber(locale, l2ScalingActivityData.data.uops)}
                </AnimatedNumberInView>
              </div>
            </CardHeader>
            <CardContent variant="flex-1-height-between" className="gap-y-4">
              <L2UopsAreaChart chartData={l2ScalingActivityData} />
              {l2ScalingActivityData.sourceInfo.source && (
                <CardSource>
                  {tCommon("source")}:{" "}
                  {l2ScalingActivityData.sourceInfo.sourceHref && (
                    <Link
                      inline
                      href={l2ScalingActivityData.sourceInfo.sourceHref}
                    >
                      {l2ScalingActivityData.sourceInfo.source}
                    </Link>
                  )}
                  {l2ScalingActivityData.lastUpdated && (
                    <SourceInfoTooltip
                      lastUpdated={formatDateMonthDayYear(
                        locale,
                        l2ScalingActivityData.lastUpdated
                      )}
                    />
                  )}
                </CardSource>
              )}
            </CardContent>
          </Card>
        </section>
        <section id="role" className="space-y-8">
          <h2 className="text-h3-mobile sm:text-h3">{t("role.heading")}</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="p-10">
              <h3 className="text-h4">{t("role.l1.heading")}</h3>

              <hr className="my-6" />

              <p className="text-muted-foreground font-medium">
                {t("role.l1.description")}
              </p>

              <ul className="mt-8 space-y-6">
                <li className="flex items-center gap-3">
                  <Check className="text-secondary-foreground shrink-0" />
                  <span className="font-medium">{t("role.l1.item1")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-secondary-foreground shrink-0" />
                  <span className="font-medium">{t("role.l1.item2")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-secondary-foreground shrink-0" />
                  <span className="font-medium">{t("role.l1.item3")}</span>
                </li>
              </ul>

              <p className="text-muted-foreground mt-12 font-medium">
                {t("role.l1.closing")}
              </p>
            </Card>

            <Card className="p-10">
              <h3 className="text-h4">{t("role.l2.heading")}</h3>

              <hr className="my-6" />

              <p className="text-muted-foreground font-medium">
                {t("role.l2.description")}
              </p>

              <ul className="mt-8 space-y-6">
                <li className="flex items-start gap-3">
                  <Check className="text-secondary-foreground mt-0.5 shrink-0" />
                  <span className="font-medium">{t("role.l2.item1")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-secondary-foreground mt-0.5 shrink-0" />
                  <span className="font-medium">{t("role.l2.item2")}</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        <section id="benefits" className="space-y-8">
          <h2 className="text-h3-mobile sm:text-h3">{t("benefits.heading")}</h2>

          <L2BenefitsPanel
            securityValue={formatLargeCurrency(
              locale,
              beaconChainData.data.totalStakedEther * ethPrice.data.usd
            )}
          />
        </section>

        <section id="trust" className="flex gap-x-32 gap-y-14 max-lg:flex-col">
          <div className="flex-1 space-y-8">
            <h2 className="text-h3-mobile sm:text-h3 tracking-[0.055rem]">
              {t("trust.heading")}
            </h2>
            <p className="text-muted-foreground max-w-xl text-xl font-medium tracking-[0.025rem]">
              {t("trust.description")}
            </p>
            <ul className="max-w-prose space-y-4 font-medium">
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("trust.transparency")}
                <p className="text-muted-foreground mt-1 text-base font-medium tracking-[0.02rem]">
                  {t("trust.transparency-desc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("trust.data-availability")}
                <p className="text-muted-foreground mt-1 text-base font-medium tracking-[0.02rem]">
                  {t("trust.data-availability-desc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("trust.exit-window")}
                <p className="text-muted-foreground mt-1 text-base font-medium tracking-[0.02rem]">
                  {t("trust.exit-window-desc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("trust.recoverability")}
                <p className="text-muted-foreground mt-1 text-base font-medium tracking-[0.02rem]">
                  {t("trust.recoverability-desc")}
                </p>
              </li>
            </ul>

            <div className="space-y-4">
              <h3 className="text-h5 tracking-[0.03rem]">
                {t("trust.issuance.heading")}
              </h3>
              <p className="text-muted-foreground text-xl font-medium">
                {t("trust.issuance.description")}
              </p>
              <ul className="space-y-2 font-medium">
                <li className="flex gap-4">
                  <Check className="text-secondary-foreground" />
                  {t("trust.issuance.anchors")}
                </li>
                <li className="flex gap-4">
                  <Check className="text-secondary-foreground" />
                  {t("trust.issuance.guarantees")}
                </li>
                <li className="flex gap-4">
                  <Check className="text-secondary-foreground" />
                  {t("trust.issuance.maximizes")}
                </li>
              </ul>
            </div>
          </div>
          <div className="relative min-h-80 flex-1">
            <Image
              src={blackGlyphBanner}
              alt=""
              fill
              placeholder="blur"
              className="object-cover object-center grayscale"
              sizes="(max-width: 1024px) 100vw, 536px"
            />
          </div>
        </section>

        <section id="frameworks" className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-h3-mobile sm:text-h3">
              {t("frameworks-section.heading")}
            </h2>
            <p className="text-muted-foreground font-medium">
              {t("frameworks-section.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {frameworks.map(({ heading, description, imgSrc, href }) => (
              <Link
                key={heading}
                href={href}
                className="bg-card group flex h-full w-full flex-col justify-between p-6 transition-transform hover:scale-105 hover:transition-transform"
                aria-label={tCommon("visit-aria-label", { name: heading })}
              >
                <div className="space-y-2">
                  <Image
                    src={imgSrc}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 object-contain"
                  />
                  <h3 className="text-h5">{heading}</h3>
                  <p className="font-medium whitespace-pre-line">
                    {description}
                  </p>
                </div>
                <p className="text-secondary-foreground mt-12 font-bold lg:mt-16">
                  {tCommon("visit")}{" "}
                  <span className="group-hover:animate-x-bounce inline-block">
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {networks.map(({ heading, description, imgSrc, href }) => (
              <Link
                key={heading}
                href={href}
                className="bg-card group flex h-full flex-col justify-between gap-2 p-6 transition-transform hover:scale-105 hover:transition-transform"
                aria-label={tCommon("visit-aria-label", { name: heading })}
              >
                <div className="space-y-2">
                  <Image
                    src={imgSrc}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 object-contain"
                  />
                  <h3 className="text-h6 font-bold">{heading}</h3>
                  <p className="text-muted-foreground text-sm font-medium">
                    {description}
                  </p>
                </div>
                <p className="text-secondary-foreground mt-4 font-bold">
                  {tCommon("visit")}{" "}
                  <span className="group-hover:animate-x-bounce inline-block">
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section id="enterprise" className="space-y-8">
          <h2 className="text-h3-mobile sm:text-h3">
            {t("enterprise.heading")}
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="p-10">
              <h3 className="text-h4">{t("enterprise.existing.heading")}</h3>

              <hr className="my-6" />

              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">
                    {t("enterprise.existing.immediate-access")}
                  </h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.existing.immediate-access-desc")}
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">
                    {t("enterprise.existing.lower-costs")}
                  </h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.existing.lower-costs-desc")}
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">
                    {t("enterprise.existing.regulatory-alignment")}
                  </h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.existing.regulatory-alignment-desc")}
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">
                    {t("enterprise.existing.production-security")}
                  </h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.existing.production-security-desc")}
                </div>
              </div>
            </Card>

            <Card className="p-10">
              <h3 className="text-h4">{t("enterprise.custom.heading")}</h3>

              <hr className="my-6" />

              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">
                    {t("enterprise.custom.tailored-environments")}
                  </h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.custom.tailored-environments-desc")}
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">
                    {t("enterprise.custom.custom-features")}
                  </h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.custom.custom-features-desc")}
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">
                    {t("enterprise.custom.shared-security")}
                  </h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.custom.shared-security-desc")}
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">
                    {t("enterprise.custom.faster-time-to-market")}
                  </h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.custom.faster-time-to-market-desc")}
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section id="cases" className="space-y-8">
          <h2 className="text-h3-mobile sm:text-h3">
            {t("case-studies-section.heading")}
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4">
            {caseStudies.map(
              ({
                heading,
                description,
                imgSrc,
                href,
                ctaLabel,
                ...tooltipProps
              }) => (
                <div
                  key={heading}
                  className="bg-card flex h-full w-full flex-col justify-between p-6"
                >
                  <div className="space-y-2">
                    <Link
                      href={href}
                      className="group css-secondary space-y-2"
                      aria-label={tCommon("visit-aria-label", { name: heading })}
                    >
                      <Image
                        src={imgSrc}
                        alt=""
                        sizes="48px"
                        className="size-12 transition-transform group-hover:scale-110 group-hover:transition-transform"
                      />
                      <h3 className="text-h5">{heading}</h3>
                    </Link>
                    <p className="font-medium">{description}</p>
                  </div>
                  <InlineText className="mt-12 font-bold lg:mt-16">
                    {ctaLabel}
                    {tooltipProps.source && (
                      <SourceInfoTooltip {...tooltipProps} />
                    )}
                  </InlineText>
                </div>
              )
            )}
          </div>
        </section>
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "layer2" })

  return getMetadata({
    slug: "layer-2",
    title: t("metadata.title"),
    description: t("metadata.description"),
    image: "/images/og/layer-2.png",
    locale,
  })
}
