import { ReactNode } from "react"
import { Check } from "lucide-react"
import Image, { type StaticImageData } from "next/image"
import type { Metadata } from "next/types"

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

import fetchBaseTvl from "../_actions/fetchBaseTvl"
import fetchBeaconChain from "../_actions/fetchBeaconChain"
import fetchCeloMonthlyStablecoinVolume from "../_actions/fetchCeloMonthlyStablecoinVolume"
import fetchL2MedianTxCost from "../_actions/fetchL2MedianTxCost"
import fetchL2ScalingActivity from "../_actions/fetchL2ScalingActivity"
import fetchL2ScalingSummary from "../_actions/fetchL2ScalingSummary"

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
import zksync from "@/public/images/logos/networks/zksync.png"

type CardItem = {
  heading: string
  description: string
  href: string
  imgSrc: StaticImageData
  ctaLabel?: ReactNode
}

export default async function Page() {
  const l2ScalingSummaryData = await fetchL2ScalingSummary()
  const l2ScalingActivityData = await fetchL2ScalingActivity()
  const l2MedianTxCostData = await fetchL2MedianTxCost()
  const beaconChainData = await fetchBeaconChain()
  const baseTvlData = await fetchBaseTvl()
  const celoMonthlyStablecoinVolumeData =
    await fetchCeloMonthlyStablecoinVolume()

  const metrics: Metric[] = [
    {
      label: <span title="Total Value Locked">TVL Across L2s</span>,
      value: formatLargeCurrency(l2ScalingSummaryData.data.totalTvl),
      lastUpdated: formatDateMonthDayYear(l2ScalingSummaryData.lastUpdated),
      ...l2ScalingSummaryData.sourceInfo,
    },
    {
      label: "Avg Transaction Cost Daily",
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
          Avg <span title="User Operations Per Second">UOPS</span>
        </>
      ),
      value: formatLargeNumber(l2ScalingActivityData.data.uops),
      lastUpdated: formatDateMonthDayYear(l2ScalingActivityData.lastUpdated),
      ...l2ScalingActivityData.sourceInfo,
    },
    {
      label: "Number of L2s",
      value: l2ScalingSummaryData.data.allProjectsCount,
      lastUpdated: formatDateMonthDayYear(l2ScalingSummaryData.lastUpdated),
      ...l2ScalingSummaryData.sourceInfo,
    },
  ]

  const frameworks: CardItem[] = [
    {
      heading: "Arbitrum",
      description:
        "A suite of Ethereum scaling solutions that make it easy to build and use decentralized applications.",
      href: "https://arbitrum.io/",
      imgSrc: arbitrum,
    },
    {
      heading: "Optimism",
      description:
        "The OP Stack is a standardized  development stack to spin up a L2. The Superchain is a network of interoperable OP Stack chains.",
      href: "https://www.optimism.io/",
      imgSrc: optimism,
    },
    {
      heading: "Polygon",
      description:
        "Polygon protocols and scaling technologies are used to build and deploy apps, or launch ZK rollups and validiums as L2s.",
      href: "https://polygon.technology/",
      imgSrc: polygon,
    },
    {
      heading: "ZKSync",
      description:
        "A scaling and privacy engine for Ethereum with a network of interoperable chains, secured by ZK privacy technology.",
      href: "https://www.zksync.io/",
      imgSrc: zksync,
    },
  ]

  const networks: CardItem[] = [
    {
      heading: "Linea",
      description:
        "Linea is a general purpose, EVM equivalent L2, built by Consensys. Allowing use of existing Ethereum tooling and smart contracts with minimal changes.",
      href: "https://linea.build/",
      imgSrc: linea,
    },
    {
      heading: "Starknet",
      description:
        "Starknet is a validity rollup (ZK-Rollup) L2 enabling provable computation using STARK proofs. Focused on high-throughput apps and low-cost transactions, combined with Ethereum's security.",
      href: "https://www.starknet.io/",
      imgSrc: starknet,
    },
    {
      heading: "Base",
      description:
        "Base is a secure, low-cost L2 built on Optimism's OP Stack, offering seamless Ethereum compatibility. It enables fast, scalable transactions while keeping assets and apps fully onchain.",
      href: "https://www.base.org/",
      imgSrc: base,
    },
    {
      heading: "Ink",
      description:
        "Ink is a L2 built by Kraken, focused on bridging centralized finance with onchain applications. Offers accessible DeFi to exchange users, combining L2 scalability with a CEX-native experience.",
      href: "https://inkonchain.com/",
      imgSrc: ink,
    },
    {
      heading: "Unichain",
      description:
        "Unichain is a DeFi-centered L2 built for high-throughput transactions and cross-chain liquidity. Providing a unified environment for financial protocols, combining capital efficiency with rollup security.",
      href: "https://www.unichain.org/",
      imgSrc: unichain,
    },
    {
      heading: "Scroll",
      description:
        "Scroll is a zkEVM-based Layer 2 built for Ethereum compatibility. It enables native deployment of existing smart contracts while maintaining full EVM equivalence and trustless proofs anchored to L1.",
      href: "https://scroll.io/",
      imgSrc: scroll,
    },
  ]

  const caseStudies: (CardItem & Partial<SourceInfo & LastUpdated>)[] = [
    {
      heading: "Ernst & Young",
      description: "Nightfall L2 Platform",
      href: "https://blockchain.ey.com/uploads/Nightfall_FAQ.pdf",
      imgSrc: ey,
      ctaLabel: (
        <>
          90%
          <br />
          Cheaper Transactions
        </>
      ),
    },
    {
      heading: "Coinbase",
      description: "Base L2 Ecosystem",
      href: "https://l2beat.com/scaling/projects/base",
      imgSrc: coinbase,
      ctaLabel: (
        <>
          {formatLargeCurrency(baseTvlData.data.baseTvl)}
          <br />
          Total Value Secured
        </>
      ),
      lastUpdated: formatDateMonthDayYear(baseTvlData.lastUpdated),
      ...baseTvlData.sourceInfo,
    },
    {
      heading: "Deutsche Bank",
      description: "DAMA 2 Permissioned L2",
      href: "https://www.db.com/news/detail/20250618-dama-2-litepaper-institutional-blueprint-for-asset-tokenisation-and-servicing-on-ethereum-layer-2?language_id=1",
      imgSrc: deutscheBank,
      ctaLabel: (
        <>
          $84T
          <br />
          Est. Digital-Native by 2045
        </>
      ),
    },
    {
      heading: "Celo",
      description: "L1 Transitioned to Ethereum L2",
      href: "https://app.artemisanalytics.com/asset/celo?from=assets&tab=metrics&category=KEY_METRICS&metric=STABLECOIN_TRANSFER_VOLUME",
      imgSrc: celo,
      ctaLabel: (
        <>
          {formatLargeCurrency(
            celoMonthlyStablecoinVolumeData.data.celoMonthlyStablecoinVolume
          )}
          <br />
          Monthly Stablecoin Volume
        </>
      ),
      lastUpdated: formatDateMonthDayYear(
        celoMonthlyStablecoinVolumeData.lastUpdated
      ),
      ...celoMonthlyStablecoinVolumeData.sourceInfo,
    },
  ]

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero heading="Ethereum L2s" shape="layers-2">
        <p>
          Layer 2s (L2s) are scalable execution layers built on top of Ethereum.
          Rollups, a primary category of L2, bundle transactions and post data
          back to Ethereum mainnet, allowing them to inherit Ethereum&apos;s
          security and decentralization.
        </p>
        <p>
          Ideal for tokenization, payments, and compliant appchains, L2s can
          offer custom environments, optimized rails, and faster, cheaper
          execution, while relying on Ethereum for finality.
        </p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-20 px-4 py-10 sm:px-10 sm:py-20 md:space-y-40">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-12 xl:grid-cols-4">
          <h2 className="sr-only">Layer 2 Ecosystem Overview</h2>
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
                      />
                    )}
                  </CardSource>
                )}
              </Card>
            )
          )}
        </section>
        <section id="role" className="space-y-8">
          <h2 className="text-h3-mobile sm:text-h3">The Role of L2s</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="p-10">
              <h3 className="text-h4">
                Ethereum L1
                <br />
                The Settlement & Liquidity Layer
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

        <section id="benefits" className="space-y-8">
          <h2 className="text-h3-mobile sm:text-h3">Benefits of L2s</h2>

          <L2BenefitsPanel
            validatorsCount={formatLargeNumber(
              beaconChainData.data.validatorCount,
              {},
              2
            )}
          />
        </section>

        <section id="trust" className="flex gap-x-32 gap-y-14 max-lg:flex-col">
          <div className="flex-1 space-y-8">
            <h2 className="text-h3-mobile sm:text-h3 tracking-[0.055rem]">
              Ethereum as the Trust Layer
            </h2>
            <p className="text-muted-foreground max-w-xl text-xl font-medium tracking-[0.025rem]">
              In a rollup, transactions are executed off-chain but the data is
              published to Ethereum L1
            </p>
            <ul className="max-w-prose space-y-4 font-medium">
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Transparency
                <p className="text-muted-foreground mt-1 text-base font-medium tracking-[0.02rem]">
                  Every user can see the rollup state on the L1
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Data availability
                <p className="text-muted-foreground mt-1 text-base font-medium tracking-[0.02rem]">
                  Even if the L2 sequencer disappears or censors users, the
                  entire history of transactions is accessible and immutable on
                  Ethereum
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Exit window
                <p className="text-muted-foreground mt-1 text-base font-medium tracking-[0.02rem]">
                  Anyone can directly withdraw their assets from the L2 to the
                  L1 by interacting with the L1 smart contract
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Recoverability
                <p className="text-muted-foreground mt-1 text-base font-medium tracking-[0.02rem]">
                  Data availability on the L1 makes user funds recoverable even
                  if the L2 fails, referred to as the “escape hatch”. This is
                  what keeps rollups trust minimized rather than reliant on the
                  L2 operator.
                </p>
              </li>
            </ul>

            <div className="space-y-4">
              <h3 className="text-h5 tracking-[0.03rem]">
                Issuance on L1 (Bridging to L2)
              </h3>
              <p className="text-muted-foreground text-xl font-medium">
                Assets should be issued on the L1 and bridged to the L2
              </p>
              <ul className="space-y-2 font-medium">
                <li className="flex gap-4">
                  <Check className="text-secondary-foreground" />
                  Anchors assets to Ethereum&apos;s most secure, neutral and
                  resilient layer
                </li>
                <li className="flex gap-4">
                  <Check className="text-secondary-foreground" />
                  Guarantees asset redeemability (escape hatch)
                </li>
                <li className="flex gap-4">
                  <Check className="text-secondary-foreground" />
                  Maximizes interoperability and composability across Ethereum
                  ecosystem
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
              Simplified Deployment and Flexibility
            </h2>
            <p className="text-muted-foreground font-medium">
              Choose from robust, audited frameworks to launch your blockchain
              in weeks, not years
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {frameworks.map(({ heading, description, imgSrc, href }) => (
              <Link
                key={heading}
                href={href}
                className="bg-card group flex w-full flex-col justify-between p-6 transition-transform hover:scale-105 hover:transition-transform"
                aria-label={`Visit ${heading}`}
              >
                <div className="space-y-2">
                  <Image src={imgSrc} alt="" sizes="48px" className="size-12" />
                  <h3 className="text-h5">{heading}</h3>
                  <p className="font-medium">{description}</p>
                </div>
                <p className="text-secondary-foreground mt-12 font-bold lg:mt-16">
                  Visit{" "}
                  <span className="group-hover:animate-x-bounce inline-block">
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-h4-mobile sm:text-h4">Deploy on Proven L2s</h3>
            <p className="text-muted-foreground font-medium">
              Build on secure and scalable networks without the operational
              overhead of launching and maintaining your own chain
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4">
            {networks.map(({ heading, description, imgSrc, href }) => (
              <Link
                key={heading}
                href={href}
                className="bg-card group flex w-full flex-col justify-between p-6 transition-transform hover:scale-105 hover:transition-transform"
                aria-label={`Visit ${heading}`}
              >
                <div className="space-y-2">
                  <Image src={imgSrc} alt="" sizes="48px" className="size-12" />
                  <h3 className="text-h5">{heading}</h3>
                  <p className="font-medium">{description}</p>
                </div>
                <p className="text-secondary-foreground mt-12 font-bold lg:mt-16">
                  Visit{" "}
                  <span className="group-hover:animate-x-bounce inline-block">
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section id="cases" className="space-y-8">
          <h2 className="text-h3-mobile sm:text-h3">Case Studies</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {caseStudies.map(
              ({
                heading,
                description,
                imgSrc,
                href,
                ctaLabel,
                ...tooltipProps
              }) => (
                <Link
                  key={heading}
                  href={href}
                  className="bg-card group flex w-full flex-col justify-between p-6 transition-transform hover:scale-105 hover:transition-transform"
                  aria-label={`Visit ${heading}`}
                >
                  <div className="space-y-2">
                    <Image
                      src={imgSrc}
                      alt=""
                      sizes="48px"
                      className="size-12"
                    />
                    <h3 className="text-h5">{heading}</h3>
                    <p className="font-medium">{description}</p>
                  </div>
                  <InlineText className="text-secondary-foreground mt-12 font-bold group-hover:underline lg:mt-16">
                    {ctaLabel || "Visit →"}
                    {tooltipProps.source && (
                      <SourceInfoTooltip {...tooltipProps} />
                    )}
                  </InlineText>
                </Link>
              )
            )}
          </div>
        </section>

        <section id="enterprise" className="space-y-8">
          <h2 className="text-h3-mobile sm:text-h3">L2s for Enterprise</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="p-10">
              <h3 className="text-h4">Use an Existing L2</h3>

              <hr className="my-6" />

              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">Immediate Access</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  Tap into mature ecosystems with large developer communities
                  and liquidity networks
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">Lower Integration Costs</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  Inherit Ethereum&apos;s decentralisation and security—no need
                  to bootstrap infrastructure
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">Regulatory Alignment</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  Many L2s are already building compliance modules suited for
                  financial institutions
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">Production Security</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  Build on live and battle-tested L2 chains, with billions of
                  dollars in value secured
                </div>
              </div>
            </Card>

            <Card className="p-10">
              <h3 className="text-h4">Launch a Custom L2</h3>

              <hr className="my-6" />

              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">Tailored Environments</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  Deploy a private or public rollup using existing stacks,
                  tailored to your specific enterprise needs
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">Custom Features</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  Implement permissioned access, privacy layers, compliance
                  hooks, or internal system integration
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">Shared Security</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  Even private rollups settle to Ethereum, benefiting from its
                  validator set without the cost of building one
                </div>
              </div>
              <div className="grid gap-x-3 gap-y-2 py-6">
                <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                  <Check className="text-secondary-foreground" />
                  <h4 className="text-h6">Faster Time to Market</h4>
                </div>
                <div className="text-muted-foreground col-start-2 font-medium">
                  Build using audited, battle-tested rollup frameworks to deploy
                  in weeks, not years
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
    title: "Ethereum's Layer 2 Ecosystem | Scalable Enterprise Solutions",
    description:
      "Layer 2s offer faster, cheaper execution, ideal for payments, appchains, and tokenization. Learn how L2s help institutions scale without sacrificing security.",
    image: "/images/og/layer-2.png",
  })
}
