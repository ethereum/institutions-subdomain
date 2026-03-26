import { Metadata } from "next"
import {
  ArrowLeftRight,
  Blocks,
  Check,
  CircleAlert,
  CircleDollarSign,
  Code,
  Globe,
  Scale,
  ShieldCheck,
} from "lucide-react"
import Image from "next/image"
import { getTranslations, setRequestLocale } from "next-intl/server"

import Hero from "@/components/Hero"
import { Card, CardContent, CardLabel } from "@/components/ui/card"

import { getMetadata } from "@/lib/utils/metadata"
import { formatMultiplier, formatPercent } from "@/lib/utils/number"
import { formatDuration } from "@/lib/utils/time"

import fetchAssetMarketShare from "@/app/_actions/fetchAssetMarketShare"
import fetchDefiTvlAllCurrent from "@/app/_actions/fetchTvlDefiAllCurrent"
import { getTimeSinceGenesis } from "@/app/_actions/getTimeSinceGenesis"
import { type Locale, routing } from "@/i18n/routing"
import curvedBuilding from "@/public/images/banners/curved-building-bw.jpg"

type Props = {
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function WhyEthereum({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("why-ethereum")
  const uptime = getTimeSinceGenesis()

  const [defiTvlAllCurrentData, rwaAssetMarketShareData] = await Promise.all([
    fetchDefiTvlAllCurrent(),
    fetchAssetMarketShare("RWAS"),
  ])

  const featureDescriptionVars: Record<string, Record<string, string>> = {
    resilience: {
      uptime: formatDuration(locale, uptime),
    },
    liquidity: {
      tokenizationShare: formatPercent(
        locale,
        rwaAssetMarketShareData.data.marketShare.mainnet +
          rwaAssetMarketShareData.data.marketShare.layer2,
        false,
        2
      ),
      yearsOfNetworkEffects: formatDuration(locale, uptime) + "+",
      defiMultiplier: formatMultiplier(
        locale,
        defiTvlAllCurrentData.data.runnerUpMultiplier,
        2
      ),
    },
  }

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero heading={t("hero.heading")} shape="circle-help">
        <p>{t("hero.description1")}</p>
        <p>{t("hero.description2")}</p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-20 px-4 py-10 sm:px-10 sm:py-20 md:space-y-40">
        {/* Section 1: Pressures & Limitations */}
        <section id="problem">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="p-10">
              <h3 className="text-h4 tracking-[0.04rem]">
                {t("problem.limitations.heading")}{" "}
                {t("problem.limitations.subheading")}
              </h3>
              <hr className="my-6" />
              {(
                [
                  "fragmented",
                  "delay",
                  "reconciliation",
                  "programmability",
                  "opacity",
                ] as const
              ).map((key) => (
                <div
                  key={key}
                  className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 py-6"
                >
                  <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                    <CircleAlert className="text-red-900" />
                    <h4 className="text-h6">
                      {t(`problem.limitations.${key}`)}
                    </h4>
                  </div>
                  <div className="text-muted-foreground col-start-2 font-medium">
                    {t(`problem.limitations.${key}-desc`)}
                  </div>
                </div>
              ))}
            </Card>

            <Card className="p-10">
              <h3 className="text-h4 tracking-[0.04rem]">
                {t("problem.pressures.heading")}{" "}
                {t("problem.pressures.subheading")}
              </h3>
              <hr className="my-6" />
              {(
                [
                  "efficiency",
                  "transparency",
                  "digital-assets",
                  "open-infra",
                ] as const
              ).map((key) => (
                <div
                  key={key}
                  className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 py-6"
                >
                  <div className="col-span-2 grid grid-cols-subgrid items-center gap-x-3">
                    <Check className="text-secondary-foreground" />
                    <h4 className="text-h6">{t(`problem.pressures.${key}`)}</h4>
                  </div>
                  <div className="text-muted-foreground col-start-2 font-medium">
                    {t(`problem.pressures.${key}-desc`)}
                  </div>
                </div>
              ))}
            </Card>
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
            {(
              [
                { key: "resilience", icon: ShieldCheck },
                { key: "settlement", icon: Globe },
                { key: "collateral", icon: ArrowLeftRight },
                { key: "neutrality", icon: Scale },
                { key: "liquidity", icon: CircleDollarSign },
                { key: "programmability", icon: Code },
                { key: "composability", icon: Blocks },
              ] as const
            ).map(({ key, icon: Icon }) => (
              <CardContent key={key}>
                <Icon className="text-secondary-foreground size-8" />
                <CardLabel variant="large">
                  {t(`features.${key}.label`)}
                </CardLabel>
                <div className="text-muted-foreground font-medium">
                  {t(`features.${key}.description`, featureDescriptionVars[key])}
                </div>
              </CardContent>
            ))}
          </div>
        </section>

        {/* Section 3: Ethereum For Risk Management */}
        <section id="risk" className="flex gap-x-32 gap-y-14 max-lg:flex-col">
          <div className="flex-3 space-y-12">
            <div className="space-y-7">
              <h2 className="text-h3-mobile sm:text-h3 tracking-[0.055rem]">
                {t("risk.heading")}
              </h2>
              <p className="text-muted-foreground max-w-4xl text-xl font-medium">
                {t("risk.description")}
              </p>
            </div>

            <ul className="max-w-prose space-y-3">
              {([1, 2, 3, 4] as const).map((i) => (
                <li
                  key={i}
                  className="text-muted-foreground ms-6 list-disc font-medium"
                >
                  {t(`risk.item${i}`)}
                </li>
              ))}
            </ul>

            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-[0.025rem]">
                {t("risk.mitigation.heading")}
              </h3>
              <ul className="max-w-prose space-y-3">
                {([1, 2, 3, 4, 5, 6, 7] as const).map((i) => (
                  <li
                    key={i}
                    className="text-muted-foreground ms-6 list-disc font-medium"
                  >
                    {t(`risk.mitigation.item${i}`)}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-muted-foreground max-w-4xl font-medium">
              {t("risk.closing")}
            </p>
          </div>
          <div className="relative min-h-80 flex-2">
            <Image
              src={curvedBuilding}
              alt=""
              fill
              placeholder="blur"
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 536px"
            />
          </div>
        </section>
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "why-ethereum" })

  return getMetadata({
    slug: "why-ethereum",
    title: t("metadata.title"),
    description: t("metadata.description"),
    locale,
  })
}
