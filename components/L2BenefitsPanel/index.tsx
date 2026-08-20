"use client"

import { Fragment, ReactNode, useState } from "react"
import { useTranslations } from "next-intl"

import { TransitionPanel } from "@/components/ui/transition-panel"

import { cn } from "@/lib/utils"

import Link from "../ui/link"

type L2BenefitsPanelProps = {
  securityValue: string
}
export function L2BenefitsPanel({ securityValue }: L2BenefitsPanelProps) {
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
      title: t("inherit-decentralization.title"),
      cards: [
        {
          heading: t("inherit-decentralization.no-bootstrapping.heading"),
          items: [
            t("inherit-decentralization.no-bootstrapping.item1"),
            t("inherit-decentralization.no-bootstrapping.item2"),
            t("inherit-decentralization.no-bootstrapping.item3"),
          ],
        },
        {
          heading: t("inherit-decentralization.shared-security.heading"),
          items: [
            t.rich("inherit-decentralization.shared-security.item1", {
              securityValue,
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
            t("inherit-decentralization.shared-security.item2"),
          ],
        },
      ],
    },
    {
      title: t("cheaper-security.title"),
      cards: [
        {
          heading: t("cheaper-security.no-inflation.heading"),
          items: [
            t("cheaper-security.no-inflation.item1"),
            t("cheaper-security.no-inflation.item2"),
            t("cheaper-security.no-inflation.item3"),
            t("cheaper-security.no-inflation.item4"),
          ],
        },
      ],
    },
    {
      title: t("enhanced-performance.title"),
      cards: [
        {
          heading: t("enhanced-performance.high-performance.heading"),
          items: [t("enhanced-performance.high-performance.item1")],
        },
        {
          heading: t("enhanced-performance.faster-cheaper.heading"),
          items: [
            t("enhanced-performance.faster-cheaper.item1"),
            t("enhanced-performance.faster-cheaper.item2"),
          ],
        },
        {
          heading: t("enhanced-performance.safer-validation.heading"),
          items: [
            t("enhanced-performance.safer-validation.item1"),
            t("enhanced-performance.safer-validation.item2"),
            t("enhanced-performance.safer-validation.item3"),
          ],
        },
      ],
    },
    {
      title: t("interoperability.title"),
      cards: [
        {
          heading: t("interoperability.shared-standards.heading"),
          items: [
            t("interoperability.shared-standards.item1"),
            t("interoperability.shared-standards.item2"),
            t("interoperability.shared-standards.item3"),
          ],
        },
      ],
    },
    {
      title: t("customization.title"),
      cards: [
        {
          heading: t("customization.configurable-environments.heading"),
          items: [
            t("customization.configurable-environments.item1"),
            t("customization.configurable-environments.item2"),
            t("customization.configurable-environments.item3"),
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
      <div className="min-w-0 flex-1 overflow-hidden">
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
