import React, { useMemo } from 'react';
import { Plus, CreditCard } from 'lucide-react';
import { formatCurrency, getCategoryLabel, cn } from '../../lib/utils';
import { VaultStorageService } from '../../services/vaultStorage';
import { motion } from 'framer-motion';

export interface SpendingCardProps {
  onOpenQuickAdd?: () => void;
  onNavigateToTab?: (tab: 'receipts' | 'subscriptions') => void;
  className?: string;
}

const CATEGORY_COLORS = [
  'bg-accent',
  'bg-accent/80',
  'bg-accent/60',
  'bg-accent/40',
  'bg-accent/25',
  'bg-secondary/30',
];

export const SpendingCard: React.FC<SpendingCardProps> = ({
  onOpenQuickAdd,
  onNavigateToTab,
  className,
}) => {
  const stats = VaultStorageService.getStats();
  const receipts = VaultStorageService.getReceipts();
  const subscriptions = VaultStorageService.getSubscriptions();

  // Dynamic category breakdown with Turkish category translations
  const spendingCategories = useMemo(() => {
    const catMap: Record<string, number> = {};

    subscriptions.forEach((sub) => {
      const catLabel = getCategoryLabel(sub.category || 'Abonelik');
      const monthlyPrice = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
      catMap[catLabel] = (catMap[catLabel] || 0) + monthlyPrice;
    });

    receipts.forEach((rec) => {
      const catLabel = getCategoryLabel(rec.category || 'Fişler');
      catMap[catLabel] = (catMap[catLabel] || 0) + rec.amount;
    });

    const entries = Object.entries(catMap);
    const catTotal = entries.reduce((acc, [, val]) => acc + val, 0);

    if (catTotal === 0) {
      return [
        { code: 'Abonelikler', percent: 50, amount: 0, color: CATEGORY_COLORS[0] },
        { code: 'Fişler', percent: 50, amount: 0, color: CATEGORY_COLORS[1] },
      ];
    }

    return entries.map(([code, amount], idx) => ({
      code,
      amount,
      percent: Math.round((amount / catTotal) * 100) || 1,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    }));
  }, [receipts, subscriptions, stats]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'w-full rounded-3xl p-6 sm:p-7 shadow-soft transition-all duration-300 relative overflow-hidden',
        'bg-surface/50 text-primary backdrop-blur-xl border border-border/60 hover:border-border',
        className
      )}
    >
      {/* Subtle background glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header & Action Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-accent shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-[1.8px] text-secondary opacity-70">
            Aylık Harcama
          </span>
        </div>

        {onOpenQuickAdd && (
          <button
            type="button"
            onClick={onOpenQuickAdd}
            title="Harcama Ekle"
            className="w-7 h-7 rounded-full bg-surface text-secondary hover:bg-accent hover:text-white flex items-center justify-center transition-all duration-200 active:scale-90 shadow-soft"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Amount & Annual Estimate */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6 relative z-10">
        <div className="flex items-baseline gap-2.5">
          <span className="text-4xl sm:text-5xl font-bold tracking-tighter text-primary">
            {formatCurrency(stats.totalMonthlyCost, 'TL')}
          </span>
          {/* NO border around "Aylık" badge */}
          <span className="text-xs font-semibold text-accent px-2.5 py-0.5 rounded-full bg-accent/15">
            Aylık
          </span>
        </div>
        <div className="text-xs font-semibold text-secondary opacity-70">
          <span>Yıllık tahmini: </span>
          <span className="text-primary font-bold">{formatCurrency(stats.totalAnnualCost, 'TL')}</span>
        </div>
      </div>

      <div className="border-b border-border/40 mb-6 relative z-10" />

      {/* Animated Segmented Progress Bar & Legend */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-1.5 w-full overflow-hidden rounded-full h-2.5 bg-surface/60 p-0.5 border border-border/30">
          {spendingCategories.map((cat) => (
            <motion.div
              key={cat.code}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(cat.percent, 4)}%` }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={cn(cat.color, 'h-full rounded-full transition-all')}
              title={`${cat.code}: %${cat.percent}`}
            />
          ))}
        </div>

        {/* Compact, sleek horizontal category breakdown */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-1">
          {spendingCategories.slice(0, 4).map((cat) => (
            <div
              key={cat.code}
              className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-surface/60 border border-border/40"
            >
              <div className={cn(cat.color, 'w-2 h-2 rounded-full shrink-0')} />
              <span className="text-[11px] font-medium text-secondary truncate max-w-[100px]">{cat.code}</span>
              <span className="text-[11px] font-bold text-primary tabular-nums">%{cat.percent}</span>
            </div>
          ))}
          {spendingCategories.length > 4 && (
            <span className="text-[11px] text-secondary/60 font-medium pl-1">
              +{spendingCategories.length - 4} diğer
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SpendingCard;
