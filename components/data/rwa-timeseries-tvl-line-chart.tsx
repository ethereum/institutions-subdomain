"use client"

import { useLocale, useTranslations } from "next-intl"
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

import type { TimeseriesAssetsValueData } from "@/app/_actions/fetchTimeseriesAssetsValue"

type RwaTimeseriesTvlLineChartProps = {
  chartData: DataTimestamped<TimeseriesAssetsValueData>
  showL2?: boolean
}
const RwaTimeseriesTvlLineChart = ({
  chartData,
  showL2,
}: RwaTimeseriesTvlLineChartProps) => {
  const locale = useLocale()
  const tCharts = useTranslations("dataHub.charts")

  const chartConfig = {
    mainnet: {
      label: tCharts("mainnet"),
      color: "var(--chart-1)",
    },
    layer2: {
      label: tCharts("layer2"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig
  const layer2DateValueMapping = chartData.data.layer2.series.reduce(
    (acc, item) => {
      acc[item.date] = item.value
      return acc
    },
    {} as Record<string, number>
  )

  const data = chartData.data.mainnet.series.map((item) => {
    const mainnetItem = {
      date: item.date,
      mainnet: item.value,
    }
    if (!showL2) return mainnetItem
    return {
      ...mainnetItem,
      layer2: layer2DateValueMapping[item.date] || 0,
    }
  })

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[270px] w-full"
    >
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillRwaTvlMainnet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="10%" stopColor="var(--chart-1)" stopOpacity={1} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.5} />
          </linearGradient>
          <linearGradient id="fillRwaTvlLayer2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="10%" stopColor="var(--chart-2)" stopOpacity={1} />
            <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.5} />
          </linearGradient>
        </defs>

        {/* Watermark */}
        <g aria-hidden="true" pointerEvents="none">
          <text
            x="53%"
            y={showL2 ? "40%" : "50%"}
            textAnchor="middle"
            fill="var(--muted-foreground)"
            className="text-big font-bold opacity-10"
          >
            {tCharts("mainnet")}
            {showL2 && (
              <>
                <tspan x="53%" dy="1.2em">
                  {tCharts("layer2")}
                </tspan>
              </>
            )}
          </text>
        </g>

        <CartesianGrid vertical horizontal strokeDasharray="8 4" />
        <YAxis
          tickFormatter={(v) =>
            formatLargeCurrency(locale, v, 2).replace(/\.0+/, "")
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
          dataKey="mainnet"
          type="natural"
          fill="url(#fillRwaTvlMainnet)"
          stroke="var(--chart-1)"
          stackId="a"
        />
        <Area
          dataKey="layer2"
          type="natural"
          fill="url(#fillRwaTvlLayer2)"
          stroke="var(--chart-2)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}

export default RwaTimeseriesTvlLineChart
