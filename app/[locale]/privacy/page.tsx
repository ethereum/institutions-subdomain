import Image, { type StaticImageData } from "next/image"
import type { Metadata } from "next/types"
import { getTranslations, setRequestLocale } from "next-intl/server"

import Hero from "@/components/Hero"
import MaskedParallelsIcon from "@/components/MaskedParallelsIcon"
import BinaryLock from "@/components/svg/binary-lock"
import LayersLock from "@/components/svg/layers-lock"
import TargetCheck from "@/components/svg/target-check"
import Link, { LinkWithArrow } from "@/components/ui/link"

import { getMetadata } from "@/lib/utils/metadata"

import { type Locale, routing } from "@/i18n/routing"
import blurWalking from "@/public/images/banners/blur-walking.png"
import aztecLogo from "@/public/images/logos/networks/aztec.png"
import zksyncLogo from "@/public/images/logos/networks/zksync.png"
import railgunLogo from "@/public/images/logos/apps/railgun.png"
import eyLogo from "@/public/images/logos/apps/ey.png"
import deutscheBankLogo from "@/public/images/logos/apps/deutsche-bank.png"
import zamaLogo from "@/public/images/logos/apps/zama.png"
import privacyPoolsLogo from "@/public/images/logos/apps/privacy-pools.png"
import midenLogo from "@/public/images/logos/apps/miden.png"
import fhenixLogo from "@/public/images/logos/apps/fhenix.png"
import shutterLogo from "@/public/images/logos/apps/shutter.png"
import renegadeLogo from "@/public/images/logos/apps/renegade.png"

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

  type ExampleLink = {
    name: string
    href: string
    logo?: StaticImageData
    note?: string
  }

  const solutions: {
    key: string
    examples: ExampleLink[]
  }[] = [
    {
      key: "prividium",
      examples: [
        {
          name: "zkSync Prividium",
          href: "https://www.zksync.io/prividium",
          logo: zksyncLogo,
          note: "Deutsche Bank's Project DAMA",
        },
      ],
    },
    {
      key: "programmablePrivacy",
      examples: [
        { name: "Aztec", href: "https://aztec.network/", logo: aztecLogo },
        { name: "EY Nightfall", href: "https://blockchain.ey.com/technology", logo: eyLogo },
        { name: "Miden", href: "https://miden.xyz/", logo: midenLogo },
      ],
    },
    {
      key: "compliancePools",
      examples: [
        { name: "Privacy Pools", href: "https://privacypools.com/", logo: privacyPoolsLogo, note: "co-authored by Vitalik Buterin; live on mainnet" },
      ],
    },
    {
      key: "shieldedTx",
      examples: [
        { name: "Railgun", href: "https://railgun.org/", logo: railgunLogo },
        { name: "EY Starlight", href: "https://blockchain.ey.com/technology", logo: eyLogo },
      ],
    },
    {
      key: "emerging",
      examples: [
        { name: "Fhenix", href: "https://www.fhenix.io/", logo: fhenixLogo },
        { name: "Zama", href: "https://www.zama.org/", logo: zamaLogo },
        { name: "Shutter", href: "https://www.shutter.network/", logo: shutterLogo },
        { name: "Renegade", href: "https://renegade.fi/", logo: renegadeLogo },
        { name: "Miden", href: "https://miden.xyz/", logo: midenLogo },
      ],
    },
  ]

  const privateChainRisks = [
    "vendorDependency",
    "noInterop",
    "talent",
    "fragility",
    "instability",
    "auditability",
    "offChainPrivacy",
    "missingAbstractions",
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
              <p className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
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

          {/* Bento: 2 rows — top 2 cards, bottom 3 cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {solutions.map(({ key, examples }) => (
              <div
                key={key}
                className={`flex h-full flex-col justify-between p-8 ${
                  key === "prividium" || key === "programmablePrivacy"
                    ? "bg-card lg:col-span-3"
                    : key === "emerging"
                      ? "border border-border lg:col-span-2"
                      : "bg-card lg:col-span-2"
                }`}
              >
                <div className="space-y-3">
                  <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                    {t(`solutions.${key}.approach`)}
                  </h3>
                  <p className="text-muted-foreground font-medium">
                    {t(`solutions.${key}.description`)}
                  </p>
                </div>
                <div className="mt-6 space-y-3 border-t pt-4">
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                    Examples
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {examples.map(({ name, href, logo, note }) => (
                      <Link
                        key={name}
                        href={href}
                        className="flex items-center gap-1"
                      >
                        {logo && (
                          <Image
                            src={logo}
                            alt={name}
                            sizes="20px"
                            className="size-5 rounded-full"
                          />
                        )}
                        <span className="text-secondary-foreground hover:text-secondary-foreground/70 text-sm font-medium transition-colors">
                          {name}
                        </span>
                        {note && (
                          <span className="text-muted-foreground text-xs">
                            {note}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Compliance Without Exposure */}
        <section id="compliance" className="space-y-10">
          <h2 className="text-h3-mobile sm:text-h3 max-w-2xl tracking-[0.055rem]">
            {t("compliance.heading")}
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {(
              [
                {
                  heading: "compliance.selectiveDisclosure",
                  desc: "compliance.selectiveDisclosureDesc",
                  icon: <TargetCheck className="size-full text-white" />,
                },
                {
                  heading: "compliance.privacyCredentials",
                  desc: "compliance.privacyCredentialsDesc",
                  icon: <BinaryLock className="size-full text-white" />,
                },
                {
                  heading: "compliance.composablePrimitives",
                  desc: "compliance.composablePrimitivesDesc",
                  icon: <LayersLock className="size-full text-white" />,
                },
              ] as const
            ).map(({ heading, desc, icon }) => (
              <div
                key={heading}
                className="bg-card space-y-4 p-8"
              >
                <div className="size-37 shrink-0 overflow-hidden p-2.5">
                  <MaskedParallelsIcon
                    className="text-secondary-foreground"
                    maskShape={icon}
                  />
                </div>
                <h3 className="text-h5 text-foreground tracking-[0.03rem]">{t(heading)}</h3>
                <p className="text-muted-foreground font-medium">
                  {t(desc)}
                </p>
              </div>
            ))}
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
                    heading: "whyMatters.noCounterparty",
                    desc: "whyMatters.noCounterpartyDesc",
                  },
                  {
                    heading: "whyMatters.economics",
                    desc: "whyMatters.economicsDesc",
                  },
                  {
                    heading: "whyMatters.interoperability",
                    desc: "whyMatters.interoperabilityDesc",
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
        <section id="trust-vs-crypto" className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-h3-mobile sm:text-h3 max-w-2xl tracking-[0.055rem]">
              {t("trustVsCrypto.heading")}
            </h2>
            <p className="text-muted-foreground max-w-3xl font-medium">
              {t("trustVsCrypto.description")}
            </p>
          </div>

          {/* Desktop: CSS Grid table */}
          <div className="hidden md:block">
            {/* Column headers */}
            <div className="grid grid-cols-[200px_repeat(2,1fr)] gap-x-px bg-white">
              <div className="bg-[#F3F3F3] px-4 py-4" />
              <div className="bg-[#ECECEC] px-4 py-4">
                <span className="text-foreground font-bold">
                  {t("trustVsCrypto.trustHeading")}
                </span>
              </div>
              <div className="bg-secondary-foreground px-4 py-4">
                <span className="font-bold text-white">
                  {t("trustVsCrypto.cryptoHeading")}
                </span>
              </div>
            </div>

            {/* Data rows */}
            {(["Guarantee", "Mechanism", "Incentives", "Vendor", "Regulatory"] as const).map((key) => (
              <div
                key={key}
                className="grid grid-cols-[200px_repeat(2,1fr)] gap-x-px border-t bg-white"
              >
                <div className="flex items-center bg-[#F3F3F3] px-4 py-4">
                  <span className="text-foreground font-bold">
                    {t(`trustVsCrypto.table${key}`)}
                  </span>
                </div>
                <div className="bg-white px-4 py-4">
                  <p className="text-muted-foreground font-medium">
                    {t(`trustVsCrypto.tableTrust${key}`)}
                  </p>
                </div>
                <div className="bg-secondary-foreground/10 px-4 py-4">
                  <p className="text-foreground font-medium">
                    {t(`trustVsCrypto.tableCrypto${key}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Stacked cards per dimension */}
          <div className="space-y-3 md:hidden">
            {(["Guarantee", "Mechanism", "Incentives", "Vendor", "Regulatory"] as const).map((key) => (
              <div
                key={key}
                className="bg-card p-5"
              >
                <p className="text-sm font-bold">
                  {t(`trustVsCrypto.table${key}`)}
                </p>
                <div className="mt-3 bg-secondary-foreground/10 px-4 py-3">
                  <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-secondary-foreground">
                    {t("trustVsCrypto.cryptoHeading")}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {t(`trustVsCrypto.tableCrypto${key}`)}
                  </p>
                </div>
                <div className="mt-3">
                  <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {t("trustVsCrypto.trustHeading")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(`trustVsCrypto.tableTrust${key}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground max-w-3xl border-l-4 pl-4 font-medium italic">
            {t("trustVsCrypto.closing")}
          </p>
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

          <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-14">
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

        {/* 9. EF Privacy Commitment */}
        <section
          id="ef-commitment"
          className="flex gap-x-32 gap-y-14 max-lg:flex-col"
        >
          <div className="flex-1 space-y-7">
            <div className="space-y-4">
              <h2 className="text-h3-mobile sm:text-h3 max-w-2xl tracking-[0.055rem]">
                {t("efCommitment.heading")}
              </h2>
              <p className="text-muted-foreground text-xl font-medium">
                {t("efCommitment.description")}
              </p>
            </div>
            <div className="bg-card mt-12 p-8">
              <h3 className="text-foreground text-2xl font-bold">
                {t("efCommitment.iptfTitle")}
              </h3>
              <p className="text-muted-foreground mt-2 font-medium">
                {t("efCommitment.iptfDesc")}
              </p>
              <LinkWithArrow href="https://iptf.ethereum.org/" className="mt-6 text-secondary-foreground">
                Visit IPTF
              </LinkWithArrow>
            </div>
          </div>
          <div className="relative flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/eth-diamond.svg"
              alt=""
              className="absolute inset-0 size-full animate-[levitate_3s_ease-in-out_infinite] object-contain object-center"
            />
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
