import type { CategoryDetails, CategoryKey } from "./types"

import oneInch from "@/public/images/logos/apps/1inch.png"
import aave from "@/public/images/logos/apps/aave.png"
import aerodrome from "@/public/images/logos/apps/aerodrome.png"
import balancer from "@/public/images/logos/apps/balancer.png"
import centrifuge from "@/public/images/logos/apps/centrifuge.png"
import circle from "@/public/images/logos/apps/circle.png"
import compound from "@/public/images/logos/apps/compound.png"
import cowSwap from "@/public/images/logos/apps/cow-swap.png"
import curve from "@/public/images/logos/apps/curve.png"
import eigenCloud from "@/public/images/logos/apps/eigen-cloud.png"
import ethena from "@/public/images/logos/apps/ethena.png"
import etherFi from "@/public/images/logos/apps/ether-fi.png"
import euler from "@/public/images/logos/apps/euler.png"
import fluid from "@/public/images/logos/apps/fluid.png"
import frax from "@/public/images/logos/apps/frax.png"
import ftBenji from "@/public/images/logos/apps/ft-benji.png"
import lido from "@/public/images/logos/apps/lido.png"
import liquidCollective from "@/public/images/logos/apps/liquid-collective.png"
import maple from "@/public/images/logos/apps/maple.png"
import moonwell from "@/public/images/logos/apps/moonwell.png"
import morpho from "@/public/images/logos/apps/morpho.png"
import ondo from "@/public/images/logos/apps/ondo.png"
import pendle from "@/public/images/logos/apps/pendle.png"
import polymarket from "@/public/images/logos/apps/polymarket.png"
import rocketPool from "@/public/images/logos/apps/rocket-pool.png"
import securitize from "@/public/images/logos/apps/securitize.png"
import sky from "@/public/images/logos/apps/sky.png"
import spark from "@/public/images/logos/apps/spark.png"
import stakewise from "@/public/images/logos/apps/stakewise.png"
import symbiotic from "@/public/images/logos/apps/symbiotic.png"
import synthetix from "@/public/images/logos/apps/synthetix.png"
import tether from "@/public/images/logos/apps/tether.png"
import uniswap from "@/public/images/logos/apps/uniswap.png"
import veda from "@/public/images/logos/apps/veda.png"
import wisdomTree from "@/public/images/logos/apps/wisdom-tree.png"

type TranslationFn = (key: string) => string

