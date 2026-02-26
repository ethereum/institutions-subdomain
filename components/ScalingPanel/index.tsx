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
      cardTitle?: string
      content: ReactNode
      href: string
      ctaLabel?: string
    }[]
  }[] = [
    {
      title: t("pectra.title"),
      cards: [
        {
          cardTitle: t("pectra.card1Title"),
          content: t("pectra.card1"),
          href: "https://blog.ethereum.org/2025/03/06/pectra",
        },
      ],
    },
    {
      title: t("fusaka.title"),
      cards: [
        {
          cardTitle: t("fusaka.card1Title"),
          content: t("fusaka.card1"),
          href: "https://blog.ethereum.org/2025/08/22/protocol-update-002",
        },
      ],
    },
    {
      title: t("postQuantum.title"),
      badge: t("coming"),
      cards: [
        {
          cardTitle: t("postQuantum.card1Title"),
          content: t("postQuantum.card1"),
          href: "https://blog.ethereum.org/2025/07/31/lean-ethereum",
        },
      ],
    },
    {
      title: t("glamsterdam.title"),
      badge: t("coming"),
      cards: [
        {
          cardTitle: t("glamsterdam.card1Title"),
          content: t("glamsterdam.card1"),
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
              {cards.map(({ cardTitle, content, href }, index) => (
                <div
                  key={index}
                  className="bg-secondary-foreground flex flex-1 flex-col justify-between gap-y-8 p-8"
                >
                  <div>
                    {cardTitle && (
                      <div className="text-secondary mb-3 text-2xl font-bold tracking-[0.025rem]">
                        {cardTitle}
                      </div>
                    )}
                    <div className={cn("text-secondary tracking-[0.025rem]", cardTitle ? "text-base font-medium" : "text-xl font-bold")}>
                      {content}
                    </div>
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
