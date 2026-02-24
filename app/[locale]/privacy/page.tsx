import Image from "next/image"
import type { Metadata } from "next/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

import Hero from "@/components/Hero"
import MaskedParallelsIcon from "@/components/MaskedParallelsIcon"
import BinaryLock from "@/components/svg/binary-lock"
import CpuLock from "@/components/svg/cpu-lock"
import LayersLock from "@/components/svg/layers-lock"
import TargetCheck from "@/components/svg/target-check"
import { Card } from "@/components/ui/card"
import Link from "@/components/ui/link"

import { getMetadata } from "@/lib/utils/metadata"

import { type Locale, routing } from "@/i18n/routing"
import blurWalking from "@/public/images/banners/blur-walking.png"

type Props = {
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("privacy")

  const featuredSolutions = [
    {
      key: "prividium" as const,
      href: "https://prividium.io/",
    },
    {
      key: "aztec" as const,
      href: "https://aztec.network/",
    },
    {
      key: "privacyPools" as const,
      href: "https://www.privacypools.com/",
    },
    {
      key: "railgun" as const,
      href: "https://www.railgun.org/",
    },
  ]

  const emergingApproaches = [
    "fhenix",
    "zama",
    "shutter",
    "renegade",
    "nightfall",
    "miden",
  ] as const

  const privateChainRisks = [
    "vendorDependency",
    "talent",
    "fragility",
    "instability",
    "complexity",
    "auditability",
    "interop",
    "innovation",
  ] as const

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      {/* 1. Hero */}
      <Hero heading={t("hero.heading")} shape="lock">
        <p>{t("hero.description1")}</p>
        <p>{t("hero.description2")}</p>
      </Hero>

      <article className="max-w-8xl mx-auto w-full space-y-20 px-4 py-10 sm:px-10 sm:py-20 md:space-y-40">
        {/* 2. Stats Bar */}
        <section id="stats" className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {(
            [
              { value: "stats.teams", label: "stats.teamsLabel" },
              { value: "stats.years", label: "stats.yearsLabel" },
              { value: "stats.researchers", label: "stats.researchersLabel" },
              { value: "stats.value", label: "stats.valueLabel" },
            ] as const
          ).map(({ value, label }) => (
            <div
              key={value}
              className="bg-card flex flex-col items-center justify-center p-6 text-center"
            >
              <p className="text-secondary-foreground text-4xl font-bold tracking-tight sm:text-5xl">
                {t(value)}
              </p>
              <p className="text-muted-foreground mt-2 text-sm font-medium">
                {t(label)}
              </p>
            </div>
          ))}
        </section>

        {/* 3. Privacy Solutions */}
        <section id="solutions" className="space-y-14">
          <div className="space-y-4">
            <h2 className="text-h3-mobile sm:text-h3 max-w-2xl tracking-[0.055rem]">
              {t("solutions.heading")}
            </h2>
            <p className="text-muted-foreground max-w-3xl font-medium">
              {t("solutions.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featuredSolutions.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="bg-card group flex h-full flex-col justify-between p-8 transition-transform hover:scale-[1.02] hover:transition-transform"
                aria-label={t(`solutions.${key}.heading`)}
              >
                <div className="space-y-3">
                  <span className="text-secondary-foreground inline-block text-xs font-bold tracking-widest">
                    {t(`solutions.${key}.badge`)}
                  </span>
                  <h3 className="text-h4 text-section-foreground tracking-[0.03rem]">
                    {t(`solutions.${key}.heading`)}
                  </h3>
                  <p className="text-muted-foreground font-medium">
                    {t(`solutions.${key}.description`)}
                  </p>
                </div>
                <p className="text-secondary-foreground mt-6 mb-0">
                  Learn more{" "}
                  <span className="group-hover:animate-x-bounce inline-block">
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>

          {/* Emerging Approaches */}
          <div className="space-y-4">
            <h3 className="text-h5 tracking-[0.03rem]">
              {t("solutions.emerging.heading")}
            </h3>
            <p className="text-muted-foreground font-medium">
              {t("solutions.emerging.description")}
            </p>
            <ul className="text-muted-foreground grid grid-cols-1 gap-2 font-medium sm:grid-cols-2 lg:grid-cols-3">
              {emergingApproaches.map((key) => (
                <li key={key} className="ms-6 list-disc">
                  {t(`solutions.emerging.${key}`)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Compliance Without Exposure */}
        <section
          id="compliance"
          className="flex gap-10 max-lg:flex-col md:gap-16"
        >
          <div className="space-y-6">
            <h2 className="text-h3-mobile sm:text-h3 max-lg:mx-auto max-lg:text-center lg:w-lg lg:max-w-lg lg:shrink-0">
              {t("compliance.heading")}
            </h2>
            <p className="text-muted-foreground font-medium">
              {t("compliance.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                {t("compliance.selective")}
              </h3>
              <div className="text-muted-foreground font-medium">
                {t("compliance.selectiveDesc")}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                {t("compliance.zkIdentity")}
              </h3>
              <div className="text-muted-foreground font-medium">
                {t("compliance.zkIdentityDesc")}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                {t("compliance.auditTrails")}
              </h3>
              <div className="text-muted-foreground font-medium">
                {t("compliance.auditTrailsDesc")}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Why This Matters */}
        <section
          id="why-matters"
          className="flex gap-x-32 gap-y-14 max-lg:flex-col"
        >
          <div className="flex-3 space-y-7">
            <h2 className="text-h3-mobile sm:text-h3 tracking-[0.055rem] lg:max-w-lg">
              {t("whyMatters.heading")}
            </h2>
            <ul className="max-w-prose space-y-4">
              {(
                [
                  {
                    heading: "whyMatters.resilience",
                    desc: "whyMatters.resilienceDesc",
                  },
                  {
                    heading: "whyMatters.censorship",
                    desc: "whyMatters.censorshipDesc",
                  },
                  {
                    heading: "whyMatters.economics",
                    desc: "whyMatters.economicsDesc",
                  },
                  {
                    heading: "whyMatters.noCounterparty",
                    desc: "whyMatters.noCounterpartyDesc",
                  },
                ] as const
              ).map(({ heading, desc }) => (
                <li
                  key={heading}
                  className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]"
                >
                  {t(heading)}
                  <p className="text-muted-foreground mt-1 text-base font-medium">
                    {t(desc)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-80 flex-2">
            <Image
              src={blurWalking}
              alt=""
              fill
              placeholder="blur"
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 536px"
            />
          </div>
        </section>

        {/* 6. Trust vs Cryptographic Privacy */}
        <section id="trust-vs-crypto" className="space-y-14">
          <h2 className="text-h3-mobile sm:text-h3 max-w-2xl tracking-[0.055rem]">
            {t("trustVsCrypto.heading")}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Trust-Based */}
            <div className="bg-card space-y-4 p-8">
              <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                {t("trustVsCrypto.trustHeading")}
              </h3>
              <blockquote className="text-muted-foreground border-l-4 pl-4 text-lg italic">
                {t("trustVsCrypto.trustQuote")}
              </blockquote>
              <p className="text-muted-foreground font-medium">
                {t("trustVsCrypto.trustDesc")}
              </p>
            </div>
            {/* Cryptographic */}
            <div className="bg-card space-y-4 p-8">
              <h3 className="text-h5 text-secondary-foreground tracking-[0.03rem]">
                {t("trustVsCrypto.cryptoHeading")}
              </h3>
              <blockquote className="border-secondary-foreground text-muted-foreground border-l-4 pl-4 text-lg italic">
                {t("trustVsCrypto.cryptoQuote")}
              </blockquote>
              <p className="text-muted-foreground font-medium">
                {t("trustVsCrypto.cryptoDesc")}
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="text-muted-foreground p-4 text-sm font-medium" />
                  <th className="text-muted-foreground p-4 text-sm font-bold">
                    {t("trustVsCrypto.trustHeading")}
                  </th>
                  <th className="text-secondary-foreground p-4 text-sm font-bold">
                    {t("trustVsCrypto.cryptoHeading")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    {
                      row: "tableAccess",
                      trust: "tableTrustAccess",
                      crypto: "tableCryptoAccess",
                    },
                    {
                      row: "tableGuarantee",
                      trust: "tableTrustGuarantee",
                      crypto: "tableCryptoGuarantee",
                    },
                    {
                      row: "tableVendor",
                      trust: "tableTrustVendor",
                      crypto: "tableCryptoVendor",
                    },
                    {
                      row: "tableAudit",
                      trust: "tableTrustAudit",
                      crypto: "tableCryptoAudit",
                    },
                  ] as const
                ).map(({ row, trust, crypto }) => (
                  <tr key={row} className="border-b last:border-b-0">
                    <td className="p-4 font-bold">
                      {t(`trustVsCrypto.${row}`)}
                    </td>
                    <td className="text-muted-foreground p-4 font-medium">
                      {t(`trustVsCrypto.${trust}`)}
                    </td>
                    <td className="text-muted-foreground p-4 font-medium">
                      {t(`trustVsCrypto.${crypto}`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. Problems with Private Chains */}
        <section id="private-chains" className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-h3-mobile sm:text-h3 max-w-2xl tracking-[0.055rem]">
              {t("privateChains.heading")}
            </h2>
            <p className="text-muted-foreground max-w-3xl font-medium">
              {t("privateChains.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {privateChainRisks.map((key) => (
              <div key={key} className="space-y-2">
                <h3 className="text-h6 text-foreground font-bold">
                  {t(`privateChains.${key}`)}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {t(`privateChains.${key}Desc`)}
                </p>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground max-w-3xl border-l-4 pl-4 font-medium italic">
            {t("privateChains.closing")}
          </p>
        </section>

        {/* 8. Building Blocks */}
        <section id="building-blocks" className="space-y-14">
          <h2 className="text-h3-mobile sm:text-h3 max-w-lg tracking-[0.055rem]">
            {t("buildingBlocks.heading")}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="https://ethereum.org/zero-knowledge-proofs/"
              className="group h-full transition-transform hover:scale-105 hover:transition-transform"
            >
              <Card className="h-full space-y-2">
                <div className="size-37 shrink-0 overflow-hidden p-2.5">
                  <MaskedParallelsIcon
                    className="text-secondary-foreground"
                    maskShape={<TargetCheck className="size-full text-white" />}
                  />
                </div>

                <h3 className="text-h5 text-section-foreground group-hover:text-secondary-foreground tracking-[0.03rem]">
                  {t("buildingBlocks.zk.label")}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {t("buildingBlocks.zk.description")}
                </p>
              </Card>
            </Link>
            <Link
              href="https://pse.dev/blog/zero-to-start-applied-fully-homomorphic-encryption-fhe-part-1"
              className="group h-full transition-transform hover:scale-105 hover:transition-transform"
            >
              <Card className="h-full space-y-2">
                <div className="size-37 shrink-0 overflow-hidden p-2.5">
                  <MaskedParallelsIcon
                    className="text-secondary-foreground"
                    maskShape={<BinaryLock className="size-full text-white" />}
                  />
                </div>

                <h3 className="text-h5 text-section-foreground group-hover:text-secondary-foreground tracking-[0.03rem]">
                  {t("buildingBlocks.fhe.label")}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {t("buildingBlocks.fhe.description")}
                </p>
              </Card>
            </Link>
            <Link
              href="https://ethereum.org/developers/docs/oracles/#authenticity-proofs"
              className="group h-full transition-transform hover:scale-105 hover:transition-transform"
            >
              <Card className="h-full space-y-2">
                <div className="size-37 shrink-0 overflow-hidden p-2.5">
                  <MaskedParallelsIcon
                    className="text-secondary-foreground"
                    maskShape={<CpuLock className="size-full text-white" />}
                  />
                </div>

                <h3 className="text-h5 text-section-foreground group-hover:text-secondary-foreground tracking-[0.03rem]">
                  {t("buildingBlocks.tee.label")}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {t("buildingBlocks.tee.description")}
                </p>
              </Card>
            </Link>
            <Link
              href="https://l2beat.com/zk-catalog"
              className="group h-full transition-transform hover:scale-105 hover:transition-transform"
            >
              <Card className="h-full space-y-2">
                <div className="size-37 shrink-0 overflow-hidden p-2.5">
                  <MaskedParallelsIcon
                    className="text-secondary-foreground"
                    maskShape={<LayersLock className="size-full text-white" />}
                  />
                </div>

                <h3 className="text-h5 text-section-foreground group-hover:text-secondary-foreground tracking-[0.03rem]">
                  {t("buildingBlocks.l2.label")}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {t("buildingBlocks.l2.description")}
                </p>
              </Card>
            </Link>
          </div>
        </section>

        {/* 9. EF Privacy Commitment */}
        <section id="ef-commitment" className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-h3-mobile sm:text-h3 max-w-2xl tracking-[0.055rem]">
              {t("efCommitment.heading")}
            </h2>
            <p className="text-muted-foreground max-w-3xl font-medium">
              {t("efCommitment.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                {t("efCommitment.iptf")}
              </h3>
              <p className="text-muted-foreground font-medium">
                {t("efCommitment.iptfDesc")}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                {t("efCommitment.research")}
              </h3>
              <ul className="text-muted-foreground space-y-2 font-medium">
                <li className="ms-6 list-disc">
                  {t("efCommitment.researchItem1")}
                </li>
                <li className="ms-6 list-disc">
                  {t("efCommitment.researchItem2")}
                </li>
                <li className="ms-6 list-disc">
                  {t("efCommitment.researchItem3")}
                </li>
                <li className="ms-6 list-disc">
                  {t("efCommitment.researchItem4")}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </article>
    </main>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "privacy" })

  return getMetadata({
    slug: "privacy",
    title: t("metadata.title"),
    description: t("metadata.description"),
    image: "/images/og/privacy.png",
    locale,
  })
}
