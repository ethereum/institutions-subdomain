"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import Link from "@/components/ui/link"

import { defiEcosystem } from "../data"
import type { CategoryKey } from "../types"

const CategoryAppGrid = ({ category }: { category: CategoryKey }) => {
  const tCommon = useTranslations("common")
  const { heading, subtext, platforms } = defiEcosystem[category]
  return (
    <div key={category} className="space-y-4">
      <div>
        <h3 className="text-h5">{heading}</h3>
        <p className="text-muted-foreground font-medium">{subtext}</p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4">
        {platforms.map(({ name, description, imgSrc, href }) => (
          <Link
            key={name}
            href={href}
            className="bg-card group flex h-full flex-col justify-between p-6 transition-transform hover:scale-105 hover:transition-transform"
            aria-label={`Visit ${name}`}
          >
            <div className="space-y-2">
              <Image src={imgSrc} alt="" sizes="48px" className="size-12" />
              <h4 className="text-h5">{name}</h4>
              <p className="font-medium">{description}</p>
            </div>
            <p className="text-secondary-foreground mt-4">
              {tCommon("visit")}{" "}
              <span className="group-hover:animate-x-bounce inline-block">
                →
              </span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CategoryAppGrid
