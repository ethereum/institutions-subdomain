import Image from "next/image"
import type { Metadata } from "next/types"

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

import fetchDexVolume from "../_actions/fetchDexVolume"
import fetchDefiTvlAllCurrent from "../_actions/fetchTvlDefiAllCurrent"

import AppGrid from "./_components/AppGrid"

import buildings from "@/public/images/banners/buildings2.png"

export default async function Page() {
  const defiTvlAllCurrentData = await fetchDefiTvlAllCurrent()
  const dexVolume = await fetchDexVolume()

  const metrics: Metric[] = [
    {
      label: (
        <>
          DeFi <span title="Total Value Locked">TVL</span>
        </>
      ),
      value: formatLargeCurrency(defiTvlAllCurrentData.data.mainnetDefiTvl),
      lastUpdated: formatDateMonthDayYear(defiTvlAllCurrentData.lastUpdated),
      ...defiTvlAllCurrentData.sourceInfo,
    },
    {
      label: (
        <>
          Share of Global DeFi <span title="Total Value Locked">TVL</span>
        </>
      ),
      value: formatPercent(defiTvlAllCurrentData.data.mainnetDefiMarketshare),
      lastUpdated: formatDateMonthDayYear(defiTvlAllCurrentData.lastUpdated),
      ...defiTvlAllCurrentData.sourceInfo,
    },
    {
      value: formatLargeCurrency(dexVolume.data.trailing12moAvgDexVolume),
      label: (
        <>
          24h <span title="Decentralized Exchange">DEX</span> Volume (12-month
          avg)
        </>
      ),
      lastUpdated: formatDateMonthDayYear(dexVolume.lastUpdated),
      ...dexVolume.sourceInfo,
    },
    {
      label: (
        <>
          <span title="Total Value Locked">TVL</span> vs. Next-Largest Ecosystem
        </>
      ),
      value: formatMultiplier(defiTvlAllCurrentData.data.runnerUpMultiplier),
      lastUpdated: formatDateMonthDayYear(defiTvlAllCurrentData.lastUpdated),
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
      heading: "Monetary Authority of Singapore & J.P. Morgan",
      description:
        "Live foreign exchange transaction executed via smart contract-based liquidity pool on Polygon L2 mainnet",
      year: "2022",
      href: "https://www.jpmorgan.com/insights/payments/wallets/institutional-defi",
    },
    {
      heading: "Siemens",
      description:
        "€60M digital bond issued onchain, sold directly to investors without engaging central securities depositories",
      year: "2023",
      href: "https://press.siemens.com/global/en/pressrelease/siemens-issues-first-digital-bond-blockchain",
    },
    {
      heading: "Visa",
      description:
        "Visa Tokenized Asset Platform (VTAP) launched for financial institutions to issue fiat-backed ERC-20 tokens on Ethereum",
      year: "2024",
      href: "https://investor.visa.com/news/news-details/2024/Visa-Introduces-the-Visa-Tokenized-Asset-Platform/default.aspx",
    },
    {
      heading: "Société Générale",
      description:
        "Euro and dollar stablecoins integrated with Uniswap and Morpho, for institutional clients to swap, lend, and borrow onchain",
      year: "2025",
      href: "https://www.dlnews.com/articles/defi/societe-generale-taps-uniswap-and-morpho-in-defi-lending-push/",
    },
  ]

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero heading="The Home of Decentralized Finance" shape="coins">
        <p>
          Ethereum introduced the world to decentralized finance (DeFi): open
          financial systems built on smart contracts.
        </p>
        <p>
          100% uptime, battle-tested and secure infrastructure, and the deepest
          liquidity layer of any blockchain—Ethereum is for DeFi.
        </p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-10 px-4 py-20 sm:px-10 sm:py-20 md:space-y-40">
        <section
          id="metrics"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-12 xl:grid-cols-4"
        >
          <h2 className="sr-only">DeFi Ecosystem Overview</h2>
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

        <section
          id="primitives"
          className="flex gap-x-32 gap-y-14 max-lg:flex-col"
        >
          <div className="flex-1 space-y-7">
            <h2 className="text-h3-mobile sm:text-h3 max-w-xl tracking-[0.055rem]">
              Ethereum is the Platform for DeFi Primitives
            </h2>
            <p className="text-muted-foreground max-w-xl font-medium">
              Ethereum&apos;s battle-tested, always-on infrastructure secures
              the largest pool of digital assets and liquidity, powered by the
              most developers and the broadest blockchain ecosystem. Ethereum
              doesn&apos;t lock users into a single chain, fostering a unified,
              global ecosystem where innovation and liquidity compound.
            </p>
            <ul className="max-w-prose space-y-4 font-medium">
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Open standards
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  Ethereum&apos;s shared EVM, token, and smart contract
                  standards provide interoperability across the entire DeFi
                  ecosystem
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Deep liquidity
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  Ethereum has the deepest DeFi liquidity of any blockchain,
                  hosting a single, efficient, global marketplace for digital
                  assets
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Composable primitives
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  Open-source building blocks and protocols act as &apos;money
                  legos&apos; that developers can combine to build sophisticated
                  products
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Permissionless innovation
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  Anyone can build or access new DeFi instruments, unlocking a
                  dynamic landscape of innovation without gatekeepers
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
              className="object-cover object-center grayscale"
              sizes="(max-width: 1024px) 100vw, 536px"
            />
          </div>
        </section>

        <section id="innovation" className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-h3-mobile sm:text-h3">
              DeFi Powers Enterprise Innovation
            </h2>
            <p className="text-muted-foreground font-medium">
              Institutions build on Ethereum&apos;s open DeFi primitives to
              advance transparent, efficient, and accessible tools for a global
              financial system
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
              Ethereum&apos;s DeFi Ecosystem
            </h2>
            <p className="text-muted-foreground font-medium">
              A small selection of DeFi applications that run on Ethereum and
              its Layer 2 networks
            </p>
          </div>

          <hr className="border-muted" />

          <AppGrid />
        </section>
      </article>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({
    title: "Decentralized Finance for Institutions | Ethereum DeFi",
    description:
      "Explore Ethereum's DeFi ecosystem, home to  the deepest liquidity onchain. Learn how open standards power enterprise innovation in lending, borrowing & trading.",
    image: "/images/og/defi.png",
  })
}
