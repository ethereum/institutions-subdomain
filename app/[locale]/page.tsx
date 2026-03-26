import { Metadata } from "next"
import Image, { type StaticImageData } from "next/image"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { Metric } from "@/lib/types"

import BigNumber from "@/components/BigNumber"
import Hero from "@/components/Hero"
import { SourceInfoTooltip } from "@/components/InfoTooltip"
import MaskedParallelsIcon from "@/components/MaskedParallelsIcon"
import { ScalingPanel } from "@/components/ScalingPanel"
import BadgeDollarSignFillInvert from "@/components/svg/badge-dollar-sign-fill-invert"
import CircleRing from "@/components/svg/circle-ring"
import Layers2Fill from "@/components/svg/layers-2-fill"
import LockFill from "@/components/svg/lock-fill"
import {
  Card,
  CardContent,
  CardDescription,
  CardLabel,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselFooter,
  CarouselIndicator,
  CarouselItem,
  CarouselNavigation,
} from "@/components/ui/carousel"
import { ComparisonTable } from "@/components/ui/comparison-table"
import { InfiniteSlider } from "@/components/ui/infinite-slider"
import { InlineText } from "@/components/ui/inline-text"
import {
  LibraryCard,
  LibraryCardDate,
  LibraryCardHeader,
  LibraryCardImage,
  LibraryCardTitle,
  LibraryCardTitleLink,
} from "@/components/ui/library-card"
import { LinkWithArrow } from "@/components/ui/link"

import { cn } from "@/lib/utils"
import { formatDateMonthDayYear } from "@/lib/utils/date"
import { getMetadata } from "@/lib/utils/metadata"
import {
  formatLargeCurrency,
  formatLargeNumber,
  formatMultiplier,
  formatPercent,
} from "@/lib/utils/number"
import { formatDuration } from "@/lib/utils/time"

import { MAINNET_GENESIS } from "@/lib/constants"

import { getLibraryItems } from "./library/data"

import fetchAssetMarketShare from "@/app/_actions/fetchAssetMarketShare"
import fetchBaseTvl from "@/app/_actions/fetchBaseTvl"
import fetchBeaconChain from "@/app/_actions/fetchBeaconChain"
import fetchEtherPrice from "@/app/_actions/fetchEtherPrice"
import fetchSecuritizeAum from "@/app/_actions/fetchSecuritizeAum"
import fetchStablecoinSupply from "@/app/_actions/fetchStablecoinSupply"
import fetchDefiTvlAllCurrent from "@/app/_actions/fetchTvlDefiAllCurrent"
import { getTimeSinceGenesis } from "@/app/_actions/getTimeSinceGenesis"
import { type Locale, routing } from "@/i18n/routing"
import blackRock from "@/public/images/logos/institutions/black-rock.png"
import blackRockSvg from "@/public/images/logos/institutions/black-rock.svg"
import coinbase from "@/public/images/logos/institutions/coinbase.png"
import coinbaseSvg from "@/public/images/logos/institutions/coinbase.svg"
import etoro from "@/public/images/logos/institutions/etoro.png"
import fidelity from "@/public/images/logos/institutions/fidelity.png"
import jpMorgan from "@/public/images/logos/institutions/jp-morgan.svg"
import mastercard from "@/public/images/logos/institutions/mastercard.png"
import morganStanley from "@/public/images/logos/institutions/morgan-stanley.svg"
import robinhood from "@/public/images/logos/institutions/robinhood.png"
import standardChartered from "@/public/images/logos/institutions/standard-chartered.svg"
import swift from "@/public/images/logos/institutions/swift.png"
import ubs from "@/public/images/logos/institutions/ubs.png"
import geoffreyKendrick from "@/public/images/profiles/geoffrey-kendrick.jpeg"
import robertMitchnick from "@/public/images/profiles/robert-mitchnick.png"
import tomZschach from "@/public/images/profiles/tom-zschach.png"
import vladTenev from "@/public/images/profiles/vlad-tenev.png"

