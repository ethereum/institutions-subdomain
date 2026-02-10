import { join } from "path"

import type { StaticImageData } from "next/image"

import { isValidDate } from "@/lib/utils/date"

import { fetchPosts, getPostImage } from "./[slug]/utils"

import a16zCrypto from "@/public/images/library/a16z-crypto-1.png"
import blockchainScotland from "@/public/images/library/blockchain-scotland-1.png"
import citi from "@/public/images/library/citi-1.png"
import consensys from "@/public/images/library/consensys-1.webp"
import decentralised from "@/public/images/library/decentralised-1.jpg"
import etherealize from "@/public/images/library/etherealize-1.png"
import ethtokyo from "@/public/images/library/ethtokyo-1.png"
import ey from "@/public/images/library/ey-1.png"
import fidelity1 from "@/public/images/library/fidelity-1.jpg"
import fidelity2 from "@/public/images/library/fidelity-2.png"
import galaxy from "@/public/images/library/galaxy-1.png"
import goldmanSachs from "@/public/images/library/goldman-sachs-1.png"
import mergeMadrid from "@/public/images/library/merge-madrid-1.jpg"
import nextFinSummit from "@/public/images/library/nextfin-summit-1.png"

type LibraryItem = {
  title: string
  imgSrc: StaticImageData | string
  date: string
  href: string
}

const externalLibraryItems: LibraryItem[] = [
  {
    title: "Citi - Stablecoins 2030 Web3 to Wall Street",
    href: "https://www.citigroup.com/rcs/citigpa/storage/public/GPS_Report_Stablecoins_2030.pdf",
    date: "2025-09-25",
    imgSrc: citi,
  },
  {
    title: "ETHTokyo - Ethereum: From tech to real",
    href: "https://www.youtube.com/watch?v=4iWXnYFjbIM",
    date: "2025-09-16",
    imgSrc: ethtokyo,
  },
  {
    title:
      "Blockchain Scotland - Ethereum: Enterprise adoption and financial services",
    href: "https://www.youtube.com/watch?v=AETDWBu3sVU",
    date: "2024-09-05",
    imgSrc: blockchainScotland,
  },
  {
    title: "Fidelity - Coin report: Ethereum (ETH)",
    href: "https://www.fidelitydigitalassets.com/research-and-insights/coin-report-ethereum-eth",
    date: "2025-08-21",
    imgSrc: fidelity1,
  },
  {
    title: "Goldman Sachs - Stablecoin summer",
    href: "https://www.goldmansachs.com/pdfs/insights/goldman-sachs-research/stablecoin-summer/TopOfMind.pdf",
    date: "2025-08-19",
    imgSrc: goldmanSachs,
  },
  {
    title: "Consensys - The industrialization of trust report",
    href: "https://consensys.io/ethereum/trust",
    date: "2025-08-04",
    imgSrc: consensys,
  },
  {
    title: "Fidelity - Blockchains as emerging economies",
    href: "https://institutional.fidelity.com/app/proxy/content?literatureURL=/9919383.PDF",
    date: "2025-07-16",
    imgSrc: fidelity2,
  },
  {
    title: "Galaxy - Beyond Bitcoin: Ethereum as a corporate treasury asset",
    href: "https://www.galaxy.com/insights/research/beyond-btc-ethereum-as-a-corporate-treasury-asset",
    date: "2025-07-15",
    imgSrc: galaxy,
  },
  {
    title: "EY - 2025 Institutional investor digital assets survey",
    href: "https://www.ey.com/content/dam/ey-unified-site/ey-com/en-us/insights/financial-services/documents/ey-growing-enthusiasm-propels-digital-assets-into-the-mainstream.pdf",
    date: "2025-03-18",
    imgSrc: ey,
  },
  {
    title: "NextFin Summit - Low-risk DeFi on Ethereum",
    href: "https://drive.google.com/file/d/13YdvzcC7G-CFmYHBjvd-Js6xicgTS8V5/view",
    date: "2025-10-01",
    imgSrc: nextFinSummit,
  },
  {
    title: "MERGE Madrid - Future of Blockchain Infrastructure",
    href: "https://www.youtube.com/watch?v=1z1iIc0TIVE",
    date: "2025-10-15",
    imgSrc: mergeMadrid,
  },
  {
    title: "a16zcrypto - State of Crypto ",
    href: "https://stateofcrypto.a16zcrypto.com/",
    date: "2025-10-22",
    imgSrc: a16zCrypto,
  },
  {
    title: "Will all L1s Move to Ethereum?",
    href: "https://www.decentralised.co/p/will-all-l1s-move-to-ethereum",
    date: "2025-10-01",
    imgSrc: decentralised,
  },
  {
    title: "Etherealize - Wall St Needs a Blockchain",
    href: "https://drive.google.com/file/d/1JMu1pXfNEij2j8P2bSrRI9OQ_oGQG22E/view",
    date: "2025-09-15",
    imgSrc: etherealize,
  },
]

const getInternalLibraryItems = (locale: string): LibraryItem[] =>
  fetchPosts(locale).map(({ frontmatter, slug }) => {
    const { title, datePublished } = frontmatter

    return {
      title,
      imgSrc: getPostImage(frontmatter, locale),
      date: datePublished,
      href: `/${join("library", slug)}`,
    }
  })

export const getLibraryItems = (locale: string): LibraryItem[] =>
  [
    ...externalLibraryItems,
    ...getInternalLibraryItems(locale),
  ].sort((a, b) => {
    if (!isValidDate(a.date)) return -1
    if (!isValidDate(b.date)) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
