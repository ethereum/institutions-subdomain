# Institutions v2 Implementation Plan

## Overview

Implementation plan for the Institutions v2 Epic tasks from Notion, prioritized by what can be implemented immediately vs what needs clarification.

## Task Summary

| Task | Status | Implementable? | Blocker |
|------|--------|----------------|---------|
| 1. Translate website (zh/es) | Sprint - Up Next | ✅ Partial | i18n PR already up, need blog post translations |
| 2. Enterprise subpage linking | Sprint - In Progress | ⚠️ Needs clarification | Link placement strategy unclear |
| 3. Ethereum adoption feed | Sprint - Up Next | ⚠️ Needs clarification | Feed data source unknown |
| 4. Bugs/UI feedback | Sprint - Up Next | ✅ Yes | Tooltip upgrade straightforward |
| 5. Dashboard data enhancement | Sprint - Up Next | ❌ Blocked | No spec on what data to add |
| 6. Etherealize dashboard data | Sprint - Up Next | ❌ Blocked | No description/data source |
| 7. Newsletter automation | Sprint - Up Next | ⚠️ Needs clarification | Automation platform decision |
| 8. Blog setup | Sprint - Done | ✅ Complete | — |

---

## Phase 1: Implement Immediately

### Task 4: Tooltip/Mouseover Descriptions for UOPs and TVL

**Current State**: UOPs and TVL metrics use basic HTML `title` attributes

**Files to Modify**:
- `app/[locale]/layer-2/page.tsx` (lines 90, 110)
- `app/[locale]/defi/page.tsx` (lines 55, 65, 76, 85)

**Implementation**:
```tsx
// Before (current)
<span title="User Operations Per Second">UOPS</span>

// After (using TooltipPopover)
import { TooltipPopover } from "@/components/TooltipPopover"

<TooltipPopover content={t("metrics.uopsDescription")}>
  <span className="cursor-help underline decoration-dotted">{t("metrics.uops")}</span>
</TooltipPopover>
```

