import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

export interface DonutSector {
  label: string;
  pct: number;
  count?: number;
}

const DEFAULT_COLORS = ['#5227FF', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'];

const R = 52;
const STROKE = 13;
const C = 2 * Math.PI * R;

export interface SectorsDonutProps {
  symbol?: string;
  caption?: string;
  sectors?: DonutSector[];
  colors?: string[];
  className?: string;
}

export const SectorsDonut: React.FC<SectorsDonutProps> = ({
  symbol = 'KAPSULE',
  caption = 'kayıt dağılımı',
  sectors = [],
  colors = DEFAULT_COLORS,
  className,
}) => {
  const reduced = useReducedMotion();
  const [hot, setHot] = useState<number | null>(null);

  const totalPct = sectors.reduce((acc, s) => acc + s.pct, 0);

  let acc = 0;
  const arcs = sectors.map((s, i) => {
    const start = acc;
    acc += s.pct;
    return { ...s, start, color: colors[i % colors.length] };
  });

  return (
    <div className={cn('flex flex-col sm:flex-row items-center gap-6 bg-background/50 backdrop-blur-xl border border-border/60 p-4.5 rounded-3xl shadow-soft select-none overflow-hidden', className)}>
      <div className="relative h-[132px] w-[132px] shrink-0">
        <svg width={132} height={132} viewBox="0 0 132 132" className="-rotate-90 text-primary">
          {totalPct === 0 ? (
            <circle cx={66} cy={66} r={R} fill="none" stroke="var(--border)" strokeWidth={STROKE} opacity={0.4} />
          ) : (
            arcs.map((a, i) => (
              <motion.circle
                key={a.label}
                cx={66}
                cy={66}
                r={R}
                fill="none"
                stroke={a.color}
                strokeWidth={STROKE}
                strokeDasharray={`${(a.pct / 100) * C - 2} ${C}`}
                strokeDashoffset={-((a.start / 100) * C)}
                initial={{ opacity: reduced ? 1 : 0 }}
                animate={{ opacity: hot === null || hot === i ? 1 : 0.2 }}
                transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE, delay: 0.06 * i }}
                onMouseEnter={() => setHot(i)}
                onMouseLeave={() => setHot(null)}
                style={{ cursor: 'default' }}
              />
            ))
          )}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-2">
          <span className="text-sm font-bold tracking-tight text-primary">{symbol}</span>
          <span className="mt-0.5 text-[10px] font-semibold text-secondary">{caption}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full max-w-[200px]">
        {arcs.map((a, i) => (
          <button
            key={a.label}
            type="button"
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot(null)}
            onFocus={() => setHot(i)}
            onBlur={() => setHot(null)}
            className={cn(
              'flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-1 text-left transition-all duration-200 outline-none',
              hot !== null && hot !== i ? 'opacity-30' : 'hover:bg-surface'
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: a.color }} />
              <span className="truncate text-xs font-semibold text-primary">{a.label}</span>
            </div>
            <span className="text-[11px] font-bold tabular-nums text-secondary shrink-0">%{a.pct.toFixed(0)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectorsDonut;
