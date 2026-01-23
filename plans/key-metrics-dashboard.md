# Key Metrics Dashboard Table

## Overview

Add a "Key Metrics" table to the data-hub page displaying 18 metrics in a 3-column grid layout. This feature was cut from MVP but is now requested per the Figma design.

## Problem Statement

The data-hub page currently shows high-level metrics across dedicated sections (DeFi, Stablecoins, RWAs, Layer 2). Stakeholders want a consolidated "Key Metrics" section showing critical ecosystem health indicators at a glance.

## Proposed Solution

Create a new `KeyMetricsTable` component that:
1. Fetches data from DefiLlama and growthepie.xyz APIs
2. Displays 18 metrics in a responsive 3-column grid
3. Reuses existing patterns (BigNumber, SourceInfoTooltip, ISR caching)
4. Handles partial failures gracefully

---

## Technical Approach

### Data Source Mapping

| Metric | Source | Endpoint | Notes |
|--------|--------|----------|-------|
| Perps Volume (24h) | DefiLlama | `/overview/derivatives` | Filter for Ethereum |
| Inflows (24h) | DefiLlama | `/bridges` | 24h change |
| Active Addresses (24h) | growthepie | `/fundamentals/full` | DAA metric |
| Total Raised | DefiLlama | `/raises` | All-time cumulative |
| Bridged TVL | DefiLlama | `/bridges` | Total value |
| NFT Volume (24h) | DefiLlama | `/overview/nfts` | 24h volume |
| $ETH Price | **Existing** | `fetchEthPrice` | Already implemented |
| $ETH Market Cap | **Existing** | `fetchEthMarketCap` | Already implemented |
| $ETH FDV | CoinGecko | `/coins/ethereum` | fully_diluted_valuation |
| Stablecoins Mcap | **Existing** | `fetchStablecoinsMarketCap` | Already implemented |
| DEXs Volume (24h) | **Existing** | `fetchDexVolume` | Already implemented |
| Token Incentives (24h) | DefiLlama | `/emissionsBreakdown?protocol=ethereum` | Daily emissions |
| Chain Fees (24h) | growthepie | `/fundamentals/full` | fees_paid_eth (converted) |
| Chain Revenue (24h) | growthepie | `/fundamentals/full` | profit metric |
| Chain REV (24h) | growthepie | `/fundamentals/full` | *Clarify: likely same as Revenue* |
| App Revenue (24h) | DefiLlama | `/fees` | All protocols on Ethereum |
| App Fees (24h) | DefiLlama | `/fees` | dailyFees aggregated |

### Architecture

```
app/[locale]/data-hub/page.tsx
└── <KeyMetricsTable />
    ├── Uses Promise.allSettled for parallel fetching
    ├── Calls 6 existing server actions
    └── Calls 7 new server actions

app/_actions/
├── fetchPerpsVolume.ts (NEW)
├── fetchBridgeStats.ts (NEW) → returns { tvl, inflows24h }
├── fetchActiveAddresses.ts (NEW)
├── fetchTotalRaised.ts (NEW)
├── fetchNftVolume.ts (NEW)
├── fetchEthFdv.ts (NEW)
├── fetchTokenIncentives.ts (NEW)
├── fetchChainMetrics.ts (NEW) → returns { fees, revenue, rev }
└── fetchAppMetrics.ts (NEW) → returns { revenue, fees }

components/
└── KeyMetricsTable/
    ├── index.tsx
    ├── KeyMetricCard.tsx
    └── types.ts
```

### Server Action Pattern

Follow existing pattern from `app/_actions/fetchEthPrice.ts`:

```typescript
// app/_actions/fetchPerpsVolume.ts
"use server"

import { DataTimestamped } from "@/lib/types"
import { every } from "@/lib/utils/time"

const DEFILLAMA_DERIVATIVES = "https://api.llama.fi/overview/derivatives?excludeTotalDataChartBreakdown=true&excludeTotalDataChart=true"

export async function fetchPerpsVolume(): Promise<DataTimestamped<number>> {
  try {
    const response = await fetch(DEFILLAMA_DERIVATIVES, {
      next: { revalidate: every("5 minutes"), tags: ["perps-volume"] },
    })

    if (!response.ok) {
      throw new Error(`DefiLlama derivatives API failed: ${response.status}`)
    }

    const data = await response.json()
    // Filter for Ethereum protocols and sum 24h volume
    const ethereumVolume = data.protocols
      ?.filter((p: any) => p.chains?.includes("Ethereum"))
      .reduce((sum: number, p: any) => sum + (p.total24h || 0), 0) ?? 0

    return {
      data: ethereumVolume,
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error("fetchPerpsVolume failed:", error)
    return { data: 0, timestamp: Date.now(), error: true }
  }
}
```

### Component Structure

```typescript
// components/KeyMetricsTable/index.tsx
import { KeyMetricCard } from "./KeyMetricCard"
import type { KeyMetric } from "./types"

type Props = {
  metrics: KeyMetric[]
}

export function KeyMetricsTable({ metrics }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <KeyMetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  )
}
```

