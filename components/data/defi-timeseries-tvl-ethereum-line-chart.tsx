"use client"

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

import type { TimeseriesDefiTvlEthereumData } from "@/app/_actions/fetchTimeseriesDefiTvlEthereum"

const chartConfig = {
  value: {
    label: "Mainnet",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type DefiTimeseriesTvlEthereumLineChartProps = {
  chartData: DataTimestamped<TimeseriesDefiTvlEthereumData>
}
const DefiTimeseriesTvlEthereumLineChart = ({
  chartData,
}: DefiTimeseriesTvlEthereumLineChartProps) => (
  <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
    <AreaChart data={chartData.data.series}>
      <defs>
        <linearGradient id="fillDefiTvl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="transparent" stopOpacity={0} />
          <stop offset="100%" stopColor="transparent" stopOpacity={0} />
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
            Mainnet
          </tspan>
        </text>
      </g>

      <CartesianGrid vertical horizontal strokeDasharray="8 4" />
      <YAxis
        tickFormatter={(v) => formatLargeCurrency(v, 3).replace(/\.0+/, "")}
        axisLine={false}
        tickLine={false}
        tickMargin={8}
      />
      <XAxis
        dataKey="date"
        axisLine={false}
        tickMargin={8}
        minTickGap={32}
        tickFormatter={(v) => formatDateMonthYear(v)}
      />
      <ChartTooltip
        content={(props) => (
          <ChartTooltipContent
            {...props}
            labelFormatter={(v) => formatDateFull(v)}
            indicator="dot"
          />
        )}
      />
      <Area
        dataKey="value"
        type="natural"
        fill="url(#fillDefiTvl)"
        stroke="var(--chart-1)"
        stackId="a"
        strokeWidth={2}
      />
    </AreaChart>
  </ChartContainer>
)

export default DefiTimeseriesTvlEthereumLineChart
