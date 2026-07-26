import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, FileText, Receipt, CreditCard, ShieldCheck, StickyNote, Bookmark, ArrowRight, X } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { VaultStorageService } from '../../services/vaultStorage';
import { ActiveTab } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: ActiveTab) => void;
}

type ResultItem = {
  id: string;
  title: string;
  subtitle: string;
  meta?: string;
  tab: ActiveTab;
  icon: React.ReactNode;
};

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigateToTab }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const allData = useMemo(() => {
    if (!isOpen) return { docs: [], receipts: [], subs: [], warranties: [], notes: [], bookmarks: [] };
    return {
      docs: VaultStorageService.getDocuments(),
      receipts: VaultStorageService.getReceipts(),
      subs: VaultStorageService.getSubscriptions(),
      warranties: VaultStorageService.getWarranties(),
      notes: VaultStorageService.getNotes(),
      bookmarks: VaultStorageService.getBookmarks(),
    };
  }, [isOpen]);

  const results = useMemo((): ResultItem[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const out: ResultItem[] = [];

    allData.docs
      .filter(d => d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q)) || (d.ocrText?.toLowerCase().includes(q)))
      .forEach(d => out.push({ id: d.id, title: d.title, subtitle: d.category, meta: formatDate(d.createdAt), tab: 'documents', icon: <FileText className="w-4 h-4" /> }));

    allData.receipts
      .filter(r => r.merchant.toLowerCase().includes(q) || (r.notes?.toLowerCase().includes(q)))
      .forEach(r => out.push({ id: r.id, title: r.merchant, subtitle: r.notes || r.category, meta: formatCurrency(r.amount, r.currency), tab: 'receipts', icon: <Receipt className="w-4 h-4" /> }));

    allData.subs
      .filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
      .forEach(s => out.push({ id: s.id, title: s.name, subtitle: s.category, meta: formatCurrency(s.price, s.currency) + '/mo', tab: 'subscriptions', icon: <CreditCard className="w-4 h-4" /> }));

    allData.warranties
      .filter(w => w.productName.toLowerCase().includes(q) || w.brand.toLowerCase().includes(q))
      .forEach(w => out.push({ id: w.id, title: w.productName, subtitle: w.brand, meta: 'Until ' + formatDate(w.expiryDate), tab: 'warranties', icon: <ShieldCheck className="w-4 h-4" /> }));

    allData.notes
      .filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      .forEach(n => out.push({ id: n.id, title: n.title, subtitle: n.content.slice(0, 60), tab: 'notes', icon: <StickyNote className="w-4 h-4" /> }));

    allData.bookmarks
      .filter(b => b.title.toLowerCase().includes(q) || b.domain.toLowerCase().includes(q))
      .forEach(b => out.push({ id: b.id, title: b.title, subtitle: b.domain, tab: 'bookmarks', icon: <Bookmark className="w-4 h-4" /> }));

    return out.slice(0, 12);
  }, [query, allData]);

  const QUICK_SEARCHES = ['Passport', 'Insurance', 'Apple', 'Warranty', 'Subscription', 'Rent'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader maxWidth="lg">
      {/* Search Input — inline, no modal header */}
      <div className="relative flex items-center -m-5 mb-0 border-b border-border px-4">
        <Search className="w-4 h-4 text-secondary shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search documents, receipts, warranties..."
          className="flex-1 px-3 py-4 text-[16px] text-primary placeholder:text-secondary/50 bg-transparent focus:outline-none"
        />
        {query && (
          <button onClick={() => setQuery('')} className="p-1 text-secondary hover:text-primary">
            <X className="w-4 h-4" />
          </button>
        )}
        {!query && (
          <kbd className="text-[10px] text-secondary/40 font-mono">Esc</kbd>
        )}
      </div>

      {/* Results */}
      <div className="mt-4 min-h-[200px]">
        <AnimatePresence mode="wait">
          {!query.trim() ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="space-y-4"
            >
              <p className="text-xs text-secondary font-medium">Quick searches</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SEARCHES.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 text-xs bg-surface border border-border rounded-lg text-secondary hover:text-primary hover:bg-surface-elevated transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="py-10 text-center space-y-1"
            >
              <p className="text-sm font-medium text-primary">Nothing matched your search.</p>
              <p className="text-xs text-secondary">Try a different keyword.</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="space-y-1"
            >
              <p className="text-xs text-secondary font-medium mb-2">{results.length} result{results.length !== 1 ? 's' : ''}</p>
              {results.map(r => (
                <button
                  key={r.id}
                  onClick={() => { onNavigateToTab(r.tab); onClose(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface text-left transition-all duration-100 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-secondary group-hover:text-primary shrink-0 transition-colors">
                    {r.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{r.title}</p>
                    <p className="text-xs text-secondary truncate">{r.subtitle}</p>
                  </div>
                  {r.meta && (
                    <span className="text-xs text-secondary/70 shrink-0 tabular-nums">{r.meta}</span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};
