import React, { useState } from 'react';
import { ShieldCheck, Search, Plus, Calendar, Hash, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { BrandAvatar } from '../../components/ui/BrandAvatar';
import { VaultStorageService } from '../../services/vaultStorage';
import { WarrantyItem } from '../../types';
import { formatDate, getDaysRemaining, cn } from '../../lib/utils';
import { WarrantyDetailModal } from './WarrantyDetailModal';
import { motion } from 'framer-motion';
import { TiltCard } from '../../components/ui/TiltCard';

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
    !searchQuery ||
    w.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = warranties.filter(w => w.status === 'active').length;
  const expiringCount = warranties.filter(w => w.status === 'expiring_soon').length;

  const handleDelete = (id: string) => {
    VaultStorageService.deleteWarranty(id);
    setWarranties(VaultStorageService.getWarranties());
    setSelectedWarranty(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">Garantiler</h1>
          <p className="text-sm sm:text-base text-secondary font-medium">
            {activeCount} aktif koruma{expiringCount > 0 ? ` · ${expiringCount} yakında bitiyor` : ''}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="rounded-full px-6 bg-accent text-white hover:bg-accent/90 shadow-soft"
          icon={<Plus className="w-4 h-4" />}
          onClick={onOpenAdd}
        >
          Garanti Ekle
        </Button>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <Input
          placeholder="Ürün veya marka ara..."
          aria-label="Garantilerde ara"
          className="rounded-2xl bg-surface border-border/60 text-primary placeholder:text-secondary/50 focus:border-accent h-12"
          icon={<Search className="w-4 h-4 text-secondary opacity-60" />}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="w-8 h-8 text-secondary opacity-60" />}
          title="Henüz garanti yok"
          description="Elektronik, beyaz eşya ve ürün korumalarınızı ekleyin, garanti sürelerini kaçırmayın."
          actionLabel="Garanti ekle"
          onAction={onOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((war, i) => {
            const days = getDaysRemaining(war.expiryDate);
            const isExpiring = war.status === 'expiring_soon' || (days > 0 && days <= 90);
            const isExpired = war.status === 'expired' || days <= 0;

            return (
              <motion.div
                key={war.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard className="rounded-3xl h-full" intensity={6}>
                  <Card
                    interactive
                    padding="lg"
                    onClick={() => setSelectedWarranty(war)}
                    className="space-y-5 border-border/60 h-full flex flex-col justify-between group"
                  >
                    {/* Header: Official Brand/Product Avatar + Title + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <BrandAvatar
                          name={war.productName}
                          brand={war.brand}
                          imageUrl={war.imageUrl}
                          size="md"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-bold text-primary line-clamp-1 tracking-tight capitalize group-hover:text-accent transition-colors">
                            {war.productName}
                          </p>
                          {war.brand && (
                            <Badge variant="muted" size="xs" className="mt-1 opacity-90">
                              {war.brand}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0">
                        {isExpired ? (
                          <Badge variant="danger" size="xs" dot className="rounded-full">
                            Süresi Doldu
                          </Badge>
                        ) : isExpiring ? (
                          <Badge variant="warning" size="xs" dot className="rounded-full">
                            {days} gün kaldı
                          </Badge>
                        ) : (
                          <Badge variant="success" size="xs" dot className="rounded-full">
                            Güvende
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Expiry Date & Serial Metadata */}
                    <div className="space-y-2.5 pt-2 border-t border-border/40">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-secondary font-medium">Bitiş Tarihi</span>
                        <span className={cn(
                          'font-bold tabular-nums',
                          isExpired
                            ? 'text-rose-600 dark:text-rose-400'
                            : isExpiring
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-primary'
                        )}>
                          {formatDate(war.expiryDate)}
                        </span>
                      </div>

                      {war.serialNumber && (
                        <div className="flex justify-between items-center text-[13px] pt-1">
                          <span className="text-secondary font-medium">Seri No</span>
                          <span className="font-mono text-xs text-primary font-medium bg-surface px-2 py-0.5 rounded-lg border border-border/40 truncate max-w-[140px]">
                            {war.serialNumber}
                          </span>
                        </div>
                      )}

                      {war.notes && (
                        <p className="text-xs text-secondary opacity-70 line-clamp-2 italic leading-relaxed pt-1">
                          {war.notes}
                        </p>
                      )}
                    </div>
                  </Card>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
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

export default WarrantiesScreen;
