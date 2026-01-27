import type { StaticImageData } from "next/image"

import { defiCategories } from "./constants"
import { defiEcosystem } from "./data"

export type CategoryKey = (typeof defiCategories)[number]

export type CategoryKeyWithAll = CategoryKey | "all"

export type Platform = {
  name: string
  description: string
  imgSrc: StaticImageData
  href: string
}

export type CategoryDetails = {
  heading: string
  subtext: string
  platforms: Platform[]
}

export type CategoryHeading =
  (typeof defiEcosystem)[keyof typeof defiEcosystem]["heading"]
