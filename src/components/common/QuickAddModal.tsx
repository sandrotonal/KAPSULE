import React, { useState } from 'react';
import { FileText, Receipt, CreditCard, ShieldCheck, StickyNote, Bookmark, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { VaultStorageService } from '../../services/vaultStorage';
import { VaultCategory } from '../../types';

export interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TYPES: { id: VaultCategory; label: string; icon: React.ReactNode; hint: string }[] = [
  { id: 'document',     label: 'Document',    icon: <FileText className="w-4 h-4" />,    hint: 'Passport, contract, policy' },
  { id: 'receipt',      label: 'Receipt',     icon: <Receipt className="w-4 h-4" />,     hint: 'Purchase and spending' },
  { id: 'subscription', label: 'Subscription',icon: <CreditCard className="w-4 h-4" />,  hint: 'Monthly or annual service' },
  { id: 'warranty',     label: 'Warranty',    icon: <ShieldCheck className="w-4 h-4" />, hint: 'Product coverage' },
  { id: 'note',         label: 'Note',        icon: <StickyNote className="w-4 h-4" />,  hint: 'Quick information' },
  { id: 'bookmark',     label: 'Bookmark',    icon: <Bookmark className="w-4 h-4" />,    hint: 'Save a website' },
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

  const reset = () => {
    setTitle(''); setAmount(''); setPrice('');
    setBrand(''); setUrl(''); setContent(''); setExpiryDate('');
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
          title, category: 'Personal' as any, fileType: 'pdf', fileSize: '—',
          previewUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
          tags: [], description: content, isFavorite: false, isArchived: false,
        });
      } else if (type === 'receipt') {
        VaultStorageService.saveReceipt({
          merchant: title, amount: parseFloat(amount) || 0,
          currency: 'TL', date: now, category: 'Tech', notes: content,
        });
      } else if (type === 'subscription') {
        VaultStorageService.saveSubscription({
          name: title, price: parseFloat(price) || 0, currency: 'TL',
          billingCycle: 'monthly', renewalDate: expiryDate || now,
          category: 'Software', status: 'active',
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Add to vault" maxWidth="md">
      <div className="space-y-5">
        {/* Type selector */}
        <div className="grid grid-cols-3 gap-2">
          {TYPES.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-100 ${
                type === t.id
                  ? 'bg-surface border-primary ring-2 ring-primary/8'
                  : 'border-border bg-background hover:bg-surface'
              }`}
            >
              <span className={`mb-1.5 ${type === t.id ? 'text-primary' : 'text-secondary'}`}>{t.icon}</span>
              <span className="text-xs font-medium text-primary">{t.label}</span>
              <span className="text-[10px] text-secondary mt-0.5 line-clamp-1">{t.hint}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-border">
          <Input
            label="Name"
            placeholder={
              type === 'document' ? 'e.g. Passport copy' :
              type === 'receipt' ? 'e.g. Apple Store' :
              type === 'subscription' ? 'e.g. Spotify' :
              type === 'warranty' ? 'e.g. MacBook Pro' :
              type === 'note' ? 'e.g. Emergency contacts' : 'e.g. Apple Developer'
            }
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          {type === 'receipt' && (
            <Input label="Amount (TL)" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
          )}

          {type === 'subscription' && (
            <div className="grid grid-cols-2 gap-2">
              <Input label="Monthly price (TL)" type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} />
              <Input label="Renewal date" type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
            </div>
          )}

          {type === 'warranty' && (
            <div className="grid grid-cols-2 gap-2">
              <Input label="Brand" placeholder="e.g. Apple" value={brand} onChange={e => setBrand(e.target.value)} />
              <Input label="Expires" type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
            </div>
          )}

          {type === 'bookmark' && (
            <Input label="URL" placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} />
          )}

          {(type === 'document' || type === 'note' || type === 'receipt') && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-primary/80">{type === 'note' ? 'Content' : 'Notes'}</label>
              <textarea
                className="w-full h-20 bg-surface text-primary placeholder:text-secondary/50 text-sm rounded-xl border border-border px-3.5 py-2.5 resize-none focus:outline-none focus:border-accent/40 focus:bg-background focus:shadow-focus transition-all"
                placeholder={type === 'note' ? 'Write your note here...' : 'Optional description or notes...'}
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm" loading={loading}>Save</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
