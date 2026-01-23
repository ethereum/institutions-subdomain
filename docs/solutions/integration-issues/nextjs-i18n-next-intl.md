---
title: "Next.js App Router i18n with next-intl"
category: integration-issues
tags: [i18n, next-intl, localization, nextjs, typescript]
related_components: [middleware, routing, metadata, sitemap]
date_documented: 2026-01-22
---

# Next.js App Router i18n with next-intl

Full internationalization implementation for a Next.js 16 site supporting English, Chinese, and Spanish.

## Problem

Internationalize a Next.js App Router site to support multiple languages with:
- URL-based locale routing (`/`, `/zh/*`, `/es/*`)
- 300+ translatable strings
- Dynamic data interpolation (percentages, currencies, dates)
- SEO support (hreflang, sitemap)
- Locale persistence

## Solution

### 1. Core Configuration

**i18n/routing.ts**
```typescript
import { defineRouting } from "next-intl/routing"

export const locales = ["en", "zh", "es"] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed", // No prefix for default locale
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 31536000,
  },
})
```

**i18n/request.ts**
```typescript
import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

**middleware.ts**
```typescript
import createMiddleware from "next-intl/middleware"
import { routing } from "@/i18n/routing"

export default createMiddleware(routing)

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
```

### 2. Page Structure

Move all pages under `app/[locale]/`:

```
app/[locale]/
├── layout.tsx      # Root layout with NextIntlClientProvider
├── page.tsx        # Home
├── rwa/page.tsx
├── defi/page.tsx
└── ...
```

**Every page must:**
```typescript
import { setRequestLocale } from "next-intl/server"
import { type Locale, routing } from "@/i18n/routing"

type Props = { params: Promise<{ locale: Locale }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)  // CRITICAL for static rendering

  const t = await getTranslations("namespace")
  // ...
}
```

### 3. Translation Files

**messages/en.json** (302 keys)
```json
{
  "common": { "menu": "Menu" },
  "nav": { "home": "Home", "rwa": "RWAs & Stablecoins" },
  "home": {
    "hero": { "heading": "The Institutional Liquidity Layer" },
    "numbers": {
      "defiMarketShare": "{percent}+ of all blockchains"
    }
  }
}
```

**ICU interpolation for word order differences:**
```json
// en.json
"defiMarketShare": "{percent}+ of all blockchains"

// zh.json (different word order)
"defiMarketShare": "占所有区块链的{percent}以上"

// es.json
"defiMarketShare": "más del {percent} de todas las blockchains"
```

### 4. Language Switcher

```typescript
"use client"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { type Locale, locales } from "@/i18n/routing"

const LanguageSwitcher = () => {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale })
  }
  // ... dropdown UI
}
```

### 5. SEO: hreflang Meta Tags

**lib/utils/metadata.ts**
```typescript
export const getMetadata = async ({ slug, locale }: { slug: string; locale?: Locale }) => {
  const languages: Record<string, string> = {}
  for (const loc of locales) {
    const localePath = loc === "en" ? slug : `${loc}/${slug}`
    languages[loc] = new URL(localePath, SITE_URL).href
  }
  languages["x-default"] = new URL(slug, SITE_URL).href

  return {
    alternates: { canonical: url, languages },
    // ...
  }
}
```

### 6. Sitemap

**next-sitemap.config.js**
```javascript
module.exports = {
  siteUrl: "https://example.com",
  alternateRefs: [
    { href: siteUrl, hreflang: "en" },
    { href: `${siteUrl}/zh`, hreflang: "zh" },
    { href: `${siteUrl}/es`, hreflang: "es" },
    { href: siteUrl, hreflang: "x-default" },
  ],
}
```

### 7. Validation Script

**scripts/validate-translations.ts**
```typescript
import en from "../messages/en.json"
import zh from "../messages/zh.json"
import es from "../messages/es.json"

function getKeys(obj, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k
    return typeof v === "object" ? getKeys(v, key) : [key]
  })
}

const enKeys = getKeys(en)
const missing = {
  zh: enKeys.filter(k => !getKeys(zh).includes(k)),
  es: enKeys.filter(k => !getKeys(es).includes(k)),
}

if (missing.zh.length || missing.es.length) {
  console.error("Missing translations:", missing)
  process.exit(1)
}
```

Run with: `pnpm validate:i18n`

## Key Gotchas

1. **`setRequestLocale()` is mandatory** - Without it, pages fall back to dynamic rendering
2. **Use `Locale` type, not `string`** - Prevents type errors in metadata functions
3. **ICU variables must match** - `{percent}` in en.json must exist in zh.json
4. **Library posts need fallback** - Check if locale directory exists, fall back to English

## Prevention

- Run `pnpm validate:i18n` before builds
- Use the `Locale` type from routing config consistently
- Test locale switching in all pages
- Verify hreflang tags in page source

## Dependencies

```json
{
  "next": "16.0.10",
  "next-intl": "^4.7.0",
  "next-sitemap": "^4.2.3"
}
```

## References

- [next-intl App Router docs](https://next-intl.dev/docs/getting-started/app-router)
- [Next.js i18n guide](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- Commit: `e20cc66` - feat(i18n): add Chinese and Spanish language support
