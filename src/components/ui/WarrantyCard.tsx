import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { VaultStorageService } from '../../services/vaultStorage';

export interface WarrantyCardProps {
  onNavigateToTab?: (tab: 'warranties') => void;
  className?: string;
}

interface RingActivityData {
  label: string;
  value: number; // percentage 0..100
  color: string;
  gradientEnd: string;
  size: number;
  current: number;
  target: number;
  unit: string;
}

interface CircleProgressProps {
  data: RingActivityData;
  index: number;
}

const CircleProgress: React.FC<CircleProgressProps> = ({ data, index }) => {
  const strokeWidth = 10;
  const radius = (data.size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedValue = Math.min(Math.max(data.value, 0), 100);
  const progress = ((100 - clampedValue) / 100) * circumference;

  const gradientId = `gradient-warranty-${data.label.toLowerCase().replace(/\s+/g, '-')}`;
  const gradientUrl = `url(#${gradientId})`;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative">
        <svg
          width={data.size}
          height={data.size}
          viewBox={`0 0 ${data.size} ${data.size}`}
          className="transform -rotate-90"
          aria-label={`${data.label} - ${data.value}%`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: data.color, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: data.gradientEnd, stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {/* Translucent colored track */}
          <circle
            cx={data.size / 2}
            cy={data.size / 2}
            r={radius}
            fill="none"
            stroke={data.color}
            strokeOpacity={0.15}
            strokeWidth={strokeWidth}
          />

          <motion.circle
            cx={data.size / 2}
            cy={data.size / 2}
            r={radius}
            fill="none"
            stroke={gradientUrl}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: progress }}
            transition={{
              duration: 1.4,
              delay: index * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.12))',
            }}
          />
        </svg>
      </div>
    </motion.div>
  );
};

export const WarrantyCard: React.FC<WarrantyCardProps> = ({
  onNavigateToTab,
  className,
}) => {
  const stats = VaultStorageService.getStats();
  const warranties = VaultStorageService.getWarranties();

  const totalWarranties = warranties.length;
  const activeWarranties = stats.activeWarranties;
  const expiringWarranties = stats.expiringWarrantiesCount;
  const safeWarranties = Math.max(0, activeWarranties - expiringWarranties);

  // Compute ring values (concentric rings)
  const ring1Value = totalWarranties > 0 ? Math.round((activeWarranties / totalWarranties) * 100) : 100;
  const ring2Value = activeWarranties > 0 ? Math.round((safeWarranties / activeWarranties) * 100) : 100;
  const ring3Value = totalWarranties > 0 ? Math.round(((totalWarranties - expiringWarranties) / totalWarranties) * 100) : 100;

  const activities: RingActivityData[] = [
    {
      label: 'AKTİF',
      value: ring1Value,
      color: '#8B5CF6',
      gradientEnd: '#A78BFA',
      size: 136,
      current: activeWarranties,
      target: totalWarranties || 1,
      unit: 'ADET',
    },
    {
      label: 'GÜVENDE',
      value: ring2Value,
      color: '#10B981',
      gradientEnd: '#34D399',
      size: 108,
      current: safeWarranties,
      target: activeWarranties || 1,
      unit: 'ÜRÜN',
    },
    {
      label: 'KORUMA',
      value: ring3Value,
      color: expiringWarranties > 0 ? '#F59E0B' : '#06B6D4',
      gradientEnd: expiringWarranties > 0 ? '#FBBF24' : '#38BDF8',
      size: 80,
      current: expiringWarranties > 0 ? expiringWarranties : totalWarranties,
      target: totalWarranties || 1,
      unit: expiringWarranties > 0 ? 'YAKIN' : 'GÜVENDE',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onNavigateToTab?.('warranties')}
      className={cn(
        'w-full rounded-3xl p-6 sm:p-7 shadow-soft transition-all duration-300 relative overflow-hidden cursor-pointer group',
        'bg-surface/50 text-primary backdrop-blur-xl border border-border/60 hover:border-accent/40',
        className
      )}
    >
      {/* Background subtle glow */}
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Clean Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-[2px] text-secondary opacity-80">
          Garantiler & Koruma
        </span>
      </div>

      {/* Content Layout: Concentric Rings + Proportional Detailed Summary */}
      <div className="flex items-center justify-between gap-5 relative z-10">
        {/* Concentric Activity Rings */}
        <div className="relative w-[136px] h-[136px] shrink-0 flex items-center justify-center">
          {activities.map((activity, index) => (
            <CircleProgress key={activity.label} data={activity} index={index} />
          ))}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
            <span className="text-2xl font-black tracking-tight text-primary tabular-nums">
              {activeWarranties}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-secondary opacity-70 mt-1">
              GARANTİ
            </span>
          </div>
        </div>

        {/* Detailed Status Breakdown with Balanced Typography */}
        <div className="flex flex-col space-y-3 min-w-0 flex-1 pl-2">
          {activities.map((activity) => (
            <div key={activity.label} className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary opacity-70">
                {activity.label}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span
                  className="text-base sm:text-lg font-black tracking-tight tabular-nums"
                  style={{ color: activity.color }}
                >
                  {activity.current}
                </span>
                <span className="text-[11px] font-semibold text-secondary opacity-70">
                  / {activity.target} {activity.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WarrantyCard;
