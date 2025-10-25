"use client"

import { CornerUpRight } from "lucide-react"
import { usePathname } from "next/navigation"

import Link from "@/components/ui/link"

const ParentPathLink = ({ className }: { className?: string }) => {
  const pathname = usePathname()

  const parentPath = pathname.split("/").slice(0, -1).join("/")

  if (!parentPath) return null

  return (
    <Link href={parentPath} className={className}>
      <CornerUpRight />
      &nbsp; Go up to {parentPath}
    </Link>
  )
}

export default ParentPathLink
