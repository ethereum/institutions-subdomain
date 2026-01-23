---
status: pending
priority: p2
issue_id: 21
tags: [code-review, performance, i18n]
dependencies: []
---

# Build Time Expectations Need Adjustment

## Problem Statement

The plan's acceptance criteria states "build time increase < 50%" but adding 3 locales will generate 3x the static pages (9 pages x 3 locales = 27 pages).

**Why it matters**: Setting unrealistic expectations leads to confusion during implementation and review.

## Findings

**Source**: Performance Oracle review

**Current expectation** (line 506): "Build time increase < 50% with additional locales"

**Realistic expectation**: 2-3x increase in static page generation time

**Mitigating factors**:
- Next.js parallel static generation
- Turbopack usage (already in build script)
- Pages share compiled JavaScript (only translation JSON differs)
- Wall-clock increase will be lower than theoretical 3x due to parallelization

## Proposed Solutions

### Option A: Update acceptance criteria (Recommended)

Change from:
> Build time increase < 50% with additional locales

To:
> Build time increase acceptable (expect 2-3x for page generation, mitigated by parallelization)

**Pros**: Sets realistic expectations
**Cons**: None
**Effort**: Small
**Risk**: Low

## Recommended Action

Update acceptance criteria in the plan to set realistic build time expectations.

## Work Log

| Date | Action | Outcome/Learnings |
|------|--------|-------------------|
| 2026-01-22 | Plan review round 2 | Identified unrealistic build time expectation |

## Resources

- Issue #21: i18n implementation plan
