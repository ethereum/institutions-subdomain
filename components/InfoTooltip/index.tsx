import { ReactNode } from "react"
import { Info } from "lucide-react"

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

const InfoTooltip = ({ children, className, ariaLabel }: InfoTooltipProps) => (
  <TooltipPopover content={<div className={className}>{children}</div>}>
    <Info
      aria-label={ariaLabel || "More information"}
      className="size-[0.875em] translate-y-[0.06125em]"
    />
  </TooltipPopover>
)

const SourceInfoTooltip = ({
  source,
  sourceHref,
  lastUpdated,
  children,
  className,
}: SourceInfo &
  LastUpdated &
  Omit<InfoTooltipProps, "children"> & { children?: ReactNode }) => (
  <InlineTextIcon className={className}>
    <InfoTooltip ariaLabel="Source information">
      {children}
      {source && (
        <p className={cn("text-nowrap", children && "mt-2")}>
          Source:{" "}
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
        <p className="text-nowrap">Last updated: {lastUpdated}</p>
      )}
    </InfoTooltip>
  </InlineTextIcon>
)

export { InfoTooltip, SourceInfoTooltip }
