---
status: deferred
priority: p2
issue_id: 21
tags: [code-review, agent-native, i18n]
dependencies: []
resolution: not-needed-now
---

# No Agent-Native API Endpoints for Translations

## Problem Statement

The plan treats translated content as only accessible via rendered HTML. An agent cannot programmatically:
- List available locales
- Get raw translation strings
- Access translations without scraping rendered pages

**Why it matters**: Agent-native principle - any action a user can take, an agent should be able to take. Currently, getting the Spanish version of "Get In Touch" requires screen-scraping.

## Findings

**Source**: Agent-Native Reviewer

**Missing capabilities for agents**:
1. No `/api/locales` endpoint to discover supported languages
2. No `/api/translations/[locale]` to get translation JSON
3. No locale parameter on existing API routes
4. No programmatic locale detection endpoint

**Current agent accessibility: 4/10**

## Proposed Solutions

### Option A: Add core translation APIs (Recommended)

```typescript
// /app/api/locales/route.ts
export async function GET() {
  return Response.json({
    locales: ['en', 'zh', 'es'],
    defaultLocale: 'en',
    localeConfig: {
      en: { name: 'English', direction: 'ltr' },
      zh: { name: '中文', direction: 'ltr' },
      es: { name: 'Español', direction: 'ltr' }
    }
  });
}

// /app/api/translations/[locale]/route.ts
export async function GET(request, { params }) {
  const validLocales = ['en', 'zh', 'es'];
  if (!validLocales.includes(params.locale)) {
    return Response.json({ error: 'Invalid locale' }, { status: 400 });
  }

  const translations = await import(`@/messages/${params.locale}.json`);
  return Response.json(translations.default);
}
```

**Pros**: Full agent parity
**Cons**: Additional endpoints to maintain
**Effort**: Small
**Risk**: Low

## Recommended Action

Add Phase 7: Agent-Native APIs to the plan with these endpoints:
- `GET /api/locales` - List available locales
- `GET /api/translations/[locale]` - Get translation JSON
- Add `locale` parameter to contact form API

## Technical Details

**Files to create**:
- `app/api/locales/route.ts`
- `app/api/translations/[locale]/route.ts`

**Files to modify**:
- `app/api/contact/route.ts` - Add locale field

## Acceptance Criteria

- [ ] `/api/locales` returns list of supported locales
- [ ] `/api/translations/zh` returns Chinese translations
- [ ] Contact form API accepts locale parameter
- [ ] Documentation updated with API endpoints

## Work Log

| Date | Action | Outcome/Learnings |
|------|--------|-------------------|
| 2026-01-21 | Plan review | Identified agent accessibility gap |

## Resources

- Issue #21: i18n implementation plan
