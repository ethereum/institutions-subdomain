---
status: pending
priority: p3
issue_id: 21
tags: [code-review, architecture, i18n]
dependencies: []
---

# Specify Nested generateStaticParams for Library Posts

## Problem Statement

The plan mentions adding `generateStaticParams()` to all pages but doesn't specify the nested params pattern needed for `[locale]/library/[slug]` route.

**Why it matters**: Without correct nested params, the build will fail or only generate English library post pages.

## Findings

**Source**: Architecture Strategist review

**Required pattern for nested routes**:
```tsx
// /app/[locale]/library/[slug]/page.tsx
export async function generateStaticParams() {
  const locales = ['en', 'zh', 'es'];
  const posts = await getLibraryPosts('en'); // English posts as base

  return locales.flatMap((locale) =>
    posts.map((post) => ({
      locale,
      slug: post.slug,
    }))
  );
}
```

## Proposed Solutions

### Option A: Add to Phase 1.2 (Recommended)

Add explicit task in Phase 1.2 showing the nested params pattern for library routes.

**Effort**: Small
**Risk**: Low

## Recommended Action

Add code example to plan showing nested `generateStaticParams` for library posts.

## Work Log

| Date | Action | Outcome/Learnings |
|------|--------|-------------------|
| 2026-01-22 | Plan review round 2 | Identified missing implementation detail |

## Resources

- Issue #21: i18n implementation plan
- Next.js docs on generateStaticParams with nested routes
