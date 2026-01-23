---
status: completed
priority: p1
issue_id: 21
tags: [code-review, architecture, i18n, critical]
dependencies: []
resolution: added-to-plan
---

# ContactForm Path Handling Needs Update for Locale-Aware Paths

## Problem Statement

The ContactForm component uses `usePathname()` to track navigation and reset form state. After adding the `[locale]` segment, paths will change from `/rwa` to `/zh/rwa`, breaking the path comparison logic.

**Why it matters**: The form will reset incorrectly when users navigate between locale variants of the same page, causing poor UX and potential data loss.

## Findings

**Source**: Architecture Strategist review

**Current implementation** (`components/ContactForm/index.tsx`):
```typescript
const pathname = usePathname()
const prevPathname = useRef(pathname)

// This comparison will fail when:
// - User navigates from /rwa to /zh/rwa
// - User switches language while on a page
```

**After i18n**:
- `/rwa` becomes `/en/rwa` or just `/rwa` (default)
- `/zh/rwa` is the Chinese version of the same page
- Form resets when path changes, but these are the same logical page

## Proposed Solutions

### Option A: Normalize paths by stripping locale (Recommended)
```typescript
function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(en|zh|es)/, '');
}

const pathname = usePathname();
const normalizedPath = stripLocale(pathname);
const prevNormalizedPath = useRef(normalizedPath);

// Compare normalized paths
if (normalizedPath !== prevNormalizedPath.current) {
  resetForm();
}
```

**Pros**: Simple, maintains existing logic
**Cons**: Hardcodes locale list
**Effort**: Small
**Risk**: Low

### Option B: Use next-intl's usePathname
```typescript
import { usePathname } from '@/i18n/navigation';

// next-intl's usePathname automatically strips locale
const pathname = usePathname(); // Returns /rwa for both /rwa and /zh/rwa
```

**Pros**: Uses library's built-in solution
**Cons**: Requires importing from i18n config
**Effort**: Small
**Risk**: Low

## Recommended Action

Use Option B - next-intl provides locale-stripped `usePathname`. Update the import:

```typescript
// Before
import { usePathname } from 'next/navigation';

// After
import { usePathname } from '@/i18n/navigation';
```

## Technical Details

**Affected files**:
- `components/ContactForm/index.tsx`
- Any other component using `usePathname` for navigation logic

**Dependencies**:
- Requires i18n/navigation.ts to be created first (Phase 1)

## Acceptance Criteria

- [ ] ContactForm uses next-intl's usePathname
- [ ] Form does NOT reset when switching languages on same page
- [ ] Form DOES reset when navigating to different page
- [ ] Manual testing: switch from `/rwa` to `/zh/rwa`, form state preserved

## Work Log

| Date | Action | Outcome/Learnings |
|------|--------|-------------------|
| 2026-01-21 | Plan review | Identified breaking change |

## Resources

- next-intl navigation: https://next-intl.dev/docs/routing/navigation
- Issue #21: i18n implementation plan
