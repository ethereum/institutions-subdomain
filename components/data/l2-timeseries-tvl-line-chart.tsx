"use client"

import { useLocale } from "next-intl"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import type { DataTimestamped } from "@/lib/types"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { formatDateFull, formatDateMonthYear } from "@/lib/utils/date"
import { formatLargeCurrency } from "@/lib/utils/number"

import type { TimeseriesL2TvlData } from "@/app/_actions/fetchTimeseriesL2Tvl"

const chartConfig = {
  value: {
    label: "Layer 2 TVL",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type L2TimeseriesTvlLineChartProps = {
  chartData: DataTimestamped<TimeseriesL2TvlData>
}
const L2TimeseriesTvlLineChart = ({
  chartData,
}: L2TimeseriesTvlLineChartProps) => {
  const locale = useLocale()
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[270px] w-full"
    >
      <AreaChart data={chartData.data.series}>
        <defs>
          <linearGradient id="fillL2Tvl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="10%" stopColor="var(--chart-1)" stopOpacity={1} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.5} />
          </linearGradient>
        </defs>

        {/* Watermark */}
        <g aria-hidden="true" pointerEvents="none">
          <text
            x="53%"
            y="40%"
            textAnchor="middle"
            fill="var(--muted-foreground)"
            className="text-big font-bold opacity-10"
          >
            Ethereum
            <tspan x="53%" dy="1.2em">
              Layer 2
            </tspan>
          </text>
        </g>

        <CartesianGrid vertical horizontal strokeDasharray="8 4" />
        <YAxis
          tickFormatter={(v) =>
            formatLargeCurrency(locale, v, 3).replace(/\.0+/, "")
          }
          axisLine={false}
          tickLine={false}
          tickMargin={8}
        />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(v) => formatDateMonthYear(locale, v)}
        />
        <ChartTooltip
          content={(props) => (
            <ChartTooltipContent
              {...props}
              labelFormatter={(v) => formatDateFull(locale, v)}
              indicator="dot"
            />
          )}
        />
        <Area
          dataKey="value"
          type="natural"
          fill="url(#fillL2Tvl)"
          stroke="var(--chart-1)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}

export default L2TimeseriesTvlLineChart
