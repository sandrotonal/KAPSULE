import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, ReceiptText, CreditCard, ShieldCheck, StickyNote, Bookmark,
  X, Check, Upload, Calendar, Tag, DollarSign,
  Link2, PenLine, Store, Plus, AlertCircle, Camera, Trash2, ArrowUpRight
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { VaultStorageService } from '../../services/vaultStorage';
import { NativeCameraService } from '../../services/nativeCamera';
import { dataURLtoFile } from '../../utils/fileUtils';
import { VaultCategory } from '../../types';
import { cn } from '../../lib/utils';
import { LiveBrandBadge } from '../ui/BrandAvatar';
import { triggerHaptic } from '../../utils/haptics';

export interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialType?: VaultCategory;
}

interface TypeTab {
  id: VaultCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TYPE_TABS: TypeTab[] = [
  { id: 'receipt', label: 'Fiş', icon: ReceiptText },
  { id: 'warranty', label: 'Garanti', icon: ShieldCheck },
  { id: 'subscription', label: 'Abonelik', icon: CreditCard },
  { id: 'document', label: 'Belge', icon: FileText },
  { id: 'note', label: 'Not', icon: StickyNote },
  { id: 'bookmark', label: 'Yer İmi', icon: Bookmark },
];

const getTodayISO = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().split('T')[0];
};

const CATEGORY_OPTIONS: Record<string, [string, string][]> = {
  document: [
    ['Personal', 'Kişisel'],
    ['Finance', 'Finans'],
    ['Insurance', 'Sigorta'],
    ['Identity', 'Kimlik'],
    ['Health', 'Sağlık'],
    ['Property', 'Mülk'],
    ['Work', 'İş'],
  ],
  receipt: [
    ['Tech', 'Teknoloji'],
    ['Home', 'Ev & Yaşam'],
    ['Travel', 'Seyahat'],
    ['Clothing', 'Giyim'],
    ['Food', 'Gıda & Yemek'],
    ['Utilities', 'Faturalar'],
    ['Services', 'Hizmetler'],
  ],
  subscription: [
    ['Software', 'Yazılım'],
    ['Entertainment', 'Eğlence'],
    ['Work', 'İş & Üretkenlik'],
    ['Cloud', 'Bulut Depolama'],
    ['Health', 'Sağlık & Yaşam'],
    ['Utility', 'Genel Hizmet'],
  ],
};

