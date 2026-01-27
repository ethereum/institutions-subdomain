import { ReactNode } from "react"
import { Check } from "lucide-react"
import Image, { type StaticImageData } from "next/image"
import type { Metadata } from "next/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { LastUpdated, Metric, SourceInfo } from "@/lib/types"

import Hero from "@/components/Hero"
import { SourceInfoTooltip } from "@/components/InfoTooltip"
import { L2BenefitsPanel } from "@/components/L2BenefitsPanel"
import { AnimatedNumberInView } from "@/components/ui/animated-number"
import {
  Card,
  CardContent,
  CardLabel,
  CardSource,
  CardValue,
} from "@/components/ui/card"
import { InlineText } from "@/components/ui/inline-text"
import Link from "@/components/ui/link"

import { formatDateMonthDayYear } from "@/lib/utils/date"
import { getMetadata } from "@/lib/utils/metadata"
import {
  formatCurrency,
  formatLargeCurrency,
  formatLargeNumber,
} from "@/lib/utils/number"

import fetchBaseTvl from "@/app/_actions/fetchBaseTvl"
import fetchBeaconChain from "@/app/_actions/fetchBeaconChain"
import fetchCeloMonthlyStablecoinVolume from "@/app/_actions/fetchCeloMonthlyStablecoinVolume"
import fetchL2MedianTxCost from "@/app/_actions/fetchL2MedianTxCost"
import fetchL2ScalingActivity from "@/app/_actions/fetchL2ScalingActivity"
import fetchL2ScalingSummary from "@/app/_actions/fetchL2ScalingSummary"
import fetchWorldChainTxCount from "@/app/_actions/fetchWorldChainTxCount"
import { type Locale, routing } from "@/i18n/routing"
import blackGlyphBanner from "@/public/images/banners/black-glyph-banner.png"
import coinbase from "@/public/images/logos/apps/coinbase.png"
import deutscheBank from "@/public/images/logos/apps/deutsche-bank.png"
import ey from "@/public/images/logos/apps/ey.png"
import arbitrum from "@/public/images/logos/networks/arbitrum.png"
import base from "@/public/images/logos/networks/base.png"
import celo from "@/public/images/logos/networks/celo.png"
import ink from "@/public/images/logos/networks/ink.webp"
import linea from "@/public/images/logos/networks/linea.png"
import optimism from "@/public/images/logos/networks/optimism.png"
import polygon from "@/public/images/logos/networks/polygon.png"
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
  const l2MedianTxCostData = await fetchL2MedianTxCost()
  const beaconChainData = await fetchBeaconChain()
  const baseTvlData = await fetchBaseTvl()
  const worldChainTxCountData = await fetchWorldChainTxCount()
  const celoMonthlyStablecoinVolumeData =
    await fetchCeloMonthlyStablecoinVolume()

  const metrics: Metric[] = [
    {
      label: <span title="Total Value Locked">{t("metrics.tvlAcross")}</span>,
      value: formatLargeCurrency(l2ScalingSummaryData.data.totalTvl),
      lastUpdated: formatDateMonthDayYear(l2ScalingSummaryData.lastUpdated),
      ...l2ScalingSummaryData.sourceInfo,
    },
    {
      label: t("metrics.avgTxCost"),
      value: formatCurrency(
        l2MedianTxCostData.data.latestWeightedMedianTxCostUsd,
        {
          minimumSignificantDigits: 3,
          maximumSignificantDigits: 3,
        }
      ),
      lastUpdated: formatDateMonthDayYear(l2MedianTxCostData.lastUpdated),
      ...l2MedianTxCostData.sourceInfo,
    },
    {
      label: (
        <>
          {t("metrics.avgUops")} <span title="User Operations Per Second">UOPS</span>
        </>
      ),
      value: formatLargeNumber(l2ScalingActivityData.data.uops),
      lastUpdated: formatDateMonthDayYear(l2ScalingActivityData.lastUpdated),
      ...l2ScalingActivityData.sourceInfo,
    },
    {
      label: t("metrics.numberOfL2s"),
      value: l2ScalingSummaryData.data.allProjectsCount,
      lastUpdated: formatDateMonthDayYear(l2ScalingSummaryData.lastUpdated),
      ...l2ScalingSummaryData.sourceInfo,
    },
  ]

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
      heading: "Polygon",
      description: t("frameworks.polygon"),
      href: "https://polygon.technology/",
      imgSrc: polygon,
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
      description: t("caseStudies.ey.description"),
      href: "https://blockchain.ey.com/technology",
      imgSrc: ey,
      ctaLabel: (
        <>
          90%
          <br />
          {t("caseStudies.ey.ctaLabel")}
        </>
      ),
      lastUpdated: formatDateMonthDayYear(new Date("2024-04-06")),
      source: "EY Nightfall FAQ",
      sourceHref: "https://blockchain.ey.com/uploads/Nightfall_FAQ.pdf",
    },
    {
      heading: "Coinbase",
      description: t("caseStudies.coinbase.description"),
      href: "https://www.base.org/",
      imgSrc: coinbase,
      ctaLabel: (
        <>
          {formatLargeCurrency(baseTvlData.data.baseTvl)}
          <br />
          {t("caseStudies.coinbase.ctaLabel")}
        </>
      ),
      lastUpdated: formatDateMonthDayYear(baseTvlData.lastUpdated),
      ...baseTvlData.sourceInfo,
    },
    {
      heading: "Deutsche Bank",
      description: t("caseStudies.deutscheBank.description"),
      href: "https://www.db.com/news/detail/20250618-dama-2-litepaper-institutional-blueprint-for-asset-tokenisation-and-servicing-on-ethereum-layer-2?language_id=1",
      imgSrc: deutscheBank,
      ctaLabel: (
        <>
          $84T
          <br />
          {t("caseStudies.deutscheBank.ctaLabel")}
        </>
      ),
      lastUpdated: formatDateMonthDayYear(new Date("2025-06-18")),
      source: "DAMA 2 litepaper",
      sourceHref:
        "https://www.db.com/news/detail/20250618-dama-2-litepaper-institutional-blueprint-for-asset-tokenisation-and-servicing-on-ethereum-layer-2?language_id=1",
    },
    {
      heading: "Celo",
      description: t("caseStudies.celo.description"),
      href: "https://celo.org/",
      imgSrc: celo,
      ctaLabel: (
        <>
          {formatLargeCurrency(
            celoMonthlyStablecoinVolumeData.data.celoMonthlyStablecoinVolume
          )}
          <br />
          {t("caseStudies.celo.ctaLabel")}
        </>
      ),
      lastUpdated: formatDateMonthDayYear(
        celoMonthlyStablecoinVolumeData.lastUpdated
      ),
      ...celoMonthlyStablecoinVolumeData.sourceInfo,
    },
    {
      heading: "World",
      description: t("caseStudies.world.description"),
      href: "https://world.org/world-chain",
      imgSrc: worldChain,
      ctaLabel: (
        <>
          {formatLargeNumber(worldChainTxCountData.data.worldChainTxCount)}
          <br />
          {t("caseStudies.world.ctaLabel")}
        </>
      ),
      lastUpdated: formatDateMonthDayYear(worldChainTxCountData.lastUpdated),
      ...worldChainTxCountData.sourceInfo,
    },
  ]

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero heading={t("hero.heading")} shape="layers-2">
        <p>
          {t("hero.description1")}
        </p>
        <p>
          {t("hero.description2")}
        </p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-20 px-4 py-10 sm:px-10 sm:py-20 md:space-y-40">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-12 xl:grid-cols-4">
          <h2 className="sr-only">{t("metrics.srHeading")}</h2>
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
                        lastUpdated={formatDateMonthDayYear(lastUpdated)}
                      />
                    )}
                  </CardSource>
                )}
              </Card>
            )
          )}
        </section>
        <section id="role" className="space-y-8">
          <h2 className="text-h3-mobile sm:text-h3">{t("role.heading")}</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="p-10">
              <h3 className="text-h4">
                {t("role.l1.heading")}
                <br />
                {t("role.l1.subheading")}
              </h3>

              <hr className="my-6" />

              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">{t("role.l1.finality")}</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("role.l1.finalityDesc")}
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">{t("role.l1.security")}</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("role.l1.securityDesc")}
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">{t("role.l1.riskGating")}</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("role.l1.riskGatingDesc")}
                </div>
              </div>
            </Card>

            <Card className="p-10">
              <h3 className="text-h4">
                {t("role.l2.heading")}
                <br />
                {t("role.l2.subheading")}
              </h3>

              <hr className="my-6" />

              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">{t("role.l2.throughput")}</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("role.l2.throughputDesc")}
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">{t("role.l2.configurable")}</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("role.l2.configurableDesc")}
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">{t("role.l2.specialization")}</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("role.l2.specializationDesc")}
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section id="benefits" className="space-y-8">
          <h2 className="text-h3-mobile sm:text-h3">{t("benefits.heading")}</h2>

          <L2BenefitsPanel
            validatorsCount={formatLargeNumber(
              beaconChainData.data.validatorsCount,
              {},
              2
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
                  {t("trust.transparencyDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("trust.dataAvailability")}
                <p className="text-muted-foreground mt-1 text-base font-medium tracking-[0.02rem]">
                  {t("trust.dataAvailabilityDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("trust.exitWindow")}
                <p className="text-muted-foreground mt-1 text-base font-medium tracking-[0.02rem]">
                  {t("trust.exitWindowDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("trust.recoverability")}
                <p className="text-muted-foreground mt-1 text-base font-medium tracking-[0.02rem]">
                  {t("trust.recoverabilityDesc")}
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
              {t("frameworksSection.heading")}
            </h2>
            <p className="text-muted-foreground font-medium">
              {t("frameworksSection.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {frameworks.map(({ heading, description, imgSrc, href }) => (
              <Link
                key={heading}
                href={href}
                className="bg-card group flex h-full w-full flex-col justify-between p-6 transition-transform hover:scale-105 hover:transition-transform"
                aria-label={`Visit ${heading}`}
              >
                <div className="space-y-2">
                  <Image src={imgSrc} alt="" sizes="48px" className="size-12" />
                  <h3 className="text-h5">{heading}</h3>
                  <p className="font-medium">{description}</p>
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

          <div className="space-y-2">
            <h3 className="text-h4-mobile sm:text-h4">{t("networksSection.heading")}</h3>
            <p className="text-muted-foreground font-medium">
              {t("networksSection.description")}
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4">
            {networks.map(({ heading, description, imgSrc, href }) => (
              <Link
                key={heading}
                href={href}
                className="bg-card group flex h-full w-full flex-col justify-between p-6 transition-transform hover:scale-105 hover:transition-transform"
                aria-label={`Visit ${heading}`}
              >
                <div className="space-y-2">
                  <Image src={imgSrc} alt="" sizes="48px" className="size-12" />
                  <h3 className="text-h5">{heading}</h3>
                  <p className="font-medium">{description}</p>
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
        </section>

        <section id="cases" className="space-y-8">
          <h2 className="text-h3-mobile sm:text-h3">{t("caseStudiesSection.heading")}</h2>
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
                      aria-label={`Visit ${heading}`}
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

        <section id="enterprise" className="space-y-8">
          <h2 className="text-h3-mobile sm:text-h3">{t("enterprise.heading")}</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="p-10">
              <h3 className="text-h4">{t("enterprise.existing.heading")}</h3>

              <hr className="my-6" />

              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">{t("enterprise.existing.immediateAccess")}</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.existing.immediateAccessDesc")}
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">{t("enterprise.existing.lowerCosts")}</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.existing.lowerCostsDesc")}
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">{t("enterprise.existing.regulatoryAlignment")}</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.existing.regulatoryAlignmentDesc")}
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">{t("enterprise.existing.productionSecurity")}</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.existing.productionSecurityDesc")}
                </div>
              </div>
            </Card>

            <Card className="p-10">
              <h3 className="text-h4">{t("enterprise.custom.heading")}</h3>

              <hr className="my-6" />

              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">{t("enterprise.custom.tailoredEnvironments")}</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.custom.tailoredEnvironmentsDesc")}
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">{t("enterprise.custom.customFeatures")}</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.custom.customFeaturesDesc")}
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">{t("enterprise.custom.sharedSecurity")}</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.custom.sharedSecurityDesc")}
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">{t("enterprise.custom.fasterTimeToMarket")}</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  {t("enterprise.custom.fasterTimeToMarketDesc")}
                </div>
              </div>
            </Card>
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
