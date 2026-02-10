"use client"

import { Fragment, ReactNode, useState } from "react"
import { useTranslations } from "next-intl"

import { TransitionPanel } from "@/components/ui/transition-panel"

import { cn } from "@/lib/utils"

import { LinkWithArrow } from "../ui/link"

export function ScalingPanel() {
  const t = useTranslations("home.scaling")
  const [activeIndex, setActiveIndex] = useState(0)

  const items: {
    title: string
    cards: {
      content: ReactNode
      href: string
      ctaLabel?: string
    }[]
  }[] = [
    {
      title: t("immediateAcceleration.title"),
      cards: [
        {
          content: t("immediateAcceleration.card1"),
          href: "https://blog.ethereum.org/2025/08/05/protocol-update-001",
        },
        {
          content: t("immediateAcceleration.card2"),
          href: "https://blog.ethereum.org/2025/08/22/protocol-update-002",
        },
        {
          content: t("immediateAcceleration.card3"),
          href: "https://blog.ethereum.org/2025/08/05/protocol-update-001",
        },
      ],
    },
    {
      title: t("alternativeProvider.title"),
      cards: [
        {
          content: t("alternativeProvider.card1"),
          href: "https://blog.eigencloud.xyz/eigenda-v2-core-architecture/",
        },
        {
          content: t("alternativeProvider.card2"),
          href: "https://www.zksync.io/airbender",
        },
      ],
    },
    {
      title: t("activeDevelopment.title"),
      cards: [
        {
          content: t("activeDevelopment.card1"),
          href: "https://blog.ethereum.org/2025/08/22/protocol-update-002",
        },
        {
          content: t("activeDevelopment.card2"),
          href: "https://blog.ethereum.org/2025/08/05/protocol-update-001",
        },
      ],
    },
    {
      title: t("terabyteScale.title"),
      cards: [
        {
          content: (
            <>
              <span className="mb-6 block">{t("terabyteScale.card1Heading")}</span>
              <ul className="ms-6 list-disc">
                <li>{t("terabyteScale.card1Item1")}</li>
                <li>{t("terabyteScale.card1Item2")}</li>
              </ul>
            </>
          ),
          href: "https://blog.ethereum.org/2025/07/31/lean-ethereum",
        },
        {
          content: t("terabyteScale.card2"),
          href: "https://blog.ethereum.org/2025/07/31/lean-ethereum",
        },
      ],
    },
  ]

  return (
    <div className="flex min-h-90 gap-10 border p-8 max-lg:flex-col max-sm:max-w-[calc(100vw-32px)] sm:max-lg:max-w-[calc(100vw-96px)]">
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
            <div key={index} className="flex gap-8 max-lg:flex-col">
              {cards.map(({ content, href }, index) => (
                <div
                  key={index}
                  className="bg-secondary-foreground flex flex-1 flex-col justify-between gap-y-8 p-8"
                >
                  <div className="text-secondary text-xl font-bold tracking-[0.025rem]">
                    {content}
                  </div>
                  <LinkWithArrow
                    href={href}
                    className="!text-secondary hover:!text-secondary/80 text-normal font-medium"
                  >
                    {t("learnMore")}
                  </LinkWithArrow>
                </div>
              ))}
            </div>
          ))}
        </TransitionPanel>
      </div>
    </div>
  )
}
