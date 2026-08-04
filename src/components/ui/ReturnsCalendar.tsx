import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = 'var(--accent, #5227FF)';
const GREEN = '#22c55e';
const SURFACE = 'var(--surface)';
const HAIRLINE = 'var(--border)';

const INITIALS = ['O', 'Ş', 'M', 'N', 'M', 'H', 'T', 'A', 'E', 'E', 'K', 'A'];
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

const DEFAULT_YEARS = [2024, 2025, 2026];

/** Compounded activity total for year row */
const compound = (row: number[]) => row.reduce((acc, r) => acc + r, 0);

/** Cumulative growth curve for sparkline */
const cumCurve = (row: number[]) => {
  let acc = 0;
  return row.map((r) => {
    acc += r;
    return acc;
  });
};

const signed = (v: number) => (v > 0 ? `+${v}` : `${v}`);

/** Magnitude tint fill based on count */
const cellFill = (r: number, on: boolean) => {
  if (r === 0) {
    return on
      ? 'color-mix(in srgb, var(--accent) 18%, transparent)'
      : 'color-mix(in srgb, var(--border) 40%, transparent)';
  }
  const intensity = Math.min(Math.abs(r) / 10, 1);
  const alpha = Math.round(intensity * 50 + (on ? 25 : 12));
  return `color-mix(in srgb, ${ACCENT} ${alpha}%, transparent)`;
};

export interface ReturnsCalendarProps {
  /** Heading above the grid. */
  title?: string;
  /** Caption shown while nothing is hovered. */
  hint?: string;
  /** Row labels — one per row of returns. */
  years?: number[];
  /** returns[year][month] count (12 months per row). */
  returns?: number[][];
  className?: string;
}

