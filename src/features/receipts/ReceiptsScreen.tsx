import React, { useState } from 'react';
import { Receipt, Search, Plus, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { VaultStorageService } from '../../services/vaultStorage';
import { ReceiptItem } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { motion } from 'framer-motion';

export interface ReceiptsScreenProps {
  onOpenAdd: () => void;
  selectedItemId?: string;
}

const CATEGORIES = ['Hepsi', 'Tech', 'Home', 'Travel', 'Clothing', 'Food', 'Utilities', 'Services'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  Hepsi: 'Tüm Fişler',
  Tech: 'Teknoloji',
  Home: 'Ev & Yaşam',
  Travel: 'Seyahat',
  Clothing: 'Giyim',
  Food: 'Gıda',
  Utilities: 'Faturalar',
  Services: 'Hizmetler',
};

export const ReceiptsScreen: React.FC<ReceiptsScreenProps> = ({ onOpenAdd, selectedItemId }) => {
  const [receipts, setReceipts] = useState<ReceiptItem[]>(() => VaultStorageService.getReceipts());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Hepsi');
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(() => {
    if (selectedItemId) {
      const list = VaultStorageService.getReceipts();
      return list.find(r => r.id === selectedItemId) || null;
    }
    return null;
  });

  const filtered = receipts.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || r.merchant.toLowerCase().includes(q) || (r.notes?.toLowerCase().includes(q));
    const matchC = selectedCategory === 'Hepsi' || r.category === selectedCategory;
    return matchQ && matchC;
  });

  const totalSpend = receipts.reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Fişler & Faturalar</h1>
          <p className="text-lg text-secondary font-medium">
            {receipts.length} harcama · Toplam {formatCurrency(totalSpend, 'TL')}
          </p>
        </div>
        <Button variant="primary" size="md" className="rounded-full px-6" icon={<Plus className="w-4 h-4" />} onClick={onOpenAdd}>
          Ekle
        </Button>
      </div>

      <div className="space-y-6">
        <div className="max-w-md">
          <Input
            placeholder="Mağaza, kategori veya not ara..."
            aria-label="Fişlerde ara"
            className="rounded-2xl bg-surface/40 border-border/60 h-12"
            icon={<Search className="w-4 h-4 opacity-40" />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`shrink-0 min-h-[44px] px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-surface/50 text-secondary border border-border/60 hover:text-primary hover:bg-surface-elevated'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Receipt className="w-8 h-8 text-secondary opacity-60" />}
          title="Fiş bulunamadı"
          description="Alışveriş fişlerinizi, faturalarınızı ve giderlerinizi buraya ekleyerek bütçenizi kontrol edin."
          actionLabel="Fiş ekle"
          onAction={onOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card
                interactive
                padding="none"
                onClick={() => setSelectedReceipt(rec)}
                className="flex items-center gap-4 p-5 group h-full border-border/60"
              >
                  {/* Logo */}
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-border/60 flex items-center justify-center p-2.5 shrink-0 shadow-soft">
                    {rec.merchantLogo ? (
                      <img src={rec.merchantLogo} alt={rec.merchant} className="w-full h-full object-contain" />
                    ) : (
                      <Receipt className="w-5 h-5 text-secondary" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-primary truncate tracking-tight">{rec.merchant}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="muted" size="xs" className="opacity-70">
                        {CATEGORY_LABELS[rec.category] || rec.category}
                      </Badge>
                      {rec.warrantyId && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-success uppercase tracking-wider">
                          <ShieldCheck className="w-3.5 h-3.5" /> Garanti
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-primary tabular-nums tracking-tight">
                      {formatCurrency(rec.amount, rec.currency)}
                    </p>
                    <p className="text-xs text-secondary mt-1">{formatDate(rec.date)}</p>
                  </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Receipt Detail */}
      <Modal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        title={selectedReceipt?.merchant}
        subtitle={selectedReceipt ? formatDate(selectedReceipt.date) : ''}
        maxWidth="md"
      >
        {selectedReceipt && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-5 bg-surface rounded-2xl border border-border/60">
              <div>
                <p className="text-[11px] font-bold text-secondary uppercase tracking-[1.5px]">Tutar</p>
                <p className="text-2xl font-bold text-primary tabular-nums mt-1">
                  {formatCurrency(selectedReceipt.amount, selectedReceipt.currency)}
                </p>
              </div>
              <Badge variant="default" size="sm" className="rounded-full px-3 py-1">
                {CATEGORY_LABELS[selectedReceipt.category] || selectedReceipt.category}
              </Badge>
            </div>

            {selectedReceipt.receiptUrl && (
              <div className="h-56 rounded-2xl overflow-hidden border border-border bg-surface shadow-inner">
                <img src={selectedReceipt.receiptUrl} alt={`${selectedReceipt.merchant} fişi`} className="w-full h-full object-cover" />
              </div>
            )}

            {selectedReceipt.notes && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-secondary uppercase tracking-[1.5px]">Notlar</p>
                <p className="text-sm text-primary px-5 py-4 bg-surface rounded-2xl border border-border/60 leading-relaxed font-medium">
                  {selectedReceipt.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-border/40">
              <Button variant="secondary" size="md" className="rounded-xl px-6" onClick={() => setSelectedReceipt(null)}>Tamam</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
