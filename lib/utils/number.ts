import { NumberParts } from "../types"

/**
 * Short compact suffixes by locale, keyed by the raw Intl compact part.
 * Keeps formatted output concise across locales to prevent layout overflow.
 */
const COMPACT_SUFFIX_MAP: Record<string, Record<string, string>> = {
  es: {
    "mil M": "MM",
    "mil\u00A0M": "MM", // non-breaking space variant
  },
}

/**
 * Formats a number using `formatToParts()` and replaces long compact suffixes
 * with shorter locale-specific alternatives.
 */
const formatCompact = (
  locale: string,
  value: number,
  options: Intl.NumberFormatOptions
): string => {
  const parts = Intl.NumberFormat(locale, options).formatToParts(value)
  const localeMap = COMPACT_SUFFIX_MAP[locale.split("-")[0]]

  if (!localeMap) return parts.map((p) => p.value).join("")

  // Collect all compact parts into a single string for lookup
  const compactParts = parts.filter((p) => p.type === "compact")
  if (compactParts.length === 0) return parts.map((p) => p.value).join("")

  const compactStr = compactParts.map((p) => p.value).join("")
  const replacement = localeMap[compactStr]

  if (replacement === undefined) return parts.map((p) => p.value).join("")

  let firstCompactReplaced = false
  return parts
    .map((p) => {
      if (p.type !== "compact") return p.value
      if (!firstCompactReplaced) {
        firstCompactReplaced = true
        return replacement
      }
      return ""
    })
    .join("")
}

/**
 * Formats a number as a percentage string with configurable significant digits and optional sign.
 *
 * @param locale - The locale to use for formatting (e.g., "en", "zh", "es").
 * @param value - The numeric value to format as a percentage (e.g., 0.25 for 25%).
 * @param includeSign - Whether to include a plus or minus sign for non-zero values. Defaults to `false`.
 * @param sigDigits - The number of significant digits to display. Defaults to `2`.
 * @returns The formatted percentage string.
 */
export const formatPercent = (
  locale: string,
  value: number,
  includeSign: boolean = false,
  sigDigits: number = 2
) => {
  const formatted = Intl.NumberFormat(locale, {
    style: "percent",
    minimumSignificantDigits: sigDigits,
    maximumSignificantDigits: sigDigits,
    signDisplay: includeSign ? "exceptZero" : "auto",
  }).format(value)
  return formatted
}

/**
 * Returns a CSS class name based on the sign of a numeric value.
 *
 * - If the value is greater than 0, returns "text-green-600".
 * - If the value is less than 0, returns "text-red-600".
 * - If the value is 0, returns "text-muted-foreground".
 *
 * @param value - The numeric value to evaluate.
 * @returns The corresponding CSS class name as a string.
 */
export const getChangeColorClass = (value: number) => {
  if (value > 0) return "text-green-600"
  if (value < 0) return "text-red-600"
  return "text-muted-foreground"
}

/**
 * Formats a numeric multiplier value with two significant digits and appends "x" to indicate multiplication.
 *
 * @param locale - The locale to use for formatting (e.g., "en", "zh", "es").
 * @param value - The numeric value to format as a multiplier.
 * @param sigDigits - The number of significant digits to display. Defaults to `2`.
 * @returns The formatted multiplier string (e.g., "1.2x").
 */
export const formatMultiplier = (
  locale: string,
  value: number,
  sigDigits: number = 2
) =>
  Intl.NumberFormat(locale, {
    minimumSignificantDigits: sigDigits,
    maximumSignificantDigits: sigDigits,
  }).format(value) + "x"

/**
 * Formats a number as a currency string in US dollars.
 *
 * @param locale - The locale to use for formatting (e.g., "en", "zh", "es").
 * @param value - The numeric value to format.
 * @param options - Optional `Intl.NumberFormatOptions` to customize formatting.
 * @returns The formatted currency string.
 *
 * @example
 * ```typescript
 * formatCurrency("en", 1234.56); // "$1,234.56"
 * formatCurrency("en", 1234.56, { minimumFractionDigits: 0 }); // "$1,235"
 * ```
 */
export const formatCurrency = (
  locale: string,
  value: number,
  options?: Intl.NumberFormatOptions
) =>
  Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    ...options,
  }).format(value)

