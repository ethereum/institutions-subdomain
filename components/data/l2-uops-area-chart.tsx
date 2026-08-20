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

import { formatDateFull, formatDateMonthDayYear } from "@/lib/utils/date"
import { formatLargeNumber } from "@/lib/utils/number"

import type { L2ScalingActivityData } from "@/app/_actions/fetchL2ScalingActivity"

type L2UopsAreaChartProps = {
  chartData: DataTimestamped<L2ScalingActivityData>
}
const L2UopsAreaChart = ({ chartData }: L2UopsAreaChartProps) => {
  const locale = useLocale()

  const chartConfig = {
    uops: {
      label: "UOPS",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[270px] w-full"
    >
      <AreaChart data={chartData.data.series}>
        <defs>
          <linearGradient id="fillUops" x1="0" y1="0" x2="0" y2="1">
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
              L2 UOPS
            </tspan>
          </text>
        </g>

        <CartesianGrid vertical horizontal strokeDasharray="8 4" />
        <YAxis
          tickFormatter={(v) => formatLargeNumber(locale, v, {}, 2)}
          axisLine={false}
          tickLine={false}
          tickMargin={8}
        />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(v) => formatDateMonthDayYear(locale, v)}
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
          dataKey="uops"
          type="natural"
          fill="url(#fillUops)"
          stroke="var(--chart-1)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}

export default L2UopsAreaChart