export const getDefiEcosystem = (
  t: TranslationFn
): Record<CategoryKey, CategoryDetails> => ({
  dex: {
    heading: t("categories.dex.heading"),
    subtext: t("categories.dex.subtext"),
    platforms: [
      {
        name: "1inch",
        description: t("categories.dex.platforms.oneInch"),
        imgSrc: oneInch,
        href: "https://1inch.com/",
      },
      {
        name: "Aerodrome",
        description: t("categories.dex.platforms.aerodrome"),
        imgSrc: aerodrome,
        href: "https://aerodrome.finance/",
      },
      {
        name: "Balancer",
        description: t("categories.dex.platforms.balancer"),
        imgSrc: balancer,
        href: "https://balancer.fi/",
      },
      {
        name: "CoWSwap",
        description: t("categories.dex.platforms.cowSwap"),
        imgSrc: cowSwap,
        href: "https://swap.cow.fi/",
      },
      {
        name: "Curve",
        description: t("categories.dex.platforms.curve"),
        imgSrc: curve,
        href: "https://www.curve.finance/",
      },
      {
        name: "Fluid",
        description: t("categories.dex.platforms.fluid"),
        imgSrc: fluid,
        href: "https://fluid.io/",
      },
      {
        name: "Uniswap",
        description: t("categories.dex.platforms.uniswap"),
        imgSrc: uniswap,
        href: "https://app.uniswap.org/",
      },
    ],
  },
  "lending-borrowing": {
    heading: t("categories.lending-borrowing.heading"),
    subtext: t("categories.lending-borrowing.subtext"),
    platforms: [
      {
        name: "Aave",
        description: t("categories.lending-borrowing.platforms.aave"),
        imgSrc: aave,
        href: "https://aave.com/",
      },
      {
        name: "Compound",
        description: t("categories.lending-borrowing.platforms.compound"),
        imgSrc: compound,
        href: "https://compound.finance/",
      },
      {
        name: "Euler",
        description: t("categories.lending-borrowing.platforms.euler"),
        imgSrc: euler,
        href: "https://www.euler.finance/",
      },
      {
        name: "Fluid",
        description: t("categories.lending-borrowing.platforms.fluid"),
        imgSrc: fluid,
        href: "https://fluid.io/",
      },
      {
        name: "Maple",
        description: t("categories.lending-borrowing.platforms.maple"),
        imgSrc: maple,
        href: "https://maple.finance/",
      },
      {
        name: "Moonwell",
        description: t("categories.lending-borrowing.platforms.moonwell"),
        imgSrc: moonwell,
        href: "https://moonwell.fi/",
      },
      {
        name: "Morpho",
        description: t("categories.lending-borrowing.platforms.morpho"),
        imgSrc: morpho,
        href: "https://morpho.org/",
      },
      {
        name: "Sky",
        description: t("categories.lending-borrowing.platforms.sky"),
        imgSrc: sky,
        href: "https://sky.money/",
      },
      {
        name: "Spark",
        description: t("categories.lending-borrowing.platforms.spark"),
        imgSrc: spark,
        href: "https://spark.fi/",
      },
    ],
  },
  "rwa-yield": {
    heading: t("categories.rwa-yield.heading"),
    subtext: t("categories.rwa-yield.subtext"),
    platforms: [
      {
        name: "Centrifuge",
        description: t("categories.rwa-yield.platforms.centrifuge"),
        imgSrc: centrifuge,
        href: "https://centrifuge.io/",
      },
      {
        name: "Circle",
        description: t("categories.rwa-yield.platforms.circle"),
        imgSrc: circle,
        href: "https://www.circle.com/",
      },
      {
        name: "Ethena",
        description: t("categories.rwa-yield.platforms.ethena"),
        imgSrc: ethena,
        href: "https://ethena.fi/",
      },
      {
        name: "Franklin Templeton BENJI",
        description: t("categories.rwa-yield.platforms.ftBenji"),
        imgSrc: ftBenji,
        href: "https://digitalassets.franklintempleton.com/benji/",
      },
      {
        name: "Frax",
        description: t("categories.rwa-yield.platforms.frax"),
        imgSrc: frax,
        href: "https://frax.com/",
      },
      {
        name: "Ondo",
        description: t("categories.rwa-yield.platforms.ondo"),
        imgSrc: ondo,
        href: "https://ondo.finance/",
      },
      {
        name: "Pendle",
        description: t("categories.rwa-yield.platforms.pendle"),
        imgSrc: pendle,
        href: "https://www.pendle.finance/",
      },
      {
        name: "Securitize",
        description: t("categories.rwa-yield.platforms.securitize"),
        imgSrc: securitize,
        href: "https://securitize.io/",
      },
      {
        name: "Sky",
        description: t("categories.rwa-yield.platforms.skyRwa"),
        imgSrc: sky,
        href: "https://sky.money/",
      },
      {
        name: "Tether",
        description: t("categories.rwa-yield.platforms.tether"),
        imgSrc: tether,
        href: "https://tether.to/en/",
      },
      {
        name: "Veda",
        description: t("categories.rwa-yield.platforms.veda"),
        imgSrc: veda,
        href: "https://veda.tech/",
      },
      {
        name: "WisdomTree",
        description: t("categories.rwa-yield.platforms.wisdomTree"),
        imgSrc: wisdomTree,
        href: "https://www.wisdomtree.com/",
      },
    ],
  },
  staking: {
    heading: t("categories.staking.heading"),
    subtext: t("categories.staking.subtext"),
    platforms: [
      {
        name: "EtherFi",
        description: t("categories.staking.platforms.etherFi"),
        imgSrc: etherFi,
        href: "https://www.ether.fi/",
      },
      {
        name: "EigenCloud",
        description: t("categories.staking.platforms.eigenCloud"),
        imgSrc: eigenCloud,
        href: "https://www.eigencloud.xyz/",
      },
      {
        name: "Lido",
        description: t("categories.staking.platforms.lido"),
        imgSrc: lido,
        href: "https://lido.fi/",
      },
      {
        name: "Liquid Collective",
        description: t("categories.staking.platforms.liquidCollective"),
        imgSrc: liquidCollective,
        href: "https://liquidcollective.io/",
      },
      {
        name: "Rocket Pool",
        description: t("categories.staking.platforms.rocketPool"),
        imgSrc: rocketPool,
        href: "https://rocketpool.net/",
      },
      {
        name: "Stakewise",
        description: t("categories.staking.platforms.stakewise"),
        imgSrc: stakewise,
        href: "https://www.stakewise.io/",
      },
      {
        name: "Symbiotic",
        description: t("categories.staking.platforms.symbiotic"),
        imgSrc: symbiotic,
        href: "https://symbiotic.fi/",
      },
    ],
  },
  synthetic: {
    heading: t("categories.synthetic.heading"),
    subtext: t("categories.synthetic.subtext"),
    platforms: [
      {
        name: "Polymarket",
        description: t("categories.synthetic.platforms.polymarket"),
        imgSrc: polymarket,
        href: "https://polymarket.com/",
      },
      {
        name: "Synthetix",
        description: t("categories.synthetic.platforms.synthetix"),
        imgSrc: synthetix,
        href: "https://www.synthetix.io/",
      },
    ],
  },
})
