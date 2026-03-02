/**
 * Validates that all translation files have matching keys.
 * Compares zh.json and es.json against en.json (source of truth).
 *
 * Usage: npx tsx scripts/validate-translations.ts
 */

import en from "../messages/en.json"
import zh from "../messages/zh.json"
import es from "../messages/es.json"

type NestedObject = { [key: string]: string | NestedObject }

function getKeys(obj: NestedObject, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k
    return typeof v === "object" && v !== null
      ? getKeys(v as NestedObject, key)
      : [key]
  })
}

function findMissing(source: string[], target: string[]): string[] {
  const targetSet = new Set(target)
  return source.filter((key) => !targetSet.has(key))
}

const enKeys = getKeys(en as NestedObject)
const zhKeys = getKeys(zh as NestedObject)
const esKeys = getKeys(es as NestedObject)

const missingZh = findMissing(enKeys, zhKeys)
const missingEs = findMissing(enKeys, esKeys)
const extraZh = findMissing(zhKeys, enKeys)
const extraEs = findMissing(esKeys, enKeys)

let hasErrors = false

if (missingZh.length) {
  console.error("\n❌ Missing in zh.json:")
  missingZh.forEach((k) => console.error(`   - ${k}`))
  hasErrors = true
}

if (missingEs.length) {
  console.error("\n❌ Missing in es.json:")
  missingEs.forEach((k) => console.error(`   - ${k}`))
  hasErrors = true
}

if (extraZh.length) {
  console.warn("\n⚠️  Extra keys in zh.json (not in en.json):")
  extraZh.forEach((k) => console.warn(`   - ${k}`))
}

if (extraEs.length) {
  console.warn("\n⚠️  Extra keys in es.json (not in en.json):")
  extraEs.forEach((k) => console.warn(`   - ${k}`))
}

if (hasErrors) {
  console.error("\n❌ Translation validation failed\n")
  process.exit(1)
}

console.log(`\n✅ All translations valid`)
console.log(`   en.json: ${enKeys.length} keys`)
console.log(`   zh.json: ${zhKeys.length} keys`)
console.log(`   es.json: ${esKeys.length} keys\n`)
