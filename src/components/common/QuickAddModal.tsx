import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Receipt, CreditCard, ShieldCheck, StickyNote, Bookmark,
  X, ArrowLeft, Check, Upload, Calendar, Tag, DollarSign,
  Link2, PenLine, ChevronRight, Store, Plus
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
  icon: React.ReactNode;
}

const TYPES: TypeConfig[] = [
  { id: 'receipt',      label: 'Fiş',       hint: 'Satın alım ve harcama',    icon: <Receipt className="w-[18px] h-[18px]" /> },
  { id: 'warranty',     label: 'Garanti',    hint: 'Ürün koruması',            icon: <ShieldCheck className="w-[18px] h-[18px]" /> },
  { id: 'subscription', label: 'Abonelik',   hint: 'Aylık veya yıllık hizmet', icon: <CreditCard className="w-[18px] h-[18px]" /> },
  { id: 'document',     label: 'Belge',      hint: 'Dosya ve evrak kayıtları', icon: <FileText className="w-[18px] h-[18px]" /> },
  { id: 'note',         label: 'Not',        hint: 'Hızlı bilgi ve notlar',    icon: <StickyNote className="w-[18px] h-[18px]" /> },
  { id: 'bookmark',     label: 'Yer İmi',    hint: 'Web sitesi kaydet',        icon: <Bookmark className="w-[18px] h-[18px]" /> },
];

/* ─────────────── Helpers ─────────────── */

const getTodayISO = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().split('T')[0];
};

/* ─────────────── Field Components ─────────────── */

const FieldLabel: React.FC<{ icon?: React.ReactNode; children: React.ReactNode; right?: React.ReactNode }> = ({ icon, children, right }) => (
  <div className="flex items-center justify-between mb-2">
    <label className="text-xs font-medium text-secondary flex items-center gap-1.5">
      {icon && <span className="text-secondary/50">{icon}</span>}
      {children}
    </label>
    {right}
  </div>
);

