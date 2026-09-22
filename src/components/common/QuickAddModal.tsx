import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, ReceiptText, CreditCard, ShieldCheck, StickyNote, Bookmark,
  X, ArrowLeft, Check, Upload, Calendar, Tag, DollarSign,
  Link2, PenLine, ChevronRight, Store, Plus, AlertCircle
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { VaultStorageService } from '../../services/vaultStorage';
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

/* ─────────────── Type Config ─────────────── */

interface TypeConfig {
  id: VaultCategory;
  label: string;
  hint: string;
  icon: React.ReactElement;
}

const TYPES: TypeConfig[] = [
  {
    id: 'receipt',
    label: 'Fiş',
    hint: 'Satın alım ve harcama',
    icon: <ReceiptText className="w-5 h-5 stroke-[1.8]" />,
  },
  {
    id: 'warranty',
    label: 'Garanti',
    hint: 'Ürün koruması',
    icon: <ShieldCheck className="w-5 h-5 stroke-[1.8]" />,
  },
  {
    id: 'subscription',
    label: 'Abonelik',
    hint: 'Aylık veya yıllık hizmet',
    icon: <CreditCard className="w-5 h-5 stroke-[1.8]" />,
  },
  {
    id: 'document',
    label: 'Belge',
    hint: 'Dosya ve evrak kayıtları',
    icon: <FileText className="w-5 h-5 stroke-[1.8]" />,
  },
  {
    id: 'note',
    label: 'Not',
    hint: 'Hızlı bilgi ve notlar',
    icon: <StickyNote className="w-5 h-5 stroke-[1.8]" />,
  },
  {
    id: 'bookmark',
    label: 'Yer İmi',
    hint: 'Web sitesi kaydet',
    icon: <Bookmark className="w-5 h-5 stroke-[1.8]" />,
  },
];

/* ─────────────── Helpers ─────────────── */

const getTodayISO = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().split('T')[0];
};

/* ─────────────── Field Components ─────────────── */

interface FieldLabelProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  right?: React.ReactNode;
}

const FieldLabel: React.FC<FieldLabelProps> = ({ icon, children, right }) => (
  <div className="flex items-center justify-between mb-1.5">
    <label className="text-xs font-medium text-secondary/80 flex items-center gap-1.5">
      {icon && <span className="text-secondary/60">{icon}</span>}
      {children}
    </label>
    {right}
  </div>
);

