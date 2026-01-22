"use client"

import { Globe } from "lucide-react"
import { useLocale } from "next-intl"

import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

import { usePathname, useRouter } from "@/i18n/navigation"
import { type Locale,locales } from "@/i18n/routing"

const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  es: "Español",
}

type LanguageSwitcherProps = {
  className?: string
}

const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "css-primary-conditional flex items-center gap-1.5 !cursor-pointer font-medium",
          className
        )}
      >
        <Globe className="size-4" />
        <span className="max-sm:sr-only">{localeNames[locale]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={cn(
              "cursor-pointer",
              loc === locale && "bg-accent"
            )}
          >
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSwitcher
