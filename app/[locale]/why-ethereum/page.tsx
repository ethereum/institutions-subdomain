import { setRequestLocale } from "next-intl/server"

import { type Locale, routing } from "@/i18n/routing"

type Props = {
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function WhyEthereum({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main className="row-start-2 flex flex-col items-center">
      <article className="max-w-8xl mx-auto w-full space-y-20 px-4 py-10 sm:px-10 sm:py-20">
        <section className="mx-auto max-w-3xl space-y-8 text-center">
          <h1 className="text-h2">Why Ethereum</h1>
          <p className="text-muted-foreground text-xl">
            This page is under construction. Content coming soon.
          </p>
        </section>
      </article>
    </main>
  )
}
