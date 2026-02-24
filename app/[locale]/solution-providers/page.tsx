import type { Metadata } from "next/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

import Hero from "@/components/Hero"

import { getMetadata } from "@/lib/utils/metadata"

import { solutionProviders } from "./data"
import { ProviderGrid } from "./provider-grid"

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

  const t = await getTranslations("solutionProviders")

  const sortedProviders = [...solutionProviders].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero heading={t("hero.heading")} shape="handshake">
        <p>{t("hero.description")}</p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-10 px-4 py-20 sm:px-10 sm:py-20 md:space-y-40">
        <section id="providers">
          <ProviderGrid providers={sortedProviders} />
        </section>
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "solutionProviders" })

  return getMetadata({
    slug: "solution-providers",
    title: t("metadata.title"),
    description: t("metadata.description"),
    locale,
  })
}
