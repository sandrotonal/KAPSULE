import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, FileText, Receipt, CreditCard, ShieldCheck, StickyNote, Bookmark, X } from 'lucide-react';
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
  group: string;
  icon: React.ReactNode;
};

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigateToTab }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

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
      .forEach(d => out.push({ id: d.id, title: d.title, subtitle: d.category, meta: formatDate(d.createdAt), tab: 'documents', group: 'Belgeler', icon: <FileText className="w-4 h-4" /> }));

    allData.receipts
      .filter(r => r.merchant.toLowerCase().includes(q) || (r.notes?.toLowerCase().includes(q)))
      .forEach(r => out.push({ id: r.id, title: r.merchant, subtitle: r.notes || r.category, meta: formatCurrency(r.amount, r.currency), tab: 'receipts', group: 'Fişler', icon: <Receipt className="w-4 h-4" /> }));

    allData.subs
      .filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
      .forEach(s => out.push({ id: s.id, title: s.name, subtitle: s.category, meta: formatCurrency(s.price, s.currency) + '/ay', tab: 'subscriptions', group: 'Abonelikler', icon: <CreditCard className="w-4 h-4" /> }));

    allData.warranties
      .filter(w => w.productName.toLowerCase().includes(q) || w.brand.toLowerCase().includes(q))
      .forEach(w => out.push({ id: w.id, title: w.productName, subtitle: w.brand, meta: formatDate(w.expiryDate) + ' tarihine kadar', tab: 'warranties', group: 'Garantiler', icon: <ShieldCheck className="w-4 h-4" /> }));

    allData.notes
      .filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      .forEach(n => out.push({ id: n.id, title: n.title, subtitle: n.content.slice(0, 60), tab: 'notes', group: 'Notlar', icon: <StickyNote className="w-4 h-4" /> }));

    allData.bookmarks
      .filter(b => b.title.toLowerCase().includes(q) || b.domain.toLowerCase().includes(q))
      .forEach(b => out.push({ id: b.id, title: b.title, subtitle: b.domain, tab: 'bookmarks', group: 'Yer İmleri', icon: <Bookmark className="w-4 h-4" /> }));

    return out.slice(0, 12);
  }, [query, allData]);

  const QUICK_SEARCHES = ['Pasaport', 'Sigorta', 'Apple', 'Garanti', 'Abonelik', 'Kira'];

  const groupedResults = useMemo(() => {
    return results.reduce((groups, result) => {
      if (!groups[result.group]) groups[result.group] = [];
      groups[result.group].push(result);
      return groups;
    }, {} as Record<string, ResultItem[]>);
  }, [results]);

  const resultIndexById = useMemo(() => {
    return new Map(results.map((result, index) => [result.id, index]));
  }, [results]);

  const openResult = (result: ResultItem) => {
    onNavigateToTab(result.tab, result.id);
    onClose();
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex(index => (index + 1) % results.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex(index => (index - 1 + results.length) % results.length);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      openResult(results[selectedIndex]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader maxWidth="lg">
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-secondary uppercase tracking-[1.6px]">Kasa Araması</p>
          <div className="group relative h-14 rounded-2xl border border-border bg-surface/50 px-4 flex items-center gap-3 transition-colors focus-within:border-accent/50 focus-within:bg-background focus-within:shadow-focus">
            <Search className="w-5 h-5 text-secondary group-focus-within:text-accent transition-colors" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Pasaport, garanti, fiş veya not ara..."
              aria-label="Kasada ara"
              aria-activedescendant={results.length > 0 ? `search-result-${results[selectedIndex]?.id}` : undefined}
              aria-controls="search-results"
              className="flex-1 bg-transparent border-none outline-none text-primary text-[15px] font-medium placeholder:text-secondary/50"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-surface-elevated transition-colors" aria-label="Aramayı temizle">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex text-[10px] font-mono text-secondary/50 bg-background px-1.5 py-0.5 rounded-md border border-border/60">Enter</kbd>
          </div>
        </div>

      {/* Results */}
      <div className="min-h-[220px]">
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
                    className="min-h-[40px] px-4 py-2 text-xs bg-surface border border-border rounded-xl text-secondary hover:text-primary hover:bg-surface-elevated transition-all duration-200"
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
              id="search-results"
              className="space-y-1"
            >
              <p className="text-xs text-secondary font-medium mb-3 px-1">{results.length} sonuç bulundu</p>
              {Object.entries(groupedResults).map(([group, groupResults]) => (
                <div key={group} className="space-y-1 pt-2 first:pt-0">
                  <p className="px-1 text-[11px] font-bold uppercase tracking-[1.4px] text-secondary/60">{group}</p>
                  {groupResults.map((r) => {
                    const index = resultIndexById.get(r.id) ?? 0;
                    return (
                      <button
                        key={r.id}
                        id={`search-result-${r.id}`}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onClick={() => openResult(r)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left transition-all duration-200 group border ${selectedIndex === index ? 'bg-surface border-border' : 'border-transparent hover:bg-surface hover:border-border'}`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-secondary group-hover:text-primary shrink-0 transition-colors">
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
                    );
                  })}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </Modal>
  );
};
