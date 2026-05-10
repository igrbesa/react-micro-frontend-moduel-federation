import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type PointerEvent as SplitterPointerEvent,
} from 'react'

export const DEFAULT_FLEX_ROW_SPLIT_LEFT_PCT = 50
export const MIN_FLEX_ROW_SPLIT_LEFT_PCT = 30
export const MAX_FLEX_ROW_SPLIT_LEFT_PCT = 70

export function clampFlexRowSplitLeftPct(pct: number): number {
  return Math.min(MAX_FLEX_ROW_SPLIT_LEFT_PCT, Math.max(MIN_FLEX_ROW_SPLIT_LEFT_PCT, pct))
}

export type UseFlexRowSplitOptions = {
  /** When false, container style omits the CSS variable (e.g. single-column layout). */
  splitActive: boolean
  /** Custom property set on the split row element (default matches cart shell CSS). */
  cssVarName?: string
  defaultLeftPct?: number
  minLeftPct?: number
  maxLeftPct?: number
}

export type FlexRowSplitHandleProps = ComponentPropsWithoutRef<'div'>

/**
 * Horizontal flex split driven by a CSS percentage custom property, with rAF-throttled
 * updates during drag and delta-based pointer math (avoids jump on pointer down when gaps
 * and a fixed splitter sit between panes).
 */
export function useFlexRowSplit(options: UseFlexRowSplitOptions) {
  const {
    splitActive,
    cssVarName = '--shell-cart-left-pct',
    defaultLeftPct = DEFAULT_FLEX_ROW_SPLIT_LEFT_PCT,
    minLeftPct = MIN_FLEX_ROW_SPLIT_LEFT_PCT,
    maxLeftPct = MAX_FLEX_ROW_SPLIT_LEFT_PCT,
  } = options

  const clamp = useCallback(
    (pct: number) => Math.min(maxLeftPct, Math.max(minLeftPct, pct)),
    [minLeftPct, maxLeftPct],
  )

  const [leftPanePct, setLeftPanePct] = useState(defaultLeftPct)

  const splitRef = useRef<HTMLDivElement>(null)
  const leftPanePctRef = useRef(leftPanePct)
  const dragAnchorRef = useRef<{ clientX: number; pct: number } | null>(null)
  const rafRef = useRef<number | null>(null)
  const pendingPctRef = useRef<number | null>(null)
  const dragActiveRef = useRef(false)

  useEffect(() => {
    leftPanePctRef.current = leftPanePct
  }, [leftPanePct])

  const flushPendingCssVar = useCallback(() => {
    const el = splitRef.current
    const pct = pendingPctRef.current
    pendingPctRef.current = null
    if (!el || pct === null) return
    el.style.setProperty(cssVarName, String(pct))
  }, [cssVarName])

  const scheduleCssVarUpdate = useCallback(
    (pct: number) => {
      pendingPctRef.current = pct
      if (rafRef.current != null) return
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null
        flushPendingCssVar()
      })
    },
    [flushPendingCssVar],
  )

  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const pctFromDragClientX = useCallback(
    (clientX: number) => {
      const el = splitRef.current
      const anchor = dragAnchorRef.current
      if (!el || !anchor) return clamp(leftPanePctRef.current)
      const w = el.getBoundingClientRect().width
      if (w <= 0) return clamp(leftPanePctRef.current)
      return clamp(anchor.pct + ((clientX - anchor.clientX) / w) * 100)
    },
    [clamp],
  )

  const endDrag = useCallback(
    (e: SplitterPointerEvent<HTMLDivElement>) => {
      if (!dragActiveRef.current) return
      dragActiveRef.current = false
      if (typeof e.currentTarget.releasePointerCapture === 'function') {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }

      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      const pendingBeforeFlush = pendingPctRef.current
      flushPendingCssVar()
      const finalPct = pendingBeforeFlush ?? pctFromDragClientX(e.clientX)
      dragAnchorRef.current = null
      setLeftPanePct(finalPct)
    },
    [flushPendingCssVar, pctFromDragClientX],
  )

  const onSplitterPointerDown = useCallback((e: SplitterPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    dragActiveRef.current = true
    dragAnchorRef.current = {
      clientX: e.clientX,
      pct: leftPanePctRef.current,
    }
    if (typeof e.currentTarget.setPointerCapture === 'function') {
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }, [])

  const onSplitterPointerMove = useCallback(
    (e: SplitterPointerEvent<HTMLDivElement>) => {
      if (!dragActiveRef.current) return
      const pct = pctFromDragClientX(e.clientX)
      scheduleCssVarUpdate(pct)
    },
    [pctFromDragClientX, scheduleCssVarUpdate],
  )

  const splitContainerStyle: CSSProperties | undefined = splitActive
    ? ({
        [cssVarName]: String(leftPanePct),
      } as CSSProperties)
    : undefined

  const splitHandleProps: FlexRowSplitHandleProps = {
    role: 'separator',
    'aria-orientation': 'vertical',
    'aria-valuemin': minLeftPct,
    'aria-valuemax': maxLeftPct,
    'aria-valuenow': Math.round(leftPanePct),
    tabIndex: 0,
    onPointerDown: onSplitterPointerDown,
    onPointerMove: onSplitterPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  }

  return {
    splitRef,
    splitContainerStyle,
    leftPanePct,
    setLeftPanePct,
    minLeftPct,
    maxLeftPct,
    splitHandleProps,
  }
}
