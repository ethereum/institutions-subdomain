"use client"

import { ReactNode } from "react"
import { Info } from "lucide-react"
import { useTranslations } from "next-intl"

import type { LastUpdated, SourceInfo } from "@/lib/types"

import { cn } from "@/lib/utils"

import TooltipPopover from "../TooltipPopover"
import { InlineTextIcon } from "../ui/inline-text"
import Link from "../ui/link"

type InfoTooltipProps = {
  children: ReactNode
  className?: string
  ariaLabel?: string
}

const InfoTooltip = ({ children, className, ariaLabel }: InfoTooltipProps) => {
  const t = useTranslations("common")
  return (
    <TooltipPopover content={<div className={className}>{children}</div>}>
      <Info
        aria-label={ariaLabel || t("moreInfo")}
        className="size-[0.875em] translate-y-[0.06125em]"
      />
    </TooltipPopover>
  )
}

const SourceInfoTooltip = ({
  source,
  sourceHref,
  lastUpdated,
  children,
  className,
}: SourceInfo &
  LastUpdated &
  Omit<InfoTooltipProps, "children"> & { children?: string }) => {
  const t = useTranslations("common")
  return (
    <InlineTextIcon className={className}>
      <InfoTooltip ariaLabel={t("sourceInfo")}>
        {children}
        {source && (
          <p className={cn("text-nowrap", children && "mt-2")}>
            {t("source")}:{" "}
            {sourceHref ? (
              <Link inline href={sourceHref}>
                {source}
              </Link>
            ) : (
              source
            )}
          </p>
        )}
        {lastUpdated && (
          <p className="text-nowrap">{t("lastUpdated")}: {lastUpdated}</p>
        )}
      </InfoTooltip>
    </InlineTextIcon>
  )
}

export { InfoTooltip, SourceInfoTooltip }
