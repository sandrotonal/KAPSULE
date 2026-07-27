import React, { useState } from 'react';
import { FileText, Receipt, CreditCard, ShieldCheck, StickyNote, Bookmark, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { VaultStorageService } from '../../services/vaultStorage';
import { VaultCategory } from '../../types';
import SlideArrowButton from '../ui/SlideArrowButton';
import { cn } from '../../lib/utils';

export interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TYPES: { id: VaultCategory; label: string; icon: React.ReactNode; hint: string }[] = [
    { id: 'document',     label: 'Belge',    icon: <FileText className="w-5 h-5" />,    hint: 'Pasaport, kontrat, poliçe' },
    { id: 'receipt',      label: 'Fiş',     icon: <Receipt className="w-5 h-5" />,     hint: 'Satın alım ve harcama' },
    { id: 'subscription', label: 'Abonelik',icon: <CreditCard className="w-5 h-5" />,  hint: 'Aylık veya yıllık hizmet' },
    { id: 'warranty',     label: 'Garanti',    icon: <ShieldCheck className="w-5 h-5" />, hint: 'Ürün koruması' },
    { id: 'note',         label: 'Not',        icon: <StickyNote className="w-5 h-5" />,  hint: 'Hızlı bilgi' },
    { id: 'bookmark',     label: 'Yer İmi',    icon: <Bookmark className="w-5 h-5" />,    hint: 'Web sitesi kaydet' },
  ];

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [type, setType] = useState<VaultCategory>('document');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');

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
        {/* Type selector grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {TYPES.map((t) => {
            const isSelected = type === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-5 rounded-[32px] border transition-all duration-500 relative group overflow-hidden",
                  isSelected
                    ? "bg-accent/10 border-accent/40 shadow-[0_20px_40px_rgba(var(--accent-rgb),0.15)] ring-1 ring-accent/20"
                    : "bg-surface/50 border-border/40 text-secondary hover:border-border hover:bg-surface-elevated hover:-translate-y-1"
                )}
              >
                {/* Background Glow for Selected */}
                {isSelected && (
                  <div className="absolute inset-0 bg-accent/10 opacity-60 blur-2xl transition-all duration-700" />
                )}
                
                <div className={cn(
                  "relative z-10 p-3 rounded-2xl transition-all duration-500",
                  isSelected ? "bg-accent text-white scale-110 shadow-lg -rotate-3" : "bg-surface-elevated text-secondary group-hover:text-primary group-hover:scale-110"
                )}>
                  {t.icon}
                </div>
                <span className={cn(
                  "relative z-10 text-[10px] uppercase tracking-[1.5px] mt-3 font-black transition-colors",
                  isSelected ? "text-accent" : "text-secondary group-hover:text-primary"
                )}>
                  {t.label}
                </span>
                
                {isSelected && (
                  <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-6 border-t border-border/20">
          <div className="bg-surface/30 p-6 rounded-[32px] border border-border/40 space-y-5 backdrop-blur-md relative overflow-hidden group/form">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/form:opacity-10 transition-opacity pointer-events-none text-accent">
              {TYPES.find(t => t.id === type)?.icon}
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
              className="rounded-2xl bg-background/50 h-14 border-border/40 focus:border-accent/40"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-secondary uppercase tracking-[2px] px-1">Kategori</label>
                <select
                  className="w-full h-14 bg-background/50 text-primary text-[15px] font-bold rounded-2xl border border-border/40 px-4 transition-all focus:outline-none focus:border-accent/40 focus:bg-background appearance-none"
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
                <Input label="Tutar (TL)" type="number" placeholder="0.00" className="rounded-2xl bg-background/50 h-14 border-border/40" value={amount} onChange={e => setAmount(e.target.value)} />
              )}

              {type === 'subscription' && (
                <Input label="Aylık fiyat (TL)" type="number" placeholder="0.00" className="rounded-2xl bg-background/50 h-14 border-border/40" value={price} onChange={e => setPrice(e.target.value)} />
              )}

              {type === 'warranty' && (
                <Input label="Marka" placeholder="Örn: Apple" className="rounded-2xl bg-background/50 h-14 border-border/40" value={brand} onChange={e => setBrand(e.target.value)} />
              )}
            </div>

            {(type === 'subscription' || type === 'warranty') && (
              <Input 
                label={type === 'subscription' ? "Sıradaki Yenileme" : "Garanti Bitiş Tarihi"} 
                type="date" 
                className="rounded-2xl bg-background/50 h-14 border-border/40"
                value={expiryDate} 
                onChange={e => setExpiryDate(e.target.value)} 
              />
            )}

            {type === 'bookmark' && (
              <Input label="URL" placeholder="https://..." className="rounded-2xl bg-background/50 h-14 border-border/40" value={url} onChange={e => setUrl(e.target.value)} />
            )}

            {(type === 'document' || type === 'note' || type === 'receipt') && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-secondary uppercase tracking-[2px] px-1">{type === 'note' ? 'İçerik' : 'Notlar'}</label>
                <textarea
                  className="w-full h-32 bg-background/50 text-primary placeholder:text-secondary/40 text-[15px] font-bold rounded-2xl border border-border/40 px-4 py-3 resize-none focus:outline-none focus:border-accent/40 focus:bg-background transition-all"
                  placeholder={type === 'note' ? 'Notunuzu buraya yazın...' : 'İsteğe bağlı açıklama veya notlar...'}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" className="rounded-2xl px-8 text-secondary font-bold hover:text-primary" onClick={handleClose}>İptal</Button>
            <SlideArrowButton 
              text={loading ? 'Kaydediliyor...' : 'Kasaya Kilitle'}
              onClick={handleSubmit as any} 
              className="w-56"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};
