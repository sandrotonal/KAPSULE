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
  { id: 'document', label: 'Belge', icon: <FileText className="w-5 h-5" />, hint: 'Dosya ve evrak kayıtları' },
  { id: 'receipt', label: 'Fiş', icon: <Receipt className="w-5 h-5" />, hint: 'Satın alım ve harcama' },
  { id: 'subscription', label: 'Abonelik', icon: <CreditCard className="w-5 h-5" />, hint: 'Aylık veya yıllık hizmet' },
  { id: 'warranty', label: 'Garanti', icon: <ShieldCheck className="w-5 h-5" />, hint: 'Ürün koruması' },
  { id: 'note', label: 'Not', icon: <StickyNote className="w-5 h-5" />, hint: 'Hızlı bilgi' },
  { id: 'bookmark', label: 'Yer İmi', icon: <Bookmark className="w-5 h-5" />, hint: 'Web sitesi kaydet' },
];

const getTodayISO = () => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().split('T')[0];
};

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
  const [error, setError] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  // Modal her açıldığında veya hedef tür değiştiğinde seçili türü senkronla.
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
    }
  }, [isOpen, initialType]);

  const reset = React.useCallback(() => {
    setTitle(''); setAmount(''); setPrice('');
    setBrand(''); setUrl(''); setContent(''); setExpiryDate('');
    setCategory(''); setDocumentFile(null);
    setError('');
  }, []);

  const handleClose = React.useCallback(() => { reset(); onClose(); }, [reset, onClose]);

  const handleTypeChange = React.useCallback((nextType: VaultCategory) => {
    setType(nextType);
    setCategory('');
    setError('');
    if (nextType !== 'document') setDocumentFile(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setError('Devam etmek için kısa bir başlık gir.');
      return;
    }

    if (type === 'document' && !documentFile) {
      setError('Belge kaydı için dosya seçin.');
      return;
    }
    if (type === 'document' && documentFile && documentFile.size > 3 * 1024 * 1024) {
      setError('Belge dosyası en fazla 3 MB olabilir.');
      return;
    }
    if (type === 'receipt' && (!amount || Number(amount) <= 0)) {
      setError('Fiş kaydı için geçerli bir tutar girin.');
      return;
    }
    if (type === 'subscription' && (!price || Number(price) <= 0 || !expiryDate)) {
      setError('Abonelik için geçerli fiyat ve yenileme tarihini girin.');
      return;
    }
    if (type === 'warranty' && (!brand.trim() || !expiryDate)) {
      setError('Garanti için marka ve bitiş tarihi girin.');
      return;
    }
    if (type === 'note' && !content.trim()) {
      setError('Not kaydı için içerik girin.');
      return;
    }

    let normalizedUrl = '';
    if (type === 'bookmark') {
      try {
        normalizedUrl = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
        new URL(normalizedUrl);
      } catch {
        setError('Geçerli bir web adresi girin.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const now = getTodayISO();
      if (type === 'document') {
        const previewUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('Belge dosyası okunamadı.'));
          reader.readAsDataURL(documentFile!);
        });
        const fileType = documentFile!.type.startsWith('image/') ? 'img' : documentFile!.type.includes('word') ? 'doc' : 'pdf';
        VaultStorageService.saveDocument({
          title: normalizedTitle,
          category: (category || 'Personal') as 'Personal' | 'Finance' | 'Insurance' | 'Vehicle' | 'Identity' | 'Health' | 'Property' | 'Work',
          fileType,
          fileSize: `${(documentFile!.size / 1024 / 1024).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} MB`,
          previewUrl,
          tags: [],
          description: content.trim() || undefined,
          isFavorite: false,
          isArchived: false,
        });
      } else if (type === 'receipt') {
        VaultStorageService.saveReceipt({
          merchant: normalizedTitle,
          amount: Number(amount),
          currency: 'TRY',
          date: now,
          category: (category || 'Services') as 'Tech' | 'Home' | 'Travel' | 'Clothing' | 'Food' | 'Utilities' | 'Services',
          notes: content.trim() || undefined,
        });
      } else if (type === 'subscription') {
        VaultStorageService.saveSubscription({
          name: normalizedTitle,
          price: Number(price),
          currency: 'TRY',
          billingCycle: 'monthly',
          renewalDate: expiryDate,
          category: (category || 'Software') as 'Software' | 'Entertainment' | 'Work' | 'Cloud' | 'Health' | 'Utility',
          status: 'active',
        });
      } else if (type === 'warranty') {
        VaultStorageService.saveWarranty({
          productName: normalizedTitle,
          brand: brand.trim(),
          purchaseDate: now,
          expiryDate,
          status: 'active',
        });
      } else if (type === 'note') {
        VaultStorageService.saveNote({ title: normalizedTitle, content: content.trim(), tags: [], isPinned: false });
      } else if (type === 'bookmark') {
        VaultStorageService.saveBookmark({ title: normalizedTitle, url: normalizedUrl, domain: new URL(normalizedUrl).hostname, tags: [] });
      }
      onSuccess();
      handleClose();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Kayıt sırasında bir sorun oluştu.');
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
                onClick={() => handleTypeChange(t.id)}
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
          {error && (
            <div className="rounded-xl border border-danger/20 bg-danger-muted px-4 py-3 text-sm font-medium text-danger" role="alert">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-3">
              <div>
                <p className="text-[11px] font-bold text-secondary uppercase tracking-[1.5px]">Detaylar</p>
                <p className="text-xs text-secondary/80 mt-1">Kısa ve net başlıklarla daha hızlı arama yapabilirsin.</p>
              </div>
              <X className="w-4 h-4 text-secondary/60" />
            </div>

            <Input
              id="quick-add-title"
              label={type === 'receipt' ? 'Mağaza / Satıcı' : type === 'warranty' ? 'Ürün Adı' : type === 'subscription' ? 'Hizmet Adı' : type === 'bookmark' ? 'Başlık' : 'Başlık'}
              placeholder={
                type === 'document' ? 'Belgenin başlığı' :
                  type === 'receipt' ? 'Satıcı adı' :
                    type === 'subscription' ? 'Hizmet adı' :
                      type === 'warranty' ? 'Ürün adı' :
                        type === 'note' ? 'Not başlığı' : 'Yer imi başlığı'
              }
              className="rounded-xl h-12 border-border"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['document', 'receipt', 'subscription'].includes(type) && (
                <div className="space-y-1.5">
                  <label htmlFor="quick-add-category" className="text-[11px] font-bold text-secondary uppercase tracking-[1.5px] px-1">Kategori</label>
                  <select
                    id="quick-add-category"
                    className="w-full h-12 bg-background text-primary text-sm font-semibold rounded-xl border border-border px-3 transition-colors focus:outline-none focus:border-accent appearance-none"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value="">Seçiniz</option>
                    {type === 'document' && [['Personal', 'Kişisel'], ['Finance', 'Finans'], ['Insurance', 'Sigorta'], ['Identity', 'Kimlik'], ['Health', 'Sağlık'], ['Property', 'Mülk'], ['Work', 'İş']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    {type === 'receipt' && [['Tech', 'Teknoloji'], ['Home', 'Ev'], ['Travel', 'Seyahat'], ['Clothing', 'Giyim'], ['Food', 'Yemek'], ['Utilities', 'Faturalar'], ['Services', 'Hizmetler']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    {type === 'subscription' && [['Software', 'Yazılım'], ['Entertainment', 'Eğlence'], ['Work', 'İş'], ['Cloud', 'Bulut'], ['Health', 'Sağlık'], ['Utility', 'Hizmet']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              )}

              {type === 'receipt' && (
                <Input label="Tutar (TL)" type="number" placeholder="0.00" className="rounded-xl h-12 border-border" value={amount} onChange={e => setAmount(e.target.value)} />
              )}

              {type === 'subscription' && (
                <Input label="Aylık fiyat (TL)" type="number" placeholder="0.00" className="rounded-xl h-12 border-border" value={price} onChange={e => setPrice(e.target.value)} />
              )}

              {type === 'warranty' && (
                <Input label="Marka" placeholder="Marka adı" className="rounded-xl h-12 border-border" value={brand} onChange={e => setBrand(e.target.value)} required />
              )}
            </div>

            {(type === 'subscription' || type === 'warranty') && (
              <Input
                label={type === 'subscription' ? "Sıradaki Yenileme" : "Garanti Bitiş Tarihi"}
                type="date"
                className="rounded-xl h-12 border-border"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                required
              />
            )}

            {type === 'document' && (
              <div className="space-y-1.5">
                <label htmlFor="quick-add-file" className="text-[11px] font-bold text-secondary uppercase tracking-[1.5px] px-1">Dosya</label>
                <input
                  id="quick-add-file"
                  type="file"
                  accept="application/pdf,image/*,.doc,.docx"
                  required
                  onChange={(event) => setDocumentFile(event.target.files?.[0] || null)}
                  className="block w-full text-sm text-secondary file:mr-4 file:rounded-xl file:border-0 file:bg-surface-elevated file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-primary hover:file:bg-border"
                />
                <p className="text-xs text-secondary">PDF, görsel veya Word dosyası; en fazla 3 MB.</p>
              </div>
            )}

            {type === 'bookmark' && (
              <Input label="URL" type="url" placeholder="https://..." className="rounded-xl h-12 border-border" value={url} onChange={e => setUrl(e.target.value)} required />
            )}

            {(type === 'document' || type === 'note' || type === 'receipt') && (
              <div className="space-y-1.5">
                <label htmlFor="quick-add-content" className="text-[11px] font-bold text-secondary uppercase tracking-[1.5px] px-1">{type === 'note' ? 'İçerik' : 'Notlar'}</label>
                <textarea
                  id="quick-add-content"
                  className="w-full h-28 bg-background text-primary placeholder:text-secondary/50 text-sm rounded-xl border border-border px-3 py-3 resize-none focus:outline-none focus:border-accent transition-colors"
                  placeholder={type === 'note' ? 'Notunuzu buraya yazın...' : 'İsteğe bağlı açıklama veya notlar...'}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required={type === 'note'}
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
