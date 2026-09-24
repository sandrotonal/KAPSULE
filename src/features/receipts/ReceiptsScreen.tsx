import React, { useState } from 'react';
import { Receipt, Search, Plus, ShieldCheck, Printer, Trash2, Pencil, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { ReceiptPrintPreview } from '../../components/ui/ReceiptPrintPreview';
import { ReceiptTicket } from '../../components/ui/ReceiptTicket';
import { BrandAvatar, LiveBrandBadge } from '../../components/ui/BrandAvatar';
import { VaultStorageService } from '../../services/vaultStorage';
import { ReceiptItem } from '../../types';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '../../components/ui/Toast';

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

const CURRENCIES = ['TL', 'USD', 'EUR', 'GBP'];

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
  const [editingReceipt, setEditingReceipt] = useState<ReceiptItem | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const { showToast } = useToast();

  // Edit Form State
  const [editMerchant, setEditMerchant] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCurrency, setEditCurrency] = useState('TL');
  const [editCategory, setEditCategory] = useState<ReceiptItem['category']>('Tech');
  const [editDate, setEditDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editReceiptUrl, setEditReceiptUrl] = useState('');
  const [editError, setEditError] = useState('');

  const filtered = receipts.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || r.merchant.toLowerCase().includes(q) || (r.notes?.toLowerCase().includes(q));
    const matchC = selectedCategory === 'Hepsi' || r.category === selectedCategory;
    return matchQ && matchC;
  });

  const totalSpend = receipts.reduce((acc, r) => acc + r.amount, 0);

  // Delete Receipt Handler
  const handleDeleteReceipt = (id: string) => {
    VaultStorageService.deleteReceipt(id);
    const updated = VaultStorageService.getReceipts();
    setReceipts(updated);
    setSelectedReceipt(null);
    showToast('Fiş başarıyla silindi.');
  };

  // Open Edit Modal
  const handleOpenEdit = (receipt: ReceiptItem) => {
    setEditingReceipt(receipt);
    setEditMerchant(receipt.merchant);
    setEditAmount(String(receipt.amount));
    setEditCurrency(receipt.currency || 'TL');
    setEditCategory(receipt.category);
    setEditDate(receipt.date);
    setEditNotes(receipt.notes || '');
    setEditReceiptUrl(receipt.receiptUrl || '');
    setEditError('');
  };

  // Save Edited Receipt
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReceipt) return;

    if (!editMerchant.trim()) {
      setEditError('Lütfen mağaza adı girin.');
      return;
    }
    const numAmount = parseFloat(editAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setEditError('Lütfen geçerli bir tutar girin.');
      return;
    }

    const updatedItem: ReceiptItem = {
      ...editingReceipt,
      merchant: editMerchant.trim(),
      amount: numAmount,
      currency: editCurrency,
      category: editCategory,
      date: editDate || editingReceipt.date,
      notes: editNotes.trim() || undefined,
      receiptUrl: editReceiptUrl.trim() || undefined,
    };

    VaultStorageService.saveReceipt(updatedItem);
    const updatedList = VaultStorageService.getReceipts();
    setReceipts(updatedList);
    setSelectedReceipt(updatedItem);
    setEditingReceipt(null);
    showToast('Fiş güncellendi.');
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Fişler & Faturalar</h1>
          <p className="text-lg text-secondary font-medium">
            {receipts.length} harcama · Toplam {formatCurrency(totalSpend, 'TL')}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="rounded-full px-6 bg-accent text-white hover:bg-accent/90 shadow-soft"
          icon={<Plus className="w-4 h-4" />}
          onClick={onOpenAdd}
        >
          Ekle
        </Button>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-6">
        <div className="max-w-md">
          <Input
            placeholder="Mağaza, kategori veya not ara..."
            aria-label="Fişlerde ara"
            className="rounded-2xl bg-surface border-border/60 text-primary placeholder:text-secondary/50 focus:border-accent h-12"
            icon={<Search className="w-4 h-4 text-secondary opacity-60" />}
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
              className={`shrink-0 min-h-[40px] px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-accent text-white shadow-soft'
                  : 'bg-surface/50 text-secondary border border-border/60 hover:text-primary hover:bg-surface/80'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Receipt Ticket List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Receipt className="w-8 h-8 text-secondary opacity-60" />}
          title="Fiş bulunamadı"
          description="Alışveriş fişlerinizi, faturalarınızı ve giderlerinizi buraya ekleyerek bütçenizi kontrol edin."
          actionLabel="Fiş ekle"
          onAction={onOpenAdd}
        />
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {filtered.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: Math.min(i * 0.02, 0.12), ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedReceipt(rec)}
            >
              <ReceiptTicket
                merchant={rec.merchant}
                merchantLogo={rec.merchantLogo}
                amount={rec.amount}
                currency={rec.currency}
                date={rec.date}
                category={CATEGORY_LABELS[rec.category] || rec.category}
                orderId={rec.id}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Print Preview Modal */}
      <Modal
        isOpen={showPrintPreview && !!selectedReceipt}
        onClose={() => setShowPrintPreview(false)}
        title="Fiş Önizleme"
        maxWidth="2xl"
      >
        {selectedReceipt && (
          <div className="min-h-[600px] flex items-center justify-center">
            <ReceiptPrintPreview 
              receipt={selectedReceipt}
              onPrintComplete={() => showToast('Fiş yazdırıldı', 'print')}
            />
          </div>
        )}
      </Modal>

      {/* Receipt Detail Modal */}
      <Modal
        isOpen={!!selectedReceipt && !showPrintPreview && !editingReceipt}
        onClose={() => setSelectedReceipt(null)}
        title={selectedReceipt?.merchant}
        subtitle={selectedReceipt ? formatDate(selectedReceipt.date) : ''}
        maxWidth="md"
      >
        {selectedReceipt && (
          <div className="space-y-5">
            {/* Merchant Header with Brand Logo */}
            <div className="flex items-center gap-3.5 pb-3 border-b border-border/40">
              <BrandAvatar
                name={selectedReceipt.merchant}
                brand={selectedReceipt.merchant}
                imageUrl={selectedReceipt.merchantLogo}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-primary tracking-tight capitalize truncate">
                  {selectedReceipt.merchant}
                </h3>
                <p className="text-xs text-secondary font-medium mt-0.5">
                  {formatDate(selectedReceipt.date)}
                </p>
              </div>
            </div>

            {/* Amount and Category */}
            <div className="flex items-center justify-between p-5 bg-surface/60 rounded-2xl border border-border/60">
              <div>
                <p className="text-[11px] font-bold text-secondary uppercase tracking-[1.5px]">Tutar</p>
                <p className="text-2xl font-bold text-primary tabular-nums mt-1">
                  {formatCurrency(selectedReceipt.amount, selectedReceipt.currency)}
                </p>
              </div>
              <Badge variant="muted" size="sm" className="rounded-full px-3 py-1 font-semibold">
                {CATEGORY_LABELS[selectedReceipt.category] || selectedReceipt.category}
              </Badge>
            </div>

            {/* Receipt Image if available */}
            {selectedReceipt.receiptUrl && (
              <div className="h-56 rounded-2xl overflow-hidden border border-border/60 bg-surface shadow-inner">
                <img
                  src={selectedReceipt.receiptUrl}
                  alt={`${selectedReceipt.merchant} fişi`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Notes if available */}
            {selectedReceipt.notes && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-secondary uppercase tracking-[1.5px]">Notlar</p>
                <p className="text-sm text-primary px-5 py-4 bg-surface/50 rounded-2xl border border-border/60 leading-relaxed font-medium">
                  {selectedReceipt.notes}
                </p>
              </div>
            )}

            {/* Clean, Transparent, Minimal Action Footer (NO bulky background!) */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              {/* Left Actions: Delete & Edit (Minimal Ghost Buttons) */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => handleDeleteReceipt(selectedReceipt.id)}
                  className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl px-3 py-2 border-0 bg-transparent"
                >
                  Sil
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Pencil className="w-4 h-4" />}
                  onClick={() => handleOpenEdit(selectedReceipt)}
                  className="text-secondary hover:text-primary hover:bg-surface rounded-xl px-3 py-2 border-0 bg-transparent"
                >
                  Düzenle
                </Button>
              </div>

              {/* Right Actions: Print & Close */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Printer className="w-4 h-4" />}
                  onClick={() => setShowPrintPreview(true)}
                  className="text-secondary hover:text-primary hover:bg-surface rounded-xl px-3 py-2 border-0 bg-transparent"
                >
                  Yazdır
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl px-5 bg-surface/60 hover:bg-surface border border-border/60"
                  onClick={() => setSelectedReceipt(null)}
                >
                  Tamam
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Receipt Modal */}
      <Modal
        isOpen={!!editingReceipt}
        onClose={() => setEditingReceipt(null)}
        title="Fişi Düzenle"
        subtitle="Fiş ve harcama bilgilerini güncelleyin"
        maxWidth="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          {editError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl">
              {editError}
            </div>
          )}

          {/* Merchant */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-secondary">Mağaza / Firma</label>
              <LiveBrandBadge text={editMerchant} />
            </div>
            <Input
              placeholder="Örn. Apple Store, Migros, Trendyol, Zara..."
              value={editMerchant}
              onChange={e => setEditMerchant(e.target.value)}
              className="rounded-xl bg-surface/50 border-border/60"
            />
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-secondary">Tutar</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={editAmount}
                onChange={e => setEditAmount(e.target.value)}
                className="rounded-xl bg-surface/50 border-border/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-secondary">Birim</label>
              <select
                value={editCurrency}
                onChange={e => setEditCurrency(e.target.value)}
                className="w-full h-12 px-3 rounded-xl bg-surface/50 border border-border/60 text-primary text-sm font-medium focus:outline-none focus:border-accent"
              >
                {CURRENCIES.map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-secondary">Kategori</label>
              <select
                value={editCategory}
                onChange={e => setEditCategory(e.target.value as ReceiptItem['category'])}
                className="w-full h-12 px-3 rounded-xl bg-surface/50 border border-border/60 text-primary text-sm font-medium focus:outline-none focus:border-accent"
              >
                {CATEGORIES.filter(c => c !== 'Hepsi').map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-secondary">Tarih</label>
              <Input
                type="date"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
                className="rounded-xl bg-surface/50 border-border/60"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-secondary">Notlar (İsteğe bağlı)</label>
            <textarea
              rows={3}
              placeholder="Fiş hakkında ek detaylar..."
              value={editNotes}
              onChange={e => setEditNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface/50 border border-border/60 text-primary text-sm placeholder:text-secondary/50 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
            <Button
              type="button"
              variant="ghost"
              size="md"
              className="rounded-xl px-5"
              onClick={() => setEditingReceipt(null)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="rounded-xl px-6 bg-accent text-white hover:bg-accent/90"
            >
              Kaydet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReceiptsScreen;