```typescript
// components/KeyMetricsTable/KeyMetricCard.tsx
import { BigNumber } from "@/components/ui/big-number"
import { SourceInfoTooltip } from "@/components/SourceInfoTooltip"

type Props = {
  metric: KeyMetric
}

export function KeyMetricCard({ metric }: Props) {
  const { label, value, source, error } = metric

  if (error) {
    return (
      <div className="flex items-center justify-between p-4">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">—</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4">
      <span className="flex items-center gap-1">
        {label}
        <SourceInfoTooltip source={source} />
      </span>
      <BigNumber value={value} prefix="$" />
    </div>
  )
}
```

### Data Fetching in Page

```typescript
// app/[locale]/data-hub/page.tsx (addition)
import { KeyMetricsTable } from "@/components/KeyMetricsTable"

// Inside the component:
const [
  perpsVolume,
  bridgeStats,
  activeAddresses,
  totalRaised,
  nftVolume,
  ethFdv,
  tokenIncentives,
  chainMetrics,
  appMetrics,
  // existing...
  ethPrice,
  ethMarketCap,
  stablecoinsMcap,
  dexVolume,
] = await Promise.allSettled([
  fetchPerpsVolume(),
  fetchBridgeStats(),
  fetchActiveAddresses(),
  fetchTotalRaised(),
  fetchNftVolume(),
  fetchEthFdv(),
  fetchTokenIncentives(),
  fetchChainMetrics(),
  fetchAppMetrics(),
  // existing calls...
  fetchEthPrice(),
  fetchEthMarketCap(),
  fetchStablecoinsMarketCap(),
  fetchDexVolume(),
])

const keyMetrics = buildKeyMetrics({
  perpsVolume: perpsVolume.status === "fulfilled" ? perpsVolume.value : null,
  bridgeStats: bridgeStats.status === "fulfilled" ? bridgeStats.value : null,
  // ... etc
})

// In JSX:
<KeyMetricsTable metrics={keyMetrics} />
```

---

## Acceptance Criteria

### Functional Requirements

- [ ] Display all 18 metrics in 3-column grid on desktop
- [ ] Each metric shows label, value (formatted), and source tooltip
- [ ] Metrics with failed API calls show "—" placeholder
- [ ] All existing metrics (ETH price, market cap, DEX volume, stablecoins) continue working

### Non-Functional Requirements

- [ ] ISR cache: 5 minutes for volatile metrics, 1 hour for static (Total Raised)
- [ ] Page load: <3s LCP with all metrics loaded
- [ ] Failed metrics don't block successful ones (Promise.allSettled)

### Responsive Layout

- [ ] Desktop (≥1024px): 3 columns
- [ ] Tablet (768-1023px): 2 columns
- [ ] Mobile (<768px): 1 column, stacked vertically

### Accessibility

- [ ] Metric labels have sufficient color contrast (WCAG 2.1 AA)
- [ ] Tooltips accessible via keyboard (Tab navigation)
- [ ] Screen readers announce metric label + value together

---

## Implementation Phases

### Phase 1: New Server Actions

Create 9 new server actions following existing patterns:

```
app/_actions/
├── fetchPerpsVolume.ts
├── fetchBridgeStats.ts
├── fetchActiveAddresses.ts
├── fetchTotalRaised.ts
├── fetchNftVolume.ts
├── fetchEthFdv.ts
├── fetchTokenIncentives.ts
├── fetchChainMetrics.ts
└── fetchAppMetrics.ts
```

Each action should:
- Use `"use server"` directive
- Return `DataTimestamped<T>` type
- Use `every()` helper for ISR caching
- Handle errors gracefully (return error flag, not throw)
- Filter for Ethereum-only data where applicable

### Phase 2: KeyMetricsTable Component

```
components/KeyMetricsTable/
├── index.tsx          # Grid container
├── KeyMetricCard.tsx  # Individual metric display
└── types.ts           # KeyMetric type definition
```

### Phase 3: Integration

- Add parallel fetching to `app/[locale]/data-hub/page.tsx`
- Build metrics array from settled promises
- Render `<KeyMetricsTable />` in appropriate position

### Phase 4: i18n (Stretch)

- Add metric label translations to `messages/en.json`, `zh.json`, `es.json`
- Ensure BigNumber uses locale-aware formatting

---

## Open Questions

### Critical (Blocks Implementation)

1. **What is "Chain REV (24h)"?** - Appears nearly identical to "Chain Revenue (24h)". Is this a typo, or a distinct metric (e.g., Return on Equity, Reversal)?

2. **Ethereum mainnet only or include L2s?** - Should bridge TVL, chain fees include L2s or strictly mainnet?

### Important (Affects UX)

3. **Should we show data freshness timestamps?** - e.g., "Updated 5m ago"

4. **Mobile tooltip interaction?** - Click-to-reveal or long-press?

---

## References

### Internal

- Existing server action pattern: `app/_actions/fetchEthPrice.ts`
- BigNumber component: `components/ui/big-number.tsx`
- SourceInfoTooltip: `components/SourceInfoTooltip/index.tsx`
- Metric type: `lib/types.ts:Metric`

### External

- DefiLlama API docs: https://defillama.com/docs/api
- growthepie.xyz API: https://docs.growthepie.xyz/
- Figma design: (see Notion task comments)

### Related

- Notion task: https://www.notion.so/efdn/Live-data-dashboard-more-data-enhancement-296d98955541805d96a3e31861f5b1ca
