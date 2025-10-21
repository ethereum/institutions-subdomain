"use client"

import { Fragment, ReactNode, useState } from "react"

import { TransitionPanel } from "@/components/ui/transition-panel"

import { cn } from "@/lib/utils"

import Link from "../ui/link"

type L2BenefitsPanelProps = {
  validatorsCount: string
}
export function L2BenefitsPanel({ validatorsCount }: L2BenefitsPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const items: {
    title: string
    cards: {
      heading: string
      items: ReactNode[]
    }[]
  }[] = [
    {
      title: "Inherit Ethereum's Decentralization",
      cards: [
        {
          heading: "No Bootstrapping",
          items: [
            "Skip the costly process of building and paying a new validator set",
            "New chains must build decentralization from scratch, a slow, capital-intensive process that can lead to fragile and centralized chains",
            "L2s inherit Ethereum's unmatched decentralization, saving resources and accessing deep economic security",
          ],
        },
        {
          heading: "Shared Security",
          items: [
            <>
              L2s tap into the security of Ethereum&apos;s{" "}
              <Link
                href="https://explorer.rated.network/network?network=mainnet&timeWindow=1d&rewardsMetric=average&geoDistType=all&hostDistType=all&soloProDist=stake"
                inline
                className="css-secondary font-bold"
              >
                {validatorsCount}+ validators
              </Link>
              , paying only usage-based fees.
            </>,
            "Rollups all settle on Ethereum, creating a shared, decentralized security and data availability layer",
          ],
        },
      ],
    },
    {
      title: "Cheaper Security Costs",
      cards: [
        {
          heading: "No Inflation Burden",
          items: [
            "Alternative L1s pay for security and usage via high native token inflation rates",
            "L2s pay usage-based fees in ETH, removing the need for a native-L2 token to facilitate economic security",
            "Because L2s don't need to use a native token to pay for security, they can choose to use a native token for other strategic functions, like governance, incentives, or fees",
            "High levels of profitability e.g. 95% margins on Base",
          ],
        },
      ],
    },
    {
      title: "Enhanced Performance",
      cards: [
        {
          heading: "High-Performance Validation",
          items: [
            "By separating execution from consensus and inheriting Ethereum's finality, rollups enable high performance without sacrificing user safety or decentralization",
          ],
        },
        {
          heading: "Faster & Cheaper",
          items: [
            "Rollups can parallelize execution and proving—they don't need to wait for thousands of nodes to sync",
            "One proof replaces millions of redundant re-computations across nodes, greatly reducing validation costs",
          ],
        },
        {
          heading: "Safer Validation",
          items: [
            "Rollups inherit Ethereum's censorship resistance and finality",
            "Assets are held in Ethereum contracts, and updates are enforced via fraud or validity proofs",
            "Even if the L2 sequencer misbehaves, users can force transaction inclusion and securely exit via Ethereum L1",
          ],
        },
      ],
    },
    {
      title: "Interoperability",
      cards: [
        {
          heading: "Shared Standards",
          items: [
            "L2s leverage Ethereum's established EVM, token standards, and core assets like ETH",
            "Users and developers benefit from a consistent experience, using the same wallets, tools, and code across Ethereum's L1 and L2 ecosystem",
            "Tokens and NFTs maintain a canonical L1 source-of-truth, making them fungible across different rollups",
          ],
        },
      ],
    },
  ]

  return (
    <div className="bg-card flex min-h-90 gap-x-20 gap-y-10 p-4 max-lg:flex-col max-sm:max-w-[calc(100vw-32px)] sm:p-8 sm:max-lg:max-w-[calc(100vw-96px)]">
      <div className="flex gap-3 max-lg:overflow-x-auto max-lg:pb-4 sm:gap-8 lg:flex-col">
        {items.map(({ title }, index) => (
          <Fragment key={index}>
            <button
              onClick={() => setActiveIndex(index)}
              className={cn(
                "text-h5 text-secondary-foreground hover:text-secondary-foreground/80 text-start font-bold tracking-[0.03rem] text-nowrap",
                activeIndex === index &&
                  "text-foreground hover:text-foreground cursor-auto"
              )}
            >
              {title}
            </button>
            <hr className={cn(index === items.length - 1 && "hidden")} />
          </Fragment>
        ))}
      </div>
      <div className="overflow-hidden">
        <TransitionPanel
          activeIndex={activeIndex}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          variants={{
            enter: { opacity: 0, y: -50, filter: "blur(4px)" },
            center: { opacity: 1, y: 0, filter: "blur(0px)" },
            exit: { opacity: 0, y: 50, filter: "blur(4px)" },
          }}
        >
          {items.map(({ cards }, index) => (
            <div key={index} className="flex flex-col gap-4">
              {cards.map(({ heading, items }, index) => (
                <div
                  key={index}
                  className="bg-background flex flex-1 flex-col justify-between gap-y-2 p-8"
                >
                  <h3 className="text-h6/snug font-bold">{heading}</h3>
                  <ul className="text-muted-foreground ms-6 list-disc font-medium">
                    {items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </TransitionPanel>
      </div>
    </div>
  )
}
