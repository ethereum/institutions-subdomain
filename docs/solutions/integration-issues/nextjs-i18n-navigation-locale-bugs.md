---
title: "next-intl Navigation Loses Locale & Auto-Redirect Issues"
category: integration-issues
tags: [i18n, next-intl, navigation, locale, nextjs, app-router]
related_components: [Link, middleware, routing, LanguageSwitcher]
date_documented: 2025-01-27
related_issues: ["#21", "#23"]
---

# next-intl Navigation Loses Locale & Auto-Redirect Issues

Two critical bugs when implementing i18n with next-intl in Next.js App Router: navigation losing locale context and unwanted auto-redirects based on browser language.

## Problem 1: Navigation Resets Language Selection

### Symptom

User selects a language (e.g., Chinese) via the LanguageSwitcher, then navigates using menu links (dropdown, footer, etc.). The page unexpectedly resets to a different language (often English or based on browser locale).

### Root Cause

The application had a custom `Link` wrapper component (`components/ui/link.tsx`) that handled external links, mailto, hash links, etc. This wrapper imported from `next/link`:

```typescript
// ❌ WRONG - loses locale context
import NextLink from "next/link"

// In component:
return <NextLink {...commonProps}>{children}</NextLink>
```

The standard `next/link` doesn't know about next-intl's locale routing. When navigating, it produces URLs without the locale prefix, causing the middleware to re-detect locale from cookies/headers.

### Solution

Replace `next/link` with the locale-aware `Link` from `@/i18n/navigation`:

```typescript
// ✅ CORRECT - preserves locale context
import { Link as IntlLink } from "@/i18n/navigation"

// In component:
return <IntlLink {...commonProps}>{children}</IntlLink>
```

### Full Fix

**File: `components/ui/link.tsx`**

```diff
 import { ComponentProps, forwardRef } from "react"
 import { ExternalLink, Mail } from "lucide-react"
-import NextLink from "next/link"
+
+import { Link as IntlLink } from "@/i18n/navigation"
 import { cn } from "@/lib/utils"

 export type LinkProps = ComponentProps<"a"> &
-  ComponentProps<typeof NextLink> & {
+  ComponentProps<typeof IntlLink> & {
     showDecorator?: boolean
     inline?: boolean
   }

 // ... component logic unchanged ...

-  return <NextLink {...commonProps}>{children}</NextLink>
+  return <IntlLink {...commonProps}>{children}</IntlLink>
```

### Why It Works

The `Link` from `@/i18n/navigation` is created by `createNavigation(routing)` and automatically:
- Reads the current locale from the request context
- Prefixes internal hrefs with the current locale (e.g., `/about` → `/zh/about`)
- Passes through external links unchanged

By updating the base Link wrapper, ALL internal navigation in the app becomes locale-aware without changing imports elsewhere.

---

## Problem 2: Auto-Redirect Based on Browser Locale

### Symptom

Users visiting the root URL `/` are automatically redirected to `/zh` or `/es` based on their browser's Accept-Language header. Users expect to see English by default and only change language when they explicitly select it.

### Root Cause

next-intl's default middleware behavior includes automatic locale detection:

```typescript
// Default behavior (implicit)
export const routing = defineRouting({
  locales: ["en", "zh", "es"],
  defaultLocale: "en",
  // localeDetection: true  ← DEFAULT
})
```

When `localeDetection` is enabled (default), the middleware:
1. Reads the `Accept-Language` header
2. Matches against supported locales
3. Redirects to the detected locale

### Solution

Disable automatic locale detection:

```typescript
export const routing = defineRouting({
  locales: ["en", "zh", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false, // Only change locale when user explicitly selects
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 31536000,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
})
```

### Why It Works

With `localeDetection: false`:
- Users always see the `defaultLocale` (English) on first visit
- The `NEXT_LOCALE` cookie still stores their preference after explicit selection
- Return visits respect the cookie (explicit user choice), not browser headers

---

## Prevention Strategies

### 1. Always Use Locale-Aware Navigation

When building Link wrapper components, always start with next-intl's Link:

```typescript
// i18n/navigation.ts - the source of truth
import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

Then import from this file, not from `next/link`:

```typescript
// ✅ Good
import { Link } from "@/i18n/navigation"

// ❌ Bad - loses locale
import Link from "next/link"
```

### 2. Decide on Locale Detection Early

Ask: "Should users see their browser's language by default, or a fixed default?"

| Preference | Setting |
|------------|---------|
| Browser language auto-detect | `localeDetection: true` (default) |
| Fixed default, explicit selection | `localeDetection: false` |

### 3. Test the Cookie Behavior

The `NEXT_LOCALE` cookie persists across sessions. When testing:

1. Clear the cookie in DevTools before testing first-visit behavior
2. Verify cookie is set after explicit language selection
3. Confirm cookie is respected on return visits

### 4. Grep for next/link Usage

After implementing i18n, search for any remaining direct `next/link` imports:

```bash
grep -r "from ['\"]next/link['\"]" --include="*.tsx" --include="*.ts"
```

All internal navigation should use the locale-aware wrapper.

---

## Testing Checklist

- [ ] Visit `/` with no cookie → shows default locale (English)
- [ ] Visit `/` with Spanish browser → still shows English (no auto-redirect)
- [ ] Select Chinese via LanguageSwitcher → URL changes to `/zh`
- [ ] Navigate via menu dropdown → stays in Chinese (`/zh/rwa`, etc.)
- [ ] Navigate via footer links → stays in Chinese
- [ ] Refresh page → still Chinese (cookie persisted)
- [ ] Close browser, reopen → still Chinese (cookie survives session)

---

## Related Documentation

- [next-intl Navigation APIs](https://next-intl.dev/docs/routing/navigation)
- [next-intl Middleware Configuration](https://next-intl.dev/docs/routing/middleware)
- [Base i18n Setup](./nextjs-i18n-next-intl.md)

## References

- PR #23: feat(i18n): add Chinese and Spanish language support
- Issue #21: Internationalize site specification
- Commit `3d2adf1`: fix(i18n): preserve locale on navigation and disable auto-redirect
