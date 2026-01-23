---
status: pending
priority: p3
issue_id: 21
tags: [code-review, i18n, content]
dependencies: []
---

# Keep Testimonial Quotes in English

## Problem Statement

The plan asks "Testimonial quotes: Translate or keep in English?" (line ~211) without a recommendation.

**Why it matters**: Translating attributed quotes from named individuals is unusual and potentially problematic.

## Findings

**Source**: DHH Rails Reviewer

**Recommendation**: Keep quotes in English. They are attributed quotes from named individuals (e.g., "Global Head of Digital Assets Research @ Standard Chartered").

Translating someone's actual quote is awkward. Just translate:
- The attribution labels/titles
- Any surrounding context text

## Proposed Solutions

### Option A: Document decision in plan (Recommended)

Add to plan: "Testimonial quotes remain in English; only translate attribution titles and surrounding UI text."

**Effort**: Small
**Risk**: Low

## Recommended Action

Add explicit decision to plan that testimonial quotes stay in English.

## Work Log

| Date | Action | Outcome/Learnings |
|------|--------|-------------------|
| 2026-01-22 | Plan review round 2 | Resolved open question |

## Resources

- Issue #21: i18n implementation plan
