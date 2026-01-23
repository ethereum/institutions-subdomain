# feat: i18n Polish - Address Remaining Gaps

Follow-up to PR #21 (i18n implementation). Addresses gaps identified in plan review.

## Acceptance Criteria

- [ ] Translation validation script catches missing keys
- [ ] Library post directories exist for zh/es (with English fallback)
- [ ] Dates render in locale-appropriate format

## Tasks

### 1. Translation Validation Script

Create `scripts/validate-translations.ts`:
- Compare zh.json and es.json against en.json
- Report missing or extra keys
- Exit non-zero if missing keys found

```typescript
// scripts/validate-translations.ts
import en from '../messages/en.json'
import zh from '../messages/zh.json'
import es from '../messages/es.json'

function getKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k
    return typeof v === 'object' && v !== null
      ? getKeys(v, key)
      : [key]
  })
}

const enKeys = new Set(getKeys(en))
const missing = { zh: [], es: [] }

for (const key of enKeys) {
  if (!getKeys(zh).includes(key)) missing.zh.push(key)
  if (!getKeys(es).includes(key)) missing.es.push(key)
}

if (missing.zh.length || missing.es.length) {
  console.error('Missing translations:', missing)
  process.exit(1)
}
console.log('All translations present')
```

Add to `package.json`:
```json
"validate:i18n": "npx tsx scripts/validate-translations.ts"
```

### 2. Library Post Directories

```bash
mkdir -p public/posts/zh public/posts/es
touch public/posts/zh/.gitkeep public/posts/es/.gitkeep
```

The existing `getLibraryPosts()` already falls back to English - this just creates the directories for future translated posts.

### 3. Locale-Aware Date Formatting (Optional)

Currently dates use `formatDateMonthDayYear()` which outputs English format. For proper locale support:

**Option A: Keep current behavior**
- Dates stay in "March 15, 2024" format for all locales
- Simpler, fewer changes
- Acceptable for institutional audience

**Option B: Use next-intl formatter**
- Update components to use `useFormatter()` from next-intl
- Outputs: "2024年3月15日" (zh), "15 de marzo de 2024" (es)
- More work, affects multiple files

**Recommendation**: Option A for initial release. Date formatting can be enhanced later if users request it.

## References

- PR #21: Initial i18n implementation
- `lib/utils/library.ts:38-41`: Fallback logic for posts
- `messages/*.json`: Translation files
- next-intl formatting docs: https://next-intl.dev/docs/usage/dates-times
