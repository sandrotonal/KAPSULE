import React, { useState } from 'react';
import { CreditCard, Search, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { VaultStorageService } from '../../services/vaultStorage';
import { SubscriptionItem } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { SubscriptionDetailModal } from './SubscriptionDetailModal';
import { motion } from 'framer-motion';

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
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-[-0.02em]">Subscriptions</h1>
          <p className="text-sm text-secondary mt-0.5">
            {subs.filter(s => s.status === 'active').length} active · ~{formatCurrency(Math.round(monthlyTotal), 'TL')}/mo
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={onOpenAdd}>
          Add
        </Button>
      </div>

      <Input
        placeholder="Search subscriptions..."
        icon={<Search className="w-4 h-4" />}
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto">
            <CreditCard className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">No subscriptions yet.</p>
            <p className="text-xs text-secondary mt-1">Keep track of your digital services and recurrent costs.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={onOpenAdd}>Add subscription</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.14, delay: i * 0.04 }}
            >
              <Card
                interactive
                padding="md"
                onClick={() => setSelectedSub(sub)}
                className="space-y-4 border-border/80 h-full"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                      {sub.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-primary line-clamp-1">{sub.name}</p>
                      <Badge variant="muted" size="xs" className="mt-0.5">{sub.category}</Badge>
                    </div>
                  </div>
                  <Badge variant={sub.status === 'active' ? 'success' : 'default'} size="xs" dot>
                    {sub.status === 'active' ? 'Active' : sub.status}
                  </Badge>
                </div>

                {/* Price & Renewal */}
                <div className="space-y-1.5 p-3 bg-surface rounded-lg border border-border text-xs">
                  <div className="flex justify-between">
                    <span className="text-secondary">Price</span>
                    <span className="font-semibold text-primary tabular-nums">
                      {formatCurrency(sub.price, sub.currency)}{sub.billingCycle === 'monthly' ? '/mo' : '/yr'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Renews</span>
                    <span className="font-medium text-primary">{formatDate(sub.renewalDate)}</span>
                  </div>
                </div>
              </Card>
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
