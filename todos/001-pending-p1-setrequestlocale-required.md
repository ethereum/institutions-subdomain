---
status: completed
priority: p1
issue_id: 21
tags: [code-review, performance, i18n, critical]
dependencies: []
resolution: added-to-plan
---

# Missing `setRequestLocale` Will Break Static Rendering

## Problem Statement

The i18n plan does not emphasize that every page and layout in `app/[locale]/` MUST call `setRequestLocale(locale)` at the top of the component. Without this, Next.js cannot statically render pages, and every request hits the server dynamically.

**Why it matters**: This is the difference between a fast, cached site and a slow, server-rendered site. Missing this single line in any page breaks the entire static generation strategy.

## Findings

**Source**: Performance Oracle review

**Evidence**:
- next-intl documentation requires `setRequestLocale` for SSG
- Every page using `[locale]` dynamic segment needs this call
- Without it, pages fall back to dynamic rendering

**Pattern required in every page.tsx and layout.tsx**:
```typescript
import { setRequestLocale } from 'next-intl/server';

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);  // MUST HAVE THIS

  // ... rest of component
}
```

## Proposed Solutions

### Option A: Add checklist item to each phase (Recommended)
**Pros**: Catches it during implementation
**Cons**: Easy to miss during code review
**Effort**: Small
**Risk**: Medium - relies on developer discipline

### Option B: Create ESLint rule to enforce
**Pros**: Automated enforcement
**Cons**: Requires custom ESLint config
**Effort**: Medium
**Risk**: Low

### Option C: Create wrapper component that includes it
**Pros**: Can't forget it
**Cons**: Adds abstraction layer
**Effort**: Medium
**Risk**: Low

## Recommended Action

Add explicit instruction in Phase 1 and Phase 2 documentation:

> **CRITICAL**: Every page.tsx and layout.tsx under `app/[locale]/` MUST include:
> ```typescript
> setRequestLocale(locale);
> ```
> Without this, static generation will fail silently.

## Technical Details

**Affected files (all pages):**
- `app/[locale]/layout.tsx`
- `app/[locale]/page.tsx`
- `app/[locale]/rwa/page.tsx`
- `app/[locale]/defi/page.tsx`
- `app/[locale]/privacy/page.tsx`
- `app/[locale]/layer-2/page.tsx`
- `app/[locale]/data-hub/page.tsx`
- `app/[locale]/library/page.tsx`
- `app/[locale]/library/[slug]/page.tsx`

## Acceptance Criteria

- [ ] `setRequestLocale` is called in every page/layout under `[locale]`
- [ ] Build completes with static generation for all locales
- [ ] `pnpm build` output shows static pages, not dynamic

## Work Log

| Date | Action | Outcome/Learnings |
|------|--------|-------------------|
| 2026-01-21 | Plan review | Identified critical gap in plan |

## Resources

- [next-intl Static Rendering Guide](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#static-rendering)
- Issue #21: i18n implementation plan
