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
    href?: string
    cards: {
      cardTitle?: string
      content: ReactNode
    }[]
  }[] = [
      {
        title: t("pectra.title"),
        href: "https://blog.ethereum.org/2025/04/23/pectra-mainnet",
        cards: [
          {
            cardTitle: t("pectra.card1Title"),
            content: t("pectra.card1"),
          },
          {
            cardTitle: t("pectra.card2Title"),
            content: t("pectra.card2"),
          },
          {
            cardTitle: t("pectra.card3Title"),
            content: t("pectra.card3"),
          },
        ],
      },
      {
        title: t("fusaka.title"),
        href: "https://blog.ethereum.org/2025/11/06/fusaka-mainnet-announcement",
        cards: [
          {
            cardTitle: t("fusaka.card1Title"),
            content: t("fusaka.card1"),
          },
          {
            cardTitle: t("fusaka.card2Title"),
            content: t("fusaka.card2"),
          },
          {
            cardTitle: t("fusaka.card3Title"),
            content: t("fusaka.card3"),
          },
        ],
      },
      {
        title: t("postQuantum.title"),
        badge: t("coming"),
        href: "https://leanroadmap.org/#research-tracks",
        cards: [
          {
            cardTitle: t("postQuantum.card1Title"),
            content: t("postQuantum.card1"),
          },
          {
            cardTitle: t("postQuantum.card2Title"),
            content: t("postQuantum.card2"),
          },
          {
            cardTitle: t("postQuantum.card3Title"),
            content: t("postQuantum.card3"),
          },
        ],
      },
      {
        title: t("glamsterdam.title"),
        badge: t("coming"),
        href: "https://forkcast.org/upgrade/glamsterdam/",
        cards: [
          {
            cardTitle: t("glamsterdam.card1Title"),
            content: t("glamsterdam.card1"),
          },
          {
            cardTitle: t("glamsterdam.card2Title"),
            content: t("glamsterdam.card2"),
          },
          {
            cardTitle: t("glamsterdam.card3Title"),
            content: t("glamsterdam.card3"),
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
          {items.map(({ cards, href }, index) => (
            <div key={index} className="space-y-8">
              <div className="flex gap-8 max-lg:flex-col">
                {cards.map(({ cardTitle, content }, index) => (
                  <div
                    key={index}
                    className="bg-secondary-foreground flex flex-1 flex-col gap-y-8 p-8"
                  >
                    {cardTitle && (
                      <div className="text-secondary whitespace-pre-line text-2xl font-bold tracking-[0.025rem]">
                        {cardTitle}
                      </div>
                    )}
                    <div className={cn("text-secondary tracking-[0.025rem]", cardTitle ? "text-base font-medium" : "text-xl font-bold")}>
                      {content}
                    </div>
                  </div>
                ))}
              </div>
              {href && (
                <LinkWithArrow
                  href={href}
                  className="css-secondary ms-auto me-5"
                >
                  {t("learnMore")}
                </LinkWithArrow>
              )}
            </div>
          ))}
        </TransitionPanel>
      </div>
    </div>
  )
}
