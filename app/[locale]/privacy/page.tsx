import Image, { StaticImageData } from "next/image"
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

import { cn } from "@/lib/utils"
import { getMetadata } from "@/lib/utils/metadata"

import { type Locale, routing } from "@/i18n/routing"
import blurWalking from "@/public/images/banners/blur-walking.png"
import chainlink from "@/public/images/logos/apps/chainlink.png"
import railgun from "@/public/images/logos/apps/railgun.png"
import zama from "@/public/images/logos/apps/zama.png"
import aztec from "@/public/images/logos/networks/aztec.png"

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
  const tCommon = await getTranslations("common")

  const productionSolutions: {
    heading: string
    description: string
    href: string
    imgSrc: StaticImageData
  }[] = [
    {
      heading: "Chainlink ACE",
      description:
        "The Automated Compliance Engine provides policy enforcement and verifiable entity identity to automate KYC/AML and transfer rules directly in smart contracts.",
      href: "https://chain.link/automated-compliance-engine",
      imgSrc: chainlink,
    },
    {
      heading: "Railgun",
      description:
        "Onchain ZK privacy system for private balances and private DeFi interactions on Ethereum and major L2s.",
      href: "https://www.railgun.org/",
      imgSrc: railgun,
    },
    {
      heading: "Aztec Network",
      description:
        "Privacy-first zkRollup with encrypted state and selective disclosure; building private smart contracts on Ethereum.",
      href: "https://aztec.network/",
      imgSrc: aztec,
    },
    {
      heading: "Zama",
      description:
        "Tools to build smart contracts that compute on encrypted data, so balances and logic stay confidential.",
      href: "https://www.zama.ai/",
      imgSrc: zama,
    },
  ]

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero heading={t("hero.heading")} shape="lock">
        <p>
          {t("hero.description1")}
        </p>
        <p>
          {t("hero.description2")}
        </p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-20 px-4 py-10 sm:px-10 sm:py-20 md:space-y-40">
        <section id="direct" className="flex gap-10 max-lg:flex-col md:gap-16">
          <div className="space-y-6">
            <h2 className="text-h3-mobile sm:text-h3 max-lg:mx-auto max-lg:text-center lg:w-lg lg:max-w-lg lg:shrink-0">
              {t("direct.heading")}
            </h2>
            <p>
              {t("direct.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                {t("direct.neutralStacks")}
              </h3>
              <div className="text-muted-foreground font-medium">
                {t("direct.neutralStacksDesc")}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                {t("direct.compliance")}
              </h3>
              <div className="text-muted-foreground font-medium">
                {t("direct.complianceDesc")}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                {t("direct.pilots")}
              </h3>
              <div className="text-muted-foreground font-medium">
                {t("direct.pilotsDesc")}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                {t("direct.education")}
              </h3>
              <div className="text-muted-foreground font-medium">
                {t("direct.educationDesc")}
              </div>
            </div>
          </div>
        </section>

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

        <section id="why" className="flex gap-x-32 gap-y-14 max-lg:flex-col">
          <div className="flex-3 space-y-7">
            <h2 className="text-h3-mobile sm:text-h3 tracking-[0.055rem] lg:max-w-lg">
              {t("why.heading")}
            </h2>
            <ul className="max-w-prose space-y-4">
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("why.auditReady")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("why.auditReadyDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("why.composability")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("why.composabilityDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("why.noLockIn")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("why.noLockInDesc")}
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                {t("why.security")}
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  {t("why.securityDesc")}
                </p>
              </li>
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

        <section id="solutions" className="space-y-8">
          <h2 className="text-h4 tracking-[0.04rem]">
            {t("solutions.heading")}
          </h2>
          <div
            className={cn(
              "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
              "*:bg-card *:space-y-2 *:p-6"
            )}
          >
            {productionSolutions.map(
              ({ heading, imgSrc, description, href }) => (
                <Link
                  key={heading}
                  href={href}
                  className="bg-card group flex h-full flex-col justify-between p-6 transition-transform hover:scale-105 hover:transition-transform"
                  aria-label={`Visit ${heading}`}
                >
                  <div className="space-y-2">
                    <Image
                      src={imgSrc}
                      alt=""
                      sizes="48px"
                      className="size-12"
                    />
                    <h3 className="text-h5 text-section-foreground tracking-[0.03rem]">
                      {heading}
                    </h3>
                    <p className="text-muted-foreground font-medium">
                      {description}
                    </p>
                  </div>
                  <p className="text-secondary-foreground mt-4 mb-0">
                    {tCommon("visit")}{" "}
                    <span className="group-hover:animate-x-bounce inline-block">
                      →
                    </span>
                  </p>
                </Link>
              )
            )}
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
