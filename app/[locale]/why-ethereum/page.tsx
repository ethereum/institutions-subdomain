import { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import Hero from "@/components/Hero"
import { CardContent, CardLabel } from "@/components/ui/card"

import { getMetadata } from "@/lib/utils/metadata"
import { formatDuration } from "@/lib/utils/time"

import { getTimeSinceGenesis } from "@/app/_actions/getTimeSinceGenesis"
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
  const t = await getTranslations("whyEthereum")
  const uptime = getTimeSinceGenesis()

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero heading={t("hero.heading")} shape="eth-glyph" />
      <article className="max-w-8xl mx-auto w-full space-y-20 px-4 py-10 sm:px-10 sm:py-20 md:space-y-40">
        {/* Section 1: The Institutional Problem */}
        <section id="problem" className="space-y-16">
          <div className="space-y-7">
            <h2 className="text-h3-mobile sm:text-h3 tracking-[0.055rem]">
              {t("problem.heading")}
            </h2>
            <p className="text-muted-foreground max-w-4xl font-medium">
              {t("problem.description")}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-[0.025rem]">
              {t("problem.pressures.heading")}
            </h3>
            <ul className="max-w-prose space-y-3">
              <li className="text-muted-foreground ms-6 list-disc font-medium">
                {t("problem.pressures.item1")}
              </li>
              <li className="text-muted-foreground ms-6 list-disc font-medium">
                {t("problem.pressures.item2")}
              </li>
              <li className="text-muted-foreground ms-6 list-disc font-medium">
                {t("problem.pressures.item3")}
              </li>
              <li className="text-muted-foreground ms-6 list-disc font-medium">
                {t("problem.pressures.item4")}
              </li>
              <li className="text-muted-foreground ms-6 list-disc font-medium">
                {t("problem.pressures.item5")}
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h3 className="text-h3-mobile sm:text-h3 tracking-[0.055rem]">
              {t("problem.problems.heading")}
            </h3>
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-14">
              <CardContent>
                <CardLabel variant="large">
                  {t("problem.problems.fragmented")}
                </CardLabel>
                <div className="text-muted-foreground font-medium">
                  {t("problem.problems.fragmentedDesc")}
                </div>
              </CardContent>
              <CardContent>
                <CardLabel variant="large">
                  {t("problem.problems.delay")}
                </CardLabel>
                <div className="text-muted-foreground font-medium">
                  {t("problem.problems.delayDesc")}
                </div>
              </CardContent>
              <CardContent>
                <CardLabel variant="large">
                  {t("problem.problems.reconciliation")}
                </CardLabel>
                <div className="text-muted-foreground font-medium">
                  {t("problem.problems.reconciliationDesc")}
                </div>
              </CardContent>
              <CardContent>
                <CardLabel variant="large">
                  {t("problem.problems.programmability")}
                </CardLabel>
                <div className="text-muted-foreground font-medium">
                  {t("problem.problems.programmabilityDesc")}
                </div>
              </CardContent>
              <CardContent>
                <CardLabel variant="large">
                  {t("problem.problems.opacity")}
                </CardLabel>
                <div className="text-muted-foreground font-medium">
                  {t("problem.problems.opacityDesc")}
                </div>
              </CardContent>
            </div>
          </div>
        </section>

        {/* Section 2: Why Institutions Choose Ethereum */}
        <section id="features" className="space-y-16">
          <div className="space-y-7">
            <h2 className="text-h3-mobile sm:text-h3 tracking-[0.055rem]">
              {t("features.heading")}
            </h2>
            <p className="text-muted-foreground max-w-4xl font-medium">
              {t("features.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-14">
            <CardContent>
              <CardLabel variant="large">
                {t("features.resilience.label")}
              </CardLabel>
              <div className="text-muted-foreground font-medium">
                {t.rich("features.resilience.description", {
                  uptime: formatDuration(locale, uptime),
                })}
              </div>
            </CardContent>
            <CardContent>
              <CardLabel variant="large">
                {t("features.settlement.label")}
              </CardLabel>
              <div className="text-muted-foreground font-medium">
                {t("features.settlement.description")}
              </div>
            </CardContent>
            <CardContent>
              <CardLabel variant="large">
                {t("features.collateral.label")}
              </CardLabel>
              <div className="text-muted-foreground font-medium">
                {t("features.collateral.description")}
              </div>
            </CardContent>
            <CardContent>
              <CardLabel variant="large">
                {t("features.neutrality.label")}
              </CardLabel>
              <div className="text-muted-foreground font-medium">
                {t("features.neutrality.description")}
              </div>
            </CardContent>
            <CardContent>
              <CardLabel variant="large">
                {t("features.liquidity.label")}
              </CardLabel>
              <div className="text-muted-foreground font-medium">
                {t("features.liquidity.description")}
              </div>
            </CardContent>
            <CardContent>
              <CardLabel variant="large">
                {t("features.programmability.label")}
              </CardLabel>
              <div className="text-muted-foreground font-medium">
                {t("features.programmability.description")}
              </div>
            </CardContent>
            <CardContent>
              <CardLabel variant="large">
                {t("features.composability.label")}
              </CardLabel>
              <div className="text-muted-foreground font-medium">
                {t("features.composability.description")}
              </div>
            </CardContent>
          </div>
        </section>

        {/* Section 3: Ethereum for Risk Management */}
        <section id="risk" className="space-y-16">
          <div className="space-y-7">
            <h2 className="text-h3-mobile sm:text-h3 tracking-[0.055rem]">
              {t("risk.heading")}
            </h2>
            <p className="text-muted-foreground max-w-4xl font-medium">
              {t("risk.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-14">
            <CardContent>
              <CardLabel variant="large">
                {t("risk.regulatory.label")}
              </CardLabel>
              <div className="text-muted-foreground font-medium">
                {t("risk.regulatory.description")}
              </div>
            </CardContent>
            <CardContent>
              <CardLabel variant="large">{t("risk.fees.label")}</CardLabel>
              <div className="text-muted-foreground font-medium">
                {t("risk.fees.description")}
              </div>
            </CardContent>
            <CardContent>
              <CardLabel variant="large">{t("risk.privacy.label")}</CardLabel>
              <div className="text-muted-foreground font-medium">
                {t("risk.privacy.description")}
              </div>
            </CardContent>
            <CardContent>
              <CardLabel variant="large">
                {t("risk.smartContract.label")}
              </CardLabel>
              <div className="text-muted-foreground font-medium">
                {t("risk.smartContract.description")}
              </div>
            </CardContent>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-[0.025rem]">
              {t("risk.mitigation.heading")}
            </h3>
            <ol className="max-w-prose space-y-3 list-decimal">
              <li className="text-muted-foreground ms-6 font-medium">
                {t("risk.mitigation.item1")}
              </li>
              <li className="text-muted-foreground ms-6 font-medium">
                {t("risk.mitigation.item2")}
              </li>
              <li className="text-muted-foreground ms-6 font-medium">
                {t("risk.mitigation.item3")}
              </li>
              <li className="text-muted-foreground ms-6 font-medium">
                {t("risk.mitigation.item4")}
              </li>
              <li className="text-muted-foreground ms-6 font-medium">
                {t("risk.mitigation.item5")}
              </li>
              <li className="text-muted-foreground ms-6 font-medium">
                {t("risk.mitigation.item6")}
              </li>
              <li className="text-muted-foreground ms-6 font-medium">
                {t("risk.mitigation.item7")}
              </li>
            </ol>
          </div>

          <p className="text-muted-foreground max-w-4xl font-medium">
            {t("risk.closing")}
          </p>
        </section>
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "whyEthereum" })

  return getMetadata({
    slug: "why-ethereum",
    title: t("metadata.title"),
    description: t("metadata.description"),
    locale,
  })
}
