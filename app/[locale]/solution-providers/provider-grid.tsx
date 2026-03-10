"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ExternalLink, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
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
  const [regionOpen, setRegionOpen] = useState(false)
  const t = useTranslations("solutionProviders")

  const regionFiltered = useMemo(() => {
    if (regionFilter === "all") return providers
    return providers.filter((p) => p.region.includes(regionFilter))
  }, [providers, regionFilter])

  const grouped = useMemo(() => {
    const cats =
      categoryFilter === "all"
        ? MACRO_CATEGORIES
        : [categoryFilter]

    return cats
      .map((cat) => ({
        category: cat,
        providers: regionFiltered
          .filter((p) => p.macroCategory === cat)
          .sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .filter((g) => g.providers.length > 0)
  }, [regionFiltered, categoryFilter])

  const categoryCounts = useMemo(() => {
    return MACRO_CATEGORIES.reduce(
      (acc, cat) => {
        acc[cat] = regionFiltered.filter((p) => p.macroCategory === cat).length
        return acc
      },
      {} as Record<MacroCategory, number>
    )
  }, [regionFiltered])

  const regionCounts = useMemo(() => {
    return REGIONS.reduce(
      (acc, region) => {
        acc[region] = providers.filter(
          (p) =>
            p.region.includes(region) &&
            (categoryFilter === "all" || p.macroCategory === categoryFilter)
        ).length
        return acc
      },
      {} as Record<Region, number>
    )
  }, [providers, categoryFilter])

  const totalFiltered = grouped.reduce((sum, g) => sum + g.providers.length, 0)

  const regionLabel =
    regionFilter === "all"
      ? t("filters.allRegions")
      : t(`regions.${regionFilter}`)

  return (
    <div className="space-y-8">
      {/* Category filter buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="default"
          onClick={() => setCategoryFilter("all")}
          className={
            categoryFilter === "all"
              ? "bg-secondary-foreground text-white hover:bg-secondary-foreground/90 border border-secondary-foreground"
              : "border border-border text-foreground hover:text-secondary-foreground"
          }
        >
          {t("filters.allCategories")}
          <span className="opacity-60">{regionFiltered.length}</span>
        </Button>
        {MACRO_CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant="secondary"
            size="default"
            onClick={() =>
              setCategoryFilter(categoryFilter === cat ? "all" : cat)
            }
            className={
              categoryFilter === cat
                ? "bg-secondary-foreground text-white hover:bg-secondary-foreground/90 border border-secondary-foreground"
                : "border border-border text-foreground hover:text-secondary-foreground"
            }
          >
            {t(`categories.${cat}`)}
            <span className="opacity-60">{categoryCounts[cat]}</span>
          </Button>
        ))}
      </div>

      {/* Region dropdown */}
      <div className="relative">
        <button
          onClick={() => setRegionOpen(!regionOpen)}
          className="text-secondary-foreground group inline-flex items-center gap-1.5 font-bold"
        >
          {regionLabel}
          <span className="text-foreground text-sm font-bold">
            {totalFiltered}
          </span>
          {regionFilter !== "all" ? (
            <X
              className="text-muted-foreground hover:text-foreground size-4 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                setRegionFilter("all")
              }}
            />
          ) : (
            <ChevronDown
              className={`text-secondary-foreground size-4 transition-transform ${regionOpen ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {regionOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setRegionOpen(false)}
            />
            <div className="bg-card absolute left-0 z-20 mt-2 min-w-52 py-2 shadow-lg">
              <button
                onClick={() => {
                  setRegionFilter("all")
                  setRegionOpen(false)
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  regionFilter === "all"
                    ? "text-secondary-foreground font-bold"
                    : "text-foreground hover:bg-section/50 font-medium"
                }`}
              >
                {t("filters.allRegions")}
                <span className="text-muted-foreground text-xs">
                  {providers.length}
                </span>
              </button>
              {REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() => {
                    setRegionFilter(regionFilter === region ? "all" : region)
                    setRegionOpen(false)
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                    regionFilter === region
                      ? "text-secondary-foreground font-bold"
                      : "text-foreground hover:bg-section/50 font-medium"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {regionFilter === region && (
                      <span className="bg-secondary-foreground inline-block h-3 w-[3px]" />
                    )}
                    {t(`regions.${region}`)}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {regionCounts[region]}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Grouped category sections */}
      {grouped.map(({ category, providers: catProviders }) => (
        <div key={category} className="space-y-4">
          <div>
            <h3 className="text-h5">
              {t(`categories.${category}`)}
            </h3>
            <p className="text-muted-foreground font-medium">
              {catProviders.length} {catProviders.length === 1 ? "provider" : "providers"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catProviders.map((provider) => {
              const content = (
                <Card
                  key={provider.name}
                  variant="flex-column"
                  className="group/card h-full transition-opacity hover:opacity-90"
                >
                  <CardContent>
                    <div className="flex items-start justify-between gap-2">
                      <CardLabel variant="large">{provider.name}</CardLabel>
                      {provider.url && (
                        <ExternalLink className="text-muted-foreground mt-0.5 size-4 shrink-0 opacity-0 transition-opacity group-hover/card:opacity-100" />
                      )}
                    </div>
                    {provider.description && (
                      <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
                        {provider.description}
                      </p>
                    )}
                  </CardContent>
                  <div className="mt-auto flex items-center gap-2 pt-2 text-xs">
                    <span className="text-secondary-foreground font-medium">
                      {provider.subCategory}
                    </span>
                    {provider.region.length > 0 && (
                      <>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="text-muted-foreground">
                          {provider.region
                            .map((r) => t(`regions.${r}`))
                            .join(", ")}
                        </span>
                      </>
                    )}
                  </div>
                </Card>
              )

              if (provider.url) {
                return (
                  <a
                    key={provider.name}
                    href={provider.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                  >
                    {content}
                  </a>
                )
              }

              return content
            })}
          </div>
        </div>
      ))}

      {totalFiltered === 0 && (
        <div className="py-24 text-center">
          <p className="text-muted-foreground text-base font-medium">
            {t("filters.noResults")}
          </p>
          <button
            onClick={() => {
              setCategoryFilter("all")
              setRegionFilter("all")
            }}
            className="text-secondary-foreground hover:text-secondary-foreground/70 mt-3 text-sm font-medium transition-colors"
          >
            {t("filters.clearAll")}
          </button>
        </div>
      )}
    </div>
  )
}
