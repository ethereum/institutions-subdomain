"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useInView } from "motion/react"
import { motion, SpringOptions, useSpring, useTransform } from "motion/react"
import { useLocale } from "next-intl"

import { NumberParts } from "@/lib/types"

import { cn } from "@/lib/utils/index"
import { getValueParts } from "@/lib/utils/number"

export type AnimatedNumberProps = {
  value: number
  className?: string
  springOptions?: SpringOptions
  as?: React.ElementType
  fractionDigits?: number
}

export function AnimatedNumber({
  value,
  className,
  springOptions,
  as = "span",
  fractionDigits = 0,
}: AnimatedNumberProps) {
  const locale = useLocale()
  const MotionComponent = motion.create(as)

  const spring = useSpring(value, springOptions)
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })

  const display = useTransform(spring, (current) => {
    // quantize so we step in units of the fraction digit (e.g., 0.1 for 1 digit)
    const step = Math.pow(10, fractionDigits)
    const quantized = Math.round(current * step) / step
    return formatter.format(quantized)
  })

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return (
    <MotionComponent
      data-slot="animated-number"
      className={cn("tabular-nums", className)}
    >
      {display}
    </MotionComponent>
  )
}

export function AnimatedNumberInView({
  children,
  className,
  springOptions,
}: {
  children: number | string
  className?: string
  springOptions?: Partial<SpringOptions>
}) {
  const locale = useLocale()
  const [targetValue, setTargetValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref)

  const { parts, error } = useMemo(() => {
    const defaultParts: NumberParts = {
      prefix: "",
      value: 0,
      suffix: "",
      fractionDigits: 0,
    }
    try {
      const _parts = getValueParts(children)
      return {
        parts: {
          prefix: _parts.prefix,
          value: _parts.value,
          suffix: _parts.suffix,
          fractionDigits: _parts.fractionDigits,
        },
        error: false,
      }
    } catch {
      return { parts: defaultParts, error: true }
    }
  }, [children])

  useEffect(() => {
    if (isInView) setTargetValue(Number.isFinite(parts.value) ? parts.value : 0)
  }, [isInView, parts.value])

  if (error)
    return (
      <div className={className} ref={ref}>
        {children}
      </div>
    )

  const options = { bounce: 0, duration: 2000, ...springOptions }

  // Format the final value to reserve its width
  const finalFormatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: parts.fractionDigits,
    maximumFractionDigits: parts.fractionDigits,
  })
  const finalFormatted = finalFormatter.format(
    Number.isFinite(parts.value) ? parts.value : 0
  )

  return (
    <div className={cn("text-nowrap", className)} ref={ref}>
      {parts.prefix}
      {/* Reserve final width and overlay the animated number */}
      <span className="inline-grid">
        <span
          className="invisible col-start-1 row-start-1 tabular-nums"
          aria-hidden="true"
        >
          {finalFormatted}
        </span>
        <AnimatedNumber
          className="col-start-1 row-start-1"
          springOptions={options}
          value={targetValue}
          fractionDigits={parts.fractionDigits}
        />
      </span>
      {parts.suffix}
    </div>
  )
}
