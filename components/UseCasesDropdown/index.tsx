"use client"

import { useState } from "react"
import { Triangle } from "lucide-react"

import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import Link, { LinkProps } from "../ui/link"

type UseCasesDropdownProps = {
  className?: string
  label: string
  links: LinkProps[]
}

const UseCasesDropdown = ({ className, label, links }: UseCasesDropdownProps) => {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          "css-primary-conditional !cursor-pointer font-medium data-[state=open]:[&>svg]:scale-y-75",
          className
        )}
      >
        {label}&nbsp;
        <Triangle className="inline size-[0.75em] -scale-y-75 fill-current transition-transform" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {links.map((props) => (
          <DropdownMenuItem key={props.href} asChild>
            <Link
              onClick={() => setOpen(false)}
              className="w-full text-base"
              {...props}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UseCasesDropdown
