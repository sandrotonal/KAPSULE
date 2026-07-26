import React, { useState } from 'react';
import { Receipt, Search, Plus, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { VaultStorageService } from '../../services/vaultStorage';
import { ReceiptItem } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { motion } from 'framer-motion';

export interface ReceiptsScreenProps {
  onOpenAdd: () => void;
}

export const ReceiptsScreen: React.FC<ReceiptsScreenProps> = ({ onOpenAdd }) => {
  const [receipts, setReceipts] = useState<ReceiptItem[]>(() => VaultStorageService.getReceipts());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null);

  const filtered = receipts.filter(r =>
    !searchQuery || r.merchant.toLowerCase().includes(searchQuery.toLowerCase()) || r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSpend = receipts.reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-[-0.02em]">Receipts</h1>
          <p className="text-sm text-secondary mt-0.5">
            {receipts.length} purchases · {formatCurrency(totalSpend, 'TL')} total
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={onOpenAdd}>
          Add
        </Button>
      </div>

      <Input
        placeholder="Search merchants, categories..."
        icon={<Search className="w-4 h-4" />}
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      <div className="space-y-2">
        {filtered.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.14, delay: i * 0.03 }}
          >
            <Card
              interactive
              padding="none"
              onClick={() => setSelectedReceipt(rec)}
              className="flex items-center gap-4 p-4 group"
            >
              {/* Logo */}
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center p-2 shrink-0">
                {rec.merchantLogo ? (
                  <img src={rec.merchantLogo} alt={rec.merchant} className="w-full h-full object-contain" />
                ) : (
                  <Receipt className="w-4 h-4 text-secondary" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary">{rec.merchant}</p>
                <p className="text-xs text-secondary mt-0.5 line-clamp-1">{rec.notes || rec.category}</p>
              </div>

              {/* Right */}
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-primary tabular-nums">
                  {formatCurrency(rec.amount, rec.currency)}
                </p>
                <p className="text-[11px] text-secondary mt-0.5">{formatDate(rec.date)}</p>
              </div>

              {rec.warrantyId && (
                <ShieldCheck className="w-4 h-4 text-success shrink-0" />
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Receipt Detail */}
      <Modal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        title={selectedReceipt?.merchant}
        subtitle={selectedReceipt ? formatDate(selectedReceipt.date) : ''}
      >
        {selectedReceipt && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
              <div>
                <p className="text-xs text-secondary font-medium">Amount</p>
                <p className="text-xl font-bold text-primary tabular-nums mt-0.5">
                  {formatCurrency(selectedReceipt.amount, selectedReceipt.currency)}
                </p>
              </div>
              <Badge variant="muted">{selectedReceipt.category}</Badge>
            </div>

            {selectedReceipt.receiptUrl && (
              <div className="h-44 rounded-xl overflow-hidden border border-border bg-surface">
                <img src={selectedReceipt.receiptUrl} alt="Receipt" className="w-full h-full object-cover" />
              </div>
            )}

            {selectedReceipt.notes && (
              <div className="space-y-1">
                <p className="text-xs text-secondary font-medium">Notes</p>
                <p className="text-sm text-primary px-4 py-3 bg-surface rounded-xl border border-border">
                  {selectedReceipt.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <Button variant="secondary" size="sm" onClick={() => setSelectedReceipt(null)}>Done</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
