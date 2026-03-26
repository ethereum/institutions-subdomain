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
import { type Locale, locales } from "@/i18n/routing"

const localeNames: Record<Locale, { full: string; compact: string }> = {
  en: { full: "English", compact: "en" },
  zh: { full: "中文", compact: "中文" },
  es: { full: "Español", compact: "es" },
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
          "css-primary-conditional flex !cursor-pointer items-center gap-1.5 font-medium",
          className
        )}
      >
        <Globe className="size-4" />
        <span className="max-sm:hidden lg:max-xl:hidden">
          {localeNames[locale].full}
        </span>
        <span className="sm:max-lg:hidden xl:hidden">
          {localeNames[locale].compact.toLocaleUpperCase(locale)}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={cn("cursor-pointer", loc === locale && "bg-accent")}
          >
            {localeNames[loc].full}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSwitcher
