import React from 'react';
import { CreditCard, Calendar, Clock, Trash2, PauseCircle, PlayCircle, Tag } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BrandAvatar } from '../../components/ui/BrandAvatar';
import { SubscriptionItem } from '../../types';
import { formatCurrency, formatDate, getDaysRemaining, cn } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';
import { triggerHaptic } from '../../utils/haptics';

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

  const daysLeft = getDaysRemaining(subscription.renewalDate);
  const annualCost = subscription.billingCycle === 'monthly' ? subscription.price * 12 : subscription.price;
  const isActive = subscription.status === 'active';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideHeader
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Top Brand Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <BrandAvatar
              name={subscription.name}
              brand={subscription.name}
              imageUrl={subscription.logoUrl}
              size="lg"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-primary tracking-tight truncate capitalize">
                {subscription.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {subscription.category && (
                  <span className="text-xs font-semibold text-secondary/80 uppercase tracking-wider">
                    {subscription.category}
                  </span>
                )}
                <span className="text-secondary/40 text-xs">•</span>
                <span className="text-xs text-secondary/70 font-medium">Abonelik</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <Badge
            variant={isActive ? 'default' : 'muted'}
            size="sm"
            dot
            className={cn("rounded-full shrink-0", isActive ? "text-primary border-border/70" : "text-secondary/60")}
          >
            {isActive ? 'Aktif' : 'Pasif'}
          </Badge>
        </div>

        {/* Pricing & Cycle Card */}
        <div className="p-4 rounded-2xl bg-surface/60 dark:bg-surface-elevated/40 border border-border/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-secondary font-medium block">Abonelik Tutarı</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-primary tracking-tight tabular-nums">
                {formatCurrency(subscription.price, subscription.currency)}
              </span>
              <span className="text-xs text-secondary font-medium">
                {subscription.billingCycle === 'monthly' ? '/ay' : '/yıl'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-secondary font-medium block">Döngü</span>
            <span className="text-sm font-bold text-primary capitalize mt-0.5 block">
              {subscription.billingCycle === 'monthly' ? 'Aylık Fatura' : 'Yıllık Fatura'}
            </span>
          </div>
        </div>

        {/* Specifications Matrix */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-surface/40 dark:bg-surface-elevated/20 border border-border/50 space-y-1">
            <span className="text-secondary/70 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-secondary/60" /> Sıradaki Yenileme
            </span>
            <p className="font-bold text-primary text-[13px] pt-0.5">
              {formatDate(subscription.renewalDate)}
            </p>
            <span className="text-[11px] text-secondary/60 font-medium block">
              {daysLeft > 0 ? `${daysLeft} gün kaldı` : 'Bugün yenileniyor'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface/40 dark:bg-surface-elevated/20 border border-border/50 space-y-1">
            <span className="text-secondary/70 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-secondary/60" /> Yıllık Toplam
            </span>
            <p className="font-bold text-primary text-[13px] tabular-nums pt-0.5">
              {formatCurrency(Math.round(annualCost), subscription.currency)}
            </p>
            <span className="text-[11px] text-secondary/60 font-medium block">
              12 aylık bütçe etkisi
            </span>
          </div>
        </div>

        {/* Notes */}
        {subscription.notes && (
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-secondary/80">Abonelik Notları</span>
            <p className="text-xs text-secondary leading-relaxed bg-surface/40 dark:bg-surface-elevated/20 px-4 py-3 rounded-2xl border border-border/50 italic">
              {subscription.notes}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <button
            type="button"
            onClick={() => {
              triggerHaptic.light();
              onDelete(subscription.id);
              onClose();
              showToast('Abonelik silindi.');
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-secondary/60 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-500/5 active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Aboneliği Sil</span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={isActive ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
              onClick={() => {
                triggerHaptic.light();
                onToggleStatus(subscription.id);
                showToast(isActive ? 'Abonelik duraklatıldı.' : 'Abonelik aktifleştirildi.');
              }}
              className="rounded-xl text-xs font-medium"
            >
              {isActive ? 'Duraklat' : 'Aktifleştir'}
            </Button>
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

export default SubscriptionDetailModal;
