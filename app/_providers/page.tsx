import type { Metadata } from "next/types"

import Hero from "@/components/Hero"
import Link from "@/components/ui/link"

import { getMetadata } from "@/lib/utils/metadata"

export default function Page() {
  const regions = ["Europe", "US", "MENA", "APAC", "LATAM"] as const

  type Region = (typeof regions)[number]

  type Provider = {
    name: string
    category: string
    href: string
  }

  const providers: Record<Region, Provider[]> = {
    Europe: [
      {
        name: "Gateway",
        category: "Infra",
        href: "https://gateway.fm/",
      },
      {
        name: "Nethermind",
        category: "Infra",
        href: "https://www.nethermind.io/",
      },
      {
        name: "Matter Labs",
        category: "Infra",
        href: "https://matter-labs.io/",
      },
      {
        name: "Lionscraft",
        category: "Infra consulting",
        href: "https://www.lionscraft.io/",
      },
      {
        name: "L2Beat",
        category: "Data",
        href: "https://l2beat.com/scaling/summary",
      },
      {
        name: "GrowthePie",
        category: "Data",
        href: "https://www.growthepie.com/",
      },
      {
        name: "Re7",
        category: "Risk Management",
        href: "https://re7.capital/",
      },
      {
        name: "kpk",
        category: "Treasury Management",
        href: "https://kpk.io/",
      },
      {
        name: "MEV Capital",
        category: "Risk Management",
        href: "https://www.mevcapital.com/",
      },
      {
        name: "PWC",
        category: "Consulting",
        href: "https://www.pwc.com/us/en.html",
      },
    ],
    US: [
      {
        name: "Consensys",
        category: "Infra",
        href: "https://consensys.io/",
      },
      {
        name: "Alluvial",
        category: "Infra",
        href: "https://alluvial.finance/",
      },
      {
        name: "Offchain Labs",
        category: "Infra",
        href: "https://www.offchainlabs.com/",
      },
      {
        name: "OP Labs",
        category: "Infra",
        href: "https://www.oplabs.co/",
      },
      {
        name: "Conduit",
        category: "Infra",
        href: "https://www.conduit.xyz/",
      },
      {
        name: "Chainlink",
        category: "Infra",
        href: "https://chain.link/",
      },
      {
        name: "Blocknative",
        category: "Infra",
        href: "https://www.blocknative.com/",
      },
      {
        name: "Securitize",
        category: "Tokenization",
        href: "https://securitize.io/",
      },
      {
        name: "EEA",
        category: "Membership",
        href: "https://entethalliance.org/",
      },
      {
        name: "Bitmine",
        category: "DAT",
        href: "https://www.bitminetech.io/",
      },
      {
        name: "Sharplink",
        category: "DAT",
        href: "https://www.sharplink.com/",
      },
      {
        name: "Etherealize",
        category: "Product",
        href: "https://www.etherealize.com/",
      },
      {
        name: "Gauntlet",
        category: "Risk",
        href: "https://www.gauntlet.xyz/",
      },
      {
        name: "EY",
        category: "Consulting",
        href: "https://blockchain.ey.com/",
      },
      {
        name: "KPMG",
        category: "Consulting",
        href: "https://kpmg.com/ch/en/services/financial-services/enterprise-blockchain-services.html",
      },
    ],
    MENA: [
      {
        name: "Aquanow",
        category: "Infra",
        href: "https://www.aquanow.com/",
      },
      {
        name: "Polygon Labs",
        category: "Infra",
        href: "https://polygon.technology/",
      },
    ],
    APAC: [
      {
        name: "AltLayer",
        category: "Infra",
        href: "https://www.altlayer.io/",
      },
      {
        name: "Pier Two",
        category: "Infra",
        href: "https://piertwo.com/",
      },
      {
        name: "SNZ",
        category: "Investments",
        href: "https://snzholding.com/",
      },
      {
        name: "FractonVentures",
        category: "Investments",
        href: "https://fracton.ventures/",
      },
      {
        name: "L2IV",
        category: "Investments",
        href: "https://www.l2iterative.com/",
      },
      {
        name: "Pacific Meta",
        category: "Development Agency",
        href: "https://pacific-meta.co.jp/en/",
      },
      {
        name: "Labyrs",
        category: "Development Agency",
        href: "https://labrys.io/",
      },
    ],
    LATAM: [
      {
        name: "Sensei Node",
        category: "Infra",
        href: "https://www.senseinode.com/",
      },
    ],
  }

  return (
    <main className="row-start-2 flex flex-col items-center sm:items-start">
      <Hero heading="Solution Providers" shape="handshake">
        <p>
          Discover providers offering expertise, tools, and support for your
          business
        </p>
      </Hero>
      <article className="max-w-8xl mx-auto w-full space-y-10 px-4 py-10 sm:px-10 sm:py-20 md:space-y-20">
        {regions.map((region) => (
          <section key={region} id={region.toLowerCase()} className="space-y-4">
            <h2 className="text-h3-mobile sm:text-h3">{region}</h2>
            <div className="*:bg-card grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4 *:p-6">
              {providers[region].map(({ name, category, href }) => (
                <Link
                  key={name}
                  href={href}
                  className="bg-card group w-full space-y-2 transition-transform hover:scale-105 hover:transition-transform"
                >
                  <h3 className="text-h5 tracking-[0.03rem]">{name}</h3>
                  <p className="text-muted-foreground font-medium">
                    {category}
                  </p>
                  <p className="text-secondary-foreground mt-6 mb-0">
                    Visit{" "}
                    <span className="group-hover:animate-x-bounce inline-block">
                      →
                    </span>
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </article>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata({
    slug: "providers",
    title: "Regional Solution Providers",
    description:
      "Discover providers offering expertise, tools, and support for your business.",
    image: "/images/og/providers.png",
  })
}