export const ReturnsCalendar: React.FC<ReturnsCalendarProps> = ({
  title = 'Aktivite & Kayıt Takvimi',
  hint = 'Ay üzerine gel · toplam hareketler',
  years = DEFAULT_YEARS,
  returns,
  className,
}) => {
  const reduced = useReducedMotion();
  const [hot, setHot] = useState<{ y: number; m: number } | null>(null);

  // Fallback demo data if returns not provided
  const computedReturns = useMemo(() => {
    if (returns && returns.length > 0) return returns;
    return DEFAULT_YEARS.map((y) =>
      INITIALS.map((_, m) => {
        if (y === 2026 && m <= 7) return Math.floor(Math.random() * 8) + 1;
        if (y < 2026) return Math.floor(Math.random() * 12);
        return 0;
      })
    );
  }, [returns]);

  const totals = useMemo(() => computedReturns.map(compound), [computedReturns]);
  const hotValue = hot ? computedReturns[hot.y]?.[hot.m] : undefined;

  return (
    <div className={cn('w-full max-w-[480px] bg-background/50 backdrop-blur-xl border border-border/60 p-4.5 rounded-3xl shadow-soft select-none overflow-hidden', className)}>
      <div className="mb-3 flex items-baseline justify-between px-0.5">
        <span className="text-xs font-bold text-primary tracking-tight">{title}</span>
        <span className="text-[11px] font-medium tabular-nums text-secondary">
          {hot && hotValue != null ? (
            <>
              <span className="text-primary font-semibold">
                {MONTHS[hot.m]} {years[hot.y]}
              </span>
              <span className="mx-1.5 text-secondary/40">·</span>
              <span className="text-accent font-bold">{signed(hotValue)} kayıt</span>
            </>
          ) : (
            hint
          )}
        </span>
      </div>

      <div className="overflow-x-auto no-scrollbar pb-1">
        <div
          className="grid gap-[4px] min-w-[360px]"
          style={{ gridTemplateColumns: '32px repeat(12, 1fr) 46px' }}
          onPointerLeave={() => setHot(null)}
        >
          <span />
          {INITIALS.map((m, i) => (
            <span
              key={i}
              className="pb-1 text-center text-[10px] font-bold text-secondary/60"
              style={{ opacity: hot && hot.m !== i ? 0.4 : 1 }}
            >
              {m}
            </span>
          ))}
          <span className="pb-1 text-center text-[10px] font-bold text-secondary/60">Top.</span>

          {years.map((year, y) => (
            <React.Fragment key={year}>
              <span
                className="flex items-center justify-end pr-1.5 text-[10px] font-bold tabular-nums text-secondary/70"
                style={{ opacity: hot && hot.y !== y ? 0.4 : 1 }}
              >
                {`'${String(year).slice(2)}`}
              </span>

              {(computedReturns[y] ?? []).map((r, m) => {
                const on = hot?.y === y && hot?.m === m;
                const dim = !!hot && !on && hot.y !== y && hot.m !== m;
                return (
                  <motion.button
                    key={m}
                    type="button"
                    aria-label={`${MONTHS[m]} ${year} ${signed(r)} kayıt`}
                    onPointerEnter={() => setHot({ y, m })}
                    onFocus={() => setHot({ y, m })}
                    className="grid aspect-square place-items-center rounded-lg text-[9px] font-bold tabular-nums outline-none transition-all duration-200"
                    style={{
                      background: cellFill(r, on),
                      color: r > 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                      outline: on ? `1.5px solid var(--accent)` : 'none',
                      outlineOffset: '-1.5px',
                    }}
                    initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.6 }}
                    animate={{ opacity: dim ? 0.35 : 1, scale: 1 }}
                    transition={reduced ? { duration: 0 } : { duration: 0.25, ease: EASE, delay: 0.005 * (y * 12 + m) }}
                  >
                    {r > 0 ? r : <span className="opacity-25 text-[10px] font-normal">•</span>}
                  </motion.button>
                );
              })}

              {/* Year total cell */}
              <YearTotalCell
                row={computedReturns[y] ?? []}
                total={totals[y]}
                dimmed={!!hot && hot.y !== y}
                reduced={!!reduced}
                align={y === 0 ? 'start' : y === years.length - 1 ? 'end' : 'center'}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Compounded year total cell with growth sparkline popover */
function YearTotalCell({
  row,
  total,
  dimmed,
  reduced,
  align,
}: {
  row: number[];
  total: number;
  dimmed: boolean;
  reduced: boolean;
  align: 'start' | 'center' | 'end';
}) {
  const [open, setOpen] = useState(false);
  const curve = useMemo(() => cumCurve(row), [row]);
  const W = 120;
  const H = 44;
  const lo = 0;
  const hi = Math.max(1, ...curve);
  const span = hi - lo || 1;
  const px = (i: number) => 4 + (i / Math.max(1, curve.length - 1)) * (W - 8);
  const py = (v: number) => 6 + (1 - (v - lo) / span) * (H - 12);
  const pts = curve.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`);
  const zeroY = py(0);

  return (
    <div
      className="relative grid cursor-pointer place-items-center rounded-lg text-[10px] font-bold tabular-nums transition-all"
      style={{
        background: cellFill(total / 3, open),
        color: 'var(--accent)',
        opacity: dimmed ? 0.4 : 1,
        outline: open ? `1.5px solid var(--accent)` : 'none',
        outlineOffset: '-1.5px',
      }}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
    >
      {signed(total)}
      <div
        className={cn(
          'pointer-events-none absolute right-[calc(100%+8px)] z-30',
          align === 'start' ? 'top-0' : align === 'end' ? 'bottom-0' : 'top-1/2 -translate-y-1/2'
        )}
      >
        <AnimatePresence>
          {open && curve.length > 1 && (
            <motion.div
              className="rounded-2xl border p-3 shadow-modal min-w-[140px]"
              style={{ background: SURFACE, borderColor: HAIRLINE }}
              initial={reduced ? { opacity: 0 } : { opacity: 0, x: 4, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: 4, scale: 0.96 }}
              transition={{ duration: reduced ? 0 : 0.16, ease: EASE }}
            >
              <div className="mb-1.5 whitespace-nowrap text-[9px] font-bold uppercase tracking-wider text-secondary">
                Yıllık Kayıt Trendi · Oca→Ara
              </div>
              <svg width={W} height={H} className="block">
                <line
                  x1={4}
                  x2={W - 4}
                  y1={zeroY}
                  y2={zeroY}
                  stroke="color-mix(in srgb, var(--text-primary) 14%, transparent)"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
                <path
                  d={`M${pts.join(' L')} L ${px(curve.length - 1)},${zeroY} L ${px(0)},${zeroY} Z`}
                  fill="color-mix(in srgb, var(--accent) 15%, transparent)"
                />
                <motion.path
                  d={`M${pts.join(' L')}`}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={1.8}
                  initial={{ pathLength: reduced ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
                />
                <circle cx={px(curve.length - 1)} cy={py(curve[curve.length - 1])} r={3} fill="var(--accent)" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ReturnsCalendar;