const fieldClass = cn(
  "w-full h-11 text-sm text-primary font-normal",
  "bg-surface/50 dark:bg-white/[0.04]",
  "rounded-xl border border-border/60 dark:border-white/[0.08]",
  "px-3.5 transition-all duration-200",
  "placeholder:text-secondary/35",
  "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15",
  "hover:border-border/90 dark:hover:border-white/15"
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialType = 'receipt',
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<VaultCategory>(initialType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  /* Reset on open */
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setAmount('');
      setPrice('');
      setBrand('');
      setUrl('');
      setContent('');
      setExpiryDate('');
      setCategory('');
      setDocumentFile(null);
      setError('');
      setType(initialType);
      setStep(1);
    }
  }, [isOpen, initialType]);

  /* Auto-focus title on step 2 */
  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => titleRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [step]);

  const handleSelectAndProceed = (id: VaultCategory) => {
    setType(id);
    setCategory('');
    setError('');
    if (id !== 'document') setDocumentFile(null);
    triggerHaptic.light();
    setStep(2);
  };

  const goStep1 = () => {
    setStep(1);
    setError('');
    triggerHaptic.light();
  };

  const close = () => onClose();

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      setError('Lütfen bir başlık girin.');
      return;
    }
    if (type === 'document' && !documentFile) {
      setError('Lütfen bir dosya seçin.');
      return;
    }
    if (type === 'document' && documentFile && documentFile.size > 3 * 1024 * 1024) {
      setError('Dosya boyutu en fazla 3 MB olabilir.');
      return;
    }
    if (type === 'receipt' && (!amount || Number(amount) <= 0)) {
      setError('Geçerli bir harcama tutarı girin.');
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
          category: (category || 'Personal') as 'Personal' | 'Finance' | 'Insurance' | 'Vehicle' | 'Identity' | 'Health' | 'Property' | 'Work',
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
          category: (category || 'Services') as 'Tech' | 'Home' | 'Travel' | 'Clothing' | 'Food' | 'Utilities' | 'Services',
          notes: content.trim() || undefined,
        });
      } else if (type === 'subscription') {
        VaultStorageService.saveSubscription({
          name: t,
          price: Number(price),
          currency: 'TRY',
          billingCycle: 'monthly',
          renewalDate: expiryDate,
          category: (category || 'Software') as 'Software' | 'Entertainment' | 'Work' | 'Cloud' | 'Health' | 'Utility',
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
      onSuccess();
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt sırasında bir hata oluştu.');
      triggerHaptic.error();
    } finally {
      setLoading(false);
    }
  };

  const portal = typeof document !== 'undefined' ? document.body : null;
  if (!portal) return null;

  const activeType = TYPES.find(t => t.id === type) || TYPES[0];

  const catOptions: Record<string, [string, string][]> = {
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
      ['Home', 'Ev'],
      ['Travel', 'Seyahat'],
      ['Clothing', 'Giyim'],
      ['Food', 'Yemek'],
      ['Utilities', 'Faturalar'],
      ['Services', 'Hizmetler'],
    ],
    subscription: [
      ['Software', 'Yazılım'],
      ['Entertainment', 'Eğlence'],
      ['Work', 'İş'],
      ['Cloud', 'Bulut'],
      ['Health', 'Sağlık'],
      ['Utility', 'Hizmet'],
    ],
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className={cn(
              "relative w-full max-w-[480px] z-10",
              "bg-surface dark:bg-[#111317]",
              "border border-border/70 dark:border-white/[0.08]",
              "shadow-2xl shadow-black/40",
              "max-h-[92vh] flex flex-col",
              "rounded-t-3xl sm:rounded-3xl overflow-hidden"
            )}
          >
            {/* Mobile drag handle bar */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border/80 dark:bg-white/20" />
            </div>

            {/* Header */}
            <div className="shrink-0 px-6 pt-4 pb-3 flex items-center justify-between border-b border-border/40 dark:border-white/[0.05]">
              <div className="flex items-center gap-3 min-w-0">
                {step === 2 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    type="button"
                    onClick={goStep1}
                    className="p-1.5 -ml-1 rounded-xl text-secondary hover:text-primary hover:bg-surface-elevated/80 dark:hover:bg-white/[0.06] transition-colors"
                    aria-label="Kategorilere Geri Dön"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[2]" />
                  </motion.button>
                )}
                <div>
                  <h2 className="text-base font-semibold text-primary tracking-tight">
                    {step === 1 ? 'Kasaya Ekle' : `${activeType.label} Ekle`}
                  </h2>
                  <p className="text-xs text-secondary/70 mt-0.5">
                    {step === 1
                      ? 'Eklemek istediğin kayıt türünü seç'
                      : 'Kayıt detaylarını doldur ve kasana güvenle ekle'}
                  </p>
                </div>
              </div>

              <button
                onClick={close}
                className="p-2 rounded-xl text-secondary/60 hover:text-primary hover:bg-surface-elevated/80 dark:hover:bg-white/[0.06] transition-colors"
                aria-label="Kapat"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* Content Area with Fluid Animation */}
            <div className="flex-1 overflow-y-auto thin-scrollbar px-6 py-5">
              <AnimatePresence mode="wait">
                {/* ═══ STEP 1: Bento Grid (Backgroundless, Floating Icons) ═══ */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {TYPES.map((t, idx) => (
                        <motion.button
                          key={t.id}
                          type="button"
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.035, duration: 0.25 }}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectAndProceed(t.id)}
                          className={cn(
                            "group relative flex flex-col items-start p-4 rounded-2xl text-left",
                            "border border-border/70 dark:border-white/[0.07]",
                            "bg-surface-elevated/40 dark:bg-white/[0.025]",
                            "hover:bg-surface-elevated dark:hover:bg-white/[0.06]",
                            "hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5",
                            "transition-all duration-200"
                          )}
                        >
                          {/* Pure Floating Icon (Arka Plansız) */}
                          <div className="text-secondary/70 group-hover:text-accent transition-colors duration-200 mb-3.5">
                            {React.cloneElement(t.icon, {
                              className: "w-6 h-6 stroke-[1.8]",
                            })}
                          </div>

                          {/* Label & Description */}
                          <span className="font-medium text-sm text-primary tracking-tight group-hover:text-accent transition-colors">
                            {t.label}
                          </span>
                          <span className="text-[11px] text-secondary/60 leading-tight mt-1 line-clamp-1">
                            {t.hint}
                          </span>

                          {/* Subtle arrow indicator */}
                          <ChevronRight className="absolute right-3.5 bottom-3.5 w-3.5 h-3.5 text-secondary/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ═══ STEP 2: Detail Form with Pure Floating Header Icon ═══ */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    {/* Active Type Indicator (Pure Floating Icon, No Box) */}
                    <div className="flex items-center gap-2.5 pb-2">
                      <div className="text-accent flex items-center">
                        {React.cloneElement(activeType.icon, {
                          className: "w-5 h-5 stroke-[2]",
                        })}
                      </div>
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                        {activeType.label} Bilgileri
                      </span>
                    </div>

                    {/* Error Banner */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2.5 text-xs font-medium text-red-500 flex items-center gap-2"
                          role="alert"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0 stroke-[2]" />
                          <span>{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                      {/* Title / Name */}
                      <div>
                        <FieldLabel
                          icon={type === 'receipt' ? <Store className="w-3.5 h-3.5 stroke-[1.8]" /> : <PenLine className="w-3.5 h-3.5 stroke-[1.8]" />}
                          right={<LiveBrandBadge text={title || brand} />}
                        >
                          {type === 'receipt'
                            ? 'Mağaza / Satıcı'
                            : type === 'warranty'
                            ? 'Ürün Adı'
                            : type === 'subscription'
                            ? 'Hizmet Adı'
                            : 'Başlık'}
                        </FieldLabel>
                        <input
                          ref={titleRef}
                          className={fieldClass}
                          placeholder={
                            type === 'receipt'
                              ? 'Örn. Apple, Migros, Amazon'
                              : type === 'subscription'
                              ? 'Örn. Spotify, Netflix, YouTube'
                              : type === 'warranty'
                              ? 'Örn. iPhone 15 Pro, Dyson V15'
                              : type === 'document'
                              ? 'Örn. Pasaport, Araç Ruhsatı'
                              : type === 'note'
                              ? 'Örn. Wi-Fi Şifresi, Alışveriş Listesi'
                              : 'Örn. İlham Verici Tasarım Sitesi'
                          }
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          required
                        />
                      </div>

                      {/* Category Selection */}
                      {catOptions[type] && (
                        <div>
                          <FieldLabel icon={<Tag className="w-3.5 h-3.5 stroke-[1.8]" />}>Kategori</FieldLabel>
                          <div className="relative">
                            <select
                              value={category}
                              onChange={e => setCategory(e.target.value)}
                              className={cn(fieldClass, "appearance-none pr-9 cursor-pointer")}
                            >
                              <option value="">Seçiniz</option>
                              {catOptions[type].map(([val, label]) => (
                                <option key={val} value={val}>
                                  {label}
                                </option>
                              ))}
                            </select>
                            <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 rotate-90 pointer-events-none stroke-[2]" />
                          </div>
                        </div>
                      )}

                      {/* Amount — Receipt */}
                      {type === 'receipt' && (
                        <div>
                          <FieldLabel icon={<DollarSign className="w-3.5 h-3.5 stroke-[1.8]" />}>Tutar</FieldLabel>
                          <div className="relative">
                            <input
                              type="number"
                              step="any"
                              placeholder="0.00"
                              className={cn(fieldClass, "pr-12 font-medium")}
                              value={amount}
                              onChange={e => setAmount(e.target.value)}
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-secondary/50">
                              TL
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Price — Subscription */}
                      {type === 'subscription' && (
                        <div>
                          <FieldLabel icon={<DollarSign className="w-3.5 h-3.5 stroke-[1.8]" />}>Aylık Ücret</FieldLabel>
                          <div className="relative">
                            <input
                              type="number"
                              step="any"
                              placeholder="0.00"
                              className={cn(fieldClass, "pr-16 font-medium")}
                              value={price}
                              onChange={e => setPrice(e.target.value)}
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-secondary/50">
                              TL / ay
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Brand — Warranty */}
                      {type === 'warranty' && (
                        <div>
                          <FieldLabel
                            icon={<Store className="w-3.5 h-3.5 stroke-[1.8]" />}
                            right={<LiveBrandBadge text={brand} />}
                          >
                            Marka
                          </FieldLabel>
                          <input
                            placeholder="Örn. Apple, Samsung, Sony"
                            className={fieldClass}
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                            required
                          />
                        </div>
                      )}

                      {/* Dates — Subscription / Warranty */}
                      {(type === 'subscription' || type === 'warranty') && (
                        <div>
                          <FieldLabel icon={<Calendar className="w-3.5 h-3.5 stroke-[1.8]" />}>
                            {type === 'subscription' ? 'Sıradaki Yenileme' : 'Garanti Bitiş Tarihi'}
                          </FieldLabel>
                          <input
                            type="date"
                            className={fieldClass}
                            value={expiryDate}
                            onChange={e => setExpiryDate(e.target.value)}
                            required
                          />
                        </div>
                      )}

                      {/* Document File Uploader (Arka Plansız İkon, Modern Hatlar) */}
                      {type === 'document' && (
                        <div>
                          <FieldLabel icon={<Upload className="w-3.5 h-3.5 stroke-[1.8]" />}>Dosya Ekle</FieldLabel>
                          <label
                            className={cn(
                              "flex flex-col items-center justify-center p-4 rounded-xl border border-dashed cursor-pointer transition-all duration-200",
                              documentFile
                                ? "border-accent/40 bg-accent/[0.04]"
                                : "border-border/80 dark:border-white/10 hover:border-accent/30 hover:bg-surface-elevated/40"
                            )}
                          >
                            <input
                              type="file"
                              accept="application/pdf,image/*,.doc,.docx"
                              className="hidden"
                              onChange={ev => setDocumentFile(ev.target.files?.[0] || null)}
                            />
                            {documentFile ? (
                              <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-accent stroke-[2.5]" />
                                <div className="text-left">
                                  <p className="text-xs font-medium text-primary line-clamp-1">{documentFile.name}</p>
                                  <p className="text-[10px] text-secondary/60">
                                    {(documentFile.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-1">
                                <Upload className="w-5 h-5 text-secondary/60 mx-auto mb-1.5 stroke-[1.8]" />
                                <p className="text-xs font-medium text-primary">Dosya seç veya buraya bırak</p>
                                <p className="text-[10px] text-secondary/50 mt-0.5">PDF, görsel veya Word · maks 3 MB</p>
                              </div>
                            )}
                          </label>
                        </div>
                      )}

                      {/* Bookmark URL */}
                      {type === 'bookmark' && (
                        <div>
                          <FieldLabel icon={<Link2 className="w-3.5 h-3.5 stroke-[1.8]" />}>Web Adresi (URL)</FieldLabel>
                          <input
                            type="url"
                            placeholder="https://..."
                            className={fieldClass}
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            required
                          />
                        </div>
                      )}

                      {/* Notes / Content Area */}
                      {(type === 'document' || type === 'note' || type === 'receipt') && (
                        <div>
                          <FieldLabel icon={<PenLine className="w-3.5 h-3.5 stroke-[1.8]" />}>
                            {type === 'note' ? 'İçerik' : 'Ek Notlar'}
                          </FieldLabel>
                          <textarea
                            className={cn(
                              "w-full h-20 text-sm text-primary font-normal",
                              "bg-surface/50 dark:bg-white/[0.04]",
                              "rounded-xl border border-border/60 dark:border-white/[0.08]",
                              "px-3.5 py-2.5 resize-none transition-all duration-200",
                              "placeholder:text-secondary/35",
                              "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
                            )}
                            placeholder={type === 'note' ? 'Notunu buraya yaz...' : 'İsteğe bağlı ek açıklama veya not...'}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            required={type === 'note'}
                          />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2.5 pt-3">
                        <button
                          type="button"
                          onClick={goStep1}
                          className="flex-1 h-11 rounded-xl text-sm font-medium text-secondary border border-border/70 dark:border-white/[0.08] hover:bg-surface-elevated hover:text-primary transition-all active:scale-[0.98]"
                        >
                          Geri
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className={cn(
                            "flex-[2] h-11 rounded-xl text-sm font-semibold text-white",
                            "bg-accent hover:bg-accent/90 shadow-md shadow-accent/20",
                            "transition-all active:scale-[0.98]",
                            "disabled:opacity-40 disabled:pointer-events-none",
                            "flex items-center justify-center gap-2"
                          )}
                        >
                          {loading ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 stroke-[2.5]" />
                              Kasaya Ekle
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    portal
  );
};
