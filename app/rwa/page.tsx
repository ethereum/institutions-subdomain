import { Check } from "lucide-react"
import Image, { StaticImageData } from "next/image"
import type { Metadata } from "next/types"

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

import fetchAssetMarketShare from "../_actions/fetchAssetMarketShare"
import fetchAssetValueByAssetIds from "../_actions/fetchAssetValueByAssetIds"
import fetchProtocolsValueBySlug from "../_actions/fetchProtocolsValueBySlug"
import fetchProtocolsValueTotal from "../_actions/fetchProtocolsValueTotal"
import fetchTokenizedTreasuries from "../_actions/fetchTokenizedTreasuries"

import buildings from "@/public/images/banners/buildings.png"
import dai from "@/public/images/logos/tokens/dai.svg"
import fdusd from "@/public/images/logos/tokens/fdusd.svg"
import pyusd from "@/public/images/logos/tokens/pyusd.svg"
import usdc from "@/public/images/logos/tokens/usdc.svg"
import usde from "@/public/images/logos/tokens/usde.svg"
import usds from "@/public/images/logos/tokens/usds.svg"
import usdt from "@/public/images/logos/tokens/usdt.svg"
import usdtb from "@/public/images/logos/tokens/usdtb.svg"

export default async function Page() {
  const [
    stablecoinAssetMarketShareData,
    rwaAssetMarketShareData,
    protocolsValueTotal,
    tokenizedTreasuriesData,
    assetValueByAssetIdsData,
    protocolsValueBySlugData,
  ] = await Promise.all([
    fetchAssetMarketShare("STABLECOINS"),
    fetchAssetMarketShare("RWAS"),
    fetchProtocolsValueTotal(),
    fetchTokenizedTreasuries(),
    fetchAssetValueByAssetIds(),
    fetchProtocolsValueBySlug(),
  ])

  const metrics: Metric[] = [
    {
      label: "Stablecoins on Ethereum L1",
      value: formatLargeCurrency(
        stablecoinAssetMarketShareData.data.assetValue.mainnet
      ),
      lastUpdated: formatDateMonthDayYear(
        stablecoinAssetMarketShareData.lastUpdated
      ),
      ...stablecoinAssetMarketShareData.sourceInfo,
    },
    {
      label: "Stablecoins on Ethereum L2",
      value: formatLargeCurrency(
        stablecoinAssetMarketShareData.data.assetValue.layer2
      ),
      lastUpdated: formatDateMonthDayYear(
        stablecoinAssetMarketShareData.lastUpdated
      ),
      ...stablecoinAssetMarketShareData.sourceInfo,
    },
  ]

  const stablecoins: {
    ticker: string
    issuer: string
    imgSrc: StaticImageData
    href: string
  }[] = [
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
      ticker: "DAI",
      issuer: "MakerDAO",
      imgSrc: dai,
      href: "https://makerdao.com/",
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
      ticker: "USDtb",
      issuer: "Ethena, Blackrock, & Securitize",
      imgSrc: usdtb,
      href: "https://usdtb.money/",
    },
    {
      ticker: "FDUSD",
      issuer: "First Digital",
      imgSrc: fdusd,
      href: "https://firstdigitallabs.com/fdusd",
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
      valuation: formatLargeCurrency(assetValueByAssetIdsData.data.BUIDL),
      description: "BlackRock USD Institutional Digital Liquidity Fund",
      issuer: "BlackRock & Securitize",
      metricHref: "https://app.rwa.xyz/assets/BUIDL",
      visitHref: "https://securitize.io/blackrock/buidl",
      ...assetValueByAssetIdsData.sourceInfo,
      lastUpdated: formatDateMonthDayYear(assetValueByAssetIdsData.lastUpdated),
    },
    {
      header: "USTB",
      valuation: formatLargeCurrency(assetValueByAssetIdsData.data.USTB),
      description: "Superstate Short Duration US Government Securities Fund",
      issuer: "Superstate",
      metricHref: "https://app.rwa.xyz/assets/USTB",
      visitHref: "https://superstate.com/assets/ustb",
      ...assetValueByAssetIdsData.sourceInfo,
      lastUpdated: formatDateMonthDayYear(assetValueByAssetIdsData.lastUpdated),
    },
    {
      header: "OUSG",
      valuation: formatLargeCurrency(assetValueByAssetIdsData.data.OUSG),
      description: "Ondo Short-Term US Government Bond Fund",
      issuer: "Ondo",
      metricHref: "https://app.rwa.xyz/assets/OUSG",
      visitHref: "https://ondo.finance/ousg",
      ...assetValueByAssetIdsData.sourceInfo,
      lastUpdated: formatDateMonthDayYear(assetValueByAssetIdsData.lastUpdated),
    },
  ]

  const creditPlatforms: AssetDetails[] = [
    {
      header: "Centrifuge",
      valuation: formatLargeCurrency(protocolsValueBySlugData.data.centrifuge),
      description: "Active loans on Ethereum + L2s",
      metricHref: "https://app.rwa.xyz/platforms/centrifuge",
      visitHref: "https://centrifuge.io/",
      ...protocolsValueBySlugData.sourceInfo,
      lastUpdated: formatDateMonthDayYear(protocolsValueBySlugData.lastUpdated),
    },
    {
      header: "Maple Finance",
      valuation: formatLargeCurrency(protocolsValueBySlugData.data.maple),
      description: "Active loans on Ethereum + L2s",
      metricHref: "https://app.rwa.xyz/platforms/maple",
      visitHref: "https://maple.finance/",
      ...protocolsValueBySlugData.sourceInfo,
      lastUpdated: formatDateMonthDayYear(protocolsValueBySlugData.lastUpdated),
    },
    {
      header: "Midas mF-ONE",
      valuation: formatLargeCurrency(assetValueByAssetIdsData.data.mF_ONE),
      description: "Active loans on Ethereum + L2s",
      metricHref: "https://app.rwa.xyz/assets/mF-ONE",
      visitHref: "https://midas.app/mfone",
      ...assetValueByAssetIdsData.sourceInfo,
      lastUpdated: formatDateMonthDayYear(assetValueByAssetIdsData.lastUpdated),
    },
  ]

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero
        heading="Stablecoins & Real-World Assets on Ethereum"
        shape="badge-dollar-sign"
      >
        Ethereum is the dominant network for asset tokenization, home to over
        75% of all tokenized real-world assets (RWAs) and over 60% of global
        stablecoin supply
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-20 px-4 py-10 sm:px-10 sm:py-20 md:space-y-40">
        <section
          id="overview"
          className="flex items-center gap-8 border p-8 max-lg:flex-col"
        >
          <h2 className="sr-only">Real-World Asset and Stablecoin Overview</h2>
          <p className="flex-1 font-medium">
            Institutions tokenize stocks, offer 24/7 settlement, deploy
            programmable cash, launch payment rails, and more, on the liquid,
            open, and resilient ecosystem of Ethereum and its L2s
          </p>
          <div className="flex w-full flex-1 gap-4 max-sm:flex-col">
            {metrics.map(({ label, value, ...sourceInfo }, idx) => {
              const { source, sourceHref } = sourceInfo
              return (
                <Card key={idx} className="flex-1 space-y-2 py-8">
                  <CardLabel className="text-base font-medium tracking-normal">
                    {label}
                  </CardLabel>
                  <AnimatedNumberInView className="text-big font-bold tracking-[0.055rem]">
                    {value}
                  </AnimatedNumberInView>
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
              Ethereum as Financial Market Infrastructure
            </h2>
            <p className="text-muted-foreground font-medium">
              Ethereum hosts the largest, most connected stablecoin ecosystem
              for payments, treasury, and settlement: plugging straight into
              wallets, exchanges, and DeFi
            </p>
            <ul className="max-w-prose space-y-4 font-medium">
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Depth
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  Ethereum mainnet hosts the majority of all onchain stablecoins
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Scale
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  Ethereum&apos;s Layer 2s add low-fee rails for retail and
                  high-frequency flows
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Cash-like settlement
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  24/7 dollar-denominated settlement at internet speed
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Compliance
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  Programmable settlement for compliance, disclosures, and
                  auditability
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Onchain yield
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  Access familiar instruments, like T-bills and short-duration
                  products
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

        <section id="stablecoins" className="space-y-8">
          <div className="space-y-2">
            <h2>Stablecoins on Ethereum</h2>
            <p className="text-muted-foreground font-medium">
              Total stablecoin market cap on Ethereum L1:{" "}
              <InlineText className="text-foreground font-bold">
                {formatLargeCurrency(
                  stablecoinAssetMarketShareData.data.assetValue.mainnet
                )}
                <SourceInfoTooltip
                  lastUpdated={formatDateMonthDayYear(
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
                <p className="font-medium">By {issuer}</p>
                <p className="text-secondary-foreground mt-6 mb-0">
                  Visit{" "}
                  <span className="group-hover:animate-x-bounce inline-block">
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section id="rwas" className="space-y-8">
          <div className="space-y-2">
            <h2>Real-World Assets (RWAs) on Ethereum</h2>
            <p className="text-muted-foreground font-medium">
              Total RWA sector on Ethereum L1:{" "}
              <InlineText className="text-foreground font-bold">
                {formatLargeCurrency(
                  rwaAssetMarketShareData.data.assetValue.mainnet
                )}
                <SourceInfoTooltip
                  lastUpdated={formatDateMonthDayYear(
                    rwaAssetMarketShareData.lastUpdated
                  )}
                  {...rwaAssetMarketShareData.sourceInfo}
                />
              </InlineText>
            </p>
          </div>

          <div className="grid grid-cols-1 grid-rows-8 gap-4 sm:grid-cols-2 sm:grid-rows-4 lg:grid-cols-4 lg:grid-rows-2">
            <div className="bg-secondary-foreground text-secondary space-y-2 p-8">
              <h3 className="text-xl font-bold tracking-[0.025rem]">
                Tokenized Treasuries & Cash-Equivalents
              </h3>
              <p className="text-big font-bold tracking-[0.055rem]">
                {formatLargeCurrency(
                  tokenizedTreasuriesData.data.totalTreasuries
                )}
              </p>
              <InlineText className="text-muted font-medium">
                sector on Ethereum + L2s
                <SourceInfoTooltip
                  lastUpdated={formatDateMonthDayYear(
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
                    <p className="text-muted-foreground font-medium">
                      {description}
                    </p>
                    {issuer && (
                      <p className="text-muted-foreground mt-6 font-medium">
                        By {issuer}
                      </p>
                    )}
                  </div>
                  <LinkWithArrow
                    href={visitHref}
                    className="css-secondary block"
                  >
                    Visit
                  </LinkWithArrow>
                </Card>
              )
            )}

            <div className="bg-secondary-foreground text-secondary space-y-2 p-8">
              <h3 className="text-xl font-bold tracking-[0.025rem]">
                Private Credit & Structured Credit
              </h3>
              <p className="text-big font-bold tracking-[0.055rem]">
                {formatLargeCurrency(
                  protocolsValueTotal.data.totalPrivateCredit
                )}
              </p>
              <InlineText className="text-muted font-medium">
                sector on Ethereum + L2s
                <SourceInfoTooltip
                  lastUpdated={formatDateMonthDayYear(
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
                    <p className="text-muted-foreground font-medium">
                      {description}
                    </p>
                    {issuer && (
                      <p className="text-muted-foreground mt-6 font-medium">
                        By {issuer}
                      </p>
                    )}
                  </div>
                  <LinkWithArrow
                    href={visitHref}
                    className="css-secondary block"
                  >
                    Visit
                  </LinkWithArrow>
                </Card>
              )
            )}
          </div>
        </section>

        <section id="why-ethereum" className="space-y-16">
          <div className="flex flex-col items-center gap-y-8 text-center">
            <h2 className="text-h3-mobile sm:text-h3 max-w-3xl leading-tight">
              Why Ethereum for Financial Market Infrastructure
            </h2>
            <p className="text-muted-foreground max-w-4xl font-medium">
              <strong>Credible settlement, global reach.</strong> Ethereum pairs
              a maximally-neutral L1 settlement layer with L2 execution
              environments that deliver scale and cost efficiency, so
              institutions can move cash-like value and short-duration assets
              with auditability and programmatic controls.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="p-10">
              <h3 className="text-h4">
                Ethereum L1
                <br />
                The settlement & liquidity layer
              </h3>

              <hr className="my-6" />

              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">Finality & Credible Neutrality</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  High-value settlement, state roots for rollups, and durable
                  records institutions can audit and attest against
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">Security</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  Assets can be stored in an environment that is built to
                  withstand major catastrophes and geopolitical tensions
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">Risk Gating</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  Keep complex or experimental logic off L1; use it for final
                  settlement, collateral custody, and proofs
                </div>
              </div>
            </Card>

            <Card className="p-10">
              <h3 className="text-h4">
                Ethereum&apos;s L2s
                <br />
                The Execution and Scaling Layer
              </h3>

              <hr className="my-6" />

              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">Throughput & UX</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  Rollups process transactions off-chain, inherit L1 security,
                  and deliver low fees suitable for payments, market-making, and
                  high-frequency flows
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">Configurable</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  L2s can add compliance features, like allowlisting or
                  KYC&apos;d pools, while remaining non-custodial and settling
                  to L1
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">Specialization</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  Multiple L2s let institutions segregate workloads, such as
                  retail payments vs. treasury ops, without fragmenting trust,
                  because settlement reconciles on L1
                </div>
              </div>
            </Card>
          </div>
        </section>
      </article>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({
    slug: "rwa",
    title: "Stablecoins & Asset Tokenization | RWAs on Ethereum",
    description:
      "Ethereum is the dominant choice for tokenizing assets and issuing stablecoins. Explore the network for 24/7 settlement, programmable cash, and onchain yield.",
    image: "/images/og/rwa.png",
  })
}
