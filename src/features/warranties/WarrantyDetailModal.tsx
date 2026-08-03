import React, { useState } from 'react';
import { ShieldCheck, Calendar, Hash, FileText, Trash2, Copy, Check } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { WarrantyItem } from '../../types';
import { formatDate, getDaysRemaining } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export interface WarrantyDetailModalProps {
  warranty: WarrantyItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onViewReceipt?: (receiptId: string) => void;
}

export const WarrantyDetailModal: React.FC<WarrantyDetailModalProps> = ({
  warranty,
  isOpen,
  onClose,
  onDelete,
  onViewReceipt,
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!warranty) return null;

  const daysLeft = getDaysRemaining(warranty.expiryDate);
  const isExpired = warranty.status === 'expired' || daysLeft <= 0;
  const isExpiring = warranty.status === 'expiring_soon' || (daysLeft > 0 && daysLeft <= 90);

  const handleCopySerial = () => {
    if (warranty.serialNumber) {
      navigator.clipboard.writeText(warranty.serialNumber);
      setCopied(true);
      showToast('Seri numarası kopyalandı.');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={warranty.productName}
      subtitle={`${warranty.brand} · Garanti kapsamı`}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Preview image */}
        {warranty.imageUrl && (
          <div className="w-full h-48 rounded-xl overflow-hidden border border-border bg-surface">
            <img src={warranty.imageUrl} alt={warranty.productName} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Days countdown overlay if active */}
        <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
          <div>
            <p className="text-xs text-secondary font-medium">Durum</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={isExpired ? 'danger' : isExpiring ? 'warning' : 'success'} size="sm" dot>
                {isExpired ? 'Süresi Doldu' : isExpiring ? 'Yakında Bitiyor' : 'Aktif'}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-secondary font-medium">Kapsam</p>
            <p className="text-sm font-semibold text-primary mt-0.5">
              {isExpired ? 'Kapsam sona erdi' : `${daysLeft} gün kaldı`}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-surface rounded-xl border border-border">
            <p className="text-secondary font-medium flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-secondary/60" /> Satın Alındı
            </p>
            <p className="font-semibold text-primary">{formatDate(warranty.purchaseDate)}</p>
          </div>
          <div className="p-3 bg-surface rounded-xl border border-border">
            <p className="text-secondary font-medium flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-secondary/60" /> Bitiş
            </p>
            <p className="font-semibold text-primary">{formatDate(warranty.expiryDate)}</p>
          </div>
        </div>

        {/* Serial Number */}
        {warranty.serialNumber && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-secondary">Seri numarası</p>
            <div className="flex items-center justify-between px-4 py-3 bg-surface rounded-xl border border-border font-mono text-sm">
              <span className="text-primary truncate">{warranty.serialNumber}</span>
              <button
                onClick={handleCopySerial}
                className="p-1 text-secondary hover:text-primary transition-colors shrink-0"
                title="Seri numarasını kopyala"
                aria-label={copied ? 'Seri numarası kopyalandı' : 'Seri numarasını kopyala'}
              >
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Notes */}
        {warranty.notes && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-secondary">Notlar</p>
            <p className="text-sm text-primary leading-relaxed bg-surface px-4 py-3 rounded-xl border border-border">
              {warranty.notes}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => { onDelete(warranty.id); onClose(); showToast('Garanti silindi.'); }}
            className="text-danger hover:text-danger hover:bg-danger-muted"
          >
            Sil
          </Button>
          <div className="flex items-center gap-2">
            {warranty.receiptId && onViewReceipt && (
              <Button
                variant="secondary"
                size="sm"
                icon={<FileText className="w-3.5 h-3.5" />}
                onClick={() => onViewReceipt(warranty.receiptId!)}
              >
                Fişi gör
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onClose}>
              Tamam
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
