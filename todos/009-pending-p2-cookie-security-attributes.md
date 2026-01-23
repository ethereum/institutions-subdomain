---
status: completed
priority: p2
issue_id: 21
tags: [code-review, security, i18n]
dependencies: []
resolution: added-to-plan
---

# Cookie Security Attributes Needed

## Problem Statement

The plan mentions storing locale preference in a cookie (`NEXT_LOCALE`) but doesn't specify required security attributes. Without proper configuration, the cookie could be vulnerable to certain attacks.

**Why it matters**: Proper cookie security is a baseline requirement, even for non-sensitive data like locale preference.

## Findings

**Source**: Security Sentinel review

**Required cookie attributes**:
```typescript
cookies().set('NEXT_LOCALE', locale, {
  httpOnly: false,      // Needs client access for language switcher
  secure: true,         // HTTPS only - REQUIRED in production
  sameSite: 'lax',      // Prevents CSRF while allowing normal navigation
  maxAge: 31536000,     // 1 year
  path: '/',            // Available site-wide
});
```

**GDPR Note**: Locale preference cookies are "strictly necessary" and don't require consent banners.

## Proposed Solutions

### Option A: Configure in next-intl routing (Recommended)

```typescript
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: ['en', 'zh', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 31536000, // 1 year
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }
});
```

**Pros**: Uses library's built-in cookie handling
**Cons**: None
**Effort**: Small
**Risk**: Low

## Recommended Action

Add cookie configuration to next-intl routing config with proper security attributes.

## Technical Details

**Files to modify**:
- `src/i18n/routing.ts` - Add localeCookie config

## Acceptance Criteria

- [ ] Cookie has `Secure` attribute in production
- [ ] Cookie has `SameSite=Lax`
- [ ] Cookie has appropriate maxAge
- [ ] Privacy policy updated to document cookie (optional)

## Work Log

| Date | Action | Outcome/Learnings |
|------|--------|-------------------|
| 2026-01-21 | Plan review | Identified cookie security gap |

## Resources

- OWASP Cookie Security: https://owasp.org/www-chapter-london/assets/slides/OWASPLondon20171130_Cookie_Security_Myths_Misconceptions_David_Johansson.pdf
- Issue #21: i18n implementation plan
