"use client"

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

type XYCoord = { x: number; y: number }

type LineData = {
  id: string
  x: number
  y: number
  length: number
  opacity: number
  travel: number
  duration: number
  delay: number
}

type Ripple = {
  id: number
  x: number
  y: number
  start: number // ms timestamp from performance.now()
  amplitude: number // px
  wavelength: number // px between crests
  speed: number // px/sec radial propagation speed
  decay: number // per-second amplitude decay
  spread: number // px thickness of the wavefront ring
}

// Per-load seeded RNG (unique each visit; stable for component lifetime)
type LineFrac = {
  id: string
  x: number // viewBox units
  len: number // viewBox units
  opacity: number
  travel: number // viewBox units (positive or negative allowed)
  duration: number // seconds
  delay: number // seconds
}

const mulberry32 = (seed: number) => {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildLinesPool(
  count: number,
  VBW: number,
  mobile: boolean
): LineFrac[] {
  // Responsive constraints
  const leftMargin = mobile ? 64 : 48
  const rightMargin = mobile ? 64 : 48
  const minLen = mobile ? VBW * 0.25 : VBW * 0.35
  const maxLen = mobile ? VBW * 0.55 : VBW * 0.75
  const minTravel = mobile ? VBW * 0.03 : VBW * 0.05
  const maxTravel = mobile ? VBW * 0.06 : VBW * 0.09

  // Seed unique per load
  const fallbackSeed = Math.floor(Math.random() * 2 ** 32)
  const perf = typeof performance !== "undefined" ? performance.now() : 0
  const seed = (fallbackSeed ^ Math.floor(perf)) >>> 0
  const rng = mulberry32(seed)

  return Array.from({ length: count }).map((_, idx) => {
    // Bias lengths longer near the middle (parabolic weight)
    const t = count > 1 ? idx / (count - 1) : 0.5
    const m = (t - 0.5) / 0.5 // -1..1
    const centerBias = 1 - 0.35 * m * m
    const len = minLen + (maxLen - minLen) * (0.35 + 0.65 * rng()) * centerBias

    // Travel amplitude and direction
    const travelAmp = minTravel + (maxTravel - minTravel) * rng()
    const direction = rng() > 0.5 ? 1 : -1
    const travel = direction * travelAmp

    // Choose x so that the full motion stays inside margins with slight overshoot
    // Visible min = x + min(0, travel), visible max = x + len + max(0, travel)
    const minX = leftMargin - Math.min(0, travel)
    const maxX = VBW - rightMargin - len - Math.max(0, travel)
    const x = minX < maxX ? minX + (maxX - minX) * rng() : Math.max(minX, 0)

    const opacity = 0.2 + 0.8 * rng()
    const duration = 18 + 18 * rng() // 18–36s
    const delay = 6 * rng() // 0–6s
    return {
      id: `line-index-${idx}`,
      x,
      len,
      opacity,
      travel,
      duration,
      delay,
    }
  })
}

type HeroBgProps = Omit<React.SVGProps<SVGSVGElement>, "height"> & {
  gap?: number
  maxLines?: number
  hoverSigmaX?: number
  hoverSigmaY?: number
  hoverStrokeGain?: number
  pointerMargin?: number
  autoHint?: boolean
  rippleAmplitude?: number
  rippleWavelength?: number
  rippleSpeed?: number
  rippleDecay?: number
  rippleSpread?: number
  rippleLifetimeMs?: number
  rippleSampleCount?: number
  splineTension?: number
  initialDrawMs?: number
  initialDrawStaggerMs?: number
  reducedMotionFadeMs?: number
}

const HeroBg = ({
  // Layout (container-driven; width prop used only as SSR fallback)
  width: widthProp = 670,
  strokeWidth = 2,
  gap = 7,
  maxLines = 60,
  // Hover emphasis
  hoverSigmaX = 80,
  hoverSigmaY = 48,
  hoverStrokeGain = 1.1,
  // Pointer tracking margin (keeps hover alive just outside bbox)
  pointerMargin = 120,
  // Ripple behavior
  rippleAmplitude = 8,
  rippleWavelength = 120,
  rippleSpeed = 300,
  rippleDecay = 1.1,
  rippleSpread = 12,
  rippleLifetimeMs = 5200,
  rippleSampleCount = 21,
  splineTension = 0.85,
  autoHint = true,
  initialDrawMs = 300,
  initialDrawStaggerMs = 12,
  reducedMotionFadeMs = 250,
  ...props
}: HeroBgProps) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  // Trigger a one-time stroke draw animation on initial mount
  const [drawReady, setDrawReady] = useState(false)
  useEffect(() => {
    if (!mounted) return
    const id = requestAnimationFrame(() => setDrawReady(true))
    return () => cancelAnimationFrame(id)
  }, [mounted])

  // Refs and measurement for container-driven sizing
  const svgRef = useRef<SVGSVGElement | null>(null)
  const measureRafRef = useRef<number | null>(null)
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null)
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null)
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    // Initialize immediately to avoid a flash
    const rect0 = el.getBoundingClientRect()
    if (rect0.width > 0) setMeasuredWidth(Math.round(rect0.width))
    if (rect0.height > 0) setMeasuredHeight(Math.round(rect0.height))
    if (typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect
      if (!cr) return
      const nextW = Math.round(cr.width)
      const nextH = Math.round(cr.height)
      if (measureRafRef.current != null)
        cancelAnimationFrame(measureRafRef.current)
      measureRafRef.current = requestAnimationFrame(() => {
        setMeasuredWidth((prev) =>
          nextW > 0 && (prev == null || Math.abs(prev - nextW) >= 1)
            ? nextW
            : (prev ?? nextW)
        )
        setMeasuredHeight((prev) =>
          nextH > 0 && (prev == null || Math.abs(prev - nextH) >= 1)
            ? nextH
            : (prev ?? nextH)
        )
      })
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      if (measureRafRef.current != null)
        cancelAnimationFrame(measureRafRef.current)
    }
  }, [])

  // Use measured width when available; else fall back to provided width prop
  const widthPx =
    (typeof widthProp === "number"
      ? widthProp
      : parseFloat(String(widthProp))) || 670
  const effectiveWidth = measuredWidth ?? widthPx
  // Fixed design viewBox to enable object-cover-like behavior
  const VBW = 1200
  const VBH = 600
  // Normalize strokeWidth to a number first (SVG prop allows string|number)
  const strokeWidthNum =
    typeof strokeWidth === "number"
      ? strokeWidth
      : parseFloat(String(strokeWidth)) || 0
  // Scale stroke/gap for smaller widths to reduce visual weight and height
  const isMobile = effectiveWidth < 768
  const strokeWidthPx = strokeWidthNum // keep 2px always; vector-effect keeps visual
  const gapPx = isMobile ? Math.max(1, +gap - 1) : +gap
  const segmentHeight = +strokeWidthPx + gapPx
  // Compute cover scale from container to viewBox
  const containerW = measuredWidth ?? widthPx
  const containerH = measuredHeight ?? segmentHeight * 40
  const scaleX = containerW / VBW
  const scaleY = containerH / VBH
  const coverScale = Math.max(scaleX, scaleY)
  const invCoverScale = Math.max(1 / Math.max(coverScale, 0.0001), 0.0001)
  // Convert spacing into viewBox units so CSS px spacing remains constant after scaling
  const segmentHeightView = segmentHeight * invCoverScale
  // Derive line count from height and spacing; clamp at maxLines
  const dynamicLineCount = Math.max(
    1,
    Math.min(
      maxLines,
      Math.floor((VBH - segmentHeightView) / segmentHeightView)
    )
  )

  // Build per-load random pool with constraints for the current device scale
  const poolRef = useRef<LineFrac[] | null>(null)
  if (!poolRef.current || poolRef.current.length !== dynamicLineCount) {
    poolRef.current = buildLinesPool(dynamicLineCount, VBW, isMobile)
  }
  const lines: LineData[] = poolRef.current.map((lf, idx) => {
    const y = (idx + 0.5) * segmentHeightView // fill from top to bottom
    return {
      id: lf.id,
      x: lf.x,
      y,
      length: lf.len,
      opacity: lf.opacity,
      travel: lf.travel,
      duration: lf.duration,
      delay: lf.delay,
    }
  })

  // Pointer hover state (for opacity/weight emphasis only)
  const [pointer, setPointer] = useState<XYCoord | null>(null)
  // Keep a ref for the latest pointer to avoid rescheduling timers on movement
  const pointerRef = useRef<XYCoord | null>(null)
  const pointerRafRef = useRef<number | null>(null)
  // svgRef declared earlier

  // Ripple animation state
  const ripplesRef = useRef<Ripple[]>([])
  const rafRef = useRef<number | null>(null)
  const [, setNow] = useState(0) // used to trigger re-renders during ripple animation
  // Track animation timeline start and paused timestamp to sync with CSS slide
  const animationStartRef = useRef<number>(performance.now())
  const pausedAtRef = useRef<number | null>(null)
  // Auto-hint ripple timers and last-trigger tracking
  const hintTimeoutRef = useRef<number | null>(null)
  const lastRippleAtRef = useRef<number | null>(null)
  // no hard cap: allow stacking; lifetime trimming keeps perf in check

  const clearHintTimeout = useCallback(() => {
    if (hintTimeoutRef.current != null) {
      clearTimeout(hintTimeoutRef.current)
      hintTimeoutRef.current = null
    }
  }, [])

  const randBetween = useCallback((minMs: number, maxMs: number) => {
    return Math.floor(minMs + Math.random() * (maxMs - minMs))
  }, [])

  const isPointInsideSvg = useCallback(
    (p: XYCoord | null) =>
      !!p && p.x >= 0 && p.x <= VBW && p.y >= 0 && p.y <= VBH,
    [VBW, VBH]
  )

  const randomPointInSvg = useCallback((): XYCoord => {
    return { x: Math.random() * VBW, y: Math.random() * VBH }
  }, [VBW, VBH])

  // Helper: convert client coordinates to SVG internal coordinates using getScreenCTM
  const svgPointFromClient = useCallback(
    (svg: SVGSVGElement, clientX: number, clientY: number) => {
      // Prefer exact mapping via getScreenCTM; fall back to rect scaling
      const pt = svg.createSVGPoint()
      pt.x = clientX
      pt.y = clientY
      const ctm = svg.getScreenCTM()
      if (ctm) {
        const inv = ctm.inverse()
        const mapped = pt.matrixTransform(inv)
        return { x: mapped.x, y: mapped.y }
      }
      const rect = svg.getBoundingClientRect()
      const sx = VBW / rect.width
      const sy = VBH / rect.height
      return { x: (clientX - rect.left) * sx, y: (clientY - rect.top) * sy }
    },
    [VBW, VBH]
  )

  // Prefers-reduced-motion handling
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduceMotion(mql.matches)
    onChange()
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    }
  }, [])

  // If reduced motion toggles on, clear ripples and stop RAF
  useEffect(() => {
    if (!reduceMotion) return
    ripplesRef.current = []
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    pausedAtRef.current = null
  }, [reduceMotion])

  // Track pointer globally so hover effect persists slightly outside the SVG bbox
  useEffect(() => {
    // Detect coarse (touch) pointers so we can adjust touch-action and overflow behavior
    if (typeof window !== "undefined") {
      const mql = window.matchMedia("(pointer: coarse)")
      const onMatch = () => {}
      // noop; we don't need the value here but keep the media query to ensure compatibility
      if (typeof mql.addEventListener === "function") {
        mql.addEventListener("change", onMatch)
      }
    }

    const onMove = (e: PointerEvent) => {
      const svg = svgRef.current
      if (!svg) return
      // Map client coordinates into the SVG's internal coordinate system so ripples align under touch
      const pt = svgPointFromClient(svg, e.clientX, e.clientY)
      if (!pt) return
      const pos = { x: pt.x, y: pt.y }
      const rect = svg.getBoundingClientRect()
      // Use a wider horizontal margin so hover fades out smoothly when leaving left/right
      const marginX = Math.max(pointerMargin, rect.width * 0.5)
      const marginY = Math.max(pointerMargin, rect.height * 0.25)
      // Use visible rect for margin checks but compare against svg internal coords for pointer storage
      const withinX =
        e.clientX >= rect.left - marginX && e.clientX <= rect.right + marginX
      const withinY =
        e.clientY >= rect.top - marginY && e.clientY <= rect.bottom + marginY
      if (withinX && withinY) {
        pointerRef.current = pos
        if (pointerRafRef.current == null) {
          pointerRafRef.current = requestAnimationFrame(() => {
            setPointer(pointerRef.current)
            pointerRafRef.current = null
          })
        }
      } else {
        pointerRef.current = null
        if (pointerRafRef.current == null) {
          pointerRafRef.current = requestAnimationFrame(() => {
            setPointer(null)
            pointerRafRef.current = null
          })
        }
      }
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [pointerMargin, svgPointFromClient])

  // Start/stop the ripple RAF loop depending on active ripples
  const ensureAnimating = useCallback(() => {
    if (rafRef.current != null) return
    const tick = () => {
      const now = performance.now()
      // Drop old ripples after configured lifetime
      ripplesRef.current = ripplesRef.current.filter(
        (r) => now - r.start < rippleLifetimeMs
      )
      setNow(now) // trigger re-render for path regeneration
      if (ripplesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [rippleLifetimeMs])

  // (handlePointerDown is defined after helper declarations)

  // Compute ripple vertical offset at a given x,y position
  const rippleOffsetAt = useCallback(
    (px: number, y: number, ripples: Ripple[], now: number) => {
      let offset = 0
      for (const r of ripples) {
        const dt = (now - r.start) / 1000
        if (dt < 0) continue
        const dx = px - r.x
        const dy = y - r.y
        const dist = Math.hypot(dx, dy)
        const phase = dist - r.speed * dt // 0 along the ring center
        const envelope = Math.exp(-(phase * phase) / (2 * r.spread * r.spread))
        const osc = Math.cos((2 * Math.PI * phase) / r.wavelength)
        const decay = Math.exp(-r.decay * dt)
        offset += r.amplitude * envelope * osc * decay
      }
      return offset
    },
    []
  )

  // Helper to create a ripple at a specific position and reset hint timer
  const createRippleAt = useCallback(
    (x: number, y: number): boolean => {
      if (reduceMotion) return false
      const start = performance.now()
      const ripple: Ripple = {
        id: Math.floor(Math.random() * 1e9),
        x,
        y,
        start,
        // convert ripple params from CSS px to viewBox units so they remain visually consistent
        amplitude: rippleAmplitude * invCoverScale,
        wavelength: rippleWavelength * invCoverScale,
        speed: rippleSpeed * invCoverScale,
        decay: rippleDecay,
        spread: rippleSpread * invCoverScale,
      }
      // Stack ripples; do not cap — every ripple is allowed to finish
      ripplesRef.current = [...ripplesRef.current, ripple]
      lastRippleAtRef.current = start
      ensureAnimating()
      return true
    },
    [
      reduceMotion,
      rippleAmplitude,
      rippleWavelength,
      rippleSpeed,
      rippleDecay,
      rippleSpread,
      invCoverScale,
      ensureAnimating,
    ]
  )

  // Schedule the next hint ripple with random delay (7–14s), unless reduced motion
  const scheduleNextHint = useCallback(() => {
    clearHintTimeout()
    if (reduceMotion) return
    const delay = randBetween(7000, 14000)
    hintTimeoutRef.current = window.setTimeout(() => {
      if (autoHint && !reduceMotion) {
        // After the first hint, use random positions for spontaneity
        const pt = randomPointInSvg()
        createRippleAt(pt.x, pt.y)
      }
      // Schedule next hint regardless
      scheduleNextHint()
    }, delay)
  }, [
    clearHintTimeout,
    reduceMotion,
    randBetween,
    randomPointInSvg,
    createRippleAt,
    autoHint,
  ])

  // Initial hint timer (4–8s) on mount or when reduced motion toggles off
  useEffect(() => {
    if (!mounted || reduceMotion || !autoHint) return
    // If user already interacted (unlikely during initial seconds), skip immediate hint and schedule normal cadence
    const initialDelay = randBetween(4000, 8000)
    clearHintTimeout()
    hintTimeoutRef.current = window.setTimeout(() => {
      if (
        autoHint &&
        true &&
        lastRippleAtRef.current == null &&
        !reduceMotion
      ) {
        // Bias to cursor if inside bounding box; otherwise center of the SVG
        const currentPointer = pointerRef.current
        const pt = isPointInsideSvg(currentPointer)
          ? (currentPointer as XYCoord)
          : { x: VBW / 2, y: VBH / 2 }
        createRippleAt(pt.x, pt.y)
      }
      scheduleNextHint()
    }, initialDelay)
    return clearHintTimeout
  }, [
    mounted,
    reduceMotion,
    randBetween,
    clearHintTimeout,
    scheduleNextHint,
    isPointInsideSvg,
    VBW,
    VBH,
    createRippleAt,
    autoHint,
  ])

  // Clean up on unmount
  useEffect(() => () => clearHintTimeout(), [clearHintTimeout])

  const handlePointerDown = useCallback<
    React.PointerEventHandler<SVGSVGElement>
  >(
    (e) => {
      if (reduceMotion) return
      const svg = e.currentTarget
      // Map the client coords into SVG coords so ripple starts exactly at touch point
      const pt = svgPointFromClient(svg, e.clientX, e.clientY)
      if (!pt) return
      if (createRippleAt(pt.x, pt.y)) scheduleNextHint()
    },
    [reduceMotion, createRippleAt, scheduleNextHint, svgPointFromClient]
  )

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Convert polyline points to a smooth Catmull–Rom Bezier path
  const toBezierPath = useCallback(
    (pts: { x: number; y: number }[], t: number) => {
      if (pts.length === 0) return ""
      if (pts.length === 1) return `M${pts[0].x} ${pts[0].y}`
      let path = `M${pts[0].x} ${pts[0].y}`
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] ?? pts[i]
        const p1 = pts[i]
        const p2 = pts[i + 1]
        const p3 = pts[i + 2] ?? pts[i + 1]
        const cp1x = p1.x + ((p2.x - p0.x) / 6) * t
        const cp1y = p1.y + ((p2.y - p0.y) / 6) * t
        const cp2x = p2.x - ((p3.x - p1.x) / 6) * t
        const cp2y = p2.y - ((p3.y - p1.y) / 6) * t
        path += ` C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
      }
      return path
    },
    []
  )

  // Current horizontal offset for a line's CSS slide at a given timestamp
  const getLineOffsetX = useCallback((line: LineData, now: number) => {
    const t0 = animationStartRef.current + line.delay * 1000
    if (now <= t0) return 0
    const period = line.duration * 1000
    if (period <= 0) return 0
    const cycle = 2 * period
    const elapsed = (now - t0) % cycle
    const phase = elapsed / period // 0..2
    const f = phase <= 1 ? phase : 2 - phase // 0..1..0
    return line.travel * f
  }, [])

  // Produce distorted path for a line (hover thickness/opacity applied elsewhere)
  const generatePath = useCallback(
    (line: LineData): string => {
      const { x, y, length } = line
      const ripples = ripplesRef.current
      if (ripples.length === 0) {
        return `M${x} ${y}H${x + length}`
      }

      const now = performance.now()
      const offsetX = getLineOffsetX(line, now)

      // Build sampling set: uniform samples plus an anchor at the ripple center projected onto this line
      const uniformSamples = rippleSampleCount
      const positions: number[] = []
      for (let i = 0; i < uniformSamples; i++) {
        const t = i / (uniformSamples - 1)
        positions.push(x + t * length)
      }

      // Anchor the ripple's visible center to avoid smeared origin
      for (const r of ripples) {
        const pxOnLine = r.x - offsetX // undo current slide to test/anchor on the actual path
        if (pxOnLine >= x && pxOnLine <= x + length) positions.push(pxOnLine)
      }

      // sort and lightly dedupe (allow closer points to keep curvature smooth)
      positions.sort((a, b) => a - b)
      const pxs: number[] = []
      for (let i = 0; i < positions.length; i++) {
        if (i === 0 || Math.abs(positions[i] - positions[i - 1]) > 0.25) {
          pxs.push(positions[i])
        }
      }

      const points: { x: number; y: number }[] = []
      for (let i = 0; i < pxs.length; i++) {
        const px = pxs[i]
        // Compare distances in visible coordinates by adding current slide offset
        const visiblePx = px + offsetX
        const py = y + rippleOffsetAt(visiblePx, y, ripples, now)
        points.push({ x: px, y: py })
      }
      // Smooth with Catmull–Rom -> Bezier using configured tension
      return toBezierPath(points, splineTension)
    },
    [
      rippleOffsetAt,
      splineTension,
      rippleSampleCount,
      toBezierPath,
      getLineOffsetX,
    ]
  )
  // Always render with safe fallbacks so hydration matches and ResizeObserver can attach

  // Convert hover emphasis sigmas to viewBox units so spatial falloff stays consistent
  const hoverSigmaXView = hoverSigmaX * invCoverScale
  const hoverSigmaYView = hoverSigmaY * invCoverScale

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VBW} ${VBH}`}
      preserveAspectRatio="xMidYMid slice"
      stroke="currentColor"
      strokeWidth={strokeWidthPx}
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
      onPointerDown={handlePointerDown}
      style={{
        width: "100%",
        height: "100%",
        touchAction: "pan-y",
        display: "block",
        // keep reduced-motion fade, remove the responsive height/maxWidth changes
        opacity: reduceMotion ? (drawReady ? 1 : 0) : 1,
        transition: reduceMotion
          ? `opacity ${reducedMotionFadeMs}ms ease`
          : undefined,
      }}
      {...props}
    >
      {/* Avoid SSR hydration mismatches by rendering paths only after mount */}
      {mounted &&
        lines.map((line, idx) => {
          const d = generatePath(line)
          // Hover emphasis: adjust stroke width and opacity based on proximity to pointer
          let hoverFactor = 0
          if (pointer) {
            const { x, y, length } = line
            const dx =
              pointer.x < x
                ? x - pointer.x
                : pointer.x > x + length
                  ? pointer.x - (x + length)
                  : 0
            const dy = Math.abs(pointer.y - y)
            const fx = Math.exp(
              -(dx * dx) / (2 * hoverSigmaXView * hoverSigmaXView)
            )
            const fy = Math.exp(
              -(dy * dy) / (2 * hoverSigmaYView * hoverSigmaYView)
            )
            hoverFactor = fx * fy // 0..1
          }

          const baseStroke = +strokeWidthPx
          const perPathStrokeWidth =
            baseStroke * (1 + hoverStrokeGain * hoverFactor)
          const perPathOpacity = Math.min(
            1,
            line.opacity + (1 - line.opacity) * hoverFactor
          )
          const style: CSSProperties & { "--x-travel"?: string } = {
            // animate CSS translate in px; convert viewBox travel distance to px via coverScale
            "--x-travel": `${line.travel * coverScale}px`,
            animationName: "hero-bg-slide",
            animationDuration: `${line.duration}s`,
            animationDelay: `${line.delay}s`,
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            animationTimingFunction: "cubic-bezier(0.45, 0.05, 0.55, 0.95)",
            animationPlayState: "running",
            willChange: "transform",
          }
          return (
            <path
              key={line.id}
              id={line.id}
              d={d}
              strokeOpacity={perPathOpacity}
              strokeWidth={perPathStrokeWidth}
              vectorEffect="non-scaling-stroke"
              fill="none"
              // Normalize path length so dash values use 0..1 and animate drawing from 0 to full
              pathLength={1}
              style={{
                ...style,
                // Reduced motion: no dash draw; use full stroke and fade SVG opacity instead
                ...(reduceMotion
                  ? {
                      strokeDasharray: undefined,
                      strokeDashoffset: undefined,
                      transition: undefined,
                      transitionDelay: undefined,
                    }
                  : {
                      // Center-out reveal: when not ready, zero-length dash centered at 0.5
                      strokeDasharray: drawReady ? "1 0" : "0 1",
                      strokeDashoffset: drawReady ? 0 : 0.5,
                      transition: `stroke-dasharray ${initialDrawMs}ms ease-out, stroke-dashoffset ${initialDrawMs}ms ease-out`,
                      transitionDelay: `${idx * initialDrawStaggerMs}ms`,
                    }),
              }}
              data-hero-bg-line
              className="motion-reduce:!animate-none"
            />
          )
        })}
    </svg>
  )
}
export default HeroBg
