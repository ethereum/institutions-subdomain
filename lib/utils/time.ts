import humanizeDuration, { HumanizerOptions } from "humanize-duration"

import type { DateArg } from "../types"

import { isValidDate } from "./date"

/**
 * Calculates the time elapsed since the given date/time.
 *
 * @param value - The date/time to compare against the current time. Can be a string, number, or Date object.
 * @returns The number of milliseconds elapsed since the provided date/time. Returns 0 if the input is not a valid date.
 */
export const getTimeSince = (value: DateArg): number => {
  if (!isValidDate(value)) return 0
  return Date.now() - new Date(value).getTime()
}

const COMPACT_UNITS: Record<string, humanizeDuration.UnitTranslationOptions> = {
  en: {
    y: () => "Yrs",
    mo: () => "Mos",
    w: () => "Wks",
    d: () => "Days",
    h: () => "Hrs",
    m: () => "Mins",
    s: () => "Secs",
    ms: () => "Ms",
  },
  es: {
    y: (n) => (n === 1 ? "Año" : "Años"),
    mo: (n) => (n === 1 ? "Mes" : "Meses"),
    w: () => "Sem",
    d: (n) => (n === 1 ? "Día" : "Días"),
    h: () => "Hrs",
    m: () => "Mins",
    s: () => "Segs",
    ms: () => "Ms",
  },
}

/**
 * Formats a duration given in milliseconds into a human-readable string using locale-aware unit labels.
 *
 * For "en" and "es", compact custom labels are used (e.g., "Yrs", "Años").
 * For "zh", the built-in zh_CN language is used (e.g., "年").
 *
 * @param locale - The locale to use for formatting (e.g., "en", "zh", "es").
 * @param ms - The duration in milliseconds to format.
 * @param options - Optional configuration for customizing the output, including unit labels.
 * @returns A formatted string representing the duration.
 */
export const formatDuration = (
  locale: string,
  ms: number,
  options?: Partial<HumanizerOptions>
) => {
  const compactUnits = COMPACT_UNITS[locale]

  // zh uses the built-in zh_CN language (compact by nature)
  if (!compactUnits) {
    const humanizer = humanizeDuration.humanizer({
      units: ["y"],
      maxDecimalPoints: 0,
      language: "zh_CN",
      ...options,
    })
    return humanizer(ms)
  }

  const humanizer = humanizeDuration.humanizer({
    units: ["y"],
    maxDecimalPoints: 0,
    language: "customUnits",
    languages: {
      customUnits: {
        ...compactUnits,
        ...options?.languages?.customUnits,
      },
      ...options?.languages,
    },
    ...options,
  })
  return humanizer(ms)
}

/**
 * Returns a duration in seconds for the given interval.
 *
 * @param interval - "minute" | "hour" | "day" | "week" | "month"
 * @param multiplier - Number of intervals (default: 1)
 * @returns Duration in seconds
 */
export const every = (
  interval: "minute" | "hour" | "day" | "week" | "month",
  multiplier: number = 1
): number => {
  const SECOND = 1
  const MINUTE = 60 * SECOND
  const HOUR = 60 * MINUTE
  const DAY = 24 * HOUR
  const WEEK = 7 * DAY
  const MONTH = 28 * DAY // approximate

  switch (interval) {
    case "minute":
      return multiplier * MINUTE
    case "hour":
      return multiplier * HOUR
    case "day":
      return multiplier * DAY
    case "week":
      return multiplier * WEEK
    case "month":
      return multiplier * MONTH
    default:
      return multiplier * DAY
  }
}
