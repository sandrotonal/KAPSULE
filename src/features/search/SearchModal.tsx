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
  onNavigateToTab: (tab: ActiveTab, linkedItemId?: string) => void;
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
      .forEach(s => out.push({ id: s.id, title: s.name, subtitle: s.category, meta: formatCurrency(s.price, s.currency) + '/ay', tab: 'subscriptions', icon: <CreditCard className="w-4 h-4" /> }));

    allData.warranties
      .filter(w => w.productName.toLowerCase().includes(q) || w.brand.toLowerCase().includes(q))
      .forEach(w => out.push({ id: w.id, title: w.productName, subtitle: w.brand, meta: formatDate(w.expiryDate) + ' tarihine kadar', tab: 'warranties', icon: <ShieldCheck className="w-4 h-4" /> }));

    allData.notes
      .filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      .forEach(n => out.push({ id: n.id, title: n.title, subtitle: n.content.slice(0, 60), tab: 'notes', icon: <StickyNote className="w-4 h-4" /> }));

    allData.bookmarks
      .filter(b => b.title.toLowerCase().includes(q) || b.domain.toLowerCase().includes(q))
      .forEach(b => out.push({ id: b.id, title: b.title, subtitle: b.domain, tab: 'bookmarks', icon: <Bookmark className="w-4 h-4" /> }));

    return out.slice(0, 12);
  }, [query, allData]);

  const QUICK_SEARCHES = ['Pasaport', 'Sigorta', 'Apple', 'Garanti', 'Abonelik', 'Kira'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader maxWidth="lg">
      {/* Search Orb Container */}
      <div className="relative w-full h-[100px] flex items-center justify-center -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-[32px] bg-transparent">
        {/* Gooey Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ filter: 'url(#enhanced-goo)' }}>
          {/* Blob 1 */}
          <div className="absolute top-2 left-0 w-[140px] h-[72px] bg-gradient-to-br from-[#6366f1] to-[#d946ef] rounded-full animate-blob-float transition-all duration-700 group-focus-within:scale-[1.15] group-focus-within:-translate-x-[20px] group-focus-within:brightness-[1.2]" />
          {/* Blob 2 */}
          <div className="absolute top-2 right-0 w-[120px] h-[72px] bg-gradient-to-br from-[#d946ef] to-[#8b5cf6] rounded-full animate-blob-float-reverse transition-all duration-700 group-focus-within:scale-[1.15] group-focus-within:translate-x-[20px] group-focus-within:brightness-[1.2]" />
          {/* Blob 3 */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[200px] h-[72px] bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] rounded-full opacity-90" />
          {/* Blob Bridge */}
          <div className="absolute top-6 left-[10%] w-[80%] h-10 bg-[#8b5cf6] rounded-[40px]" />
        </div>

        {/* Input Overlay */}
        <div className="group relative z-10 w-[90%] h-[52px] bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 rounded-[26px] flex items-center px-5 shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-500 focus-within:-translate-y-1 focus-within:bg-white/15 focus-within:border-white/40 focus-within:shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
          <div className="text-white opacity-90 shrink-0">
            <Search className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Dijital boşluğu keşfedin..."
            className="flex-1 bg-transparent border-none outline-none text-white text-[15px] font-medium px-3 placeholder:text-white/60 tracking-tight"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-white/70 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
          
          {/* Focus Indicator */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-500 w-0 group-focus-within:w-[40%]" />
        </div>

        {/* SVG Filter Definition */}
        <svg className="absolute invisible w-0 h-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="enhanced-goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Results */}
      <div className="mt-2 min-h-[200px]">
        <AnimatePresence mode="wait">
          {!query.trim() ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <p className="text-xs text-secondary font-medium px-1">Hızlı aramalar</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SEARCHES.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-4 py-2 text-xs bg-surface border border-border rounded-xl text-secondary hover:text-primary hover:bg-surface-elevated transition-all duration-200"
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
              className="py-12 text-center space-y-2"
            >
              <p className="text-sm font-semibold text-primary">Aramanızla eşleşen bir sonuç bulunamadı.</p>
              <p className="text-xs text-secondary">Farklı bir anahtar kelime deneyin.</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-1"
            >
              <p className="text-xs text-secondary font-medium mb-3 px-1">{results.length} sonuç bulundu</p>
              {results.map(r => (
                <button
                  key={r.id}
                  onClick={() => { onNavigateToTab(r.tab, r.id); onClose(); }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-surface text-left transition-all duration-200 group border border-transparent hover:border-border"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-secondary group-hover:text-primary shrink-0 transition-all group-hover:scale-110">
                    {r.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary truncate">{r.title}</p>
                    <p className="text-xs text-secondary truncate">{r.subtitle}</p>
                  </div>
                  {r.meta && (
                    <span className="text-xs font-medium text-secondary/60 shrink-0 tabular-nums bg-surface-elevated px-2 py-1 rounded-lg">{r.meta}</span>
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
