"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { defiCategories } from "../constants"
import { defiEcosystem } from "../data"
import type { CategoryKeyWithAll } from "../types"

type CategoryDropdownProps = {
  categoryState: [
    CategoryKeyWithAll,
    React.Dispatch<React.SetStateAction<CategoryKeyWithAll>>,
  ]
}
const CategoryDropdown = ({ categoryState }: CategoryDropdownProps) => {
  const [open, setOpen] = useState(false)
  const [categoryKey, setCategoryKey] = categoryState

  const label =
    categoryKey === "all"
      ? "All categories"
      : defiEcosystem[categoryKey].heading

  const handleClick = (selectedCategoryKey: CategoryKeyWithAll) => () => {
    setOpen(false)
    setCategoryKey(selectedCategoryKey)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="text-secondary-foreground font-medium [&>svg]:transition-transform data-[state=open]:[&>svg]:-rotate-180 data-[state=open]:[&>svg]:transition-transform">
        {label}&nbsp;
        <ChevronDown className="inline" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <p className="text-base font-bold" onClick={handleClick("all")}>
            All categories
          </p>
        </DropdownMenuItem>

        {defiCategories.map((category) => (
          <DropdownMenuItem key={category} asChild>
            <p
              className="w-full !cursor-pointer !text-base font-medium"
              onClick={handleClick(category)}
            >
              {defiEcosystem[category].heading}
            </p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CategoryDropdown
