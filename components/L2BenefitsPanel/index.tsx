"use client"

import { Fragment, ReactNode, useState } from "react"
import { useTranslations } from "next-intl"

import { TransitionPanel } from "@/components/ui/transition-panel"

import { cn } from "@/lib/utils"

import Link from "../ui/link"

type L2BenefitsPanelProps = {
  validatorsCount: string
}
export function L2BenefitsPanel({ validatorsCount }: L2BenefitsPanelProps) {
  const t = useTranslations("layer2.benefits")
  const [activeIndex, setActiveIndex] = useState(0)

  const items: {
    title: string
    cards: {
      heading: string
      items: ReactNode[]
    }[]
  }[] = [
    {
      title: t("inheritDecentralization.title"),
      cards: [
        {
          heading: t("inheritDecentralization.noBootstrapping.heading"),
          items: [
            t("inheritDecentralization.noBootstrapping.item1"),
            t("inheritDecentralization.noBootstrapping.item2"),
            t("inheritDecentralization.noBootstrapping.item3"),
          ],
        },
        {
          heading: t("inheritDecentralization.sharedSecurity.heading"),
          items: [
            t.rich("inheritDecentralization.sharedSecurity.item1", {
              validatorsCount,
              link: (chunks) => (
                <Link
                  href="https://explorer.rated.network/network?network=mainnet&timeWindow=1d&rewardsMetric=average&geoDistType=all&hostDistType=all&soloProDist=stake"
                  inline
                  className="css-secondary font-bold"
                >
                  {chunks}
                </Link>
              ),
            }),
            t("inheritDecentralization.sharedSecurity.item2"),
          ],
        },
      ],
    },
    {
      title: t("cheaperSecurity.title"),
      cards: [
        {
          heading: t("cheaperSecurity.noInflation.heading"),
          items: [
            t("cheaperSecurity.noInflation.item1"),
            t("cheaperSecurity.noInflation.item2"),
            t("cheaperSecurity.noInflation.item3"),
            t("cheaperSecurity.noInflation.item4"),
          ],
        },
      ],
    },
    {
      title: t("enhancedPerformance.title"),
      cards: [
        {
          heading: t("enhancedPerformance.highPerformance.heading"),
          items: [
            t("enhancedPerformance.highPerformance.item1"),
          ],
        },
        {
          heading: t("enhancedPerformance.fasterCheaper.heading"),
          items: [
            t("enhancedPerformance.fasterCheaper.item1"),
            t("enhancedPerformance.fasterCheaper.item2"),
          ],
        },
        {
          heading: t("enhancedPerformance.saferValidation.heading"),
          items: [
            t("enhancedPerformance.saferValidation.item1"),
            t("enhancedPerformance.saferValidation.item2"),
            t("enhancedPerformance.saferValidation.item3"),
          ],
        },
      ],
    },
    {
      title: t("interoperability.title"),
      cards: [
        {
          heading: t("interoperability.sharedStandards.heading"),
          items: [
            t("interoperability.sharedStandards.item1"),
            t("interoperability.sharedStandards.item2"),
            t("interoperability.sharedStandards.item3"),
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
