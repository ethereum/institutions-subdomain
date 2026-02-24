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
    badge?: string
    cards: {
      content: ReactNode
      href: string
      ctaLabel?: string
    }[]
  }[] = [
    {
      title: t("pectra.title"),
      cards: [
        {
          content: t("pectra.card1"),
          href: "https://blog.ethereum.org/2025/03/06/pectra",
        },
        {
          content: t("pectra.card2"),
          href: "https://blog.ethereum.org/2025/03/06/pectra",
        },
        {
          content: t("pectra.card3"),
          href: "https://blog.ethereum.org/2025/03/06/pectra",
        },
      ],
    },
    {
      title: t("fusaka.title"),
      cards: [
        {
          content: t("fusaka.card1"),
          href: "https://blog.ethereum.org/2025/08/22/protocol-update-002",
        },
        {
          content: t("fusaka.card2"),
          href: "https://blog.ethereum.org/2025/08/22/protocol-update-002",
        },
      ],
    },
    {
      title: t("postQuantum.title"),
      badge: t("coming"),
      cards: [
        {
          content: t("postQuantum.card1"),
          href: "https://blog.ethereum.org/2025/07/31/lean-ethereum",
        },
        {
          content: t("postQuantum.card2"),
          href: "https://blog.ethereum.org/2025/07/31/lean-ethereum",
        },
      ],
    },
    {
      title: t("glamsterdam.title"),
      badge: t("coming"),
      cards: [
        {
          content: t("glamsterdam.card1"),
          href: "https://blog.ethereum.org/2025/08/05/protocol-update-001",
        },
        {
          content: t("glamsterdam.card2"),
          href: "https://blog.ethereum.org/2025/08/05/protocol-update-001",
        },
      ],
    },
  ]

  return (
    <div className="flex min-h-90 gap-10 border p-8 max-lg:flex-col max-sm:max-w-[calc(100vw-32px)] sm:max-lg:max-w-[calc(100vw-96px)]">
      <div className="flex gap-3 max-lg:overflow-x-auto max-lg:pb-4 sm:gap-8 lg:flex-col">
        {items.map(({ title, badge }, index) => (
          <Fragment key={index}>
            <button
              onClick={() => setActiveIndex(index)}
              className={cn(
                "text-h5 text-secondary-foreground hover:text-secondary-foreground/80 flex items-center gap-2 text-start font-bold tracking-[0.03rem] text-nowrap",
                activeIndex === index &&
                  "text-foreground hover:text-foreground cursor-auto"
              )}
            >
              {title}
              {badge && (
                <span className="bg-secondary-foreground text-secondary rounded-full px-2 py-0.5 text-xs font-medium">
                  {badge}
                </span>
              )}
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