const AMOUNT_PRESETS = ['50', '100', '250', '500', '1000'];

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialType = 'receipt',
}) => {
  const [type, setType] = useState<VaultCategory>(initialType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [receiptPhotoPreview, setReceiptPhotoPreview] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const receiptFileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize initialType when opening directly into context
  useEffect(() => {
    if (!isOpen) return;

    setType(initialType);
    setTitle('');
    setAmount('');
    setPrice('');
    setBrand('');
    setUrl('');
    setContent('');
    setExpiryDate('');
    setCategory('');
    setDocumentFile(null);
    setReceiptPhotoPreview(null);
    setError('');

    // Auto-focus appropriate input after spring animation settles
    const timer = setTimeout(() => {
      if (titleInputRef.current && (initialType !== 'receipt' && initialType !== 'subscription')) {
        titleInputRef.current.focus();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isOpen, initialType]);

  // Handle ESC key press to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleTabChange = (newType: VaultCategory) => {
    triggerHaptic.light();
    setType(newType);
    setError('');
  };

  const handleCapturePhoto = async (target: 'document' | 'receipt') => {
    triggerHaptic.medium();
    setError('');
    const res = await NativeCameraService.capturePhoto('camera');
    if (res.success && res.dataUrl) {
      if (target === 'document') {
        const file = dataURLtoFile(res.dataUrl, `belge_${Date.now()}.jpg`);
        setDocumentFile(file);
      } else {
        setReceiptPhotoPreview(res.dataUrl);
      }
      triggerHaptic.success();
    } else if (res.errorMessage) {
      setError(res.errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();

    if (!t) {
      setError('Lütfen bir başlık veya isim belirtin.');
      return;
    }
    if (type === 'document' && !documentFile) {
      setError('Lütfen bir dosya seçin veya kamerayla belge çekin.');
      return;
    }
    if (type === 'document' && documentFile && documentFile.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu en fazla 5 MB olabilir.');
      return;
    }
    if (type === 'receipt' && (!amount || Number(amount) <= 0)) {
      setError('Lütfen geçerli bir harcama tutarı girin.');
      return;
    }
    if (type === 'subscription' && (!price || Number(price) <= 0 || !expiryDate)) {
      setError('Abonelik ücreti ve sıradaki yenileme tarihini girin.');
      return;
    }
    if (type === 'warranty' && (!brand.trim() || !expiryDate)) {
      setError('Marka ve garanti bitiş tarihini girin.');
      return;
    }
    if (type === 'note' && !content.trim()) {
      setError('Lütfen not içeriği yazın.');
      return;
    }

    let normalizedUrl = '';
    if (type === 'bookmark') {
      try {
        normalizedUrl = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
        new URL(normalizedUrl);
      } catch {
        setError('Geçerli bir web adresi (URL) girin.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const now = getTodayISO();

      if (type === 'document') {
        const previewUrl = await new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(String(r.result));
          r.onerror = () => rej(new Error('Dosya okunamadı.'));
          r.readAsDataURL(documentFile!);
        });

        const ft = documentFile!.type.startsWith('image/')
          ? 'img'
          : documentFile!.type.includes('word')
          ? 'doc'
          : 'pdf';

        VaultStorageService.saveDocument({
          title: t,
          category: (category || 'Personal') as any,
          fileType: ft,
          fileSize: `${(documentFile!.size / 1024 / 1024).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} MB`,
          previewUrl,
          tags: [],
          description: content.trim() || undefined,
          isFavorite: false,
          isArchived: false,
        });
      } else if (type === 'receipt') {
        VaultStorageService.saveReceipt({
          merchant: t,
          amount: Number(amount),
          currency: 'TRY',
          date: now,
          category: (category || 'Services') as any,
          notes: content.trim() || undefined,
          receiptUrl: receiptPhotoPreview || undefined,
        });
      } else if (type === 'subscription') {
        VaultStorageService.saveSubscription({
          name: t,
          price: Number(price),
          currency: 'TRY',
          billingCycle: 'monthly',
          renewalDate: expiryDate,
          category: (category || 'Software') as any,
          status: 'active',
        });
      } else if (type === 'warranty') {
        VaultStorageService.saveWarranty({
          productName: t,
          brand: brand.trim(),
          purchaseDate: now,
          expiryDate,
          status: 'active',
        });
      } else if (type === 'note') {
        VaultStorageService.saveNote({
          title: t,
          content: content.trim(),
          tags: [],
          isPinned: false,
        });
      } else if (type === 'bookmark') {
        VaultStorageService.saveBookmark({
          title: t,
          url: normalizedUrl,
          domain: new URL(normalizedUrl).hostname,
          tags: [],
        });
      }

      triggerHaptic.success();
      onClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt sırasında bir hata oluştu.');
      triggerHaptic.error();
    } finally {
      setLoading(false);
    }
  };

  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return undefined;
    }
    const timer = setTimeout(() => {
      setShouldRender(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (typeof document === 'undefined' || (!isOpen && !shouldRender)) return null;

  return createPortal(
    <AnimatePresence mode="wait" onExitComplete={() => setShouldRender(false)}>
      {isOpen && (
        <motion.div
          key="quick-add-modal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className={cn(
            "fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 select-none",
            !isOpen && "pointer-events-none"
          )}
          style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop with Silky Blur */}
          <div
            onClick={() => {
              triggerHaptic.light();
              onClose();
            }}
            className={cn(
              "fixed inset-0 bg-black/40 dark:bg-black/75 backdrop-blur-md",
              !isOpen && "pointer-events-none"
            )}
          />

          {/* Luxury Sheet Container */}
          <motion.div
            key="quick-add-sheet-container"
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              "relative w-full max-w-lg z-10 max-h-[92vh] flex flex-col",
              "bg-white dark:bg-[#0c0d11]",
              "border-t border-x sm:border border-zinc-200/90 dark:border-white/[0.08]",
              "shadow-[0_-20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_-25px_60px_rgba(0,0,0,0.85)]",
              "rounded-t-[32px] sm:rounded-3xl overflow-hidden"
            )}
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Mobile Drag Handle */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 rounded-full bg-zinc-300 dark:bg-white/20" />
            </div>

            {/* Header */}
            <div className="shrink-0 px-6 pt-3 pb-3 flex items-center justify-between border-b border-zinc-100 dark:border-white/[0.05]">
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-white tracking-tight">
                  Kasaya Ekle
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Çevrimdışı güvenli yerel depolama
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic.light();
                  onClose();
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Kapat"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* ─── Fluid Animated Category Segmented Bar ─── */}
            <div className="px-6 pt-3 pb-1 shrink-0">
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-100/90 dark:bg-white/[0.04] border border-zinc-200/60 dark:border-white/[0.06] overflow-x-auto no-scrollbar">
                {TYPE_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = type === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabChange(tab.id)}
                      className={cn(
                        "relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0",
                        isActive
                          ? "text-zinc-950 dark:text-white font-semibold"
                          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="quickAddActivePill"
                          className="absolute inset-0 rounded-xl bg-white dark:bg-white/[0.12] shadow-sm border border-black/[0.04] dark:border-white/10"
                          transition={{ type: 'spring', damping: 26, stiffness: 380 }}
                        />
                      )}
                      <span className="relative z-10">
                        <Icon className={cn("w-3.5 h-3.5 stroke-[2]", isActive ? "text-zinc-950 dark:text-white" : "text-zinc-400 dark:text-zinc-500")} />
                      </span>
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto thin-scrollbar px-6 py-4 space-y-4">
              {/* Error Banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2.5 text-xs font-medium text-red-500 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 stroke-[2]" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ═══ 1. HERO AMOUNT DISPLAY (Fiş & Abonelik İçin) ═══ */}
                {(type === 'receipt' || type === 'subscription') && (
                  <div className="flex flex-col items-center justify-center py-4 px-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.025] border border-zinc-200/70 dark:border-white/[0.06]">
                    <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
                      {type === 'receipt' ? 'Harcama Tutarı' : 'Aylık Ücret'}
                    </span>
                    <div className="flex items-center justify-center gap-1.5 my-1">
                      <span className="text-2xl font-light text-zinc-400 dark:text-zinc-500">₺</span>
                      <input
                        type="number"
                        step="any"
                        placeholder="0.00"
                        autoFocus
                        className="w-48 text-3xl sm:text-4xl font-mono font-semibold text-center bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 focus:outline-none"
                        value={type === 'receipt' ? amount : price}
                        onChange={(e) => {
                          if (type === 'receipt') setAmount(e.target.value);
                          else setPrice(e.target.value);
                        }}
                      />
                    </div>
                    {/* Fast Preset Chips */}
                    <div className="flex items-center gap-1.5 mt-2.5">
                      {AMOUNT_PRESETS.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            triggerHaptic.light();
                            if (type === 'receipt') setAmount(val);
                            else setPrice(val);
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-white dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.08] text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/20 active:scale-95 transition-all shadow-2xs"
                        >
                          +₺{val}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ═══ 2. TITLE / MERCHANT / BRAND ═══ */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      {type === 'receipt' ? <Store className="w-3.5 h-3.5 text-zinc-400" /> : <PenLine className="w-3.5 h-3.5 text-zinc-400" />}
                      <span>
                        {type === 'receipt'
                          ? 'Mağaza / Satıcı'
                          : type === 'warranty'
                          ? 'Ürün Adı'
                          : type === 'subscription'
                          ? 'Hizmet Adı'
                          : 'Başlık'}
                      </span>
                    </label>
                    <LiveBrandBadge text={title || brand} />
                  </div>
                  <input
                    ref={titleInputRef}
                    type="text"
                    required
                    placeholder={
                      type === 'receipt'
                        ? 'Örn. Apple Store, Migros, Amazon'
                        : type === 'subscription'
                        ? 'Örn. Spotify, Netflix, iCloud'
                        : type === 'warranty'
                        ? 'Örn. iPhone 16 Pro, Dyson V15'
                        : type === 'document'
                        ? 'Örn. Pasaport, Araç Ruhsatı'
                        : type === 'note'
                        ? 'Örn. Wi-Fi Şifresi, Kasa Notu'
                        : 'Örn. Web Sitesi Başlığı'
                    }
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-11 px-3.5 text-sm bg-zinc-50 dark:bg-white/[0.035] border border-zinc-200/80 dark:border-white/[0.08] rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:bg-white dark:focus:bg-white/[0.06] transition-all"
                  />
                </div>

                {/* ═══ 3. BRAND & EXPIRY (Warranty) ═══ */}
                {type === 'warranty' && (
                  <div>
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">
                      Marka / Üretici
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn. Apple, Sony, Dyson"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm bg-zinc-50 dark:bg-white/[0.035] border border-zinc-200/80 dark:border-white/[0.08] rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
                    />
                  </div>
                )}

                {/* ═══ 4. DATES (Subscription & Warranty) ═══ */}
                {(type === 'subscription' || type === 'warranty') && (
                  <div>
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mb-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{type === 'subscription' ? 'Sıradaki Yenileme Tarihi' : 'Garanti Bitiş Tarihi'}</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm bg-zinc-50 dark:bg-white/[0.035] border border-zinc-200/80 dark:border-white/[0.08] rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
                    />
                  </div>
                )}

                {/* ═══ 5. CATEGORY SELECTION ═══ */}
                {CATEGORY_OPTIONS[type] && (
                  <div>
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mb-1.5">
                      <Tag className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Kategori</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-700/80 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-400 transition-all cursor-pointer"
                    >
                      <option value="" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Kategori Seçiniz</option>
                      {CATEGORY_OPTIONS[type].map(([val, label]) => (
                        <option key={val} value={val} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* ═══ 6. PHOTO / SCANNER (Fiş İçin) ═══ */}
                {type === 'receipt' && (
                  <div>
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mb-1.5">
                      <Camera className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Fiş Görseli / Makbuz</span>
                    </label>
                    {receiptPhotoPreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 group bg-zinc-900">
                        <img
                          src={receiptPhotoPreview}
                          alt="Fiş Önizleme"
                          className="w-full h-36 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic.light();
                            setReceiptPhotoPreview(null);
                          }}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-500 transition-colors shadow-md"
                          title="Fotoğrafı Kaldır"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleCapturePhoto('receipt')}
                          className="flex items-center justify-center gap-2 h-12 px-3 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-white/20 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-all active:scale-[0.98]"
                        >
                          <Camera className="w-4 h-4 stroke-[1.8] text-zinc-600 dark:text-zinc-300" />
                          <span>Kamera ile Çek</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => receiptFileInputRef.current?.click()}
                          className="flex items-center justify-center gap-2 h-12 px-3 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-white/20 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-all active:scale-[0.98]"
                        >
                          <Upload className="w-4 h-4 stroke-[1.8] text-zinc-600 dark:text-zinc-300" />
                          <span>Galeriden Seç</span>
                        </button>
                        <input
                          ref={receiptFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const r = new FileReader();
                              r.onload = (ev) => setReceiptPhotoPreview(String(ev.target?.result));
                              r.readAsDataURL(f);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* ═══ 7. DOCUMENT UPLOADER & SCANNER ═══ */}
                {type === 'document' && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Belge Dosyası</span>
                    </label>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleCapturePhoto('document')}
                        className="flex items-center justify-center gap-2 h-11 px-3 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-white/20 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-all active:scale-[0.98]"
                      >
                        <Camera className="w-4 h-4 stroke-[1.8] text-zinc-600 dark:text-zinc-300" />
                        <span>Kamerayla Tara</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 h-11 px-3 rounded-2xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-white/20 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-all active:scale-[0.98]"
                      >
                        <Upload className="w-4 h-4 stroke-[1.8] text-zinc-600 dark:text-zinc-300" />
                        <span>Dosya Seç</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf,image/*,.doc,.docx"
                      className="hidden"
                      onChange={(ev) => setDocumentFile(ev.target.files?.[0] || null)}
                    />

                    {documentFile && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-100/80 dark:bg-white/[0.04] border border-zinc-200/80 dark:border-white/[0.08]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-zinc-900 dark:text-white truncate">
                              {documentFile.name}
                            </p>
                            <p className="text-[10px] text-zinc-400">
                              {(documentFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDocumentFile(null)}
                          className="text-xs text-red-500 hover:underline p-1"
                        >
                          Kaldır
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ═══ 8. BOOKMARK URL ═══ */}
                {type === 'bookmark' && (
                  <div>
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mb-1.5">
                      <Link2 className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Web Adresi (URL)</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm bg-zinc-50 dark:bg-white/[0.035] border border-zinc-200/80 dark:border-white/[0.08] rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-all font-mono text-xs"
                    />
                  </div>
                )}

                {/* ═══ 9. NOTES & DETAILS ═══ */}
                {(type === 'document' || type === 'note' || type === 'receipt') && (
                  <div>
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 mb-1.5">
                      <PenLine className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{type === 'note' ? 'Not İçeriği' : 'Ek Açıklama (İsteğe Bağlı)'}</span>
                    </label>
                    <textarea
                      required={type === 'note'}
                      placeholder={type === 'note' ? 'Notunuzu buraya yazın...' : 'Eklemek istediğiniz notlar veya detaylar...'}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-20 p-3.5 text-sm bg-zinc-50 dark:bg-white/[0.035] border border-zinc-200/80 dark:border-white/[0.08] rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-white resize-none transition-all"
                    />
                  </div>
                )}

                {/* ═══ 10. SUBMIT BUTTON (MONOCHROME LUXURY) ═══ */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      "w-full h-12 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98]",
                      "bg-zinc-900 text-white hover:bg-zinc-800 shadow-md",
                      "dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 dark:shadow-white/5",
                      "disabled:opacity-40 disabled:pointer-events-none",
                      "flex items-center justify-center gap-2"
                    )}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Kasaya Kaydet</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