**Translation Keys to Add** (messages/*.json):
```json
{
  "metrics": {
    "uops": "UOPS",
    "uopsDescription": "User Operations Per Second - measures L2 transaction throughput",
    "tvl": "TVL",
    "tvlDescription": "Total Value Locked - sum of all assets deposited in smart contracts",
    "dex": "DEX",
    "dexDescription": "Decentralized Exchange - permissionless trading platform"
  }
}
```

**Acceptance Criteria**:
- [ ] Replace HTML `title` with TooltipPopover for UOPS in layer-2/page.tsx
- [ ] Replace HTML `title` with TooltipPopover for TVL in defi/page.tsx (4 instances)
- [ ] Add translation keys to en.json, zh.json, es.json
- [ ] Test tooltip on desktop (hover) and mobile (tap)
- [ ] Verify accessibility (keyboard focus, aria-describedby)

---

### Task 1 (Partial): Translation Validation & Polish

**Current State**:
- i18n PR already up with zh/es locales
- messages/en.json, messages/zh.json, messages/es.json exist
- Validation script exists at `scripts/validate-translations.ts`

**Remaining Work**:

1. **Run translation validation**:
   ```bash
   npx tsx scripts/validate-translations.ts
   ```

2. **Check blog post translations**:
   - `public/posts/en/` has content
   - `public/posts/zh/` and `public/posts/es/` may be empty

3. **Verify language switcher exists** (check navigation component)

**Acceptance Criteria**:
- [ ] All translation keys validated (no missing keys in zh/es)
- [ ] Language switcher UI functional
- [ ] Blog posts have locale fallback to English when translation missing
- [ ] Locale-specific date formatting works

---

## Phase 2: Needs Clarification

### Task 2: Enterprise Subpage Linking

**Current State**: No enterprise page exists on institutions site. ethereum.org/enterprise/ exists externally.

**Questions to Answer**:
1. Where should link appear? (Navigation, footer, hero CTA, dedicated section?)
2. Should we create an enterprise overview page on institutions site, or just link out?
3. What specific ethereum.org/enterprise pages should we link to?

**Proposed Approach** (pending confirmation):
- Add "Enterprise Resources" link in footer under "Resources" section
- Add CTA card on homepage pointing to ethereum.org/enterprise/use-cases/
- No new page creation on institutions site

**Files to Modify** (once confirmed):
- `lib/constants.ts` - add enterprise links to navigation/footer config
- `app/[locale]/page.tsx` - add enterprise CTA section (if approved)

---

### Task 3: Ethereum Adoption Feed

**Current State**: No feed integration exists. Library uses hardcoded `externalLibraryItems` array.

**Questions to Answer**:
1. Does ethereumadoption.com have RSS/API? (Need to check https://ethereumadoption.com/feed or similar)
2. Should feed items mix with library items or have separate section?
3. Update frequency? (Build-time SSG, ISR every hour, client-side?)
4. How to handle missing images from feed items?

**Proposed Approach** (pending data source confirmation):

```typescript
// app/_actions/fetchEthereumAdoptionFeed.ts
"use server"

import Parser from 'rss-parser';

export async function fetchEthereumAdoptionFeed() {
  const parser = new Parser();
  const feed = await parser.parseURL('https://ethereumadoption.com/feed'); // URL TBD

  return feed.items.map(item => ({
    title: item.title,
    href: item.link,
    date: item.pubDate,
    imgSrc: item.enclosure?.url || '/images/library/ethereum-adoption-default.png',
    source: 'ethereumadoption'
  }));
}
```

**Files to Create/Modify**:
- `app/_actions/fetchEthereumAdoptionFeed.ts` (new)
- `app/[locale]/library/data.ts` - merge feed with existing items
- `app/[locale]/library/page.tsx` - display merged items

---

### Task 7: Newsletter Automation (Enterprise Onchain)

**Current State**: Library items manually curated in `data.ts`

**Substack RSS Available**: `https://enterpriseonchain.substack.com/feed`

**Questions to Answer**:
1. Automation platform? (Vercel cron, GitHub Action, manual script?)
2. Where to persist newsletter data? (Update data.ts via PR, separate JSON, database?)
3. Should automation backfill historical newsletters?
4. Image strategy for newsletters without featured images?

**Proposed Approach** (simplest):

Option A: **GitHub Action + PR** (recommended for transparency)
```yaml
# .github/workflows/sync-newsletters.yml
name: Sync Enterprise Onchain Newsletters
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx tsx scripts/sync-newsletters.ts
      - uses: peter-evans/create-pull-request@v5
        with:
          title: 'chore: sync Enterprise Onchain newsletters'
          branch: auto/newsletter-sync
```

Option B: **Build-time fetch with ISR**
```typescript
// Fetch at build time, revalidate every 6 hours
const newsletters = await fetchSubstackFeed('enterpriseonchain');
```

---

## Phase 3: Blocked (Missing Specs)

### Task 5: Dashboard Data Enhancement

**Current State**: Data hub has Overview, DeFi, Stablecoins, RWAs, Layer 2 sections

**Blocker**: "Add more data to dashboard" - no specifics on WHAT data

**Questions Needed**:
- Which metrics to add?
- Which data sources to integrate?
- New sections or enhance existing ones?

**Existing Data Sources** (for reference):
- DefiLlama (TVL, DEX volume)
- L2Beat (L2 scaling stats)
- RWA.xyz (stablecoin/RWA market share)
- beaconcha.in (validator count, staked ETH)
- CoinGecko (ETH price)
- ultrasound.money (ETH supply)

---

### Task 6: Etherealize Dashboard Data

**Current State**: Only reference is an Etherealize library item linking to newsletter

**Blocker**: No description of what "etherealize dashboard data" means

**Questions Needed**:
- What is the Etherealize dashboard?
- What data does it provide?
- Is there an API endpoint?
- How does it relate to existing dashboard sections?

---

## Implementation Order

```
Week 1:
├── Task 4: Tooltip upgrades (1-2 days)
│   ├── Update layer-2/page.tsx
│   ├── Update defi/page.tsx
│   └── Add translation keys
└── Task 1: Translation validation (1 day)
    ├── Run validate-translations.ts
    └── Fix any missing keys

Week 2 (after clarification):
├── Task 2: Enterprise linking (1 day)
│   └── Add links to footer/nav once placement confirmed
├── Task 3: Adoption feed (2-3 days)
│   ├── Create server action for feed
│   ├── Merge with library data
│   └── Handle errors/caching
└── Task 7: Newsletter automation (2-3 days)
    ├── Create sync script
    ├── Set up GitHub Action
    └── Test deduplication

Blocked until specs provided:
├── Task 5: Dashboard enhancement
└── Task 6: Etherealize data
```

---

## Questions for Product/Design

### Critical (Blocks Implementation)

1. **Task 3**: What is the data source URL for ethereumadoption.com feed?
   - Check: https://ethereumadoption.com/feed or /rss.xml

2. **Task 7**: Preferred automation approach?
   - A) GitHub Action creating PRs (more visible, reviewable)
   - B) Build-time fetch with ISR (automatic, no PRs)

3. **Task 2**: Where should enterprise links appear?
   - Footer only?
   - Navigation menu?
   - Homepage CTA section?

4. **Task 5 & 6**: Can you provide specs for dashboard data enhancements?

### Nice-to-Have

5. **Task 4**: Any specific font size issues to address beyond tooltips?

6. **Task 1**: Should external library items (English titles) be translated or shown in original language?

---

## Technical Notes

### Existing Infrastructure

- **i18n**: next-intl with `[locale]` routing, messages in JSON
- **Tooltips**: TooltipPopover (desktop hover, mobile tap), InfoTooltip (with icon)
- **Data fetching**: Server actions in `/app/_actions/` with ISR caching
- **Library**: Hardcoded array in `data.ts`, markdown posts in `public/posts/`

### Dependencies to Install (if needed)

```bash
# For RSS feed parsing (Task 3 & 7)
npm install rss-parser
```

### File References

| Component | Path |
|-----------|------|
| TooltipPopover | `/components/TooltipPopover/index.tsx` |
| InfoTooltip | `/components/InfoTooltip/index.tsx` |
| Library data | `/app/[locale]/library/data.ts` |
| Translation validation | `/scripts/validate-translations.ts` |
| i18n routing | `/i18n/routing.ts` |
| Middleware | `/middleware.ts` |
| Data actions | `/app/_actions/` |
