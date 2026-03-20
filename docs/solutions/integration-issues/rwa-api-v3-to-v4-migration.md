---
title: "Migrate RWA API integration from v3 to v4 endpoints"
date: 2026-03-09
category: integration-issues
tags:
  - api-migration
  - rwa-xyz
  - next-js-server-actions
  - breaking-change
  - deprecation
severity: high
component: app/_actions (RWA fetch functions)
status: resolved-partial
pr_number: 53
---

# RWA API v3 to v4 Migration

## Problem

The RWA.xyz team notified us that all `/v3/*` API endpoints are being deprecated. We use 8 server action fetch functions that hit two v3 endpoints:

- `v3/assets/aggregates/timeseries` (6 functions)
- `v3/protocols/timeseries` (2 functions)

Both are replaced by a single v4 endpoint: `v4/tokens/aggregates/timeseries`.

## Symptoms

- All RWA data on the site would break once v3 is shut down
- Home, RWA, Layer-2 pages affected; Data Hub and DeFi pages also depend on RWA data

## Root Cause

The v4 endpoint introduces several breaking changes:

1. **Filter field names changed from camelCase to snake_case** (`measureID` -> `measure_id`, `assetClassID` -> `asset_class_id`, etc.)
2. **`protocol_id` is not a valid filter field** -- returns 400 Bad Request despite provider documentation claiming support
3. **`groupBy` values also require snake_case** (`"assetClass"` -> `"asset_class"`)
4. **Endpoint consolidation** -- `protocols/timeseries` no longer exists; all queries go through `tokens/aggregates/timeseries`
5. **`measureSlug: "outstanding_capital_dollar"` does not exist on v4** -- replaced by `measure_id: 63` + `asset_class_id: 33`

## Investigation Steps

### 1. Initial migration (commit `9384745`)

Straightforward field rename across all 8 functions:

- Updated base URLs to `v4/tokens/aggregates/timeseries`
- Converted all filter field names to snake_case per provider mapping table
- Updated `getRwaApiEthereumNetworksFilter()` utility: `networkID` -> `network_id`
- Updated cache tags from `rwa:v3:` to `rwa:v4:`

### 2. First failure -- `fetchSecuritizeAum` returned 400

Isolated via curl testing:

```bash
# This returns 400:
curl ... --data-urlencode 'query={"filter":{"filters":[{"field":"protocol_id","operator":"equals","value":10}]}}'

# This works:
curl ... --data-urlencode 'query={"filter":{"filters":[{"field":"protocol_name","operator":"equals","value":"Securitize"}]}}'
```

**Fix**: Use `protocol_name` instead of `protocol_id` everywhere. Also fixed a pre-existing typo (`protcolID`) in the Securitize fetcher.

### 3. Second failure -- Layer-2 page broken

`fetchCeloMonthlyStablecoinVolume` used `groupBy: "assetClass"`, which is invalid on v4.

**Fix**: `groupBy: "asset_class"` (snake_case applies to groupBy values too, not just filter fields).

### 4. Third failure -- RWA page protocol data

The two protocol fetchers used `measureSlug: "outstanding_capital_dollar"` on the old `protocols/timeseries` endpoint. This measure does not exist on the v4 tokens endpoint.

**Fix**: Used `measure_id: 63` + `asset_class_id: 33` per RWA team guidance for private credit data.

### 5. Data gap -- Centrifuge shows $0

Centrifuge tokens are classified under asset classes 27 (US Treasury Debt), 34 (Public Equity), and 43 (Institutional Alternative Funds) -- not 33 (Private Credit). Filtering by `asset_class_id: 33` excludes all Centrifuge data.

