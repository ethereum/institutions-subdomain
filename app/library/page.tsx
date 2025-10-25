import type { Metadata } from "next/types"

import Hero from "@/components/Hero"
import {
  LibraryCard,
  LibraryCardDate,
  LibraryCardHeader,
  LibraryCardImage,
  LibraryCardTitle,
  LibraryCardTitleLink,
} from "@/components/ui/library-card"

import { isValidDate } from "@/lib/utils/date"
import { getMetadata } from "@/lib/utils/metadata"

import { libraryItems } from "./data"

export default function Page() {
  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero
        heading="Library: Institutional Insights"
        shape="book-open-text-fill"
      >
        <p>
          Reports, articles, and analyses from across the institutional
          landscape, along with thought leadership and updates from the Ethereum
          Foundation&apos;s Enterprise Acceleration team.
        </p>
        <p>
          Explore market trends, technical developments, and strategic
          opportunities for institutions building in the onchain economy.
        </p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-10 px-4 py-10 sm:px-10 sm:py-20 md:space-y-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-[6.5rem]">
          {libraryItems
            .sort((a, b) => {
              if (!isValidDate(a.date)) return -1
              if (!isValidDate(b.date)) return 1
              return new Date(b.date).getTime() - new Date(a.date).getTime()
            })
            .map(({ title, imgSrc, date, href }) => (
              <LibraryCard key={title}>
                <LibraryCardHeader>
                  <LibraryCardImage src={imgSrc} alt="" />
                </LibraryCardHeader>
                <LibraryCardTitleLink href={href}>
                  <LibraryCardTitle asChild>
                    <h2>{title}</h2>
                  </LibraryCardTitle>
                </LibraryCardTitleLink>
                <LibraryCardDate>{date}</LibraryCardDate>
              </LibraryCard>
            ))}
        </div>
      </article>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({
    slug: "library",
    title: "Research & Insights | Ethereum Institutional Resources",
    description:
      "Explore a curated library for businesses adopting Ethereum, with reports, analysis, market trends, and the latest institutional insights.",
    image: "/images/og/library.png",
  })
}
