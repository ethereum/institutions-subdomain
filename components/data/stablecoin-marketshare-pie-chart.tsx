"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  Cell,
  Pie,
  PieChart,
  type PieLabelRenderProps,
  Sector,
  type SectorProps,
  TooltipContentProps,
} from "recharts"

import type { DataTimestamped, NetworkPieChartData } from "@/lib/types"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart"

import { formatPercent } from "@/lib/utils/number"

type PieSlicePayload = {
  name?: string | number
  network?: string
  fill?: string
  [k: string]: unknown
}

type PieSliceProps = Partial<SectorProps> & {
  cx?: number
  cy?: number
  midAngle?: number
  outerRadius?: number
  innerRadius?: number
  startAngle?: number
  endAngle?: number
  percent?: number
  value?: number
  payload?: PieSlicePayload
}


/**
 * Renders a custom label for a pie chart slice, consisting of a small connector line
 * and a short value label. Intended for non-hovered slices.
 *
 * @param cx - The x-coordinate of the pie chart center.
 * @param cy - The y-coordinate of the pie chart center.
 * @param midAngle - The middle angle of the slice, in degrees.
 * @param outerRadius - The outer radius of the pie chart.
 * @param percent - The percentage value of the slice.
 * @param value - The value to display in the label.
 * @param payload - The data payload for the slice, used for color.
 * @returns SVG elements representing the connector and label.
 */
const RenderedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  value,
  payload,
  locale,
}: PieLabelRenderProps & { payload?: PieSlicePayload; locale: string }) => {
  const cxNum = typeof cx === "number" ? cx : Number(cx) || 0
  const cyNum = typeof cy === "number" ? cy : Number(cy) || 0
  const midAngleNum =
    typeof midAngle === "number" ? midAngle : Number(midAngle) || 0
  const outerNum =
    typeof outerRadius === "number" ? outerRadius : Number(outerRadius) || 0

  const RADIAN = Math.PI / 180
  const sin = Math.sin(-RADIAN * midAngleNum)
  const cos = Math.cos(-RADIAN * midAngleNum)

  const sx = cxNum + outerNum * cos
  const sy = cyNum + outerNum * sin
  const ex = cxNum + (outerNum + 26) * cos
  const ey = cyNum + (outerNum + 26) * sin
  const textAnchor = cos >= 0 ? "start" : "end"

  return (
    <g>
      <path
        d={`M${sx},${sy}L${ex},${ey}`}
        stroke={String(payload?.fill ?? "currentColor")}
        fill="none"
      />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 6}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        fontSize={12}
      >
        {formatPercent(locale, Number(value ?? percent ?? 0))}
      </text>
    </g>
  )
}

/**
 * Renders the active (hovered) pie chart slice with enhanced visual emphasis.
 *
 * Displays:
 * - The main slice sector.
 * - A subtle, larger outer arc to emphasize the hovered slice.
 * - A connector line from the slice to the label.
 * - The slice's value (as a percentage) and its network name at the end of the connector.
 *
 * @param cx - The x-coordinate of the pie center.
 * @param cy - The y-coordinate of the pie center.
 * @param midAngle - The middle angle of the slice.
 * @param innerRadius - The inner radius of the slice.
 * @param outerRadius - The outer radius of the slice.
 * @param startAngle - The starting angle of the slice.
 * @param endAngle - The ending angle of the slice.
 * @param fill - The fill color for the slice.
 * @param payload - The data payload for the slice, containing network or name.
 * @param percent - The percentage value of the slice.
 * @param value - The value of the slice.
 *
 * @remarks
 * Used to highlight the hovered slice in a stablecoin market share pie chart.
 */
const RenderedActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  percent,
  value,
  locale,
}: PieSliceProps & { locale: string }) => {
  const RADIAN = Math.PI / 180
  const sin = Math.sin(-RADIAN * (midAngle ?? 0))
  const cos = Math.cos(-RADIAN * (midAngle ?? 0))

  // connector points
  const sx = (cx ?? 0) + (outerRadius ?? 0) * cos
  const sy = (cy ?? 0) + (outerRadius ?? 0) * sin
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 24) * cos
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 24) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 8
  const ey = my
  const textAnchor = cos >= 0 ? "start" : "end"

  return (
    <g pointerEvents="none">
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* subtle outer arc to emphasize slice */}
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 4}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={String(fill)}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={3} fill={String(fill)} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 8}
        y={ey}
        textAnchor={textAnchor}
        fill="#111"
        fontWeight={600}
      >
        {formatPercent(locale, Number(value ?? percent ?? 0))}
      </text>
    </g>
  )
}

