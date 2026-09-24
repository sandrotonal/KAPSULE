import React, { useState } from 'react';
import { Calendar, Hash, FileText, Trash2, Copy, Check, ShieldCheck, Clock } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BrandAvatar } from '../../components/ui/BrandAvatar';
import { WarrantyItem } from '../../types';
import { formatDate, getDaysRemaining, cn } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';
import { triggerHaptic } from '../../utils/haptics';

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

  // Calculate warranty percentage elapsed
  const pDate = new Date(warranty.purchaseDate).getTime();
  const eDate = new Date(warranty.expiryDate).getTime();
  const now = Date.now();
  const totalDuration = eDate - pDate;
  const elapsed = Math.max(0, Math.min(totalDuration, now - pDate));
  const progressPercent = totalDuration > 0 ? Math.min(100, Math.round((elapsed / totalDuration) * 100)) : 100;

  const handleCopySerial = () => {
    if (warranty.serialNumber) {
      triggerHaptic.light();
      navigator.clipboard.writeText(warranty.serialNumber);
      setCopied(true);
      showToast('Seri numarası panoya kopyalandı.');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideHeader
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Top Drag & Close Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <BrandAvatar
              name={warranty.productName}
              brand={warranty.brand}
              imageUrl={warranty.imageUrl}
              size="lg"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-primary tracking-tight truncate capitalize">
                {warranty.productName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {warranty.brand && (
                  <span className="text-xs font-semibold text-secondary/80 uppercase tracking-wider">
                    {warranty.brand}
                  </span>
                )}
                <span className="text-secondary/40 text-xs">•</span>
                <span className="text-xs text-secondary/70 font-medium">Garanti Belgesi</span>
              </div>
            </div>
          </div>

          {/* Status Badge — Neutral quiet luxury */}
          <div className="shrink-0">
            {isExpired ? (
              <Badge variant="muted" size="sm" dot className="rounded-full text-secondary/70">
                Süresi Doldu
              </Badge>
            ) : isExpiring ? (
              <Badge variant="default" size="sm" dot className="rounded-full border-border/70 text-primary">
                {daysLeft} gün kaldı
              </Badge>
            ) : (
              <Badge variant="default" size="sm" dot className="rounded-full border-border/70 text-primary">
                Kapsam Aktif
              </Badge>
            )}
          </div>
        </div>

        {/* Optional Product Image Preview */}
        {warranty.imageUrl && (
          <div className="w-full h-44 rounded-2xl overflow-hidden border border-border/60 bg-surface/50">
            <img
              src={warranty.imageUrl}
              alt={warranty.productName}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Warranty Lifespan Timeline Card */}
        <div className="p-4 rounded-2xl bg-surface/60 dark:bg-surface-elevated/40 border border-border/60 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-secondary font-medium">Kapsam Durumu</span>
            <span className="font-semibold text-primary tabular-nums">
              {isExpired ? 'Sona Erdi' : `%${progressPercent} tamamlandı`}
            </span>
          </div>

          {/* Minimal Timeline Bar */}
          <div className="w-full h-1.5 rounded-full bg-border/40 dark:bg-white/[0.06] overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isExpired ? 'bg-secondary/40' : 'bg-primary'
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-secondary/70 font-medium pt-0.5">
            <span>Satın Alma: {formatDate(warranty.purchaseDate)}</span>
            <span>Bitiş: {formatDate(warranty.expiryDate)}</span>
          </div>
        </div>

        {/* Specifications Matrix */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-surface/40 dark:bg-surface-elevated/20 border border-border/50 space-y-1">
            <span className="text-secondary/70 font-medium block">Satın Alma Tarihi</span>
            <span className="font-bold text-primary text-[13px] tabular-nums">
              {formatDate(warranty.purchaseDate)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface/40 dark:bg-surface-elevated/20 border border-border/50 space-y-1">
            <span className="text-secondary/70 font-medium block">Garanti Bitiş Tarihi</span>
            <span className="font-bold text-primary text-[13px] tabular-nums">
              {formatDate(warranty.expiryDate)}
            </span>
          </div>
        </div>

        {/* Serial Number Copy Box */}
        {warranty.serialNumber && (
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-secondary/80">Ürün Seri Numarası</span>
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-surface/50 dark:bg-surface-elevated/30 border border-border/60">
              <span className="font-mono text-xs text-primary font-semibold truncate tracking-wider">
                {warranty.serialNumber}
              </span>
              <button
                type="button"
                onClick={handleCopySerial}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium text-secondary hover:text-primary hover:bg-surface transition-colors shrink-0 border border-border/40"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-primary" />
                    <span>Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-secondary/70" />
                    <span>Kopyala</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Notes */}
        {warranty.notes && (
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-secondary/80">Özel Notlar</span>
            <p className="text-xs text-secondary leading-relaxed bg-surface/40 dark:bg-surface-elevated/20 px-4 py-3 rounded-2xl border border-border/50 italic">
              {warranty.notes}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <button
            type="button"
            onClick={() => {
              triggerHaptic.light();
              onDelete(warranty.id);
              onClose();
              showToast('Garanti kaydı silindi.');
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-secondary/60 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-500/5 active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kaydı Sil</span>
          </button>

          <div className="flex items-center gap-2">
            {warranty.receiptId && onViewReceipt && (
              <Button
                variant="secondary"
                size="sm"
                icon={<FileText className="w-3.5 h-3.5" />}
                onClick={() => onViewReceipt(warranty.receiptId!)}
                className="rounded-xl text-xs font-medium"
              >
                Fişi Gör
              </Button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-xs tracking-tight shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WarrantyDetailModal;