const getTestimonials = (
  t: (key: string) => string
): {
  name: string
  role: string
  content: string[]
  imgSrc: StaticImageData
}[] => [
  {
    name: "Geoffrey Kendrick",
    role: `${t("testimonials.kendrick.role")} @ Standard Chartered`,
    content: [
      t("testimonials.kendrick.quote1"),
      t("testimonials.kendrick.quote2"),
    ],
    imgSrc: geoffreyKendrick,
  },
  {
    name: "Tom Zschach",
    role: `${t("testimonials.zschach.role")} @ SWIFT`,
    content: [
      t("testimonials.zschach.quote1"),
      t("testimonials.zschach.quote2"),
    ],
    imgSrc: tomZschach,
  },
  {
    name: "Robert Mitchnick",
    role: `${t("testimonials.mitchnick.role")} @ BlackRock`,
    content: [t("testimonials.mitchnick.quote1")],
    imgSrc: robertMitchnick,
  },
  {
    name: "Vlad Tenev",
    role: `${t("testimonials.tenev.role")} @ Robinhood`,
    content: [t("testimonials.tenev.quote1"), t("testimonials.tenev.quote2")],
    imgSrc: vladTenev,
  },
]

type Props = {
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("home")
  const tCommon = await getTranslations("common")

  const logos: { src: StaticImageData; alt: string; className?: string }[] = [
    { src: blackRock, alt: tCommon("brand-logo", { name: "BlackRock" }), className: "py-1 translate-y-0.5" },
    { src: coinbase, alt: tCommon("brand-logo", { name: "Coinbase" }), className: "py-0.5" },
    { src: etoro, alt: tCommon("brand-logo", { name: "eToro" }), className: "py-0.5" },
    {
      src: fidelity,
      alt: tCommon("brand-logo", { name: "Fidelity" }),
      className: "invert translate-y-[3px]",
    },
    {
      src: jpMorgan,
      alt: tCommon("brand-logo", { name: "JPMorgan" }),
      className: "py-0.5 translate-y-1.5 invert",
    },
    {
      src: morganStanley,
      alt: tCommon("brand-logo", { name: "Morgan Stanley" }),
      className: "h-[18px] invert opacity-80",
    },
    { src: mastercard, alt: tCommon("brand-logo", { name: "Mastercard" }), className: "translate-y-[3px]" },
    { src: robinhood, alt: tCommon("brand-logo", { name: "Robinhood" }), className: "translate-y-1" },
    {
      src: standardChartered,
      alt: tCommon("brand-logo", { name: "Standard Chartered" }),
      className: "scale-120 mx-4 translate-y-1",
    },
    { src: swift, alt: tCommon("brand-logo", { name: "Swift" }), className: "translate-y-[3px]" },
    { src: ubs, alt: tCommon("brand-logo", { name: "UBS" }), className: "translate-y-[3px]" },
  ]

  const uptime = getTimeSinceGenesis()

  const [
    beaconChainData,
    ethPrice,
    defiTvlAllCurrentData,
    stablecoinAssetMarketShareData,
    rwaAssetMarketShareData,
    securitizeAumData,
    baseTvlData,
    stablecoinSupplyData,
  ] = await Promise.all([
    fetchBeaconChain(),
    fetchEtherPrice(),
    fetchDefiTvlAllCurrent(),
    fetchAssetMarketShare("STABLECOINS"),
    fetchAssetMarketShare("RWAS"),
    fetchSecuritizeAum(),
    fetchBaseTvl(),
    fetchStablecoinSupply(),
  ])

  const metrics: Metric[] = [
    {
      value: formatDuration(locale, uptime, { maxDecimalPoints: 1 }),
      label: t("numbers.uptime-label"),
      source: t("numbers.genesis-source", {
        date: formatDateMonthDayYear(locale, MAINNET_GENESIS),
      }),
      lastUpdated: formatDateMonthDayYear(locale, Date.now()),
    },
    {
      value: formatLargeCurrency(
        locale,
        beaconChainData.data.totalStakedEther * ethPrice.data.usd
      ),
      label: t("numbers.network-security-label", {
        ethAmount: formatLargeNumber(
          locale,
          beaconChainData.data.totalStakedEther
        ),
      }),
      lastUpdated: formatDateMonthDayYear(locale, beaconChainData.lastUpdated),
      ...beaconChainData.sourceInfo,
    },
    {
      value: formatLargeCurrency(
        locale,
        stablecoinAssetMarketShareData.data.assetValue.mainnet
      ),
      label: (
        <>
          {t("numbers.stablecoin-tvl-label")}
          <br />
          <span className="font-medium">
            {t("numbers.stablecoin-market-share", {
              percent: formatPercent(
                locale,
                stablecoinAssetMarketShareData.data.marketShare.mainnet
              ),
            })}
          </span>
        </>
      ),
      lastUpdated: formatDateMonthDayYear(
        locale,
        stablecoinAssetMarketShareData.lastUpdated
      ),
      ...stablecoinAssetMarketShareData.sourceInfo,
    },
    {
      value: formatLargeCurrency(
        locale,
        defiTvlAllCurrentData.data.mainnetDefiTvl
      ),
      label: (
        <>
          {t("numbers.defi-tvl-label")}
          <br />{" "}
          <span className="font-medium">
            {t("numbers.defi-market-share", {
              percent: formatPercent(
                locale,
                defiTvlAllCurrentData.data.mainnetDefiMarketshare +
                  defiTvlAllCurrentData.data.layer2DefiMarketshare
              ),
            })}
          </span>
        </>
      ),
      lastUpdated: formatDateMonthDayYear(
        locale,
        defiTvlAllCurrentData.lastUpdated
      ),
      ...defiTvlAllCurrentData.sourceInfo,
    },
  ]

  const platforms: ({
    name: string
    imgSrc: StaticImageData
    className?: string
    imgClassName?: string
  } & Metric)[] = [
    {
      name: "BlackRock",
      imgSrc: blackRockSvg,
      label: t("platforms.blackrock.label"),
      value: t("platforms.blackrock.value", {
        amount: formatLargeCurrency(
          locale,
          securitizeAumData.data.currentValue
        ),
      }),
      lastUpdated: formatDateMonthDayYear(
        locale,
        securitizeAumData.lastUpdated
      ),
      ...securitizeAumData.sourceInfo,
    },
    {
      name: "Coinbase",
      imgSrc: coinbaseSvg,
      label: t("platforms.coinbase.label"),
      value: t("platforms.coinbase.value", {
        amount: formatLargeCurrency(locale, baseTvlData.data.baseTvl),
      }),
      lastUpdated: formatDateMonthDayYear(locale, baseTvlData.lastUpdated),
      ...baseTvlData.sourceInfo,
    },
    {
      name: "Fidelity",
      imgSrc: fidelity,
      label: t("platforms.fidelity.label"),
      value: t("platforms.fidelity.value", {
        amount: formatLargeCurrency(
          locale,
          stablecoinSupplyData.data.FIDD
        ),
      }),
      lastUpdated: formatDateMonthDayYear(
        locale,
        stablecoinSupplyData.lastUpdated
      ),
      ...stablecoinSupplyData.sourceInfo,
    },
    {
      name: "JPMorgan",
      imgSrc: jpMorgan,
      label: t("platforms.jpmorgan.label"),
      value: t("platforms.jpmorgan.value"),
      source: t("platforms.jpmorgan.source"),
      sourceHref:
        "https://am.jpmorgan.com/us/en/asset-management/adv/about-us/media/press-releases/jp-morgan-asset-management-launches-its-first-tokenized-money-market-fund/",
      lastUpdated: formatDateMonthDayYear(locale, "2025-12-15"),
    },
  ]

  // Tokenized assets market share (mainnet + L2)
  const tokenizationShare = formatPercent(
    locale,
    rwaAssetMarketShareData.data.marketShare.mainnet +
      rwaAssetMarketShareData.data.marketShare.layer2,
    false,
    2
  )

  // Years of network effects (from genesis)
  const yearsOfNetworkEffects = formatDuration(locale, uptime) + "+"

  // DeFi multiplier vs next largest
  const defiMultiplier = formatMultiplier(
    locale,
    defiTvlAllCurrentData.data.runnerUpMultiplier,
    2
  )

  // Variables for leader description interpolation
  const leaderDescriptionVars: Record<string, Record<string, string>> = {
    resilience: {
      uptime: formatDuration(locale, uptime, { maxDecimalPoints: 1 }),
    },
    liquidity: {
      tokenizationShare,
      yearsOfNetworkEffects,
      defiMultiplier,
    },
  }

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero
        data-label="hero"
        heading={t("hero.heading")}
        shape="eth-glyph"
        className="css-primary-invert"
        beneath={
          <>
            <InfiniteSlider
              speedOnHover={16}
              gap={56}
              className="overflow-visible"
            >
              {logos.map(({ src, alt, className }) => (
                <div key={alt} className="flex h-6 items-center">
                  <Image
                    src={src}
                    alt={alt}
                    className={cn("h-6 w-auto grayscale", className)}
                  />
                </div>
              ))}
            </InfiniteSlider>
          </>
        }
      >
        <p className="text-muted max-w-md text-xl">{t("hero.tagline")}</p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-20 px-4 py-10 sm:px-10 sm:py-20 md:space-y-40">
        <section id="numbers" className="flex gap-20 max-lg:flex-col">
          <div className="flex flex-col gap-y-10 max-lg:items-center">
            <h2 className="text-h3-mobile sm:text-h3 max-lg:mx-auto max-lg:text-center lg:max-w-md">
              {t("numbers.heading")}
            </h2>
            <LinkWithArrow
              href="/data-hub"
              className="css-secondary w-fit text-lg"
            >
              {tCommon("live-data")}
            </LinkWithArrow>
          </div>
          <div className="grid grid-cols-[auto_auto] gap-14 max-sm:grid-cols-2">
            {metrics.map(({ label, ...props }, idx) => (
              <BigNumber key={idx} {...props}>
                {label}
              </BigNumber>
            ))}
          </div>
        </section>

        <section id="digital-assets" className="w-full space-y-7">
          <div className="space-y-2 text-center">
            <h2>{t("use-cases.heading")}</h2>
            <p className="text-muted-foreground text-xl tracking-[0.025rem]">
              {t("use-cases.subheading")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card variant="flex-height">
              <CardContent>
                <div className="size-37 shrink-0 overflow-hidden p-2.5">
                  <MaskedParallelsIcon
                    className="text-secondary-foreground"
                    maskShape={
                      <BadgeDollarSignFillInvert className="size-full text-white" />
                    }
                  />
                </div>
                <CardLabel variant="large">{t("use-cases.rwa.label")}</CardLabel>
                <CardDescription>
                  {t("use-cases.rwa.description")}
                </CardDescription>
              </CardContent>
              <LinkWithArrow href="/rwa" className="css-secondary max-md:mt-6">
                {t("use-cases.rwa.link")}
              </LinkWithArrow>
            </Card>
            <Card variant="flex-height">
              <CardContent>
                <div className="size-37 shrink-0 overflow-hidden p-2.5">
                  <MaskedParallelsIcon
                    className="text-secondary-foreground"
                    maskShape={<CircleRing className="size-full text-white" />}
                  />
                </div>
                <CardLabel variant="large">
                  {t("use-cases.defi.label")}
                </CardLabel>
                <CardDescription>
                  {t("use-cases.defi.description")}
                </CardDescription>
              </CardContent>
              <LinkWithArrow href="/defi" className="css-secondary max-md:mt-6">
                {t("use-cases.defi.link")}
              </LinkWithArrow>
            </Card>
            <Card variant="flex-height">
              <CardContent>
                <div className="size-37 shrink-0 p-2.5">
                  <MaskedParallelsIcon
                    className="text-secondary-foreground"
                    maskShape={<LockFill className="size-full text-white" />}
                  />
                </div>
                <CardLabel variant="large">
                  {t("use-cases.privacy.label")}
                </CardLabel>
                <CardDescription>
                  {t("use-cases.privacy.description")}
                </CardDescription>
              </CardContent>
              <LinkWithArrow
                href="/privacy"
                className="css-secondary max-md:mt-6"
              >
                {t("use-cases.privacy.link")}
              </LinkWithArrow>
            </Card>
            <Card variant="flex-height">
              <CardContent>
                <div className="size-37 shrink-0 overflow-hidden p-2.5">
                  <MaskedParallelsIcon
                    className="text-secondary-foreground"
                    maskShape={<Layers2Fill className="size-full text-white" />}
                  />
                </div>
                <CardLabel variant="large">
                  {t("use-cases.layer2.label")}
                </CardLabel>
                <CardDescription>
                  {t("use-cases.layer2.description")}
                </CardDescription>
              </CardContent>
              <LinkWithArrow
                href="/layer-2"
                className="css-secondary max-md:mt-6"
              >
                {t("use-cases.layer2.link")}
              </LinkWithArrow>
            </Card>
          </div>
        </section>

        <div>
          <section id="leader" className="space-y-12">
            <div className="space-y-4 text-center">
              <h2>
                {t("leader.heading-line1")}
                <br />
                {t("leader.heading-line2")}
              </h2>
              <p className="text-muted-foreground mx-auto max-w-4xl text-xl font-medium">
                {t("leader.intro")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-16">
              {(
                [
                  { key: "resilience", span: "lg:col-span-6" },
                  { key: "settlement", span: "lg:col-span-4" },
                  { key: "neutrality", span: "lg:col-span-6" },
                  { key: "liquidity", span: "lg:col-span-5" },
                  { key: "programmability", span: "lg:col-span-6" },
                  { key: "composability", span: "lg:col-span-5" },
                ] as const
              ).map(({ key, span }) => (
                <div key={key} className={cn("bg-card space-y-3 p-8", span)}>
                  <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                    {t(`leader.${key}.label`)}
                  </h3>
                  <p className="text-muted-foreground font-medium">
                    {t(
                      `leader.${key}.description`,
                      leaderDescriptionVars[key]
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="my-20 md:my-40" />

          <section id="comparison" className="space-y-12">
            <h2 className="text-center">{t("comparison.heading")}</h2>

            <ComparisonTable
              columns={[
                {
                  key: "ethereum",
                  label: t("comparison.ethereum"),
                  highlighted: true,
                },
                { key: "l1Alt", label: t("comparison.l1-alt") },
                { key: "privateDlt", label: t("comparison.private-dlt") },
                { key: "traditional", label: t("comparison.traditional") },
              ]}
              rows={(
                [
                  { key: "settlement", label: "settlement-finality" },
                  { key: "audit", label: "auditability" },
                  { key: "neutrality", label: "neutrality" },
                  { key: "composability", label: "composability" },
                ] as const
              ).map(({ key, label }) => ({
                label: t(`comparison.${label}`),
                cells: {
                  ethereum: t(`comparison.ethereum_${key}`),
                  l1Alt: t(`comparison.l1-alt_${key}`),
                  privateDlt: t(`comparison.private-dlt_${key}`),
                  traditional: t(`comparison.traditional_${key}`),
                },
              }))}
            />
          </section>

          <hr className="border-muted m-10 md:my-20" />

          <section id="who" className="flex gap-10 max-lg:flex-col md:gap-20">
            <div className="flex flex-col gap-y-2 max-lg:items-center">
              <h2 className="text-h3-mobile sm:text-h3 max-lg:mx-auto max-lg:text-center lg:w-md lg:max-w-md">
                {t("platforms.heading")}
              </h2>
              <p className="text-muted-foreground font-medium">
                {t("platforms.subheading")}
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-x-8 gap-y-8 sm:gap-y-14">
              {platforms.map(
                ({
                  name,
                  imgSrc,
                  label,
                  value,
                  className,
                  imgClassName,
                  ...sourceInfo
                }) => (
                  <div key={name} className={cn("space-y-2", className)}>
                    <h3 className="text-h5 text-foreground sr-only tracking-[0.03rem]">
                      {name}
                    </h3>
                    <Image
                      src={imgSrc}
                      alt={tCommon("brand-logo", { name })}
                      className={cn("h-7 w-auto", imgClassName)}
                    />
                    <p className="text-muted-foreground">{label}</p>
                    <InlineText className="text-muted-foreground font-bold">
                      {value}
                      <SourceInfoTooltip {...sourceInfo} />
                    </InlineText>
                  </div>
                )
              )}
            </div>
          </section>

          <hr className="border-muted m-10 md:my-20" />

          <section
            id="testimonials"
            className="relative flex gap-10 overflow-x-hidden max-lg:flex-col md:gap-20"
          >
            <div className="flex flex-col gap-y-10 max-lg:items-center">
              <h2 className="text-h3-mobile sm:text-h3 max-lg:mx-auto max-lg:text-center lg:w-md lg:max-w-md">
                {t("testimonials.heading")}
              </h2>
            </div>
            <div className="relative w-full min-w-0 overflow-x-hidden">
              <Carousel>
                <CarouselContent>
                  {getTestimonials(t).map(({ name, role, imgSrc, content }) => (
                    <CarouselItem key={name} className="space-y-12">
                      <div className="text-muted-foreground space-y-8 text-xl italic">
                        {content.map((children, idx) => (
                          <p key={idx}>{children}</p>
                        ))}
                      </div>
                      {locale !== "en" && (
                        <p className="text-muted-foreground text-sm">
                          {t("testimonials.translated-from")}
                        </p>
                      )}
                      <div className="flex gap-4">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={imgSrc}
                            alt={tCommon("profile-picture", { name })}
                            fill
                            className="object-cover object-top grayscale"
                            placeholder="blur"
                            sizes="48px"
                            draggable={false}
                          />
                        </div>
                        <div>
                          <p className="font-bold">{name}</p>
                          <p className="font-medium">{role}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselFooter className="gap-12 max-sm:flex-col-reverse">
                  <CarouselIndicator />
                  <CarouselNavigation alwaysShow />
                </CarouselFooter>
              </Carousel>
            </div>
          </section>
        </div>

        <section id="scaling" className="space-y-12 md:space-y-20">
          <div className="flex flex-col items-center gap-y-2 text-center">
            <h2>{t("scaling.heading")}</h2>
            <div className="md:max-w-3xl">{t("scaling.description")}</div>
          </div>
          <ScalingPanel />
        </section>

        <section id="articles" className="space-y-12">
          <div className="flex flex-col items-center">
            <h2>{t("library.heading")}</h2>
            <p className="text-muted-foreground text-xl tracking-[0.025rem]">
              {t("library.subheading")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-16">
            {getLibraryItems(locale)
              .slice(0, 3)
              .map(({ title, imgSrc, date, href }) => (
                <LibraryCard key={title}>
                  <LibraryCardHeader>
                    <LibraryCardImage src={imgSrc} alt="" />
                  </LibraryCardHeader>
                  <LibraryCardTitleLink href={href}>
                    <LibraryCardTitle>{title}</LibraryCardTitle>
                  </LibraryCardTitleLink>
                  <LibraryCardDate>
                    {formatDateMonthDayYear(locale, date)}
                  </LibraryCardDate>
                </LibraryCard>
              ))}
          </div>
          <LinkWithArrow
            href="/library"
            className="css-secondary mx-auto block w-fit text-lg"
          >
            {tCommon("view-all-resources")}
          </LinkWithArrow>
        </section>
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home" })

  return getMetadata({
    slug: "",
    title: t("metadata.title"),
    description: t("metadata.description"),
    image: "/images/og/home.png",
    locale,
  })
}
