"use client"

import {
  Children,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { motion } from "motion/react"
import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils/index"

import ArrowLeftSharp from "../svg/arrow-left-sharp"
import ArrowRightSharp from "../svg/arrow-right-sharp"

export type CarouselContextType = {
  index: number
  setIndex: (newIndex: number) => void
  itemsCount: number
  setItemsCount: (newItemsCount: number) => void
  disableDrag: boolean
}

const CarouselContext = createContext<CarouselContextType | undefined>(
  undefined
)

function useCarousel() {
  const context = useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within an CarouselProvider")
  }
  return context
}

export type CarouselProviderProps = {
  children: ReactNode
  initialIndex?: number
  onIndexChange?: (newIndex: number) => void
  disableDrag?: boolean
}

function CarouselProvider({
  children,
  initialIndex = 0,
  onIndexChange,
  disableDrag = false,
}: CarouselProviderProps) {
  const [index, setIndex] = useState<number>(initialIndex)
  const [itemsCount, setItemsCount] = useState<number>(0)

  const handleSetIndex = (newIndex: number) => {
    setIndex(newIndex)
    onIndexChange?.(newIndex)
  }

  useEffect(() => {
    setIndex(initialIndex)
  }, [initialIndex])

  return (
    <CarouselContext.Provider
      value={{
        index,
        setIndex: handleSetIndex,
        itemsCount,
        setItemsCount,
        disableDrag,
      }}
    >
      {children}
    </CarouselContext.Provider>
  )
}

export type CarouselProps = {
  children: ReactNode
  className?: string
  initialIndex?: number
  index?: number
  onIndexChange?: (newIndex: number) => void
  disableDrag?: boolean
}

function Carousel({
  children,
  className,
  initialIndex = 0,
  index: externalIndex,
  onIndexChange,
  disableDrag = false,
}: CarouselProps) {
  const [internalIndex, setInternalIndex] = useState<number>(initialIndex)
  const isControlled = externalIndex !== undefined
  const currentIndex = isControlled ? externalIndex : internalIndex

  const handleIndexChange = (newIndex: number) => {
    if (!isControlled) {
      setInternalIndex(newIndex)
    }
    onIndexChange?.(newIndex)
  }

  return (
    <CarouselProvider
      initialIndex={currentIndex}
      onIndexChange={handleIndexChange}
      disableDrag={disableDrag}
    >
      <div
        className={cn("group/hover relative isolate w-full min-w-0", className)}
      >
        <div className="w-full min-w-0 overflow-hidden [contain:layout_inline-size]">
          {children}
        </div>
      </div>
    </CarouselProvider>
  )
}

export type CarouselNavigationProps = {
  className?: string
  classNameButton?: string
  alwaysShow?: boolean
}

function CarouselNavigation({
  className,
  classNameButton,
  alwaysShow,
}: CarouselNavigationProps) {
  const { index, setIndex, itemsCount } = useCarousel()

  const classes = cn(
    "pointer-events-auto size-fit transition-[opacity,colors] duration-300",
    !alwaysShow && "opacity-0 group-hover/hover:opacity-100",
    alwaysShow
      ? "disabled:*:text-muted"
      : "group-hover/hover:disabled:*:text-muted",
    classNameButton
  )
  return (
    <div
      className={cn(
        "pointer-events-none mt-10 flex w-fit gap-x-4 max-sm:justify-center sm:mt-14",
        className
      )}
    >
      <button
        type="button"
        aria-label="Previous slide"
        className={classes}
        disabled={index === 0}
        onClick={() => {
          if (index > 0) {
            setIndex(index - 1)
          }
        }}
      >
        <ArrowLeftSharp className="text-secondary-foreground" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        className={classes}
        disabled={index + 1 === itemsCount}
        onClick={() => {
          if (index < itemsCount - 1) {
            setIndex(index + 1)
          }
        }}
      >
        <ArrowRightSharp className="text-secondary-foreground" />
      </button>
    </div>
  )
}

export type CarouselIndicatorProps = {
  className?: string
  classNameButton?: string
}

function CarouselIndicator({
  className,
  classNameButton,
}: CarouselIndicatorProps) {
  const { index, itemsCount, setIndex } = useCarousel()

  return (
    <div className={cn("mt-14 w-fit", className)}>
      <ul role="tablist" className="flex">
        {Array.from({ length: itemsCount }, (_, i) => (
          <li key={i} role="presentation">
            <button
              type="button"
              role="tab"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "mx-2 size-2.5 shrink-0 rounded-full transition-opacity duration-300",
                index === i ? "bg-secondary-foreground" : "bg-muted",
                classNameButton
              )}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export type CarouselContentProps = {
  children: ReactNode
  className?: string
}

function CarouselContent({ children, className }: CarouselContentProps) {
  const { index, setItemsCount } = useCarousel()
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const itemsLength = Children.count(children)

  useEffect(() => {
    if (!viewportRef.current || !trackRef.current) {
      return
    }

    const options = {
      root: viewportRef.current,
      threshold: 0.5,
    }

    const observer = new IntersectionObserver(() => {}, options)

    const childNodes = trackRef.current.children
    Array.from(childNodes).forEach((child) => observer.observe(child))

    return () => observer.disconnect()
  }, [children, setItemsCount])

  useEffect(() => {
    if (!itemsLength) {
      return
    }

    setItemsCount(itemsLength)
  }, [itemsLength, setItemsCount])

  // Programmatic scroll when index changes
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const width = viewport.clientWidth
    viewport.scrollTo({ left: width * index, behavior: "smooth" })
  }, [index])

  // Sync index when user scrolls (native drag/swipe)
  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const slide = track.children[index] as HTMLElement | undefined
    if (!slide) return

    // Use the slide's actual offset instead of width * index for reliability on iOS
    viewport.scrollTo({
      left: slide.offsetLeft,
      behavior: "smooth",
    })
  }, [index])

  return (
    <div
      ref={viewportRef}
      className={cn(
        "relative w-full min-w-0 touch-pan-x touch-pan-y snap-x snap-mandatory overflow-x-auto overscroll-x-contain [contain:layout_inline-size]",
        "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      )}
    >
      <div
        ref={trackRef}
        className={cn(
          "flex w-full min-w-0 flex-nowrap items-stretch",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export type CarouselItemProps = {
  children: ReactNode
  className?: string
}

function CarouselItem({ children, className }: CarouselItemProps) {
  return (
    <motion.div
      className={cn(
        // exactly one viewport wide, with strong snap
        "w-full min-w-0 flex-none snap-start snap-always overflow-hidden",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

function CarouselFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-8 flex items-center justify-between [&>div]:!mt-0",
        className
      )}
      {...props}
    />
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselFooter,
  CarouselIndicator,
  CarouselItem,
  CarouselNavigation,
  useCarousel,
}
