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
import { triggerHaptic } from '../../utils/haptics';

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
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [selectedWarranty, setSelectedWarranty] = useState<WarrantyItem | null>(() => {
    if (selectedItemId) {
      const list = VaultStorageService.getWarranties();
      return list.find(w => w.id === selectedItemId) || null;
    }
    return null;
  });

  const activeCount = warranties.filter(w => {
    const days = getDaysRemaining(w.expiryDate);
    return w.status !== 'expired' && days > 0;
  }).length;

  const expiredCount = warranties.filter(w => {
    const days = getDaysRemaining(w.expiryDate);
    return w.status === 'expired' || days <= 0;
  }).length;

  const filtered = warranties.filter(w => {
    const days = getDaysRemaining(w.expiryDate);
    const isExp = w.status === 'expired' || days <= 0;

    if (activeFilter === 'active' && isExp) return false;
    if (activeFilter === 'expired' && !isExp) return false;

    if (!searchQuery) return true;
    return (
      w.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDelete = (id: string) => {
    VaultStorageService.deleteWarranty(id);
    setWarranties(VaultStorageService.getWarranties());
    setSelectedWarranty(null);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">Garantiler</h1>
          <p className="text-sm sm:text-base text-secondary font-medium">
            {activeCount} aktif koruma{expiredCount > 0 ? ` · ${expiredCount} süresi dolan` : ''}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="rounded-full px-6 bg-primary text-background hover:opacity-90 shadow-sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={onOpenAdd}
        >
          Garanti Ekle
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Ürün veya marka ara..."
            aria-label="Garantilerde ara"
            className="rounded-2xl bg-surface/70 border-border/60 text-primary placeholder:text-secondary/50 focus:border-accent h-11 text-xs"
            icon={<Search className="w-4 h-4 text-secondary opacity-60" />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface/60 dark:bg-surface-elevated/40 rounded-2xl border border-border/50 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => { triggerHaptic.light(); setActiveFilter('all'); }}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
              activeFilter === 'all'
                ? "bg-background text-primary shadow-sm"
                : "text-secondary hover:text-primary"
            )}
          >
            Tümü ({warranties.length})
          </button>
          <button
            type="button"
            onClick={() => { triggerHaptic.light(); setActiveFilter('active'); }}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
              activeFilter === 'active'
                ? "bg-background text-primary shadow-sm"
                : "text-secondary hover:text-primary"
            )}
          >
            Aktif ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => { triggerHaptic.light(); setActiveFilter('expired'); }}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
              activeFilter === 'expired'
                ? "bg-background text-primary shadow-sm"
                : "text-secondary hover:text-primary"
            )}
          >
            Süresi Dolanlar ({expiredCount})
          </button>
        </div>
      </div>

      {/* Grid List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="w-8 h-8 text-secondary opacity-60" />}
          title={searchQuery ? "Aramanıza uygun garanti bulunamadı" : "Henüz garanti yok"}
          description={
            searchQuery
              ? "Farklı bir arama terimi deneyebilir veya filtreyi değiştirebilirsiniz."
              : "Elektronik, beyaz eşya ve ürün korumalarınızı ekleyin, garanti sürelerini kaçırmayın."
          }
          actionLabel={searchQuery ? undefined : "Garanti ekle"}
          onAction={searchQuery ? undefined : onOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((war, i) => {
            const days = getDaysRemaining(war.expiryDate);
            const isExpiring = war.status === 'expiring_soon' || (days > 0 && days <= 90);
            const isExpired = war.status === 'expired' || days <= 0;

            return (
              <motion.div
                key={war.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: Math.min(i * 0.02, 0.12), ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard className="rounded-3xl h-full" intensity={5}>
                  <Card
                    interactive
                    padding="lg"
                    onClick={() => {
                      triggerHaptic.light();
                      setSelectedWarranty(war);
                    }}
                    className="space-y-4 border-border/60 h-full flex flex-col justify-between group hover:border-border transition-all"
                  >
                    {/* Header: Official Brand/Product Avatar + Title + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
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
                            <span className="text-[11px] font-semibold text-secondary/70 uppercase tracking-wider block mt-0.5">
                              {war.brand}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Badge — Clean, quiet luxury */}
                      <div className="shrink-0">
                        {isExpired ? (
                          <Badge variant="muted" size="xs" dot className="rounded-full text-secondary/70">
                            Süresi Doldu
                          </Badge>
                        ) : isExpiring ? (
                          <Badge variant="default" size="xs" dot className="rounded-full border-border/70 text-primary">
                            {days} gün kaldı
                          </Badge>
                        ) : (
                          <Badge variant="default" size="xs" dot className="rounded-full border-border/70 text-primary">
                            Güvende
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Expiry Date & Serial Metadata — Pure neutral typography */}
                    <div className="space-y-2 pt-2.5 border-t border-border/40">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-secondary/80 font-medium">Bitiş Tarihi</span>
                        <span className={cn(
                          'font-bold tabular-nums',
                          isExpired ? 'text-secondary/70 font-medium' : 'text-primary'
                        )}>
                          {formatDate(war.expiryDate)}
                        </span>
                      </div>

                      {war.serialNumber && (
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-secondary/80 font-medium">Seri No</span>
                          <span className="font-mono text-xs text-secondary font-medium bg-surface/80 px-2 py-0.5 rounded-lg border border-border/40 truncate max-w-[140px]">
                            {war.serialNumber}
                          </span>
                        </div>
                      )}

                      {war.notes && (
                        <p className="text-xs text-secondary/70 line-clamp-1 italic leading-relaxed pt-0.5">
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
