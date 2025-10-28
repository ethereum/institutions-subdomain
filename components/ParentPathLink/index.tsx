"use client"

import { CornerUpRight } from "lucide-react"
import { usePathname } from "next/navigation"

import Link from "@/components/ui/link"

import { cn } from "@/lib/utils"

const ParentPathLink = ({ className }: { className?: string }) => {
  const pathname = usePathname()

  const parentPath = pathname.split("/").slice(0, -1).join("/")

  if (!parentPath) return null

  return (
    <Link href={parentPath} className={cn("group/up-link", className)}>
      <CornerUpRight className="group-hover/up-link:animate-wiggle" />
      &nbsp; Go up to {parentPath}
    </Link>
  )
}

export default ParentPathLink
