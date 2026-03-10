"use client"

import { CSSProperties, useEffect, useState } from "react"
import { animate, motion, useMotionValue } from "motion/react"
import useMeasure from "react-use-measure"

import { cn } from "@/lib/utils"

export type InfiniteSliderProps = {
  children: React.ReactNode
  gap?: number
  speed?: number
  speedOnHover?: number
  direction?: "horizontal" | "vertical"
  reverse?: boolean
  className?: string
}

export function InfiniteSlider({
  children,
  gap = 16,
  speed = 32,
  speedOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentSpeed, setCurrentSpeed] = useState(speed)
  // Measure a single "window" (one set of children)
  const [groupRef, { width: groupWidth, height: groupHeight }] = useMeasure()
  const translation = useMotionValue(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    let controls
    const size = direction === "horizontal" ? groupWidth : groupHeight
    if (!size) return
    // Travel exactly one window size plus the gap between the two groups
    const contentSize = size + gap
    const from = reverse ? -contentSize : 0
    const to = reverse ? 0 : -contentSize

    const distanceToTravel = Math.abs(to - from)
    const duration = distanceToTravel / currentSpeed

    if (isTransitioning) {
      const remainingDistance = Math.abs(translation.get() - to)
      const transitionDuration = remainingDistance / currentSpeed

      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration: transitionDuration,
        onComplete: () => {
          setIsTransitioning(false)
          setKey((prevKey) => prevKey + 1)
        },
      })
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from)
        },
      })
    }

    return controls?.stop
  }, [
    key,
    translation,
    currentSpeed,
    groupWidth,
    groupHeight,
    gap,
    isTransitioning,
    direction,
    reverse,
  ])

  const hoverProps = speedOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true)
          setCurrentSpeed(speedOnHover)
        },
        onHoverEnd: () => {
          setIsTransitioning(true)
          setCurrentSpeed(speed)
        },
      }
    : {}

  const styles: CSSProperties = {
    gap: `${gap}px`,
    flexDirection: direction === "horizontal" ? "row" : "column",
  }
  return (
    <div className={cn("max-w-screen overflow-hidden", className)}>
      <motion.div
        className="flex w-max will-change-transform"
        style={{
          ...(direction === "horizontal"
            ? { x: translation }
            : { y: translation }),
          ...styles,
        }}
        {...hoverProps}
      >
        {/* First group (measured window) */}
        <div ref={groupRef} className="flex shrink-0 items-center" style={styles}>
          {children}
        </div>
        {/* Clone groups */}
        {Array.from({ length: 2 }).map((_, cloneIndex) => (
          <div key={cloneIndex} className="flex shrink-0 items-center" style={styles}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
