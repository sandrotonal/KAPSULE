import React, { useState } from 'react';
import { CreditCard, Search, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { VaultStorageService } from '../../services/vaultStorage';
import { SubscriptionItem } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { motion } from 'framer-motion';

export interface SubscriptionsScreenProps {
  onOpenAdd: () => void;
}

export const SubscriptionsScreen: React.FC<SubscriptionsScreenProps> = ({ onOpenAdd }) => {
  const [subs, setSubs] = useState<SubscriptionItem[]>(() => VaultStorageService.getSubscriptions());
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = subs.filter(s =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Approximate monthly total in TL
  const monthlyTotal = subs.reduce((acc, s) => {
    const price = s.currency === 'USD' ? s.price * 34 : s.price;
    const monthly = s.billingCycle === 'yearly' ? price / 12 : price;
    return acc + monthly;
  }, 0);

  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-[-0.02em]">Subscriptions</h1>
          <p className="text-sm text-secondary mt-0.5">
            {subs.length} active · ~{formatCurrency(Math.round(monthlyTotal), 'TL')}/mo
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((sub, i) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.14, delay: i * 0.04 }}
          >
            <Card padding="md" className="space-y-4 border-border/80">
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
    </div>
  );
};
