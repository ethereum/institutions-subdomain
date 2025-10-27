import Image, { StaticImageData } from "next/image"
import type { Metadata } from "next/types"

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

import blurWalking from "@/public/images/banners/blur-walking.png"
import chainlink from "@/public/images/logos/apps/chainlink.png"
import railgun from "@/public/images/logos/apps/railgun.png"
import zama from "@/public/images/logos/apps/zama.png"
import aztec from "@/public/images/logos/networks/aztec.png"

export default function Page() {
  const productionSolutions: {
    heading: string
    description: string
    href: string
    imgSrc: StaticImageData
  }[] = [
    {
      heading: "Chainlink Automated Compliance Engine (ACE)",
      description:
        "Policy enforcement and verifiable entity identity to automate KYC/AML and transfer rules directly in smart contracts.",
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
      <Hero heading="Compliant Privacy for Institutions" shape="lock">
        <p>
          On Ethereum, you can keep counterparties, data, and business logic
          confidential while settling against the deepest onchain liquidity.
        </p>
        <p>
          Privacy isn&apos;t a sidechain or a silo. It&apos;s a set of open
          standards you compose on L1 or L2 to meet regulatory, risk, and audit
          needs.
        </p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-20 px-4 py-10 sm:px-10 sm:py-20 md:space-y-40">
        <section id="direct" className="flex gap-10 max-lg:flex-col md:gap-16">
          <div className="space-y-6">
            <h2 className="text-h3-mobile sm:text-h3 max-lg:mx-auto max-lg:text-center lg:w-lg lg:max-w-lg lg:shrink-0">
              A Privacy Strike Team for Institutions
            </h2>
            <p>
              The Ethereum Foundation pairs its cryptographic research team
              (PSE) of 50+ leading privacy researchers with its Institutional
              Privacy Task Force (IPTF) to deliver institutional-grade privacy
              on public rails
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                Neutral Privacy Stacks
              </h3>
              <div className="text-muted-foreground font-medium">
                Avoid vendor lock-in with privacy stacks that map to
                institutional use cases. IPTF advises, designs, and ships
                vendor-neutral privacy solutions on Ethereum.
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                Advancing Compliance
              </h3>
              <div className="text-muted-foreground font-medium">
                Co-design policy proofs that satisfy enterprise audit standards
                and regulation. PSE works to advance onchain privacy solutions
                and auditability for real-world adoption.
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                Production-Ready Pilots
              </h3>
              <div className="text-muted-foreground font-medium">
                Stand up pilots that settle publicly and compose with existing
                liquidity, while keeping specific counterparties, amounts, and
                logic confidential.
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-h5 text-foreground tracking-[0.03rem]">
                Institutional Education
              </h3>
              <div className="text-muted-foreground font-medium">
                We engage directly to identify privacy needs and onchain
                solutions, publishing guidance and reports to share learnings
                and accelerate safe, compliant adoption.
              </div>
            </div>
          </div>
        </section>

        <section id="building-blocks" className="space-y-14">
          <h2 className="text-h3-mobile sm:text-h3 max-w-lg tracking-[0.055rem]">
            Privacy Building Blocks on Ethereum
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
                  Zero-Knowledge Proofs (ZK)
                </h3>
                <p className="text-muted-foreground font-medium">
                  Prove policy checks (KYC, limits, SOW) without exposing raw
                  data. Enable selective disclosure for regulators and
                  counterparties while keeping transactions composable with
                  Ethereum liquidity.
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
                  Fully Homomorphic Encryption (FHE)
                </h3>
                <p className="text-muted-foreground font-medium">
                  Compute on encrypted data (risk, pricing, and netting). An
                  early tech that&apos;s advancing quickly. FHE is best for
                  highly-sensitivity analytics, where even intermediaries
                  shouldn&apos;t see plaintext.
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
                  Trusted Execution Environments (TEE)
                </h3>
                <p className="text-muted-foreground font-medium">
                  Hardware-attested confidential compute for low-latency
                  workflows (matching, auctions). TEEs keep code and data
                  sealed, then emit verifiable attestations suitable for audits
                  and due diligence.
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
                  Privacy-Focused L2s
                </h3>
                <p className="text-muted-foreground font-medium">
                  Confidential rollups settle on Ethereum while keeping
                  counterparties, amounts, and logic private via ZK, FHE or
                  TEEs. Get L1 security, liquidity, and auditability, plus
                  access to selective disclosure.
                </p>
              </Card>
            </Link>
          </div>
        </section>

        <section id="why" className="flex gap-x-32 gap-y-14 max-lg:flex-col">
          <div className="flex-3 space-y-7">
            <h2 className="text-h3-mobile sm:text-h3 tracking-[0.055rem] lg:max-w-lg">
              Why Ethereum for Privacy
            </h2>
            <ul className="max-w-prose space-y-4">
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Credibly Neutral, Audit-Ready
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  Prove compliance without exposing raw data. Unlock
                  verification of KYC-checks, legitimate sources of funds, and
                  transaction limits, with selective disclosure for regulators
                  and auditors.
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Composability with Liquidity
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  Private flows can still plug into the liquidity on Ethereum
                  and its L2s. Privacy is composable with stablecoin and
                  real-world asset (RWA) rails, DEX liquidity, institutional
                  custody, and more.
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                No Vendor Lock In
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  Launch on Ethereum mainnet for maximum composability, or
                  launch on Ethereum&apos;s L2s for lower settlement costs, with
                  access to the same privacy tooling and vendor-neutral
                  standards.
                </p>
              </li>
              <li className="ms-6 list-disc text-xl font-bold tracking-[0.025rem]">
                Security at Scale
                <p className="text-muted-foreground mt-1 text-base font-medium">
                  Privacy features inherit Ethereum&apos;s decentralization and
                  resilience. Build future-proof products and services on a
                  global foundation designed for maximum security and permanent
                  availability.
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
            Privacy Solutions in Production
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
                    Visit{" "}
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

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({
    slug: "privacy",
    title: "Blockchain Privacy & Compliance for Institutions | Ethereum",
    description:
      "Settle onchain while protecting sensitive business data. Explore Ethereum's privacy features and tooling for institutional regulatory, risk, and audit needs.",
    image: "/images/og/privacy.png",
  })
}
