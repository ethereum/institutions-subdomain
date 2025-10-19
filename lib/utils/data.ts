import { RWA_API_LAYER_2S_IDS, RWA_API_MAINNET } from "../constants"
import type { DataSeries, DateArg } from "../types"

/**
 * Filters an array of objects, returning only those whose `date` property falls on the specified days of the month (UTC),
 * and always includes the most recent element in the array (based on UTC time) if not already included.
 *
 * Notes:
 * - The input array is not mutated.
 * - All date checks use UTC (getUTCDate / getTime) to ensure timezone-independent behavior.
 *
 * @template T - The type of objects in the array, which must include a `date` property.
 * @param array - The array of objects to filter.
 * @param dateMatches - An array of day numbers (1-31) to match against the day of the month in each object's `date` property. Defaults to `[1, 15]`.
 * @returns A new array containing only the objects whose `date` property matches one of the specified days (UTC), plus the last element if not already included. Results are returned in ascending chronological order (UTC).
 */
export const filterFirstAndFifteenth = <
  T extends { date: DateArg } & Record<string, unknown>,
>(
  array: T[],
  dateMatches = [1, 15]
): T[] => {
  if (!array || array.length < 2) return array

  // Normalize and validate the dateMatches into a Set of integers 1..31
  const matches = new Set<number>(
    dateMatches
      .map((d) => Number(d))
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= 31)
  )

  // Sort a copy of the array by UTC timestamp to avoid mutating the original
  const sorted = [...array].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Filter by UTC day-of-month
  const filtered = sorted.filter((item) =>
    matches.has(new Date(item.date).getUTCDate())
  )

  if (filtered.length < 2) return sorted

  if (filtered[filtered.length - 1].date === sorted[sorted.length - 1].date)
    return filtered

  return [...filtered, sorted[sorted.length - 1]]
}

/**
 * Produces a series (optionally filtered) and the current value from the original series array.
 *
 * @param seriesMapped - The input data series to read from. Must be a non-empty DataSeries.
 * @param skipFiltering - If true, the original seriesMapped is returned unchanged. If false or omitted, the series is passed through `filterFirstAndFifteenth`.
 * @returns An object containing:
 *  - `series`: the resulting DataSeries (filtered unless `skipFiltering` is true),
 *  - `currentValue`: the `value` of the last element in the original `seriesMapped` array.
 *
 * @throws {Error} If `seriesMapped` is empty or not provided.
 *
 * @remarks
 * The function does not mutate the input `seriesMapped`; it either returns it directly or returns the result of `filterFirstAndFifteenth(seriesMapped)`.
 */
export const getSeriesWithCurrent = (
  seriesMapped: DataSeries,
  skipFiltering?: boolean
) => {
  if (seriesMapped?.length <= 0) throw new Error("Data series array empty")

  const series = skipFiltering
    ? seriesMapped
    : filterFirstAndFifteenth(seriesMapped)

  return {
    series,
    currentValue: seriesMapped[seriesMapped.length - 1].value,
  }
}

/**
 * Returns a data series object containing the filtered or unfiltered series,
 * the current value, and the last updated timestamp.
 *
 * @param seriesMapped - The array of data series objects to process.
 * @param skipFiltering - If true, skips filtering and returns the original series.
 * @returns An object with the processed data series, current value, and last updated timestamp.
 * @throws If the input data series array is empty.
 */
export const getDataSeriesWithCurrent = (
  seriesMapped: DataSeries,
  skipFiltering?: boolean
) => ({
  data: getSeriesWithCurrent(seriesMapped, skipFiltering),
  lastUpdated: new Date(seriesMapped[seriesMapped.length - 1].date).getTime(),
})

/**
 * Generates a filter object for querying RWA API by Ethereum network IDs.
 *
 * @param networks - An array specifying which networks to include in the filter.
 *                   Possible values are "mainnet" and "layer-2". Defaults to both.
 * @returns An object containing an "or" operator and an array of filter conditions
 *          for the specified networks. If no networks are provided, returns an empty object.
 */
export const getRwaApiEthereumNetworksFilter = (
  networks: ("mainnet" | "layer-2")[] = ["mainnet", "layer-2"]
) => {
  if (!networks.length) return

  const COMMON_FIELD_OPERATOR = {
    field: "networkID",
    operator: "equals",
  }

  const mainnetFilter = {
    ...COMMON_FIELD_OPERATOR,
    value: RWA_API_MAINNET.id,
  }

  const layer2Filters = RWA_API_LAYER_2S_IDS.map((id) => ({
    ...COMMON_FIELD_OPERATOR,
    value: id,
  }))

  const filters = []

  if (networks.includes("mainnet")) filters.push(mainnetFilter)
  if (networks.includes("layer-2")) filters.push(...layer2Filters)

  return { operator: "or", filters }
}
