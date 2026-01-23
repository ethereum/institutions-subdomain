---
status: completed
priority: p1
issue_id: 21
tags: [code-review, architecture, i18n, critical]
dependencies: []
resolution: added-to-plan
---

# Library Post Utilities Need Locale Parameter

## Problem Statement

The library post loading utilities in `/app/library/[slug]/utils.ts` currently hardcode the posts directory path. For i18n support with locale-specific posts (`/public/posts/en/`, `/public/posts/zh/`), these utilities need to accept and use a locale parameter.

**Why it matters**: Without this change, localized library posts cannot be loaded, breaking a core feature of the i18n implementation.

## Findings

**Source**: Architecture Strategist review

**Current implementation**:
```typescript
// app/library/[slug]/constants.ts
export const MD_DIR_POSTS = "public/posts"

// app/library/[slug]/utils.ts
export function fetchPosts() {
  const files = fs.readdirSync(MD_DIR_POSTS);
  // ...
}

export function getPost(slug: string) {
  const filePath = path.join(MD_DIR_POSTS, `${slug}.md`);
  // ...
}
```

**Required for i18n**:
```
/public/posts/
  en/
    fusaka-upgrade-overview.md
  zh/
    fusaka-upgrade-overview.md (translated)
  es/
    fusaka-upgrade-overview.md (translated)
```

## Proposed Solutions

### Option A: Add locale parameter to existing functions
```typescript
// constants.ts
export const PATH_POSTS = "posts"
export const getMdDirPosts = (locale: string) =>
  `public/${PATH_POSTS}/${locale}`

// utils.ts
export function fetchPosts(locale: string = 'en') {
  const postsDir = getMdDirPosts(locale);
  const files = fs.readdirSync(postsDir);
  // ...
}

export function getPost(slug: string, locale: string = 'en') {
  const postsDir = getMdDirPosts(locale);
  const filePath = path.join(postsDir, `${slug}.md`);
  // ...
}
```

**Pros**: Minimal changes, backward compatible
**Cons**: Need to pass locale through call chain
**Effort**: Small
**Risk**: Low

### Option B: Fallback to English if locale post doesn't exist
```typescript
export function getPost(slug: string, locale: string = 'en') {
  const localizedPath = path.join(getMdDirPosts(locale), `${slug}.md`);

  if (fs.existsSync(localizedPath)) {
    return readPost(localizedPath);
  }

  // Fallback to English
  const englishPath = path.join(getMdDirPosts('en'), `${slug}.md`);
  return readPost(englishPath);
}
```

**Pros**: Graceful degradation for missing translations
**Cons**: Slightly more complex
**Effort**: Small
**Risk**: Low

## Recommended Action

Implement both Option A and Option B:
1. Add locale parameter to all functions
2. Include fallback logic to English for missing translations
3. Validate locale parameter before use (see security todo)

## Technical Details

**Files to modify**:
- `app/library/[slug]/constants.ts` - Add locale-aware path function
- `app/library/[slug]/utils.ts` - Add locale parameter
- `app/library/[slug]/page.tsx` - Pass locale from params
- `app/library/page.tsx` - Pass locale from params

## Acceptance Criteria

- [ ] `fetchPosts(locale)` accepts locale parameter
- [ ] `getPost(slug, locale)` accepts locale parameter
- [ ] Missing locale posts fall back to English
- [ ] Locale parameter is validated against allowlist
- [ ] Library page at `/zh/library` shows posts (with fallback)

## Work Log

| Date | Action | Outcome/Learnings |
|------|--------|-------------------|
| 2026-01-21 | Plan review | Identified required utility changes |

## Resources

- Current utils: `app/library/[slug]/utils.ts`
- Issue #21: i18n implementation plan