const fieldClass = cn(
  "w-full h-11 text-sm text-primary font-normal",
  "bg-surface/50 dark:bg-white/[0.04]",
  "rounded-xl border border-border/50 dark:border-white/[0.06]",
  "px-3.5 transition-all duration-150",
  "placeholder:text-secondary/35",
  "focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10",
  "hover:border-border/80 dark:hover:border-white/10",
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen, onClose, onSuccess, initialType = 'receipt',
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
      setTitle(''); setAmount(''); setPrice(''); setBrand('');
      setUrl(''); setContent(''); setExpiryDate(''); setCategory('');
      setDocumentFile(null); setError(''); setType(initialType); setStep(1);
    }
  }, [isOpen, initialType]);

  /* Auto-focus title on step 2 */
  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => titleRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [step]);

  const selectType = (id: VaultCategory) => {
    setType(id); setCategory(''); setError('');
    if (id !== 'document') setDocumentFile(null);
    triggerHaptic.light();
  };

  const goStep2 = () => { setStep(2); triggerHaptic.medium(); };
  const goStep1 = () => { setStep(1); setError(''); triggerHaptic.light(); };
  const close = () => onClose();

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) { setError('Kısa bir başlık gir.'); return; }
    if (type === 'document' && !documentFile) { setError('Dosya seçin.'); return; }
    if (type === 'document' && documentFile && documentFile.size > 3 * 1024 * 1024) { setError('Dosya en fazla 3 MB.'); return; }
    if (type === 'receipt' && (!amount || Number(amount) <= 0)) { setError('Geçerli bir tutar girin.'); return; }
    if (type === 'subscription' && (!price || Number(price) <= 0 || !expiryDate)) { setError('Fiyat ve yenileme tarihi girin.'); return; }
    if (type === 'warranty' && (!brand.trim() || !expiryDate)) { setError('Marka ve bitiş tarihi girin.'); return; }
    if (type === 'note' && !content.trim()) { setError('İçerik girin.'); return; }

    let normalizedUrl = '';
    if (type === 'bookmark') {
      try {
        normalizedUrl = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
        new URL(normalizedUrl);
      } catch { setError('Geçerli bir web adresi girin.'); return; }
    }

    setLoading(true); setError('');
    try {
      const now = getTodayISO();
      if (type === 'document') {
        const previewUrl = await new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(String(r.result));
          r.onerror = () => rej(new Error('Dosya okunamadı.'));
          r.readAsDataURL(documentFile!);
        });
        const ft = documentFile!.type.startsWith('image/') ? 'img' : documentFile!.type.includes('word') ? 'doc' : 'pdf';
        VaultStorageService.saveDocument({
          title: t, category: (category || 'Personal') as 'Personal' | 'Finance' | 'Insurance' | 'Vehicle' | 'Identity' | 'Health' | 'Property' | 'Work',
          fileType: ft, fileSize: `${(documentFile!.size / 1024 / 1024).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} MB`,
          previewUrl, tags: [], description: content.trim() || undefined, isFavorite: false, isArchived: false,
        });
      } else if (type === 'receipt') {
        VaultStorageService.saveReceipt({ merchant: t, amount: Number(amount), currency: 'TRY', date: now, category: (category || 'Services') as 'Tech' | 'Home' | 'Travel' | 'Clothing' | 'Food' | 'Utilities' | 'Services', notes: content.trim() || undefined });
      } else if (type === 'subscription') {
        VaultStorageService.saveSubscription({ name: t, price: Number(price), currency: 'TRY', billingCycle: 'monthly', renewalDate: expiryDate, category: (category || 'Software') as 'Software' | 'Entertainment' | 'Work' | 'Cloud' | 'Health' | 'Utility', status: 'active' });
      } else if (type === 'warranty') {
        VaultStorageService.saveWarranty({ productName: t, brand: brand.trim(), purchaseDate: now, expiryDate, status: 'active' });
      } else if (type === 'note') {
        VaultStorageService.saveNote({ title: t, content: content.trim(), tags: [], isPinned: false });
      } else if (type === 'bookmark') {
        VaultStorageService.saveBookmark({ title: t, url: normalizedUrl, domain: new URL(normalizedUrl).hostname, tags: [] });
      }
      triggerHaptic.success();
      onSuccess();
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir sorun oluştu.');
      triggerHaptic.error();
    } finally {
      setLoading(false);
    }
  };

  const portal = typeof document !== 'undefined' ? document.body : null;
  if (!portal) return null;

  const activeType = TYPES.find(t => t.id === type) || TYPES[0];

  const catOptions: Record<string, [string, string][]> = {
    document: [['Personal','Kişisel'],['Finance','Finans'],['Insurance','Sigorta'],['Identity','Kimlik'],['Health','Sağlık'],['Property','Mülk'],['Work','İş']],
    receipt: [['Tech','Teknoloji'],['Home','Ev'],['Travel','Seyahat'],['Clothing','Giyim'],['Food','Yemek'],['Utilities','Faturalar'],['Services','Hizmetler']],
    subscription: [['Software','Yazılım'],['Entertainment','Eğlence'],['Work','İş'],['Cloud','Bulut'],['Health','Sağlık'],['Utility','Hizmet']],
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
            className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-[2px]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative w-full max-w-[480px] z-10",
              "bg-background border border-border/50 dark:border-white/[0.06]",
              "shadow-xl dark:shadow-black/30",
              "max-h-[90vh] flex flex-col",
              "rounded-t-2xl sm:rounded-2xl overflow-hidden",
            )}
          >
            {/* Mobile drag bar */}
            <div className="sm:hidden flex justify-center pt-2.5 pb-1">
              <div className="w-8 h-1 rounded-full bg-border/60" />
            </div>

            {/* Header */}
            <div className="shrink-0 px-5 pt-4 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                {step === 2 && (
                  <motion.button
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    type="button" onClick={goStep1}
                    className="p-1.5 -ml-1 rounded-lg text-secondary hover:text-primary hover:bg-surface/60 transition-colors"
                    aria-label="Geri"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>
                )}
                <div>
                  <h2 className="text-[15px] font-semibold text-primary leading-tight">
                    {step === 1 ? 'Kasaya Ekle' : `${activeType.label} Ekle`}
                  </h2>
                  <p className="text-[11px] text-secondary/60 mt-0.5 leading-tight">
                    {step === 1 ? 'Ne tür bir kayıt eklemek istiyorsun?' : 'Detayları doldur ve kaydet'}
                  </p>
                </div>
              </div>
              <button onClick={close} className="p-1.5 rounded-lg text-secondary/50 hover:text-primary hover:bg-surface/60 transition-colors" aria-label="Kapat">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step dots */}
            <div className="shrink-0 flex justify-center gap-1.5 pb-3">
              <div className={cn("h-1 rounded-full transition-all duration-300", step === 1 ? "w-5 bg-accent" : "w-1.5 bg-border/60")} />
              <div className={cn("h-1 rounded-full transition-all duration-300", step === 2 ? "w-5 bg-accent" : "w-1.5 bg-border/60")} />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto thin-scrollbar px-5 pb-5">

              {/* ═══ STEP 1 ═══ */}
              {step === 1 && (
                <div className="space-y-2">
                  {TYPES.map((t, i) => {
                    const sel = type === t.id;
                    return (
                      <motion.button
                        key={t.id} type="button"
                        onClick={() => selectType(t.id)}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl text-left",
                          "border transition-all duration-200",
                          sel
                            ? "bg-accent/[0.06] dark:bg-accent/[0.08] border-accent/20 dark:border-accent/15"
                            : "bg-transparent border-transparent hover:bg-surface/50 dark:hover:bg-white/[0.02]"
                        )}
                      >
                        {/* Icon */}
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
                          sel
                            ? "bg-accent text-white"
                            : "bg-surface-elevated/70 dark:bg-white/[0.05] text-secondary"
                        )}>
                          {t.icon}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <span className={cn("block text-sm font-medium transition-colors", sel ? "text-primary" : "text-primary/80")}>{t.label}</span>
                          <span className="block text-[11px] text-secondary/60 leading-tight">{t.hint}</span>
                        </div>

                        {/* Check */}
                        <div className={cn(
                          "w-[18px] h-[18px] rounded-full shrink-0 flex items-center justify-center transition-all duration-200",
                          sel ? "bg-accent text-white" : "border border-border/50 dark:border-white/10"
                        )}>
                          {sel && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                        </div>
                      </motion.button>
                    );
                  })}

                  {/* Continue */}
                  <div className="pt-2">
                    <button
                      type="button" onClick={goStep2}
                      className={cn(
                        "w-full h-11 rounded-xl text-sm font-semibold",
                        "bg-accent text-white",
                        "transition-all duration-200",
                        "hover:bg-accent/90 active:scale-[0.98]",
                        "flex items-center justify-center gap-1.5",
                      )}
                    >
                      Devam Et
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ═══ STEP 2 ═══ */}
              {step === 2 && (
                <div>
                  {/* Type badge */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center">
                      {React.cloneElement(activeType.icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
                    </div>
                    <span className="text-xs font-medium text-accent">{activeType.label}</span>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="rounded-xl bg-red-500/8 dark:bg-red-500/6 border border-red-500/15 px-3.5 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-400 mb-4"
                        role="alert"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                      <FieldLabel
                        icon={type === 'receipt' ? <Store className="w-3.5 h-3.5" /> : <PenLine className="w-3.5 h-3.5" />}
                        right={<LiveBrandBadge text={title || brand} />}
                      >
                        {type === 'receipt' ? 'Mağaza / Satıcı' : type === 'warranty' ? 'Ürün Adı' : type === 'subscription' ? 'Hizmet Adı' : 'Başlık'}
                      </FieldLabel>
                      <input
                        ref={titleRef}
                        className={fieldClass}
                        placeholder={
                          type === 'receipt' ? 'Örn. Apple, Migros, Trendyol' :
                          type === 'subscription' ? 'Örn. Spotify, Netflix' :
                          type === 'warranty' ? 'Örn. iPhone 15, Dyson V15' :
                          type === 'document' ? 'Belge başlığı' :
                          type === 'note' ? 'Not başlığı' : 'Yer imi başlığı'
                        }
                        value={title} onChange={e => setTitle(e.target.value)} required
                      />
                    </div>

                    {/* Category */}
                    {catOptions[type] && (
                      <div>
                        <FieldLabel icon={<Tag className="w-3.5 h-3.5" />}>Kategori</FieldLabel>
                        <div className="relative">
                          <select
                            value={category} onChange={e => setCategory(e.target.value)}
                            className={cn(fieldClass, "appearance-none pr-8")}
                          >
                            <option value="">Seçiniz</option>
                            {catOptions[type].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                          </select>
                          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary/30 rotate-90 pointer-events-none" />
                        </div>
                      </div>
                    )}

                    {/* Amount — receipt */}
                    {type === 'receipt' && (
                      <div>
                        <FieldLabel icon={<DollarSign className="w-3.5 h-3.5" />}>Tutar</FieldLabel>
                        <div className="relative">
                          <input type="number" placeholder="0.00" className={cn(fieldClass, "pr-12")} value={amount} onChange={e => setAmount(e.target.value)} />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-secondary/40">TL</span>
                        </div>
                      </div>
                    )}

                    {/* Price — subscription */}
                    {type === 'subscription' && (
                      <div>
                        <FieldLabel icon={<DollarSign className="w-3.5 h-3.5" />}>Aylık Fiyat</FieldLabel>
                        <div className="relative">
                          <input type="number" placeholder="0.00" className={cn(fieldClass, "pr-16")} value={price} onChange={e => setPrice(e.target.value)} />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-secondary/40">TL / ay</span>
                        </div>
                      </div>
                    )}

                    {/* Brand — warranty */}
                    {type === 'warranty' && (
                      <div>
                        <FieldLabel icon={<Store className="w-3.5 h-3.5" />} right={<LiveBrandBadge text={brand} />}>Marka</FieldLabel>
                        <input placeholder="Örn. Apple, Samsung, Bosch" className={fieldClass} value={brand} onChange={e => setBrand(e.target.value)} required />
                      </div>
                    )}

                    {/* Date — subscription/warranty */}
                    {(type === 'subscription' || type === 'warranty') && (
                      <div>
                        <FieldLabel icon={<Calendar className="w-3.5 h-3.5" />}>
                          {type === 'subscription' ? 'Sıradaki Yenileme' : 'Garanti Bitiş Tarihi'}
                        </FieldLabel>
                        <input type="date" className={fieldClass} value={expiryDate} onChange={e => setExpiryDate(e.target.value)} required />
                      </div>
                    )}

                    {/* File — document */}
                    {type === 'document' && (
                      <div>
                        <FieldLabel icon={<Upload className="w-3.5 h-3.5" />}>Dosya</FieldLabel>
                        <label className={cn(
                          "flex items-center justify-center gap-2 w-full h-20 rounded-xl border border-dashed cursor-pointer transition-all duration-150",
                          documentFile
                            ? "border-accent/30 bg-accent/[0.04]"
                            : "border-border/40 dark:border-white/[0.06] hover:border-accent/20 hover:bg-surface/30"
                        )}>
                          <input type="file" accept="application/pdf,image/*,.doc,.docx" className="hidden" onChange={ev => setDocumentFile(ev.target.files?.[0] || null)} />
                          {documentFile ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-accent" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-primary line-clamp-1">{documentFile.name}</p>
                                <p className="text-[10px] text-secondary/50">{(documentFile.size / 1024 / 1024).toFixed(1)} MB</p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="w-4 h-4 text-secondary/30 mx-auto mb-1" />
                              <p className="text-[11px] text-secondary/50">PDF, görsel veya Word · maks 3 MB</p>
                            </div>
                          )}
                        </label>
                      </div>
                    )}

                    {/* URL — bookmark */}
                    {type === 'bookmark' && (
                      <div>
                        <FieldLabel icon={<Link2 className="w-3.5 h-3.5" />}>Web Adresi</FieldLabel>
                        <input type="url" placeholder="https://..." className={fieldClass} value={url} onChange={e => setUrl(e.target.value)} required />
                      </div>
                    )}

                    {/* Notes / Content */}
                    {(type === 'document' || type === 'note' || type === 'receipt') && (
                      <div>
                        <FieldLabel icon={<PenLine className="w-3.5 h-3.5" />}>{type === 'note' ? 'İçerik' : 'Notlar'}</FieldLabel>
                        <textarea
                          className={cn(
                            "w-full h-20 text-sm text-primary",
                            "bg-surface/50 dark:bg-white/[0.04]",
                            "rounded-xl border border-border/50 dark:border-white/[0.06]",
                            "px-3.5 py-2.5 resize-none transition-all duration-150",
                            "placeholder:text-secondary/35",
                            "focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/10",
                          )}
                          placeholder={type === 'note' ? 'Notunu buraya yaz...' : 'İsteğe bağlı açıklama...'}
                          value={content} onChange={e => setContent(e.target.value)}
                          required={type === 'note'}
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 pt-2">
                      <button
                        type="button" onClick={close}
                        className="flex-1 h-11 rounded-xl text-sm font-medium text-secondary border border-border/40 dark:border-white/[0.06] hover:bg-surface/40 hover:text-primary transition-all duration-150 active:scale-[0.98]"
                      >
                        İptal
                      </button>
                      <button
                        type="submit" disabled={loading}
                        className={cn(
                          "flex-[2] h-11 rounded-xl text-sm font-semibold text-white",
                          "bg-accent hover:bg-accent/90",
                          "transition-all duration-150 active:scale-[0.98]",
                          "disabled:opacity-40 disabled:pointer-events-none",
                          "flex items-center justify-center gap-1.5",
                        )}
                      >
                        {loading ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            Kasaya Ekle
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    portal
  );
};
