"use client"

import { useState } from "react"

import { defiCategories } from "../constants"
import { CategoryKeyWithAll } from "../types"

import CategoryAppGrid from "./CategoryAppGrid"
import CategoryDropdown from "./CategoryDropdown"

const AppGrid = () => {
  const categoryState = useState<CategoryKeyWithAll>("all")
  const [categoryKey] = categoryState
  const displayCategories =
    categoryKey === "all" ? defiCategories : [categoryKey]

  return (
    <>
      <span className="font-medium">Show</span>&nbsp;
      <CategoryDropdown categoryState={categoryState} />
      {displayCategories.map((key) => (
        <CategoryAppGrid key={key} category={key} />
      ))}
    </>
  )
}

export default AppGrid
