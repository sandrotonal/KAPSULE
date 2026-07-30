import React, { useState, useEffect } from 'react';
import { FileText, Receipt, CreditCard, ShieldCheck, StickyNote, Bookmark, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { VaultStorageService } from '../../services/vaultStorage';
import { VaultCategory } from '../../types';
import { cn } from '../../lib/utils';

export interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialType?: VaultCategory;
}

const TYPES: { id: VaultCategory; label: string; icon: React.ReactNode; hint: string }[] = [
    { id: 'document',     label: 'Belge',    icon: <FileText className="w-5 h-5" />,    hint: 'Pasaport, kontrat, poliçe' },
    { id: 'receipt',      label: 'Fiş',     icon: <Receipt className="w-5 h-5" />,     hint: 'Satın alım ve harcama' },
    { id: 'subscription', label: 'Abonelik',icon: <CreditCard className="w-5 h-5" />,  hint: 'Aylık veya yıllık hizmet' },
    { id: 'warranty',     label: 'Garanti',    icon: <ShieldCheck className="w-5 h-5" />, hint: 'Ürün koruması' },
    { id: 'note',         label: 'Not',        icon: <StickyNote className="w-5 h-5" />,  hint: 'Hızlı bilgi' },
    { id: 'bookmark',     label: 'Yer İmi',    icon: <Bookmark className="w-5 h-5" />,    hint: 'Web sitesi kaydet' },
  ];

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onSuccess, initialType = 'document' }) => {
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

  // Modal her açıldığında veya hedef tür değiştiğinde seçili türü senkronla.
  useEffect(() => {
    if (isOpen) setType(initialType);
  }, [isOpen, initialType]);

  const reset = () => {
    setTitle(''); setAmount(''); setPrice('');
    setBrand(''); setUrl(''); setContent(''); setExpiryDate('');
    setCategory('');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    try {
      const now = new Date().toISOString().split('T')[0];
      if (type === 'document') {
        VaultStorageService.saveDocument({
          title, category: (category as any) || 'Kişisel', fileType: 'pdf', fileSize: '—',
          previewUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
          tags: [], description: content, isFavorite: false, isArchived: false,
        });
      } else if (type === 'receipt') {
        VaultStorageService.saveReceipt({
          merchant: title, amount: parseFloat(amount) || 0,
          currency: 'TL', date: now, category: (category as any) || 'Teknoloji', notes: content,
        });
      } else if (type === 'subscription') {
        VaultStorageService.saveSubscription({
          name: title, price: parseFloat(price) || 0, currency: 'TL',
          billingCycle: 'monthly', renewalDate: expiryDate || now,
          category: (category as any) || 'Yazılım', status: 'active',
        });
      } else if (type === 'warranty') {
        VaultStorageService.saveWarranty({
          productName: title, brand: brand || '—',
          purchaseDate: now,
          expiryDate: expiryDate || new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
          status: 'active',
        });
      } else if (type === 'note') {
        VaultStorageService.saveNote({ title, content: content || title, tags: [], isPinned: false });
      } else if (type === 'bookmark') {
        const domain = url ? (() => { try { return new URL(url).hostname; } catch { return url; } })() : '';
        VaultStorageService.saveBookmark({ title, url: url || 'https://example.com', domain, tags: [] });
      }
      onSuccess();
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Kasaya ekle" maxWidth="md">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 border-b border-border/50 pb-4">
          <p className="text-[11px] font-bold uppercase tracking-[1.6px] text-secondary">Kayıt Türü</p>
          <p className="text-xs text-secondary/80">Önce türü seç, sonra detayları gir</p>
        </div>

        {/* Type selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
          {TYPES.map((t) => {
            const isSelected = type === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={cn(
                  "group flex items-center gap-3 text-left py-3 px-1 border-b transition-all duration-300",
                  isSelected
                    ? "border-accent text-primary"
                    : "border-border/60 text-secondary hover:border-accent/50 hover:text-primary"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-300",
                  isSelected
                    ? "bg-accent text-white border-accent shadow-soft"
                    : "bg-background text-secondary border-border group-hover:text-accent"
                )}>
                  {t.icon}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className={cn("text-xs font-bold uppercase tracking-[1.2px]", isSelected ? "text-accent" : "text-primary")}>{t.label}</span>
                  <span className="text-[11px] text-secondary leading-tight">{t.hint}</span>
                </div>
                <span className={cn(
                  "text-[10px] uppercase tracking-[1.4px] font-bold transition-opacity",
                  isSelected ? "opacity-100 text-accent" : "opacity-0 group-hover:opacity-60"
                )}>
                  Seçildi
                </span>
                <div className={cn(
                  "h-[2px] w-6 rounded-full transition-all duration-300",
                  isSelected ? "bg-accent" : "bg-transparent group-hover:bg-accent/40"
                )} />
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-3">
              <div>
                <p className="text-[11px] font-bold text-secondary uppercase tracking-[1.5px]">Detaylar</p>
                <p className="text-xs text-secondary/80 mt-1">Kısa ve net başlıklarla daha hızlı arama yapabilirsin.</p>
              </div>
              <X className="w-4 h-4 text-secondary/60" />
            </div>

            <Input
              label={type === 'receipt' ? 'Mağaza / Satıcı' : type === 'warranty' ? 'Ürün Adı' : type === 'subscription' ? 'Hizmet Adı' : type === 'bookmark' ? 'Başlık' : 'Başlık'}
              placeholder={
                type === 'document' ? 'Örn: Pasaport kopyası' :
                type === 'receipt' ? 'Örn: Apple Store' :
                type === 'subscription' ? 'Örn: Spotify' :
                type === 'warranty' ? 'Örn: MacBook Pro' :
                type === 'note' ? 'Örn: Acil durum kişileri' : 'Örn: Apple Geliştirici'
              }
              className="rounded-xl h-12 border-border"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-secondary uppercase tracking-[1.5px] px-1">Kategori</label>
                <select
                  className="w-full h-12 bg-background text-primary text-sm font-semibold rounded-xl border border-border px-3 transition-colors focus:outline-none focus:border-accent appearance-none"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  {type === 'document' && ['Kişisel', 'Finans', 'Sigorta', 'Kimlik', 'Sağlık', 'İş'].map(c => <option key={c} value={c}>{c}</option>)}
                  {type === 'receipt' && ['Teknoloji', 'Ev', 'Seyahat', 'Giyim', 'Yemek', 'Hizmetler'].map(c => <option key={c} value={c}>{c}</option>)}
                  {type === 'subscription' && ['Yazılım', 'Eğlence', 'İş', 'Bulut', 'Hizmet'].map(c => <option key={c} value={c}>{c}</option>)}
                  {type === 'warranty' && ['Teknoloji', 'Ev', 'Araç', 'Kişisel'].map(c => <option key={c} value={c}>{c}</option>)}
                  {type === 'note' && ['Genel', 'Güvenlik', 'Kişisel', 'İş'].map(c => <option key={c} value={c}>{c}</option>)}
                  {type === 'bookmark' && ['İş', 'Sosyal', 'Kaynak', 'Referans'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {type === 'receipt' && (
                <Input label="Tutar (TL)" type="number" placeholder="0.00" className="rounded-xl h-12 border-border" value={amount} onChange={e => setAmount(e.target.value)} />
              )}

              {type === 'subscription' && (
                <Input label="Aylık fiyat (TL)" type="number" placeholder="0.00" className="rounded-xl h-12 border-border" value={price} onChange={e => setPrice(e.target.value)} />
              )}

              {type === 'warranty' && (
                <Input label="Marka" placeholder="Örn: Apple" className="rounded-xl h-12 border-border" value={brand} onChange={e => setBrand(e.target.value)} />
              )}
            </div>

            {(type === 'subscription' || type === 'warranty') && (
              <Input 
                label={type === 'subscription' ? "Sıradaki Yenileme" : "Garanti Bitiş Tarihi"}
                type="date"
                className="rounded-xl h-12 border-border"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
              />
            )}

            {type === 'bookmark' && (
              <Input label="URL" placeholder="https://..." className="rounded-xl h-12 border-border" value={url} onChange={e => setUrl(e.target.value)} />
            )}

            {(type === 'document' || type === 'note' || type === 'receipt') && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-secondary uppercase tracking-[1.5px] px-1">{type === 'note' ? 'İçerik' : 'Notlar'}</label>
                <textarea
                  className="w-full h-28 bg-background text-primary placeholder:text-secondary/50 text-sm rounded-xl border border-border px-3 py-3 resize-none focus:outline-none focus:border-accent transition-colors"
                  placeholder={type === 'note' ? 'Notunuzu buraya yazın...' : 'İsteğe bağlı açıklama veya notlar...'}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/50">
            <Button type="button" variant="ghost" className="rounded-xl px-5 h-11 text-secondary font-semibold hover:text-primary" onClick={handleClose}>İptal</Button>
            <Button type="submit" className="rounded-xl px-6 h-11 font-semibold min-w-[170px]" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kasaya Ekle'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
