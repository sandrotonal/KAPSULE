import React, { useState } from 'react';
import { CreditCard, Search, Plus, Calendar, ArrowUpRight, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { VaultStorageService } from '../../services/vaultStorage';
import { SubscriptionItem } from '../../types';
import { formatCurrency, formatDate, getDaysRemaining, cn } from '../../lib/utils';
import { SubscriptionDetailModal } from './SubscriptionDetailModal';
import { SubscriptionDrawerCard } from './SubscriptionDrawerCard';
import { motion } from 'framer-motion';
import { TiltCard } from '../../components/ui/TiltCard';
import { triggerHaptic } from '../../utils/haptics';

export interface SubscriptionsScreenProps {
  onOpenAdd: () => void;
  selectedItemId?: string;
}

export const SubscriptionsScreen: React.FC<SubscriptionsScreenProps> = ({
  onOpenAdd,
  selectedItemId,
}) => {
  const [subs, setSubs] = useState<SubscriptionItem[]>(() => VaultStorageService.getSubscriptions());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'monthly' | 'yearly'>('all');
  const [selectedSub, setSelectedSub] = useState<SubscriptionItem | null>(() => {
    if (selectedItemId) {
      const list = VaultStorageService.getSubscriptions();
      return list.find(s => s.id === selectedItemId) || null;
    }
    return null;
  });

  const activeCount = subs.filter(s => s.status === 'active').length;
  const monthlyCount = subs.filter(s => s.billingCycle === 'monthly').length;
  const yearlyCount = subs.filter(s => s.billingCycle === 'yearly').length;

  const monthlyTotal = subs.reduce((acc, s) => {
    if (s.status !== 'active') return acc;
    if (s.currency !== 'TL' && s.currency !== 'TRY') return acc;
    const price = s.price;
    const monthly = s.billingCycle === 'yearly' ? price / 12 : price;
    return acc + monthly;
  }, 0);

  // Find next upcoming renewal
  const sortedByRenewal = [...subs]
    .filter(s => s.status === 'active')
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());
  const nextRenewalSub = sortedByRenewal[0] || null;

  const filtered = subs.filter(s => {
    if (activeFilter === 'active' && s.status !== 'active') return false;
    if (activeFilter === 'monthly' && s.billingCycle !== 'monthly') return false;
    if (activeFilter === 'yearly' && s.billingCycle !== 'yearly') return false;

    if (!searchQuery) return true;
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDelete = (id: string) => {
    VaultStorageService.deleteSubscription(id);
    setSubs(VaultStorageService.getSubscriptions());
    setSelectedSub(null);
  };

  const handleToggleStatus = (id: string) => {
    const updated = VaultStorageService.toggleSubscriptionStatus(id);
    if (!updated) return;
    setSubs(VaultStorageService.getSubscriptions());
    if (selectedSub && selectedSub.id === id) {
      setSelectedSub(updated);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">Abonelikler</h1>
          <p className="text-sm sm:text-base text-secondary font-medium">
            {activeCount} aktif abonelik · ~{formatCurrency(Math.round(monthlyTotal), 'TL')}/ay
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="rounded-full px-6 bg-primary text-background hover:opacity-90 shadow-sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={onOpenAdd}
        >
          Abonelik Ekle
        </Button>
      </div>

      {/* Subscription Analytics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Monthly Expense */}
        <TiltCard className="rounded-3xl" intensity={4}>
          <div className="p-5 sm:p-6 rounded-3xl bg-surface/70 dark:bg-surface-elevated/40 border border-border/60 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                Aylık Harcama
              </span>
              <span className="text-[11px] font-bold text-secondary/70 bg-surface dark:bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-border/40">
                {activeCount} Servis
              </span>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-primary tracking-tight tabular-nums">
                {formatCurrency(Math.round(monthlyTotal), 'TL')}
              </p>
              <div className="w-full bg-border/40 dark:bg-white/[0.05] h-1.5 rounded-full overflow-hidden mt-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.round((monthlyTotal / 3500) * 100), 100)}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-primary h-full rounded-full"
                />
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Next Upcoming Renewal */}
        <TiltCard className="rounded-3xl" intensity={4}>
          <div className="p-5 sm:p-6 rounded-3xl bg-surface/70 dark:bg-surface-elevated/40 border border-border/60 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-secondary/60" /> Sıradaki Yenileme
              </span>
              {nextRenewalSub && (
                <span className="text-[11px] font-bold text-secondary/70 bg-surface dark:bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-border/40">
                  {getDaysRemaining(nextRenewalSub.renewalDate)} gün
                </span>
              )}
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-primary tracking-tight truncate">
                {nextRenewalSub ? nextRenewalSub.name : '—'}
              </p>
              <p className="text-xs text-secondary/70 font-medium mt-1">
                {nextRenewalSub ? formatDate(nextRenewalSub.renewalDate) : 'Yaklaşan ödeme yok'}
              </p>
            </div>
          </div>
        </TiltCard>

        {/* Annual Commitment */}
        <TiltCard className="rounded-3xl" intensity={4}>
          <div className="p-5 sm:p-6 rounded-3xl bg-surface/70 dark:bg-surface-elevated/40 border border-border/60 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-secondary/60" /> Yıllık Bütçe Etkisi
              </span>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-primary tracking-tight tabular-nums">
                {formatCurrency(Math.round(monthlyTotal * 12), 'TL')}
              </p>
              <p className="text-xs text-secondary/70 font-medium mt-1">
                12 aylık tahmini toplam yük
              </p>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Abonelik veya kategori ara..."
            aria-label="Aboneliklerde ara"
            className="rounded-2xl bg-surface/70 border-border/60 text-primary placeholder:text-secondary/50 focus:border-accent h-11 text-xs"
            icon={<Search className="w-4 h-4 text-secondary opacity-60" />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-surface/60 dark:bg-surface-elevated/40 rounded-2xl border border-border/50 self-start sm:self-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => { triggerHaptic.light(); setActiveFilter('all'); }}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
              activeFilter === 'all'
                ? "bg-background text-primary shadow-sm"
                : "text-secondary hover:text-primary"
            )}
          >
            Tümü ({subs.length})
          </button>
          <button
            type="button"
            onClick={() => { triggerHaptic.light(); setActiveFilter('active'); }}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
              activeFilter === 'active'
                ? "bg-background text-primary shadow-sm"
                : "text-secondary hover:text-primary"
            )}
          >
            Aktif ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => { triggerHaptic.light(); setActiveFilter('monthly'); }}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
              activeFilter === 'monthly'
                ? "bg-background text-primary shadow-sm"
                : "text-secondary hover:text-primary"
            )}
          >
            Aylık ({monthlyCount})
          </button>
          <button
            type="button"
            onClick={() => { triggerHaptic.light(); setActiveFilter('yearly'); }}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
              activeFilter === 'yearly'
                ? "bg-background text-primary shadow-sm"
                : "text-secondary hover:text-primary"
            )}
          >
            Yıllık ({yearlyCount})
          </button>
        </div>
      </div>

      {/* Subscription Drawer Cards Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="w-8 h-8 text-secondary opacity-60" />}
          title={searchQuery ? "Aramanıza uygun abonelik bulunamadı" : "Henüz abonelik yok"}
          description={
            searchQuery
              ? "Farklı bir arama terimi deneyebilir veya filtreyi değiştirebilirsiniz."
              : "Dijital hizmetlerinizi ve düzenli giderlerinizi takip ederek bütçenizi kontrol altında tutun."
          }
          actionLabel={searchQuery ? undefined : "Abonelik ekle"}
          onAction={searchQuery ? undefined : onOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {filtered.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: Math.min(i * 0.02, 0.12), ease: [0.16, 1, 0.3, 1] }}
            >
              <SubscriptionDrawerCard
                subscription={sub}
                onSelect={(selected) => setSelectedSub(selected)}
                onToggleStatus={handleToggleStatus}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Subscription Detail Sheet */}
      <SubscriptionDetailModal
        subscription={selectedSub}
        isOpen={!!selectedSub}
        onClose={() => setSelectedSub(null)}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default SubscriptionsScreen;
