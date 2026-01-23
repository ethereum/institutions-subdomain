---
status: completed
priority: p2
issue_id: 21
tags: [code-review, architecture, pattern, i18n]
dependencies: []
resolution: added-to-plan
---

# Translation Files Should Be Namespaced, Not Monolithic

## Problem Statement

The plan proposes a single `messages/en.json` file with ~495 strings. This will become unmaintainable and affects performance (loads all translations for every page).

**Why it matters**:
- Large JSON files are hard to review in PRs
- Merge conflicts when multiple people translate
- All translations loaded even for simple pages
- ethereum.org uses namespaced files for 60+ languages successfully

## Findings

**Source**: Architecture Strategist, Pattern Recognition Specialist

**Current proposal**:
```
messages/
  en.json     # ~495 strings in one file
  zh.json
  es.json
```

**Recommended structure**:
```
messages/
  en/
    common.json          # ~50 shared strings
    navigation.json      # ~30 nav strings
    page-home.json       # ~100 homepage strings
    page-rwa.json        # ~80 RWA page strings
    page-defi.json       # ~60 DeFi page strings
    page-layer-2.json    # ~70 L2 page strings
    page-data-hub.json   # ~50 data hub strings
    components.json      # ~55 component strings
  zh/
    ... (same structure)
  es/
    ... (same structure)
```

## Proposed Solutions

### Option A: Namespaced files per page (Recommended)
Follow ethereum.org pattern with one file per major page/feature.

**Pros**:
- Parallel translation work
- Code splitting possible
- Easier PR reviews
- Matches ethereum.org pattern

**Cons**:
- More files to manage
- Slightly more complex loading

**Effort**: Medium
**Risk**: Low

## Recommended Action

Update plan to specify namespaced file structure and update i18n config to load by namespace.

## Technical Details

**Loading pattern**:
```typescript
// i18n/request.ts
export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  // Load only common + current page namespace
  const common = (await import(`@/messages/${locale}/common.json`)).default;

  return {
    locale,
    messages: common,
  };
});

// In page components, load specific namespace
const t = await getTranslations({ locale, namespace: 'page-home' });
```

## Acceptance Criteria

- [ ] Translation files split by page/feature
- [ ] Common strings in shared namespace
- [ ] Each page loads only required translations
- [ ] Build size doesn't include all translations per page

## Work Log

| Date | Action | Outcome/Learnings |
|------|--------|-------------------|
| 2026-01-21 | Plan review | Identified scalability issue |

## Resources

- ethereum.org i18n structure: https://github.com/ethereum/ethereum-org-website/tree/dev/src/intl
- Issue #21: i18n implementation plan
