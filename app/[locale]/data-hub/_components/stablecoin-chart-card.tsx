"use client"

import { useState } from "react"

import { DataTimestamped } from "@/lib/types"

import StablecoinTimeseriesTvlLineChart from "@/components/data/stablecoin-timeseries-tvl-line-chart"
import { SourceInfoTooltip } from "@/components/InfoTooltip"
import { AnimatedNumberInView } from "@/components/ui/animated-number"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardSource,
  CardTitle,
} from "@/components/ui/card"
import Link from "@/components/ui/link"

import { formatDateMonthDayYear } from "@/lib/utils/date"
import { formatLargeCurrency } from "@/lib/utils/number"

import { TimeseriesAssetsValueData } from "@/app/_actions/fetchTimeseriesAssetsValue"

const StablecoinChartCard = ({
  data,
}: {
  data: DataTimestamped<TimeseriesAssetsValueData>
}) => {
  const [showL2, setShowL2] = useState(true)

  const toggleShowL2 = () => {
    setShowL2((prev) => !prev)
  }

  return (
    <Card variant="flex-column">
      <CardHeader className="flex gap-2 !px-0 max-sm:flex-col sm:items-center">
        <CardContent className="flex-1 gap-4">
          <CardTitle className="text-xl">
            Stablecoin TVL (Mainnet{showL2 ? " and L2s" : ""})
          </CardTitle>
          <CardDescription className="font-medium">
            <Button variant="link" onClick={toggleShowL2}>
              {showL2 ? "Hide" : "Show"} layer 2 data
            </Button>
          </CardDescription>
        </CardContent>
        <div className="text-h4 font-bold tracking-[0.04rem]">
          <AnimatedNumberInView>
            {formatLargeCurrency(
              showL2
                ? data.data.mainnet.currentValue + data.data.layer2.currentValue
                : data.data.mainnet.currentValue
            )}
          </AnimatedNumberInView>
        </div>
      </CardHeader>

      <CardContent variant="flex-1-height-between" className="gap-y-4">
        <StablecoinTimeseriesTvlLineChart chartData={data} showL2={showL2} />

        {data.sourceInfo.source && (
          <CardSource>
            Source:{" "}
            {data.sourceInfo.sourceHref && (
              <Link inline href={data.sourceInfo.sourceHref}>
                {data.sourceInfo.source}
              </Link>
            )}
            {data.lastUpdated && (
              <SourceInfoTooltip
                lastUpdated={formatDateMonthDayYear(data.lastUpdated)}
              />
            )}
          </CardSource>
        )}
      </CardContent>
    </Card>
  )
}

export default StablecoinChartCard
