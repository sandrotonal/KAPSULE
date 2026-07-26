import React, { useState } from 'react';
import { ShieldCheck, Search, Plus, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { VaultStorageService } from '../../services/vaultStorage';
import { WarrantyItem } from '../../types';
import { formatDate, getDaysRemaining } from '../../lib/utils';
import { WarrantyDetailModal } from './WarrantyDetailModal';
import { motion } from 'framer-motion';

export interface WarrantiesScreenProps {
  onOpenAdd: () => void;
  selectedItemId?: string;
  onViewReceipt?: (receiptId: string) => void;
}

export const WarrantiesScreen: React.FC<WarrantiesScreenProps> = ({
  onOpenAdd,
  selectedItemId,
  onViewReceipt,
}) => {
  const [warranties, setWarranties] = useState<WarrantyItem[]>(() => VaultStorageService.getWarranties());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyItem | null>(() => {
    if (selectedItemId) {
      const list = VaultStorageService.getWarranties();
      return list.find(w => w.id === selectedItemId) || null;
    }
    return null;
  });

  const filtered = warranties.filter(w =>
    !searchQuery || w.productName.toLowerCase().includes(searchQuery.toLowerCase()) || w.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = warranties.filter(w => w.status === 'active').length;
  const expiringCount = warranties.filter(w => w.status === 'expiring_soon').length;

  const handleDelete = (id: string) => {
    VaultStorageService.deleteWarranty(id);
    setWarranties(VaultStorageService.getWarranties());
    setSelectedWarranty(null);
  };

  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-[-0.02em]">Warranties</h1>
          <p className="text-sm text-secondary mt-0.5">
            {activeCount} active{expiringCount > 0 ? ` · ${expiringCount} expiring soon` : ''}
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={onOpenAdd}>
          Add
        </Button>
      </div>

      <Input
        placeholder="Search products, brands..."
        icon={<Search className="w-4 h-4" />}
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">No warranties yet.</p>
            <p className="text-xs text-secondary mt-1">Add details of your electronics, appliances, and coverage.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={onOpenAdd}>Add warranty</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((war, i) => {
            const days = getDaysRemaining(war.expiryDate);
            const isExpiring = war.status === 'expiring_soon' || (days > 0 && days <= 90);
            const isExpired = war.status === 'expired' || days <= 0;

            return (
              <motion.div
                key={war.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.14, delay: i * 0.04 }}
              >
                <Card
                  interactive
                  padding="none"
                  onClick={() => setSelectedWarranty(war)}
                  className="overflow-hidden flex flex-col border-border/80 h-full"
                >
                  {/* Image */}
                  <div className="relative h-36 bg-surface border-b border-border overflow-hidden">
                    {war.imageUrl ? (
                      <img src={war.imageUrl} alt={war.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-border" />
                      </div>
                    )}
                    {/* Status badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {isExpired ? (
                        <Badge variant="danger" size="xs" dot>Expired</Badge>
                      ) : isExpiring ? (
                        <Badge variant="warning" size="xs" dot>{days} days left</Badge>
                      ) : (
                        <Badge variant="success" size="xs" dot>Active</Badge>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-semibold text-secondary uppercase tracking-wider">{war.brand}</p>
                      <p className="text-sm font-medium text-primary mt-0.5 line-clamp-1">{war.productName}</p>
                    </div>

                    <div className="space-y-1.5 text-xs p-3 bg-surface rounded-lg border border-border">
                      {war.serialNumber && (
                        <div className="flex justify-between">
                          <span className="text-secondary">Serial</span>
                          <span className="font-mono text-primary text-[11px] truncate max-w-[120px]">{war.serialNumber}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-secondary">Expires</span>
                        <span className={`font-medium ${isExpiring ? 'text-warning' : isExpired ? 'text-danger' : 'text-primary'}`}>
                          {formatDate(war.expiryDate)}
                        </span>
                      </div>
                    </div>

                    {war.notes && (
                      <p className="text-[11px] text-secondary line-clamp-2 italic leading-relaxed">{war.notes}</p>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <WarrantyDetailModal
        warranty={selectedWarranty}
        isOpen={!!selectedWarranty}
        onClose={() => setSelectedWarranty(null)}
        onDelete={handleDelete}
        onViewReceipt={onViewReceipt}
      />
    </div>
  );
};
