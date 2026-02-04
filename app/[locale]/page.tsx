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
  formatPercent,
} from "@/lib/utils/number"
import { formatDuration } from "@/lib/utils/time"

import { MAINNET_GENESIS } from "@/lib/constants"

import { libraryItems } from "./library/data"

import fetchAssetMarketShare from "@/app/_actions/fetchAssetMarketShare"
import fetchBaseTvl from "@/app/_actions/fetchBaseTvl"
import fetchBeaconChain from "@/app/_actions/fetchBeaconChain"
import fetchDexVolume from "@/app/_actions/fetchDexVolume"
import fetchEtherPrice from "@/app/_actions/fetchEtherPrice"
import fetchSecuritizeAum from "@/app/_actions/fetchSecuritizeAum"
import fetchDefiTvlAllCurrent from "@/app/_actions/fetchTvlDefiAllCurrent"
import { getTimeSinceGenesis } from "@/app/_actions/getTimeSinceGenesis"
import { type Locale, routing } from "@/i18n/routing"
import blackRock from "@/public/images/logos/institutions/black-rock.png"
import blackRockSvg from "@/public/images/logos/institutions/black-rock.svg"
import citi from "@/public/images/logos/institutions/citi.png"
import coinbase from "@/public/images/logos/institutions/coinbase.png"
import coinbaseSvg from "@/public/images/logos/institutions/coinbase.svg"
import etoro from "@/public/images/logos/institutions/etoro.png"
import etoroSvg from "@/public/images/logos/institutions/etoro.svg"
import fidelity from "@/public/images/logos/institutions/fidelity.png"
import jpMorgan from "@/public/images/logos/institutions/jp-morgan.svg"
import mastercard from "@/public/images/logos/institutions/mastercard.png"
import robinhood from "@/public/images/logos/institutions/robinhood.png"
import sony from "@/public/images/logos/institutions/sony.png"
import standardChartered from "@/public/images/logos/institutions/standard-chartered.svg"
import swift from "@/public/images/logos/institutions/swift.png"
import ubs from "@/public/images/logos/institutions/ubs.png"
import visaSvg from "@/public/images/logos/institutions/visa.svg"
import geoffreyKendrick from "@/public/images/profiles/geoffrey-kendrick.jpeg"
import robertMitchnick from "@/public/images/profiles/robert-mitchnick.png"
import tomZschach from "@/public/images/profiles/tom-zschach.png"
import vladTenev from "@/public/images/profiles/vlad-tenev.png"

const logos: { src: StaticImageData; alt: string; className?: string }[] = [
  { src: blackRock, alt: "BlackRock logo", className: "py-1 translate-y-0.5" },
  { src: citi, alt: "Citi logo", className: "-translate-y-px" },
  { src: coinbase, alt: "Coinbase logo", className: "py-0.5" },
  { src: etoro, alt: "eToro logo", className: "py-0.5" },
  {
    src: fidelity,
    alt: "Fidelity logo",
    className: "brightness-75 translate-y-[3px]",
  },
  { src: jpMorgan, alt: "JPMorgan logo", className: "py-0.5 translate-y-1.5" },
  { src: mastercard, alt: "Mastercard logo", className: "translate-y-[3px]" },
  { src: robinhood, alt: "Robinhood logo", className: "translate-y-1" },
  { src: sony, alt: "Sony logo", className: "py-[5px] translate-y-[3px]" },
  {
    src: standardChartered,
    alt: "Standard Chartered logo",
    className: "scale-120 mx-4 translate-y-1",
  },
  { src: swift, alt: "Swift logo", className: "translate-y-[3px]" },
  { src: ubs, alt: "UBS logo", className: "translate-y-[3px]" },
]

