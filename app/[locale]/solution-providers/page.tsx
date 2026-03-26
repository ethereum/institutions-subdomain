import type { Metadata } from "next/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

import Hero from "@/components/Hero"

import { getMetadata } from "@/lib/utils/metadata"

import { MACRO_CATEGORIES, REGIONS, solutionProviders } from "./data"
import { ProviderGrid, type ProviderGridTranslations } from "./provider-grid"

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
  const tCommon = await getTranslations("common")

  // Resolve translatable fields on each provider for the client
  const displayProviders = [...solutionProviders]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((p) => ({
      ...p,
      subCategory: t(`sub-categories.${p.subCategory}`),
      description: p.description
        ? t(`providers.${p.description}.description`)
        : undefined,
    }))

  // Pre-resolve UI translations for the client component
  const translations: ProviderGridTranslations = {
    filters: {
      allCategories: t("filters.all-categories"),
      allRegions: t("filters.all-regions"),
      noResults: t("filters.no-results"),
      clearAll: t("filters.clear-all"),
    },
    categories: Object.fromEntries(
      MACRO_CATEGORIES.map((cat) => [cat, t(`categories.${cat}`)])
    ) as ProviderGridTranslations["categories"],
    regions: Object.fromEntries(
      REGIONS.map((r) => [r, t(`regions.${r}`)])
    ) as ProviderGridTranslations["regions"],
    providerSingular: t("provider-singular"),
    providerPlural: t("provider-plural"),
    visit: tCommon("visit"),
  }

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero heading={t("hero.heading")} shape="handshake">
        <p>{t("hero.description")}</p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full px-4 py-12 sm:px-10 sm:py-16">
        <section id="providers">
          <ProviderGrid
            providers={displayProviders}
            translations={translations}
          />
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
