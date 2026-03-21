import Image, { StaticImageData } from "next/image"
import type { Metadata } from "next/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { LastUpdated, Metric, SourceInfo } from "@/lib/types"

import Hero from "@/components/Hero"
import { SourceInfoTooltip } from "@/components/InfoTooltip"
import { AnimatedNumberInView } from "@/components/ui/animated-number"
import { Card, CardLabel, CardSource } from "@/components/ui/card"
import { ComparisonTable } from "@/components/ui/comparison-table"
import { InlineText } from "@/components/ui/inline-text"
import Link, { LinkWithArrow } from "@/components/ui/link"

import { formatDateMonthDayYear } from "@/lib/utils/date"
import { getMetadata } from "@/lib/utils/metadata"
import {
  formatLargeCurrency,
  formatLargeCurrencyRange,
  formatPercentRange,
} from "@/lib/utils/number"

import fetchAssetMarketShare from "@/app/_actions/fetchAssetMarketShare"
import fetchAssetValueByAssetIds from "@/app/_actions/fetchAssetValueByAssetIds"
import fetchProtocolsValueBySlug from "@/app/_actions/fetchProtocolsValueBySlug"
import fetchProtocolsValueTotal from "@/app/_actions/fetchProtocolsValueTotal"
import fetchTokenizedTreasuries from "@/app/_actions/fetchTokenizedTreasuries"
import fetchTotalValueSecured from "@/app/_actions/fetchTotalValueSecured"
import { type Locale, routing } from "@/i18n/routing"
import buildings from "@/public/images/banners/buildings.png"
import aaveLogo from "@/public/images/logos/apps/aave.png"
import centrifugeLogo from "@/public/images/logos/apps/centrifuge.png"
import mapleLogo from "@/public/images/logos/apps/maple.png"
import morphoLogo from "@/public/images/logos/apps/morpho.png"
import buidlUsd from "@/public/images/logos/tokens/buidl-usd.svg"
import eurc from "@/public/images/logos/tokens/eurc.svg"
import fditStar from "@/public/images/logos/tokens/fdit-star.svg"
import fidd from "@/public/images/logos/tokens/fidd.svg"
import kinexysLogo from "@/public/images/logos/tokens/kinexys.svg"
import mfoneLogo from "@/public/images/logos/tokens/mfone.svg"
import pyusd from "@/public/images/logos/tokens/pyusd.svg"
import superstateLogo from "@/public/images/logos/tokens/superstate.svg"
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
      label: t("overview.stablecoins-l1"),
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
      label: t("overview.stablecoins-l2"),
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
      label: t("overview.commodities-share"),
      value: "70%",
      lastUpdated: "",
      source: "",
      sourceHref: "",
    },
    {
      label: t("overview.value-secured"),
      value: formatLargeCurrency(locale, totalValueSecuredData.data.sum),
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
    imgSrc?: StaticImageData
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
      description: t("cards.buidl-desc", { brand: "BlackRock" }),
      imgSrc: buidlUsd,
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
      description: t("cards.ustb-desc", { brand: "Superstate" }),
      imgSrc: superstateLogo,
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
      description: t("cards.mony-desc", { brand: "JPMorgan" }),
      imgSrc: kinexysLogo,
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
      description: t("cards.fdit-desc", { brand: "Fidelity" }),
      imgSrc: fditStar,
      issuer: "Fidelity",
      metricHref: "https://app.rwa.xyz/assets/FDIT",
      visitHref:
        "https://institutional.fidelity.com/app/funds-and-products/9053/fidelity-treasury-digital-fund-onchain-class-fyoxx.html",
      ...assetValueByAssetIdsData.sourceInfo,
      lastUpdated: formatDateMonthDayYear(
        locale,
        assetValueByAssetIdsData.lastUpdated
      ),
    },
  ]

  const categoryBreakdownData: {
    labelKey: string
    tvlEth: [number, number]
    tvlTotal: [number, number]
    ethShare: [number, number]
    examples: { name: string; href?: string }[]
  }[] = [
    {
      labelKey: "treasuries",
      tvlEth: [8.8e9, 9.5e9],
      tvlTotal: [9.1e9, 9.75e9],
      ethShare: [0.93, 0.97],
      examples: [
        {
          name: "BlackRock BUIDL",
          href: "https://securitize.io/blackrock/buidl",
        },
        { name: "Ondo", href: "https://ondo.finance/" },
        {
          name: "Franklin Templeton",
          href: "https://digitalassets.franklintempleton.com/benji/",
        },
      ],
    },
    {
      labelKey: "credit",
      tvlEth: [2.0e9, 2.8e9],
      tvlTotal: [3.0e9, 3.7e9],
      ethShare: [0.7, 0.85],
      examples: [
        { name: "Centrifuge", href: "https://centrifuge.io/" },
        { name: "Maple", href: "https://maple.finance/" },
        { name: "Securitize", href: "https://securitize.io/" },
      ],
    },
    {
      labelKey: "commodities",
      tvlEth: [3.0e9, 3.5e9],
      tvlTotal: [3.7e9, 4.0e9],
      ethShare: [0.8, 0.95],
      examples: [
        { name: "Tether Gold", href: "https://gold.tether.to/" },
        { name: "Paxos Gold", href: "https://paxos.com/paxgold/" },
      ],
    },
    {
      labelKey: "equities",
      tvlEth: [0.8e9, 1.0e9],
      tvlTotal: [1.0e9, 1.3e9],
      ethShare: [0.75, 0.9],
      examples: [
        { name: "Ondo", href: "https://ondo.finance/" },
        { name: "Backed", href: "https://backed.fi/" },
      ],
    },
    {
      labelKey: "real-estate",
      tvlEth: [0.15e9, 0.22e9],
      tvlTotal: [0.24e9, 0.3e9],
      ethShare: [0.6, 0.8],
      examples: [
        {
          name: t("category-breakdown.examples-tokenizes-properties"),
        },
      ],
    },
  ]

  const creditPlatforms: AssetDetails[] = [
    {
      header: "Aave",
      valuation: "",
      imgSrc: aaveLogo,
      description: t("rwas.active-loans"),
      metricHref: "https://defillama.com/protocol/aave",
      visitHref: "https://aave.com/",
    },
    {
      header: "Morpho",
      valuation: "",
      imgSrc: morphoLogo,
      description: t("rwas.active-loans"),
      metricHref: "https://defillama.com/protocol/morpho",
      visitHref: "https://morpho.org/",
    },
    {
      header: "Centrifuge",
      imgSrc: centrifugeLogo,
      valuation: formatLargeCurrency(
        locale,
        protocolsValueBySlugData.data.centrifuge
      ),
      description: t("rwas.active-loans"),
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
      imgSrc: mapleLogo,
      valuation: formatLargeCurrency(
        locale,
        protocolsValueBySlugData.data.maple
      ),
      description: t("rwas.active-loans"),
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
      imgSrc: mfoneLogo,
      valuation: formatLargeCurrency(
        locale,
        assetValueByAssetIdsData.data.mF_ONE
      ),
      description: t("rwas.active-loans"),
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
          <h2 className="sr-only">{t("overview.sr-heading")}</h2>
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
                      <Link href={sourceHref} className="css-secondary" inline>
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
                  {t("infrastructure.depth-desc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("infrastructure.scale")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("infrastructure.scale-desc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("infrastructure.settlement")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("infrastructure.settlement-desc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("infrastructure.compliance")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("infrastructure.compliance-desc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("infrastructure.yield")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("infrastructure.yield-desc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("infrastructure.network-effects")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("infrastructure.network-effects-desc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("infrastructure.cost-savings")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("infrastructure.cost-savings-desc")}
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

          <ComparisonTable
            labelHeader={t("comparison.functions")}
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
                "settlement",
                "resilience",
                "security",
                "dev-base",
                "liquidity",
                "auditability",
                "neutrality",
                "geo-risk",
                "composability",
              ] as const
            ).map((row) => ({
              label: t(`comparison.${row}`),
              cells: {
                ethereum: t(`comparison.ethereum_${row}`),
                l1Alt: t(`comparison.l1-alt_${row}`),
                privateDlt: t(`comparison.private-dlt_${row}`),
                traditional: t(`comparison.traditional_${row}`),
              },
            }))}
          />
        </section>

        <section id="stablecoins" className="space-y-8">
          <div className="space-y-2">
            <h2>{t("stablecoins.heading")}</h2>
            <p className="text-muted-foreground font-medium">
              {t("stablecoins.market-cap")}{" "}
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
            <h2>{t("category-breakdown.heading")}</h2>
            <p className="text-muted-foreground font-medium">
              {t("category-breakdown.description")}
            </p>
          </div>

          <ComparisonTable
            labelHeader={t("category-breakdown.category")}
            labelWidth="160px"
            columns={[
              { key: "tvlEth", label: t("category-breakdown.tvl-eth") },
              { key: "tvlTotal", label: t("category-breakdown.tvl-total") },
              {
                key: "ethShare",
                label: t("category-breakdown.eth-share"),
                highlighted: true,
              },
              { key: "examples", label: t("category-breakdown.examples") },
            ]}
            rows={categoryBreakdownData.map(
              ({ labelKey, tvlEth, tvlTotal, ethShare, examples }) => ({
                label: t(`category-breakdown.${labelKey}`),
                cells: {
                  tvlEth: formatLargeCurrencyRange(locale, ...tvlEth),
                  tvlTotal: formatLargeCurrencyRange(locale, ...tvlTotal),
                  ethShare: `~${formatPercentRange(locale, ...ethShare)}`,
                  examples: examples.map((example, i) => (
                    <span key={example.name}>
                      {i > 0 && ", "}
                      {example.href ? (
                        <Link
                          href={example.href}
                          inline
                          className="css-secondary"
                        >
                          {example.name}
                        </Link>
                      ) : (
                        example.name
                      )}
                    </span>
                  )),
                },
              })
            )}
          />
        </section>

        <section id="rwas" className="space-y-8">
          <div className="space-y-2">
            <h2>{t("rwas.heading")}</h2>
            <p className="text-muted-foreground font-medium">
              {t("rwas.total-sector")}{" "}
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
                {t("rwas.treasuries-sector")}
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
                imgSrc,
                metricHref,
                visitHref,
                ...tooltipProps
              }) => (
                <Card
                  className="flex flex-col justify-between gap-y-6 p-8"
                  key={header}
                >
                  <div className="space-y-2">
                    {imgSrc && (
                      <Image
                        src={imgSrc}
                        alt=""
                        sizes="40px"
                        className="mb-2 size-10"
                      />
                    )}
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
                {t("rwas.private-credit")}
              </h3>
              <p className="text-big font-bold tracking-[0.055rem]">
                {formatLargeCurrency(
                  locale,
                  protocolsValueTotal.data.totalPrivateCredit
                )}
              </p>
              <InlineText className="text-muted font-medium">
                {t("rwas.active-loans")}
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
                imgSrc,
                metricHref,
                visitHref,
                ...tooltipProps
              }) => (
                <Card
                  className="flex flex-col justify-between gap-y-6 p-8"
                  key={header}
                >
                  <div className="space-y-2">
                    {imgSrc && (
                      <Image
                        src={imgSrc}
                        alt=""
                        sizes="40px"
                        className="mb-2 size-10"
                      />
                    )}
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

        <section
          id="why-ethereum"
          className="bg-primary text-primary-foreground -mx-4 px-4 py-16 sm:-mx-10 sm:px-10 md:py-24"
        >
          <div className="max-w-8xl mx-auto grid grid-cols-1 gap-x-32 gap-y-8 md:grid-cols-2 md:items-center">
            <h2 className="text-h3-mobile sm:text-h2 tracking-[0.055rem]">
              {t("why.heading")}
            </h2>
            <div className="space-y-6 text-lg leading-relaxed font-medium text-white/85">
              <p className="text-2xl font-bold text-white">
                {t("why.tagline")}
              </p>
              <p>{t("why.desc1")}</p>
              <p>{t("why.desc2")}</p>
            </div>
          </div>
        </section>

        <section
          id="l2-section"
          className="flex gap-x-32 gap-y-14 max-lg:flex-col"
        >
          <div className="flex-1 space-y-7">
            <h2 className="sm:text-h3 text-h3-mobile tracking-[0.055rem]">
              {t("l2-section.heading")}
            </h2>
            <p className="text-muted-foreground font-medium">
              {t("l2-section.description")}
            </p>
            <LinkWithArrow href="/layer-2" className="css-secondary block">
              {t("l2-section.cta")}
            </LinkWithArrow>
          </div>
          <div className="flex-1">
            <ul className="space-y-4 font-medium">
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("l2-section.throughput")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("l2-section.throughput-desc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("l2-section.configurable")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("l2-section.configurable-desc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("l2-section.specialization")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("l2-section.specialization-desc")}
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
