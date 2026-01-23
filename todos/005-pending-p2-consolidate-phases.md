---
status: completed
priority: p2
issue_id: 21
tags: [code-review, simplicity, i18n]
dependencies: []
resolution: added-to-plan
---

# Plan Over-Engineered: 6 Phases Should Be 3

## Problem Statement

The current plan has 6 implementation phases with artificial boundaries that create unnecessary overhead. Phases 3 and 4 (Chinese/Spanish translation) are nearly identical - just copy-paste with different JSON content.

**Why it matters**: More phases means more context switching, more planning overhead, and more opportunities to get stuck in "planning mode" instead of shipping.

## Findings

**Source**: Code Simplicity Reviewer

**Current 6-phase structure**:
1. Foundation (Core Infrastructure)
2. Translation Extraction (English Baseline)
3. Chinese Translation
4. Spanish Translation
5. Language Switcher & UX
6. SEO & Production

**Problems**:
- Phases 3 and 4 are duplicates with different locales
- ~80 lines of duplicated phase documentation
- Artificial separation between related tasks

## Proposed Solutions

### Option A: Consolidate to 3 phases (Recommended)

**Phase 1: Infrastructure + English extraction**
- Install next-intl
- Restructure to [locale]
- Create messages/en.json
- Extract all strings
- Handle ICU patterns

**Phase 2: Translations**
- Create messages/zh.json
- Create messages/es.json
- Test both locales
- Handle locale-specific formatting

**Phase 3: Polish & Ship**
- Language switcher
- hreflang tags
- Sitemap
- QA all locales

**Pros**: Clearer path to shipping, less overhead
**Cons**: Larger individual phases
**Effort**: Documentation update only
**Risk**: Low

## Recommended Action

Update issue #21 to consolidate phases. Key changes:
1. Merge Phase 2, 2.5, 3, 4 into single "Content & Translations" phase
2. Merge Phase 5, 6 into single "Polish & Ship" phase
3. Remove duplicated task lists

## Technical Details

**Files to modify**:
- Issue #21 body (GitHub)
- `plans/feat-internationalize-institutions-subdomain-zh-es.md`

## Acceptance Criteria

- [ ] Plan has 3 clear phases
- [ ] No duplicated task descriptions
- [ ] Each phase has clear deliverable

## Work Log

| Date | Action | Outcome/Learnings |
|------|--------|-------------------|
| 2026-01-21 | Plan review | Identified over-engineering |

## Resources

- Issue #21: i18n implementation plan
