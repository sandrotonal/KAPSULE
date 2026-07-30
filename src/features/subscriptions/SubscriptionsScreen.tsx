import React, { useState } from 'react';
import { CreditCard, Search, Plus, TrendingDown, Calendar, ArrowUpRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { VaultStorageService } from '../../services/vaultStorage';
import { SubscriptionItem } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { SubscriptionDetailModal } from './SubscriptionDetailModal';
import { motion } from 'framer-motion';
import { TiltCard } from '../../components/ui/TiltCard';

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
  const [selectedSub, setSelectedSub] = useState<SubscriptionItem | null>(() => {
    if (selectedItemId) {
      const list = VaultStorageService.getSubscriptions();
      return list.find(s => s.id === selectedItemId) || null;
    }
    return null;
  });

  const filtered = subs.filter(s =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Approximate monthly total in TL
  const monthlyTotal = subs.reduce((acc, s) => {
    if (s.status !== 'active') return acc;
    const price = s.currency === 'USD' ? s.price * 34 : s.price;
    const monthly = s.billingCycle === 'yearly' ? price / 12 : price;
    return acc + monthly;
  }, 0);

  const handleDelete = (id: string) => {
    VaultStorageService.deleteSubscription(id);
    setSubs(VaultStorageService.getSubscriptions());
    setSelectedSub(null);
  };

  const handleToggleStatus = (id: string) => {
    const list = VaultStorageService.getSubscriptions();
    const updated = list.map(s => {
      if (s.id === id) {
        const nextStatus: SubscriptionItem['status'] = s.status === 'active' ? 'paused' : 'active';
        return { ...s, status: nextStatus };
      }
      return s;
    });
    // Write back to storage
    localStorage.setItem('kapsule_subscriptions', JSON.stringify(updated));
    setSubs(updated);
    setSelectedSub(prev => prev ? { ...prev, status: prev.status === 'active' ? 'paused' : 'active' } : null);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Abonelikler</h1>
          <p className="text-lg text-secondary font-medium">
            {subs.filter(s => s.status === 'active').length} aktif · ~{formatCurrency(Math.round(monthlyTotal), 'TL')}/ay
          </p>
        </div>
        <Button variant="primary" size="md" className="rounded-full px-6" icon={<Plus className="w-4 h-4" />} onClick={onOpenAdd}>
          Ekle
        </Button>
      </div>

      {/* Subscription Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TiltCard className="rounded-2xl">
          <Card className="bg-surface/30 border-border/40 p-6 space-y-4 h-full">
            <div className="flex items-center gap-2 text-secondary/60">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Aylık Harcama</span>
            </div>
            <p className="text-3xl font-bold text-primary tracking-tight">{formatCurrency(Math.round(monthlyTotal), 'TL')}</p>
            <div className="w-full bg-border/20 h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                className="bg-accent h-full"
              />
            </div>
          </Card>
        </TiltCard>

        <TiltCard className="rounded-2xl">
          <Card className="bg-surface/30 border-border/40 p-6 space-y-4 h-full">
            <div className="flex items-center gap-2 text-secondary/60">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Sıradaki Yenileme</span>
            </div>
            <p className="text-3xl font-bold text-primary tracking-tight">
              {subs.length > 0 ? formatDate([...subs].sort((a,b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())[0].renewalDate) : '—'}
            </p>
            <p className="text-[11px] text-secondary font-medium">En yakın ödeme tarihi</p>
          </Card>
        </TiltCard>

        <TiltCard className="rounded-2xl">
          <Card className="bg-surface/30 border-border/40 p-6 space-y-4 h-full">
            <div className="flex items-center gap-2 text-secondary/60">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Yıllık Etki</span>
            </div>
            <p className="text-3xl font-bold text-primary tracking-tight">{formatCurrency(Math.round(monthlyTotal * 12), 'TL')}</p>
            <p className="text-[11px] text-secondary font-medium">Tahmini 12 aylık maliyet</p>
          </Card>
        </TiltCard>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Aboneliklerde ara..."
          aria-label="Aboneliklerde ara"
          className="rounded-2xl bg-surface/40 border-border/60 h-12"
          icon={<Search className="w-4 h-4 opacity-40" />}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center space-y-6">
          <div className="w-20 h-20 rounded-[2.5rem] bg-surface border border-border flex items-center justify-center mx-auto shadow-soft">
            <CreditCard className="w-10 h-10 text-secondary opacity-40" />
          </div>
          <div className="max-w-xs mx-auto">
            <p className="text-lg font-bold text-primary">Henüz abonelik yok</p>
            <p className="text-sm text-secondary mt-2 leading-relaxed">Dijital hizmetlerinizi ve düzenli giderlerinizi takip ederek bütçenizi kontrol altında tutun.</p>
          </div>
          <Button variant="primary" size="md" className="rounded-full px-8" onClick={onOpenAdd}>Abonelik ekle</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard className="rounded-[1.5rem] h-full" intensity={6}>
                <Card
                  interactive
                  padding="lg"
                  onClick={() => setSelectedSub(sub)}
                  className="space-y-6 border-border/60 h-full flex flex-col justify-between"
                >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-lg font-bold text-accent shrink-0 shadow-soft">
                      {sub.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-bold text-primary line-clamp-1 tracking-tight">{sub.name}</p>
                      <Badge variant="muted" size="xs" className="mt-1 opacity-70">{sub.category}</Badge>
                    </div>
                  </div>
                  <Badge variant={sub.status === 'active' ? 'success' : 'default'} size="xs" dot className="rounded-full">
                    {sub.status === 'active' ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>

                {/* Price & Renewal */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest opacity-60">Fiyat</span>
                    <span className="text-xl font-bold text-primary tracking-tight">
                      {formatCurrency(sub.price, sub.currency)}<span className="text-xs text-secondary font-medium">{sub.billingCycle === 'monthly' ? '/ay' : '/yıl'}</span>
                    </span>
                  </div>
                  <div className="w-full h-px bg-border/40" />
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-secondary font-medium">Yenileme</span>
                    <span className="font-bold text-primary">{formatDate(sub.renewalDate)}</span>
                  </div>
                </div>
                </Card>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      )}

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
