import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, Clock, ArrowUpRight, PauseCircle, PlayCircle, Settings2 } from 'lucide-react';
import { BrandAvatar } from '../../components/ui/BrandAvatar';
import { Badge } from '../../components/ui/Badge';
import { SubscriptionItem } from '../../types';
import { formatCurrency, formatDate, getDaysRemaining, cn } from '../../lib/utils';
import { triggerHaptic } from '../../utils/haptics';

interface SubscriptionDrawerCardProps {
  subscription: SubscriptionItem;
  onSelect: (sub: SubscriptionItem) => void;
  onToggleStatus: (id: string) => void;
}

export const SubscriptionDrawerCard: React.FC<SubscriptionDrawerCardProps> = ({
  subscription,
  onSelect,
  onToggleStatus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const lastToggleTimeRef = React.useRef(0);

  const daysLeft = getDaysRemaining(subscription.renewalDate);
  const annualCost = subscription.billingCycle === 'monthly' ? subscription.price * 12 : subscription.price;
  const isActive = subscription.status === 'active';

  const handleCardClick = () => {
    const now = Date.now();
    // Prevent double-tap or ghost click from immediately reopening/closing
    if (now - lastToggleTimeRef.current < 280) return;
    lastToggleTimeRef.current = now;

    triggerHaptic.light();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative flex flex-col w-full">
      {/* ─── 1. Main Top Card (Elevated Surface) ─── */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        whileTap={{ scale: 0.985 }}
        className={cn(
          "relative z-20 w-full p-5 rounded-[26px] border transition-all duration-300 cursor-pointer select-none",
          "bg-surface/90 dark:bg-zinc-900/90 backdrop-blur-xl border-border/70 dark:border-white/[0.08]",
          isOpen
            ? "shadow-[0_16px_36px_-10px_rgba(0,0,0,0.14)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] border-border"
            : "shadow-sm hover:shadow-md hover:border-border/90"
        )}
      >
        {/* Header: Brand Avatar + Name + Status Dot Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <BrandAvatar
              name={subscription.name}
              brand={subscription.name}
              imageUrl={subscription.logoUrl}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-primary tracking-tight truncate capitalize">
                {subscription.name}
              </h3>
              {subscription.category && (
                <span className="text-[11px] font-semibold text-secondary/70 uppercase tracking-wider block mt-0.5">
                  {subscription.category}
                </span>
              )}
            </div>
          </div>

          <Badge
            variant={isActive ? 'default' : 'muted'}
            size="xs"
            dot
            className={cn("rounded-full", isActive ? "text-primary border-border/70" : "text-secondary/60")}
          >
            {isActive ? 'Aktif' : 'Pasif'}
          </Badge>
        </div>

        {/* Pricing Row & Drawer Trigger */}
        <div className="mt-4 pt-3 border-t border-border/40 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-bold text-secondary/60 uppercase tracking-widest block">
              Maliyet
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-primary tracking-tight tabular-nums">
                {formatCurrency(subscription.price, subscription.currency)}
              </span>
              <span className="text-xs text-secondary/70 font-medium">
                {subscription.billingCycle === 'monthly' ? '/ay' : '/yıl'}
              </span>
            </div>
          </div>

          {/* Minimal drawer pull hint indicator */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary/60 group-hover:text-primary transition-colors pb-0.5">
            <span className="text-[11px] font-medium hidden sm:inline">
              {isOpen ? 'Detayları Kapat' : 'Detayları Gör'}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-5 h-5 rounded-full bg-surface-elevated/80 dark:bg-white/[0.04] border border-border/50 flex items-center justify-center text-secondary/80"
            >
              <ChevronDown className="w-3 h-3 stroke-[2.2]" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ─── 2. Slide-Out Detail Tray (Draws out from underneath) ─── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.24,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 w-full -mt-4 pt-6 px-4 pb-3.5 rounded-b-[24px] bg-surface/95 dark:bg-zinc-900/95 border border-t-0 border-border/70 dark:border-white/[0.08] shadow-md overflow-hidden flex flex-col gap-3"
          >
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              {/* Next Renewal */}
              <div className="p-2.5 rounded-xl bg-background/80 dark:bg-white/[0.02] border border-border/40 space-y-0.5">
                <span className="text-[10px] font-semibold text-secondary/70 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-secondary/60" /> Sıradaki Ödeme
                </span>
                <p className="font-bold text-primary text-[12px] truncate">
                  {formatDate(subscription.renewalDate)}
                </p>
                <span className="text-[10px] text-secondary/60 font-medium block">
                  {daysLeft > 0 ? `${daysLeft} gün kaldı` : 'Bugün yenileniyor'}
                </span>
              </div>

              {/* Annualized Cost */}
              <div className="p-2.5 rounded-xl bg-background/80 dark:bg-white/[0.02] border border-border/40 space-y-0.5">
                <span className="text-[10px] font-semibold text-secondary/70 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-secondary/60" /> Yıllık Projeksiyon
                </span>
                <p className="font-bold text-primary text-[12px] tabular-nums truncate">
                  {formatCurrency(Math.round(annualCost), subscription.currency)}
                </p>
                <span className="text-[10px] text-secondary/60 font-medium block">
                  12 aylık toplam
                </span>
              </div>
            </div>

            {/* Quick Actions Tray */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic.light();
                  onToggleStatus(subscription.id);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-elevated/60 transition-colors active:scale-95"
              >
                {isActive ? (
                  <>
                    <PauseCircle className="w-3.5 h-3.5" />
                    <span>Duraklat</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Aktifleştir</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic.light();
                  onSelect(subscription);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-background text-xs font-bold tracking-tight hover:opacity-90 transition-all active:scale-95 shadow-sm"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Yönet</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionDrawerCard;