**Status**: Open -- pending team decision on how to handle. See [Known Issue](#known-issue) below.

## Working Solution

### Field name conversion (all functions)

```
v3 (camelCase)          v4 (snake_case)
-----------------       -----------------
measureID            -> measure_id
assetClassID         -> asset_class_id
assetID              -> asset_id
networkID            -> network_id
isInvestable         -> is_investable
measureSlug          -> measure_slug
protocolID           -> protocol_name (protocol_id not supported)
```

### groupBy values

```
v3                v4
-----------       -----------
"assetClass"   -> "asset_class"
"network"      -> "network"      (unchanged)
"asset"        -> "asset"        (unchanged)
"protocol"     -> "protocol"     (unchanged)
"measure"      -> "measure"      (unchanged)
```

### Protocol filtering

```ts
// v3 (broken on v4)
{ field: "protocolSlug", operator: "equals", value: "centrifuge" }
{ field: "protocolID", operator: "equals", value: 10 }

// v4 (working)
{ field: "protocol_name", operator: "equals", value: "Centrifuge" }
```

Confirmed working protocol names: `"Securitize"`, `"Centrifuge"`, `"Maple"`

### Private credit queries

```ts
// v3 (protocols/timeseries endpoint)
{ field: "measureSlug", operator: "equals", value: "outstanding_capital_dollar" }

// v4 (tokens/aggregates/timeseries endpoint)
{ field: "measure_id", operator: "equals", value: 63 }
{ field: "asset_class_id", operator: "equals", value: 33 }
```

## Files Changed (9 total)

| File | Key Changes |
|------|------------|
| `lib/utils/data.ts` | `networkID` -> `network_id` in helper |
| `fetchTokenizedTreasuries.ts` | URL + snake_case fields |
| `fetchAssetValueByAssetIds.ts` | URL + `asset_id` field |
| `fetchSecuritizeAum.ts` | URL + `protocol_name` (fixed `protcolID` typo) |
| `fetchTimeseriesAssetsValue.ts` | URL + snake_case fields |
| `fetchAssetMarketShare.ts` | URL + snake_case fields |
| `fetchCeloMonthlyStablecoinVolume.ts` | URL + snake_case fields + `groupBy: "asset_class"` |
| `fetchProtocolsValueTotal.ts` | URL + `measure_id`/`asset_class_id` replaces `measureSlug` |
| `fetchProtocolsValueBySlug.ts` | URL + `protocol_name` filter + ID-based measure |

## Resolved: asset_class_id: 33 removed (2026-03-19)

The `asset_class_id: 33` (Private Credit) filter was returning **empty results** on v4 as of 2026-03-19, causing a build failure on Netlify (`Cannot read properties of undefined (reading 'points')` during static page generation of `/en/rwa`).

Confirmed via curl that `measure_id: 63` alone returns data, but combining it with `asset_class_id: 33` returns `"results": []`. Per RWA.xyz, private credit is no longer available as an isolated category in v4 -- it is lumped with other asset classes.

**Resolution**: Removed `asset_class_id: 33` filter from both `fetchProtocolsValueTotal.ts` and `fetchProtocolsValueBySlug.ts`. Added an empty-results guard in `fetchProtocolsValueTotal` to prevent future crashes if the API returns no data.

Since the data now represents all tokenized asset classes (not just private credit), the UI labels were updated across all locales:

| Key | Old (en) | New (en) |
|---|---|---|
| `rwas.privateCredit` | Private Credit & Structured Credit | Tokenized Real-World Assets |
| `rwas.activeLoans` | Active loans on Ethereum + L2s | Total value on Ethereum + L2s |

### Previous known issue (now resolved)

Centrifuge previously showed $0 under `asset_class_id: 33` because their tokens are classified under asset classes 27, 34, and 43 -- not 33. Removing the filter resolves this as well.

## Prevention Strategies

### For future third-party API migrations

1. **Independently verify every field** -- mapping tables from providers may contain typos or omissions. Test each filter, groupBy value, and sort field individually with curl before writing integration code.

2. **Assume convention changes apply everywhere** -- when a provider changes naming conventions (e.g., camelCase to snake_case), assume it applies to query parameters, filter values, groupBy clauses, sort fields, and response keys. Do not assume partial adoption.

3. **Build a curl test suite** -- maintain a directory of curl commands that test individual parameters. When debugging, these isolate issues faster than full application builds.

4. **Track data classification changes** -- API version bumps can silently reclassify data. Pull representative datasets from both versions and compare groupings before migrating.

5. **Request meaningful error responses** -- a 400 that says `"Cannot read properties of undefined"` is not useful. Report unhelpful errors to the provider immediately.

### Testing when API access is limited

The development container could not reach the API, creating a slow push-test cycle. Mitigations:

- **Record and replay**: capture real API responses via curl, serve locally with a mock server
- **Response fixtures**: commit sanitized responses for unit testing the data transformation layer
- **Targeted curl scripts**: formalize the ad hoc curl testing done during this migration

## Related Documentation

- [PR #53](https://github.com/ethereum/institutions-subdomain/pull/53) -- Draft PR for this migration
- `docs/solutions/integration-issues/nextjs-i18n-next-intl.md` -- references RWA page structure
- RWA API keys: https://app.rwa.xyz/tools/api/api-keys

## Useful Curl Template

```bash
# Read API key securely
read -s "YOUR_API_KEY?API Key: " && echo

# Test a v4 query
curl -s -H "Authorization: Bearer $YOUR_API_KEY" \
  -H "Accept: application/json" \
  --get "https://api.rwa.xyz/v4/tokens/aggregates/timeseries" \
  --data-urlencode 'query={"filter":{...},"aggregate":{...},"sort":{"direction":"asc","field":"date"},"pagination":{"page":1,"perPage":5}}'
```
