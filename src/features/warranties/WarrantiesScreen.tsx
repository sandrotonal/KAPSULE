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
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Garantiler</h1>
          <p className="text-lg text-secondary font-medium">
            {activeCount} aktif{expiringCount > 0 ? ` · ${expiringCount} yakında bitiyor` : ''}
          </p>
        </div>
        <Button variant="primary" size="md" className="rounded-full px-6" icon={<Plus className="w-4 h-4" />} onClick={onOpenAdd}>
          Ekle
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Ürün veya marka ara..."
          aria-label="Garantilerde ara"
          className="rounded-2xl bg-surface/40 border-border/60 h-12"
          icon={<Search className="w-4 h-4 opacity-40" />}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center space-y-6">
          <div className="w-20 h-20 rounded-[2.5rem] bg-surface border border-border flex items-center justify-center mx-auto shadow-soft">
            <ShieldCheck className="w-10 h-10 text-secondary opacity-40" />
          </div>
          <div className="max-w-xs mx-auto">
            <p className="text-lg font-bold text-primary">Henüz garanti yok</p>
            <p className="text-sm text-secondary mt-2 leading-relaxed">Elektronik, beyaz eşya ve ürün korumalarınızı ekleyin, garanti sürelerini kaçırmayın.</p>
          </div>
          <Button variant="primary" size="md" className="rounded-full px-8" onClick={onOpenAdd}>Garanti ekle</Button>
        </div>
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
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard className="rounded-3xl h-full" intensity={7}>
                <Card
                  interactive
                  padding="none"
                  onClick={() => setSelectedWarranty(war)}
                  className="overflow-hidden flex flex-col border-border/60 h-full group"
                >
                  {/* Image */}
                  <div className="relative h-44 bg-surface border-b border-border/40 overflow-hidden">
                    {war.imageUrl ? (
                      <img src={war.imageUrl} alt={war.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface to-surface-elevated">
                        <ShieldCheck className="w-10 h-10 text-border group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    {/* Status badge */}
                    <div className="absolute top-4 right-4">
                      {isExpired ? (
                        <Badge variant="danger" size="xs" dot className="rounded-full shadow-soft bg-white/90 dark:bg-black/90 backdrop-blur-md">Süresi Doldu</Badge>
                      ) : isExpiring ? (
                        <Badge variant="warning" size="xs" dot className="rounded-full shadow-soft bg-white/90 dark:bg-black/90 backdrop-blur-md">{days} gün kaldı</Badge>
                      ) : (
                        <Badge variant="success" size="xs" dot className="rounded-full shadow-soft bg-white/90 dark:bg-black/90 backdrop-blur-md">Aktif</Badge>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-[11px] font-bold text-secondary uppercase tracking-widest opacity-60">{war.brand}</p>
                      <p className="text-base font-bold text-primary mt-1 line-clamp-1 tracking-tight group-hover:text-accent transition-colors">{war.productName}</p>
                    </div>

                    <div className="space-y-2 text-[13px] p-4 bg-surface/50 rounded-2xl border border-border/40">
                      {war.serialNumber && (
                        <div className="flex justify-between items-center">
                          <span className="text-secondary font-medium">Seri No</span>
                          <span className="font-mono text-primary text-[11px] bg-background px-1.5 py-0.5 rounded border border-border/40 truncate max-w-[120px]">{war.serialNumber}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-secondary font-medium">Bitiş Tarihi</span>
                        <span className={`font-bold ${isExpiring ? 'text-warning' : isExpired ? 'text-danger' : 'text-primary'}`}>
                          {formatDate(war.expiryDate)}
                        </span>
                      </div>
                    </div>

                    {war.notes && (
                      <p className="text-[12px] text-secondary/70 line-clamp-2 italic leading-relaxed pl-2 border-l-2 border-border/40">{war.notes}</p>
                    )}
                  </div>
                  </Card>
              </TiltCard>
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
