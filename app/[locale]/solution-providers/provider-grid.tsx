"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"
import { useTranslations } from "next-intl"

import { Card, CardContent, CardLabel } from "@/components/ui/card"

import {
  MACRO_CATEGORIES,
  type MacroCategory,
  type Region,
  REGIONS,
  type SolutionProvider,
} from "./data"

export function ProviderGrid({
  providers,
}: {
  providers: SolutionProvider[]
}) {
  const [categoryFilter, setCategoryFilter] = useState<MacroCategory | "all">(
    "all"
  )
  const [regionFilter, setRegionFilter] = useState<Region | "all">("all")
  const t = useTranslations("solutionProviders")

  const filtered = providers.filter((p) => {
    if (categoryFilter !== "all" && p.macroCategory !== categoryFilter)
      return false
    if (regionFilter !== "all" && !p.region.includes(regionFilter)) return false
    return true
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as MacroCategory | "all")
          }
          className="bg-card text-foreground border-muted rounded border px-3 py-2 text-sm font-medium"
        >
          <option value="all">{t("filters.allCategories")}</option>
          {MACRO_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {t(`categories.${cat}`)}
            </option>
          ))}
        </select>

        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value as Region | "all")}
          className="bg-card text-foreground border-muted rounded border px-3 py-2 text-sm font-medium"
        >
          <option value="all">{t("filters.allRegions")}</option>
          {REGIONS.map((region) => (
            <option key={region} value={region}>
              {t(`regions.${region}`)}
            </option>
          ))}
        </select>

        <p className="text-muted-foreground text-sm font-medium">
          {t("filters.showing", { count: filtered.length })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((provider) => {
          const content = (
            <Card key={provider.name} variant="flex-column">
              <CardContent>
                <div className="flex items-start justify-between gap-2">
                  <CardLabel variant="large">{provider.name}</CardLabel>
                  {provider.url && (
                    <ExternalLink className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">
                    {provider.subCategory}
                  </span>
                  {provider.region.map((r) => (
                    <span
                      key={r}
                      className="text-muted-foreground border-muted rounded-full border px-3 py-1 text-xs font-medium"
                    >
                      {t(`regions.${r}`)}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )

          if (provider.url) {
            return (
              <a
                key={provider.name}
                href={provider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                {content}
              </a>
            )
          }

          return content
        })}
      </div>
    </div>
  )
}
