You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
returns-calendar.tsx
import { useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

const EASE = [0.16, 1, 0.3, 1] as const
const GREEN = "var(--chart-up, #22c55e)"
const RED = "var(--chart-down, #ef5350)"
const SURFACE = "var(--surface, var(--card))"
const HAIRLINE = "var(--border)"

const INITIALS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const DEFAULT_YEARS = [2021, 2022, 2023, 2024, 2025]

/** Deterministic sample field so every render agrees (2022 reads as a down year). */
const DEFAULT_RETURNS: number[][] = (() => {
  let seed = 2021
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  return DEFAULT_YEARS.map((_, yi) =>
    INITIALS.map(() => Math.round(((yi === 1 ? -1.6 : 0.9) + (rnd() - 0.5) * 12) * 10) / 10),
  )
})()

/** Compounded year return from its months, in percent. */
const compound = (row: number[]) => (row.reduce((acc, r) => acc * (1 + r / 100), 1) - 1) * 100

/** Cumulative compounded growth after each month — Jan..Dec, derived from the row. */
const cumCurve = (row: number[]) => {
  let acc = 1
  return row.map((r) => {
    acc *= 1 + r / 100
    return (acc - 1) * 100
  })
}

const signed = (v: number, dp: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(dp)}`

/** magnitude → tinted fill of the single up/down hue, never a second color */
const cellFill = (r: number, on: boolean) =>
  `color-mix(in srgb, ${r >= 0 ? GREEN : RED} ${Math.round(Math.min(Math.abs(r) / 8, 1) * 55 + (on ? 22 : 7))}%, transparent)`

export interface ReturnsCalendarProps {
  /** Heading above the grid. */
  title?: string
  /** Caption shown while nothing is hovered. */
  hint?: string
  /** Row labels — one per row of `returns`. */
  years?: number[]
  /** `returns[year][month]` in percent (12 months per row). */
  returns?: number[][]
  className?: string
}

/**
 * Monthly-returns heat grid — years × months, diverging up/down by magnitude,
 * with a compounded year-total column. Hovering a cell reads out the month and
 * dims every unrelated cell; hovering a year total unfolds that year's growth-of-$1
 * curve to the left of the column, drawn straight from the twelve months next to
 * it. Cells settle in on a diagonal delay. Light and dark via shadcn theme tokens;
 * respects reduced motion.
 */
export default function ReturnsCalendar({
  title = "Monthly returns",
  hint = "hover a month · year = compounded",
  years = DEFAULT_YEARS,
  returns = DEFAULT_RETURNS,
  className,
}: ReturnsCalendarProps) {
  const reduced = useReducedMotion()
  const [hot, setHot] = useState<{ y: number; m: number } | null>(null)

  const totals = useMemo(() => returns.map(compound), [returns])
  const hotValue = hot ? returns[hot.y]?.[hot.m] : undefined

  return (
    <div className={cn("w-[440px]", className)}>
      <div className="mb-2 flex items-baseline justify-between px-0.5">
        <span className="text-[13px] font-medium text-foreground">{title}</span>
        <span className="text-[10px] tabular-nums text-foreground/45">
          {hot && hotValue != null ? (
            <>
              <span className="text-foreground">
                {MONTHS[hot.m]} {years[hot.y]}
              </span>
              <span className="mx-1.5 text-foreground/25">·</span>
              <span style={{ color: hotValue >= 0 ? GREEN : RED }}>{signed(hotValue, 1)}%</span>
            </>
          ) : (
            hint
          )}
        </span>
      </div>

      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: "30px repeat(12, 1fr) 46px" }}
        onPointerLeave={() => setHot(null)}
      >
        <span />
        {INITIALS.map((m, i) => (
          <span
            key={i}
            className="pb-0.5 text-center text-[9px] text-foreground/45"
            style={{ opacity: hot && hot.m !== i ? 0.4 : 1 }}
          >
            {m}
          </span>
        ))}
        <span className="pb-0.5 text-center text-[9px] text-foreground/45">Yr</span>

        {years.map((year, y) => (
          <div key={year} className="contents">
            <span
              className="flex items-center justify-end pr-1 text-[9.5px] tabular-nums text-foreground/45"
              style={{ opacity: hot && hot.y !== y ? 0.4 : 1 }}
            >
              {`’${String(year).slice(2)}`}
            </span>

            {(returns[y] ?? []).map((r, m) => {
              const on = hot?.y === y && hot?.m === m
              const dim = !!hot && !on && hot.y !== y && hot.m !== m
              return (
                <motion.button
                  key={m}
                  type="button"
                  aria-label={`${MONTHS[m]} ${year} ${signed(r, 1)}%`}
                  onPointerEnter={() => setHot({ y, m })}
                  onFocus={() => setHot({ y, m })}
                  className="grid aspect-square place-items-center rounded-[3px] text-[8px] font-semibold tabular-nums outline-none"
                  style={{
                    background: cellFill(r, on),
                    color: `color-mix(in srgb, var(--foreground) ${Math.round(40 + Math.min(Math.abs(r) / 8, 1) * 45)}%, transparent)`,
                    outline: on ? `1.5px solid ${r >= 0 ? GREEN : RED}` : "none",
                    outlineOffset: "-1.5px",
                  }}
                  initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.6 }}
                  animate={{ opacity: dim ? 0.35 : 1, scale: 1 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.3, ease: EASE, delay: 0.008 * (y * 12 + m) }}
                >
                  {Math.abs(r) >= 4 ? Math.round(r) : ""}
                </motion.button>
              )
            })}

            {/* year total — hover to unfold the year's compounding curve */}
            <YearTotalCell
              row={returns[y] ?? []}
              total={totals[y]}
              dimmed={!!hot && hot.y !== y}
              reduced={!!reduced}
              align={y === 0 ? "start" : y === years.length - 1 ? "end" : "center"}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/** The compounded year cell — hovering it floats a growth-of-$1 sparkline built
 *  from the same twelve months sitting to its left, so the number is showable. */
function YearTotalCell({
  row,
  total,
  dimmed,
  reduced,
  align,
}: {
  row: number[]
  total: number
  dimmed: boolean
  reduced: boolean
  /** vertical anchor of the popover — clamps the first/last rows inside the grid */
  align: "start" | "center" | "end"
}) {
  const [open, setOpen] = useState(false)
  const hue = total >= 0 ? GREEN : RED
  const curve = useMemo(() => cumCurve(row), [row])
  const W = 116
  const H = 42
  const lo = Math.min(0, ...curve)
  const hi = Math.max(0, ...curve)
  const span = hi - lo || 1
  const px = (i: number) => 3 + (i / Math.max(1, curve.length - 1)) * (W - 6)
  const py = (v: number) => 4 + (1 - (v - lo) / span) * (H - 8)
  const pts = curve.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`)
  const zeroY = py(0)

  return (
    <div
      className="relative grid cursor-help place-items-center rounded-[3px] text-[9px] font-semibold tabular-nums transition-opacity"
      style={{
        background: cellFill(total / 3, open),
        color: hue,
        opacity: dimmed ? 0.4 : 1,
        outline: open ? `1.5px solid ${hue}` : "none",
        outlineOffset: "-1.5px",
      }}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
    >
      {signed(total, 0)}
      {/* opens to the LEFT of the totals column, never above/below it — running the
          pointer up or down the column keeps every year cell in view */}
      <div
        className={cn(
          "pointer-events-none absolute right-[calc(100%+6px)] z-20",
          align === "start" ? "top-0" : align === "end" ? "bottom-0" : "top-1/2 -translate-y-1/2",
        )}
      >
        <AnimatePresence>
          {open && curve.length > 1 && (
            <motion.div
              className="rounded-lg border p-2"
              style={{ background: SURFACE, borderColor: HAIRLINE }}
              initial={reduced ? { opacity: 0 } : { opacity: 0, x: 4, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: 4, scale: 0.96 }}
              transition={{ duration: reduced ? 0 : 0.16, ease: EASE }}
            >
              <div className="mb-1 whitespace-nowrap text-[8.5px] font-medium text-foreground/45">growth of $1 · Jan→Dec</div>
              <svg width={W} height={H} className="block">
                <line
                  x1={3}
                  x2={W - 3}
                  y1={zeroY}
                  y2={zeroY}
                  stroke="color-mix(in srgb, var(--foreground) 14%, transparent)"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
                <path
                  d={`M${pts.join(" L")} L ${px(curve.length - 1)},${zeroY} L ${px(0)},${zeroY} Z`}
                  fill={`color-mix(in srgb, ${hue} 12%, transparent)`}
                />
                <motion.path
                  d={`M${pts.join(" L")}`}
                  fill="none"
                  stroke={hue}
                  strokeWidth={1.4}
                  initial={{ pathLength: reduced ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
                />
                <circle cx={px(curve.length - 1)} cy={py(curve[curve.length - 1])} r={2.4} fill={hue} />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function Demo() {
  return (
    <div className="flex min-h-[260px] w-full items-center justify-center p-6">
      <ReturnsCalendar />
    </div>
  )
}

export { ReturnsCalendar as Component }


demo.tsx
import { useEffect } from "react"
import { Demo } from "@/components/ui/returns-calendar"

export default function DemoOne() {
  // open the preview in dark by default; the sandbox theme toggle still works
  useEffect(() => { document.documentElement.classList.add("dark") }, [])
  return (
    <div className="w-full">
      <Demo />
    </div>
  )
}

```

Install NPM dependencies:
```bash
framer-motion
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them





