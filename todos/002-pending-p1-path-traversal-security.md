---
status: completed
priority: p1
issue_id: 21
tags: [code-review, security, i18n, critical]
dependencies: []
resolution: not-applicable
---

# Path Traversal Vulnerability in Locale/Post Loading

## Problem Statement

The plan proposes loading translation files and library posts from filesystem paths based on user-controlled locale values. Without strict validation, this creates path traversal vulnerabilities.

**Why it matters**: An attacker could potentially read arbitrary files from the server by manipulating locale values like `../../../etc/passwd`.

## Findings

**Source**: Security Sentinel review

**Vulnerable patterns identified**:

```typescript
// VULNERABLE - Library post loading
async function getLibraryPost(locale: string, slug: string) {
  const path = `./content/${locale}/library/${slug}.mdx`;
  return fs.readFile(path); // Path traversal possible!
}

// VULNERABLE - Translation loading
async function loadTranslations(locale: string) {
  const filePath = `./locales/${locale}/messages.json`;
  return fs.readFile(filePath); // Path traversal possible!
}
```

**Attack vectors**:
- `Accept-Language: ../../../../etc/passwd`
- URL: `/../../etc/passwd/rwa`
- Cookie: `NEXT_LOCALE=../../../etc/passwd`

## Proposed Solutions

### Option A: Strict allowlist validation (Recommended)
```typescript
const SUPPORTED_LOCALES = ['en', 'zh', 'es'] as const;
type SupportedLocale = typeof SUPPORTED_LOCALES[number];

function isValidLocale(value: unknown): value is SupportedLocale {
  return typeof value === 'string'
    && SUPPORTED_LOCALES.includes(value as SupportedLocale);
}

async function loadTranslations(locale: string) {
  if (!isValidLocale(locale)) {
    throw new Error('Invalid locale');
  }
  // Safe to proceed
}
```

**Pros**: Simple, comprehensive, type-safe
**Cons**: None
**Effort**: Small
**Risk**: Low

### Option B: Path resolution verification
```typescript
import path from 'path';

const LOCALES_DIR = path.resolve(process.cwd(), 'locales');

async function loadTranslations(locale: string) {
  const filePath = path.join(LOCALES_DIR, locale, 'messages.json');

  // Verify resolved path is within expected directory
  if (!filePath.startsWith(LOCALES_DIR)) {
    throw new Error('Path traversal detected');
  }

  return fs.readFile(filePath, 'utf-8');
}
```

**Pros**: Defense in depth
**Cons**: More complex
**Effort**: Medium
**Risk**: Low

## Recommended Action

Implement BOTH Option A and Option B for defense in depth:
1. Always validate locale against allowlist FIRST
2. Then verify resolved paths stay within expected directories

## Technical Details

**Files to create**:
- `/lib/i18n/validation.ts` - Centralized locale validation

**Files to modify**:
- `/middleware.ts` - Use validation before any locale processing
- `/app/library/[slug]/utils.ts` - Validate locale parameter
- Any file that accepts locale from user input

## Acceptance Criteria

- [ ] `isValidLocale()` function exists and is used everywhere
- [ ] All filesystem operations validate locale first
- [ ] Path resolution checks prevent directory escapes
- [ ] Security tests cover path traversal attempts

## Work Log

| Date | Action | Outcome/Learnings |
|------|--------|-------------------|
| 2026-01-21 | Plan review | Identified security vulnerability |
| 2026-01-21 | Reviewed with user | Closed as not-applicable. No sensitive paths exist to traverse to. Middleware allowlist validation (already in plan) rejects invalid locales before any filesystem access occurs. Theoretical risk without practical impact. |

## Resources

- OWASP Path Traversal: https://owasp.org/www-community/attacks/Path_Traversal
- Issue #21: i18n implementation plan
