"use client"

import { CornerUpRight } from "lucide-react"
import { useTranslations } from "next-intl"

import Link from "@/components/ui/link"

import { cn } from "@/lib/utils"

import { usePathname } from "@/i18n/navigation"

const ParentPathLink = ({ className }: { className?: string }) => {
  const pathname = usePathname()
  const t = useTranslations("common")

  const parentPath = pathname.split("/").slice(0, -1).join("/")

  if (!parentPath) return null

  return (
    <Link href={parentPath} className={cn("group/up-link", className)}>
      <CornerUpRight className="group-hover/up-link:animate-wiggle" />
      &nbsp; {t("go-up-to", { path: parentPath })}
    </Link>
  )
}

export default ParentPathLink
