import React from 'react';
import { CreditCard, Calendar, RefreshCw, Trash2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SubscriptionItem } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export interface SubscriptionDetailModalProps {
  subscription: SubscriptionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const SubscriptionDetailModal: React.FC<SubscriptionDetailModalProps> = ({
  subscription,
  isOpen,
  onClose,
  onDelete,
  onToggleStatus,
}) => {
  const { showToast } = useToast();

  if (!subscription) return null;

  // Approximate annual cost
  const price = subscription.currency === 'USD' ? subscription.price * 34 : subscription.price;
  const annualCost = subscription.billingCycle === 'monthly' ? price * 12 : price;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subscription.name}
      subtitle={`${subscription.category} · Abonelik detayları`}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Main Details Panel */}
        <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-sm font-semibold text-primary shrink-0">
              {subscription.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-secondary font-medium">Fatura Döngüsü</p>
              <p className="text-sm font-medium text-primary capitalize mt-0.5">{subscription.billingCycle === 'monthly' ? 'Aylık' : 'Yıllık'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-secondary font-medium">Maliyet</p>
            <p className="text-base font-bold text-primary mt-0.5 tabular-nums">
              {formatCurrency(subscription.price, subscription.currency)}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-surface rounded-xl border border-border">
            <p className="text-secondary font-medium flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-secondary/60" /> Sıradaki Yenileme
            </p>
            <p className="font-semibold text-primary">{formatDate(subscription.renewalDate)}</p>
          </div>
          <div className="p-3 bg-surface rounded-xl border border-border">
            <p className="text-secondary font-medium flex items-center gap-1.5 mb-1">
              <RefreshCw className="w-3.5 h-3.5 text-secondary/60" /> Tahmini Yıllık
            </p>
            <p className="font-semibold text-primary tabular-nums">{formatCurrency(Math.round(annualCost), 'TL')}</p>
          </div>
        </div>

        {/* Notes */}
        {subscription.notes && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-secondary">Notlar</p>
            <p className="text-sm text-primary leading-relaxed bg-surface px-4 py-3 rounded-xl border border-border">
              {subscription.notes}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => { onDelete(subscription.id); onClose(); showToast('Abonelik silindi.'); }}
            className="text-danger hover:text-danger hover:bg-danger-muted"
          >
            Sil
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onToggleStatus(subscription.id);
                showToast(subscription.status === 'active' ? 'Abonelik duraklatıldı.' : 'Abonelik aktifleştirildi.');
              }}
            >
              {subscription.status === 'active' ? 'Aboneliği duraklat' : 'Aktifleştir'}
            </Button>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Tamam
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