const testimonials: {
  name: string
  role: string
  content: string[]
  imgSrc: StaticImageData
}[] = [
  {
    name: "Geoffrey Kendrick",
    role: "Global Head of Digital Assets Research @ Standard Chartered",
    content: [
      "I think tokenised real-world assets will grow from $34bn today to $300bn over the next 12 months. All of this growth will happen on Ethereum because TradFi trusts Ethereum.",
      "It is irrelevant that other chains are faster or cheaper. Ethereum has been around for over 10 years and has never gone down. For TradFi, trustworthiness trumps marginal speed and cost savings every day of the week.",
    ],
    imgSrc: geoffreyKendrick,
  },
  {
    name: "Tom Zschach",
    role: "CIO @ SWIFT",
    content: [
      "Saying Ethereum is the wrong blockchain because it has high gas fees is like saying Amazon shouldn't use the internet because dial-up was slow in 1995.",
      "Banks aren't building on 2015 Ethereum, they're using today's Ethereum stack with tomorrows upgrades.",
    ],
    imgSrc: tomZschach,
  },
  {
    name: "Robert Mitchnick",
    role: "Head of Digital Assets @ BlackRock",
    content: [
      "There was no question that the blockchain that we would start our tokenization on was on Ethereum.",
    ],
    imgSrc: robertMitchnick,
  },
  {
    name: "Vlad Tenev",
    role: "CEO @ Robinhood",
    content: [
      "I believe tokenization is the greatest capital markets innovation since the central limit order book.",
      "The Robinhood Chain is the first Ethereum Layer 2 optimized for real-world assets.",
    ],
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

  const uptime = getTimeSinceGenesis()

  const [
    beaconChainData,
    ethPrice,
    defiTvlAllCurrentData,
    dexVolume,
    rwaAssetMarketShareData,
    stablecoinAssetMarketShareData,
    securitizeAumData,
    baseTvlData,
  ] = await Promise.all([
    fetchBeaconChain(),
    fetchEtherPrice(),
    fetchDefiTvlAllCurrent(),
    fetchDexVolume(),
    fetchAssetMarketShare("RWAS"),
    fetchAssetMarketShare("STABLECOINS"),
    fetchSecuritizeAum(),
    fetchBaseTvl(),
  ])

  const metrics: Metric[] = [
    {
      value: formatDuration(uptime, { maxDecimalPoints: 1 }),
      label: t("numbers.uptimeLabel"),
      source: t("numbers.genesisSource", { date: formatDateMonthDayYear(MAINNET_GENESIS) }),
      lastUpdated: formatDateMonthDayYear(Date.now()),
    },
    {
      value: formatLargeCurrency(
        beaconChainData.data.totalStakedEther * ethPrice.data.usd
      ),
      label: t("numbers.networkSecurityLabel", { ethAmount: formatLargeNumber(beaconChainData.data.totalStakedEther) }),
      lastUpdated: formatDateMonthDayYear(beaconChainData.lastUpdated),
      ...beaconChainData.sourceInfo,
    },
    {
      value: formatLargeCurrency(
        stablecoinAssetMarketShareData.data.assetValue.mainnet
      ),
      label: (
        <>
          {t("numbers.stablecoinTvlLabel")}
          <br />
          <span className="font-medium">
            {t("numbers.stablecoinMarketShare", { percent: formatPercent(stablecoinAssetMarketShareData.data.marketShare.mainnet) })}
          </span>
        </>
      ),
      lastUpdated: formatDateMonthDayYear(
        stablecoinAssetMarketShareData.lastUpdated
      ),
      ...stablecoinAssetMarketShareData.sourceInfo,
    },
    {
      value: formatLargeCurrency(defiTvlAllCurrentData.data.mainnetDefiTvl),
      label: (
        <>
          {t("numbers.defiTvlLabel")}
          <br />{" "}
          <span className="font-medium">
            {t("numbers.defiMarketShare", { percent: formatPercent(
              defiTvlAllCurrentData.data.mainnetDefiMarketshare +
                defiTvlAllCurrentData.data.layer2DefiMarketshare
            ) })}
          </span>
        </>
      ),
      lastUpdated: formatDateMonthDayYear(defiTvlAllCurrentData.lastUpdated),
      ...defiTvlAllCurrentData.sourceInfo,
    },
    {
      value: formatLargeCurrency(dexVolume.data.trailing12moAvgDexVolume),
      label: (
        <>
          {t("numbers.dexVolumeLabel")}
          <br />
          {t("numbers.dexVolumeSubLabel")}
        </>
      ),
      lastUpdated: formatDateMonthDayYear(dexVolume.lastUpdated),
      ...dexVolume.sourceInfo,
    },
  ]

  const platforms: ({
    name: string
    imgSrc: StaticImageData
    className?: string
  } & Metric)[] = [
    {
      name: "BlackRock",
      imgSrc: blackRockSvg,
      label: t("platforms.blackrock.label"),
      value: t("platforms.blackrock.value", { amount: formatLargeCurrency(securitizeAumData.data.currentValue) }),
      lastUpdated: formatDateMonthDayYear(securitizeAumData.lastUpdated),
      ...securitizeAumData.sourceInfo,
    },
    {
      name: "Coinbase",
      imgSrc: coinbaseSvg,
      label: t("platforms.coinbase.label"),
      value: t("platforms.coinbase.value", { amount: formatLargeCurrency(baseTvlData.data.baseTvl) }),
      lastUpdated: formatDateMonthDayYear(baseTvlData.lastUpdated),
      ...baseTvlData.sourceInfo,
    },
    {
      name: "Visa",
      imgSrc: visaSvg,
      label: t("platforms.visa.label"),
      value: t("platforms.visa.value"),
      lastUpdated: formatDateMonthDayYear("2025-10-17T00:00:00Z"),
      source: "Yahoo! Finance",
      sourceHref:
        "https://finance.yahoo.com/news/visa-v-shares-updates-goldman-185036058.html",
    },
    {
      name: "eToro",
      imgSrc: etoroSvg,
      label: t("platforms.etoro.label"),
      value: t("platforms.etoro.value"),
      lastUpdated: formatDateMonthDayYear("2025-10-17T00:00:00Z"),
      source: "eToro",
      sourceHref: "https://go.etoro.com/en/unlocked/withoutboundaries",
    },
  ]

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero
        data-label="hero"
        heading={t("hero.heading")}
        shape="eth-glyph"
        className="css-primary-invert"
        beneath={
          <InfiniteSlider
            speedOnHover={16}
            gap={56}
            className="overflow-visible"
          >
            {logos.map(({ src, alt, className }) => (
              <Image
                key={alt}
                src={src}
                alt={alt}
                className={cn("h-6 w-auto grayscale", className)}
              />
            ))}
          </InfiniteSlider>
        }
      />
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
              {tCommon("liveData")}
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
            <h2>{t("useCases.heading")}</h2>
            <p className="text-muted-foreground text-xl tracking-[0.025rem]">
              {t("useCases.subheading")}
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
                <CardLabel variant="large">{t("useCases.rwa.label")}</CardLabel>
                <CardDescription>
                  {t("useCases.rwa.description")}
                </CardDescription>
              </CardContent>
              <LinkWithArrow href="/rwa" className="css-secondary max-md:mt-6">
                {t("useCases.rwa.link")}
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
                <CardLabel variant="large">{t("useCases.defi.label")}</CardLabel>
                <CardDescription>
                  {t("useCases.defi.description")}
                </CardDescription>
              </CardContent>
              <LinkWithArrow href="/defi" className="css-secondary max-md:mt-6">
                {t("useCases.defi.link")}
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
                <CardLabel variant="large">{t("useCases.privacy.label")}</CardLabel>
                <CardDescription>
                  {t("useCases.privacy.description")}
                </CardDescription>
              </CardContent>
              <LinkWithArrow
                href="/privacy"
                className="css-secondary max-md:mt-6"
              >
                {t("useCases.privacy.link")}
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
                <CardLabel variant="large">{t("useCases.layer2.label")}</CardLabel>
                <CardDescription>
                  {t("useCases.layer2.description")}
                </CardDescription>
              </CardContent>
              <LinkWithArrow
                href="/layer-2"
                className="css-secondary max-md:mt-6"
              >
                {t("useCases.layer2.link")}
              </LinkWithArrow>
            </Card>
          </div>
        </section>

        <div>
          <section
            id="leader"
            className="flex gap-10 max-lg:flex-col md:gap-20"
          >
            <div className="flex flex-col gap-y-10 max-lg:items-center">
              <h2 className="text-h3-mobile sm:text-h3 max-lg:mx-auto max-lg:text-center lg:w-md lg:max-w-md">
                {t("leader.heading")}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-14">
              <CardContent>
                <CardLabel variant="large">{t("leader.resilience.label")}</CardLabel>
                <div className="text-muted-foreground font-medium">
                  {t.rich("leader.resilience.description", {
                    uptime: formatDuration(uptime),
                  })}
                </div>
              </CardContent>
              <CardContent>
                <CardLabel variant="large">{t("leader.flexibility.label")}</CardLabel>
                <div className="text-muted-foreground font-medium">
                  {t("leader.flexibility.description")}
                </div>
              </CardContent>
              <CardContent>
                <CardLabel variant="large">{t("leader.neutrality.label")}</CardLabel>
                <div className="text-muted-foreground font-medium">
                  {t("leader.neutrality.description")}
                </div>
              </CardContent>
              <CardContent>
                <CardLabel variant="large">{t("leader.decentralization.label")}</CardLabel>
                <div className="text-muted-foreground font-medium">
                  {t.rich("leader.decentralization.description", {
                    validatorCount: formatLargeNumber(beaconChainData.data.validatorsCount, {}, 2),
                    securityValue: formatLargeCurrency(beaconChainData.data.totalStakedEther * ethPrice.data.usd),
                  })}
                </div>
              </CardContent>
              <CardContent>
                <CardLabel variant="large">{t("leader.liquidity.label")}</CardLabel>
                <div className="text-muted-foreground font-medium">
                  {t.rich("leader.liquidity.description", {
                    dexVolume: formatLargeCurrency(dexVolume.data.trailing12moAvgDexVolume),
                  })}
                </div>
              </CardContent>
              <CardContent>
                <CardLabel variant="large">{t("leader.tokenization.label")}</CardLabel>
                <div className="text-muted-foreground font-medium">
                  {t.rich("leader.tokenization.description", {
                    rwaMarketShare: formatPercent(
                      rwaAssetMarketShareData.data.marketShare.mainnet +
                        rwaAssetMarketShareData.data.marketShare.layer2
                    ),
                    stablecoinTvl: formatLargeCurrency(
                      stablecoinAssetMarketShareData.data.assetValue.mainnet +
                        stablecoinAssetMarketShareData.data.assetValue.layer2
                    ),
                  })}
                </div>
              </CardContent>
            </div>
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
                ({ name, imgSrc, label, value, className, ...sourceInfo }) => (
                  <div key={name} className={cn("space-y-2", className)}>
                    <h3 className="text-h5 text-foreground sr-only tracking-[0.03rem]">
                      {name}
                    </h3>
                    <Image src={imgSrc} alt={`${name} logo`} className="h-10" />
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
                  {testimonials.map(({ name, role, imgSrc, content }) => (
                    <CarouselItem key={name} className="space-y-12">
                      <div className="text-muted-foreground space-y-8 text-xl italic">
                        {content.map((children, idx) => (
                          <p key={idx}>{children}</p>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={imgSrc}
                            alt={`${name} profile picture`}
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

        {/* <section id="events" className="flex max-lg:flex-col">
          <Image
            src={eventPlaceholder}
            alt="event placeholder"
            placeholder="blur"
            className="w-full shrink-0 object-cover grayscale max-lg:h-80 lg:w-md lg:max-w-md"
          />
          <div className="border-secondary-foreground border p-4 max-sm:mx-6 sm:p-10 sm:max-lg:mx-10 lg:my-10">
            <p className="text-accent-foreground font-bold tracking-[0.02rem]">
              Premier
            </p>
            <h2 className="text-h3-mobile sm:text-h3 mb-6 tracking-[0.055rem]">
              Institutional events
            </h2>
            <p className="mb-12 font-medium">
              <span className="font-bold">
                Step inside the room where decisions are made.
              </span>{" "}
              Our events bring together a handpicked circle of industry
              trailblazers and rising power players. Each gathering features
              insider perspectives from world-class experts followed by high
              value networking designed to spark business opportunities.
            </p>
            <div className="flex flex-wrap gap-4 max-sm:flex-col max-sm:py-4 sm:items-center sm:p-4">
              <div className="bg-primary grid size-22 place-items-center rounded-sm">
                <EthGlyphColor />
              </div>
              <div className="flex-1 shrink-0 space-y-1">
                <h3 className="text-h6 sm:text-nowrap">
                  Ethereum Foundation:
                  <br />
                  Institution dinner
                </h3>
                <p className="text-muted-foreground font-bold tracking-[0.02rem]">
                  Buenos Aires
                </p>
                <p className="text-muted-foreground text-sm font-medium tracking-[0.0175rem]">
                  17.11.2025
                </p>
              </div>
              <LinkWithArrow
                href="#"
                className="css-secondary sm:mx-auto"
              >
                Apply here
              </LinkWithArrow>
            </div>
          </div>
        </section> */}

        <section id="scaling" className="space-y-12 md:space-y-20">
          <div className="flex flex-col items-center gap-y-2 text-center">
            <h2>{t("scaling.heading")}</h2>
            <div className="md:max-w-3xl">
              {t("scaling.description")}
            </div>
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
            {libraryItems.slice(0, 3).map(({ title, imgSrc, date, href }) => (
              <LibraryCard key={title}>
                <LibraryCardHeader>
                  <LibraryCardImage src={imgSrc} alt="" />
                </LibraryCardHeader>
                <LibraryCardTitleLink href={href}>
                  <LibraryCardTitle>{title}</LibraryCardTitle>
                </LibraryCardTitleLink>
                <LibraryCardDate>{date}</LibraryCardDate>
              </LibraryCard>
            ))}
          </div>
          <LinkWithArrow
            href="/library"
            className="css-secondary mx-auto block w-fit text-lg"
          >
            {tCommon("viewAllResources")}
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