/**
 * Formats a large currency value using compact notation and a specified number of significant digits.
 *
 * @param locale - The locale to use for formatting (e.g., "en", "zh", "es").
 * @param value - The numeric value to format as currency.
 * @param sigDigits - The number of significant digits to display (default is 3).
 * @returns The formatted currency string in USD using compact notation.
 *
 * @example
 * formatLargeCurrency("en", 1500000); // "$1.50M"
 * formatLargeCurrency("en", 12345, 4); // "$12,350"
 */
export const formatLargeCurrency = (
  locale: string,
  value: number,
  sigDigits: number = 3
) =>
  formatCompact(locale, value, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    currencyDisplay: "narrowSymbol",
    minimumSignificantDigits: sigDigits,
    maximumSignificantDigits: sigDigits,
  })

/**
 * Formats a number according to the specified locale and formatting options.
 *
 * @param locale - The locale to use for formatting (e.g., "en", "zh", "es").
 * @param value - The number to format.
 * @param options - Optional formatting options conforming to `Intl.NumberFormatOptions`.
 * @returns The formatted number as a string.
 *
 * @example formatNumber("en", 1234567.89); // "1,234,567.89"
 */
export const formatNumber = (
  locale: string,
  value: number,
  options?: Intl.NumberFormatOptions
) => Intl.NumberFormat(locale, { ...options }).format(value)

/**
 * Formats a large number using compact notation (e.g., 1K, 1M).
 *
 * @param locale - The locale to use for formatting (e.g., "en", "zh", "es").
 * @param value - The number to format.
 * @param options - Optional formatting options to customize the output, extending `Intl.NumberFormatOptions`.
 * @param sigDigits - Optional number of significant digits to display (defaults to 3).
 * @returns The formatted number as a string.
 */
export const formatLargeNumber = (
  locale: string,
  value: number,
  options?: Partial<Intl.NumberFormatOptions>,
  sigDigits?: number
) =>
  formatCompact(locale, value, {
    notation: "compact",
    minimumSignificantDigits: sigDigits || 3,
    maximumSignificantDigits: sigDigits || 3,
    ...options,
  })

/**
 * Extracts the prefix, numeric value, suffix, and number of fraction digits from a given input string or number.
 *
 * If the input is a number, returns an object with an empty prefix and suffix, the numeric value, and the count of fraction digits.
 * If the input is a string, attempts to parse out any non-numeric prefix and suffix, the numeric value (removing commas), and the count of fraction digits.
 *
 * @param input - The value to parse, which can be a string or a number.
 * @returns An object containing:
 * - `prefix`: Any non-numeric characters before the number.
 * - `value`: The parsed numeric value.
 * - `suffix`: Any non-numeric characters after the number.
 * - `fractionDigits`: The number of digits after the decimal point.
 */
export const getValueParts = (input: string | number): NumberParts => {
  if (typeof input === "number") {
    const fractionDigits = `${input}`.split(".")[1]?.length ?? 0
    return { prefix: "", value: input, suffix: "", fractionDigits }
  }

  // Match: optional non-digit prefix, digits with separators (.,), optional non-digit suffix
  const stringValueRegExp = /^([^\d]*)([\d.,]+)(.*)$/
  const match = input.match(stringValueRegExp) ?? []

  const [, prefix = "", strValue = "", suffix = ""] = match

  // Detect if comma is decimal separator (e.g., "77,7") vs thousands (e.g., "1,234")
  // If the last separator is a comma and has 1-2 digits after it, it's a decimal comma
  const lastCommaIdx = strValue.lastIndexOf(",")
  const lastDotIdx = strValue.lastIndexOf(".")
  let clean: string
  let fractionDigits: number

  if (lastCommaIdx > lastDotIdx && strValue.length - lastCommaIdx - 1 <= 2) {
    // Comma is the decimal separator (e.g., "77,7" or "1.234,56")
    clean = strValue.replace(/\./g, "").replace(",", ".")
    fractionDigits = strValue.length - lastCommaIdx - 1
  } else {
    // Period is the decimal separator (e.g., "77.7" or "1,234.56")
    clean = strValue.replace(/,/g, "")
    fractionDigits = lastDotIdx >= 0 ? strValue.length - lastDotIdx - 1 : 0
  }

  const value = +clean

  return { prefix, value, suffix, fractionDigits }
}