type StablecoinMarketsharePieChartProps = {
  chartData: DataTimestamped<NetworkPieChartData>
}

const StablecoinMarketSharePieChart = ({
  chartData,
}: StablecoinMarketsharePieChartProps) => {
  const locale = useLocale()
  const tCharts = useTranslations("dataHub.charts")
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [activated, setActivated] = useState(false)

  const chartConfig = {
    marketShare: {
      label: tCharts("marketShare"),
    },
    ethereum: {
      label: tCharts("ethMainnet"),
      color: "var(--chart-1)",
    },
    "ethereum-l2s": {
      label: tCharts("ethL2s"),
      color: "var(--chart-2)",
    },
    "alt-2nd": {
      label: tCharts("secondLargest"),
      color: "var(--chart-3)",
    },
    "alt-3rd": {
      label: tCharts("thirdLargest"),
      color: "var(--chart-4)",
    },
    "alt-rest": {
      label: tCharts("remainder"),
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  const colorLookup = chartConfig as Record<
    string,
    { label: string; color?: string }
  >

  // rotation in degrees clockwise (change this to rotate the starting point)
  const ROTATION = 150 // e.g. 45 to rotate 45° clockwise
  const startAngle = 90 - ROTATION
  const endAngle = startAngle - 360

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[320px] w-full sm:max-lg:h-[320px]"
    >
      <PieChart
        onMouseLeave={() => setActiveIndex(null)}
        margin={{ left: 0, right: 0, top: 24, bottom: 32 }}
      >
        <ChartTooltip
          formatter={(value: unknown) => formatPercent(locale, Number(value))}
          // ((props: TooltipContentProps<TValue, TName>) => ReactNode)
          // content={(props: TooltipProps<number, string> | undefined) => {
          content={(props: TooltipContentProps<number, string>) => {
            if (
              !props ||
              !props.active ||
              !props.payload ||
              props.payload.length === 0
            )
              return null
            const item = props.payload[0]
            const entry = item.payload as {
              network?: string
              name?: string
              [k: string]: unknown
            }
            const key = String(entry.network ?? entry.name ?? item.name ?? "")
            const label =
              (chartConfig as Record<string, { label: string }>)[key]?.label ??
              key
            return (
              <div className="bg-card/95 rounded p-2 text-sm font-semibold shadow">
                {label}
              </div>
            )
          }}
        />
        <Pie
          data={chartData.data}
          dataKey="marketShare"
          // label function hides the label for the hovered slice immediately
          label={(props: PieLabelRenderProps) => {
            const payload = props.payload as PieSlicePayload | undefined
            const key = payload?.network ?? payload?.name
            const idx = chartData.data.findIndex(
              (d) => String(d.network) === String(key)
            )
            if (idx === activeIndex) return null
            return <RenderedLabel {...props} locale={locale} />
          }}
          nameKey="network"
          startAngle={startAngle}
          endAngle={endAngle}
          activeShape={(props: PieSliceProps) => (
            <RenderedActiveShape {...props} locale={locale} />
          )}
          // remove Pie-level mouse handlers (we'll attach handlers to Cells)
          isAnimationActive={!activated} // disable animation after activated so labels/slices switch immediately
          animationDuration={activated ? 0 : 2000}
        >
          {chartData.data.map((entry, i) => {
            const cfg = colorLookup[String(entry.network)] ?? {}
            const fill = cfg.color ?? "var(--chart-1)"
            return (
              <Cell
                key={`cell-${i}`}
                fill={fill}
                fillOpacity={0.9}
                stroke="var(--card-bg, #fff)" // keep 1px gap if desired
                strokeWidth={1}
                // attach events to the Cell so the hovered target is stable
                onMouseEnter={() => {
                  setActivated(true)
                  setActiveIndex(i)
                }}
                onMouseLeave={() => setActiveIndex(null)}
                // only treat the filled area as pointer-target (ignore stroke)
                style={{ pointerEvents: "fill" }}
              />
            )
          })}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="network" />}
          className="flex-wrap gap-2 *:basis-1/4 *:justify-center"
        />
      </PieChart>
    </ChartContainer>
  )
}

export default StablecoinMarketSharePieChart
