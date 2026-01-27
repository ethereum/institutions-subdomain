import type { Metadata } from "next/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

import Hero from "@/components/Hero"
import {
  LibraryCard,
  LibraryCardDate,
  LibraryCardHeader,
  LibraryCardImage,
  LibraryCardTitle,
  LibraryCardTitleLink,
} from "@/components/ui/library-card"

import { getMetadata } from "@/lib/utils/metadata"

import { libraryItems } from "./data"

import { type Locale, routing } from "@/i18n/routing"

type Props = {
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("library")

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero
        heading={t("hero.heading")}
        shape="book-open-text-fill"
      >
        <p>
          {t("hero.description1")}
        </p>
        <p>
          {t("hero.description2")}
        </p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-10 px-4 py-10 sm:px-10 sm:py-20 md:space-y-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-[6.5rem]">
          {libraryItems.map(({ title, imgSrc, date, href }) => (
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "library" })

  return getMetadata({
    slug: "library",
    title: t("metadata.title"),
    description: t("metadata.description"),
    image: "/images/og/library.png",
    locale,
  })
}
