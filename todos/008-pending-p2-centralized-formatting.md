---
status: completed
priority: p2
issue_id: 21
tags: [code-review, pattern, i18n]
dependencies: []
resolution: added-to-plan
---

# Centralized Formatting Abstraction Needed

## Problem Statement

There are 107 formatting calls (`formatLargeCurrency`, `formatPercent`, etc.) spread across multiple files. The plan proposes two options but doesn't recommend a clear pattern, risking inconsistent implementations.

**Why it matters**: Without a centralized abstraction, different developers may format the same data differently, leading to visual inconsistencies and maintenance burden.

## Findings

**Source**: Pattern Recognition Specialist

**Current formatting calls by file**:
- `app/page.tsx` - 20+ calls
- `app/rwa/page.tsx` - 15+ calls
- `app/data-hub/page.tsx` - 20+ calls
- `app/layer-2/page.tsx` - 15+ calls
- `app/defi/page.tsx` - 10+ calls
- Chart components - 6+ calls
- Various other components

**Risk**: Each migration could introduce inconsistencies if done ad-hoc.

## Proposed Solutions

### Option A: Centralized formatter wrapper (Recommended)

```typescript
// /lib/i18n/formatters.ts
import { getFormatter } from "next-intl/server"

export const createFormatters = async () => {
  const format = await getFormatter()

  return {
    largeCurrency: (value: number) =>
      format.number(value, {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumSignificantDigits: 3,
      }),

    percent: (value: number) =>
      format.number(value, {
        style: "percent",
        maximumSignificantDigits: 2,
      }),

    dateMonthDayYear: (date: Date | number | string) =>
      format.dateTime(new Date(date), {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),

    largeNumber: (value: number) =>
      format.number(value, {
        notation: "compact",
        maximumSignificantDigits: 3,
      }),
  }
}
```

**Pros**:
- Single source of truth
- Easy to migrate existing calls
- Consistent formatting across site

**Cons**:
- Additional abstraction layer

**Effort**: Medium
**Risk**: Low

## Recommended Action

1. Create centralized formatter wrapper
2. Migrate existing utilities to use it
3. Update all 107 call sites to use new formatters

## Technical Details

**Files to create**:
- `lib/i18n/formatters.ts` - Server formatters
- `lib/i18n/formatters.client.ts` - Client formatters (useFormatter)

**Files to modify**:
- All files using `formatLargeCurrency`, `formatPercent`, etc.

## Acceptance Criteria

- [ ] Centralized formatters file exists
- [ ] All 107 format calls use centralized formatters
- [ ] No direct `Intl.NumberFormat("en-US")` calls remain
- [ ] Formatting is consistent across all pages

## Work Log

| Date | Action | Outcome/Learnings |
|------|--------|-------------------|
| 2026-01-21 | Plan review | Identified pattern consistency need |

## Resources

- next-intl formatting: https://next-intl.dev/docs/usage/dates-times
- Issue #21: i18n implementation plan
