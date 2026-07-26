import React from 'react';
import {
  FileText,
  Receipt,
  CreditCard,
  ShieldCheck,
  StickyNote,
  Bookmark,
  Clock,
  Search,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ActiveTab } from '../../types';
import { VaultStorageService } from '../../services/vaultStorage';
import { formatCurrency, formatDate } from '../../lib/utils';
import { motion } from 'framer-motion';
import SlideArrowButton from '../../components/ui/SlideArrowButton';
import { PinContainer } from '../../components/ui/3d-pin';

export interface HomeScreenProps {
  onNavigateToTab: (tab: ActiveTab, linkedItemId?: string) => void;
  onOpenSearch: () => void;
  onOpenQuickAdd: () => void;
}

const stagger = {
  container: { transition: { staggerChildren: 0.04 } },
  item: { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToTab,
  onOpenSearch,
  onOpenQuickAdd,
}) => {
  const docs = VaultStorageService.getDocuments();
  const receipts = VaultStorageService.getReceipts();
  const subscriptions = VaultStorageService.getSubscriptions();
  const warranties = VaultStorageService.getWarranties();
  const notes = VaultStorageService.getNotes();
  const bookmarks = VaultStorageService.getBookmarks();
  const suggestions = VaultStorageService.getSuggestions();
  const [selectedColIndex, setSelectedColIndex] = React.useState(0);

  const recentItems = [
    ...docs.slice(0, 2).map(d => ({
      id: d.id, title: d.title,
      tab: 'documents' as ActiveTab,
      date: d.createdAt, meta: d.category, type: 'Document',
    })),
    ...receipts.slice(0, 1).map(r => ({
      id: r.id, title: r.merchant,
      tab: 'receipts' as ActiveTab,
      date: r.date, meta: formatCurrency(r.amount, r.currency), type: 'Receipt',
    })),
    ...warranties.slice(0, 1).map(w => ({
      id: w.id, title: w.productName,
      tab: 'warranties' as ActiveTab,
      date: w.expiryDate, meta: w.brand, type: 'Warranty',
    })),
    ...notes.slice(0, 1).map(n => ({
      id: n.id, title: n.title,
      tab: 'notes' as ActiveTab,
      date: n.updatedAt, meta: n.tags[0] || 'Note', type: 'Note',
    })),
  ].slice(0, 5);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const COLLECTIONS = [
    { id: 'documents' as ActiveTab, label: 'Documents', count: docs.length, icon: <FileText className="w-4 h-4" />, desc: 'Passports, policies, contracts' },
    { id: 'receipts' as ActiveTab, label: 'Receipts', count: receipts.length, icon: <Receipt className="w-4 h-4" />, desc: 'Purchase history and invoices' },
    { id: 'subscriptions' as ActiveTab, label: 'Subscriptions', count: subscriptions.length, icon: <CreditCard className="w-4 h-4" />, desc: 'Monthly and annual services' },
    { id: 'warranties' as ActiveTab, label: 'Warranties', count: warranties.length, icon: <ShieldCheck className="w-4 h-4" />, desc: 'Device and product coverage' },
    { id: 'notes' as ActiveTab, label: 'Notes', count: notes.length, icon: <StickyNote className="w-4 h-4" />, desc: 'Important codes and info' },
    { id: 'bookmarks' as ActiveTab, label: 'Bookmarks', count: bookmarks.length, icon: <Bookmark className="w-4 h-4" />, desc: 'Saved links and resources' },
    { id: 'timeline' as ActiveTab, label: 'Timeline', count: '—', icon: <Clock className="w-4 h-4" />, desc: 'Life events and history' },
  ];

  return (
    <motion.div
      className="space-y-10"
      initial="initial"
      animate="animate"
      variants={stagger.container}
    >
      {/* Greeting */}
      <motion.div variants={stagger.item} className="space-y-1">
        <p className="text-xs text-secondary font-medium">{dateStr}</p>
        <h1 className="text-[28px] font-bold text-primary tracking-[-0.03em] leading-tight">
          {greeting}
        </h1>
        <p className="text-sm text-secondary flex items-center justify-between gap-4">
          <span>Everything important, in one place.</span>
          <SlideArrowButton
            text="Add Item"
            variant="primary"
            onClick={onOpenQuickAdd}
          />
        </p>
      </motion.div>

      {/* Search — always visible, large, centered */}
      <motion.div variants={stagger.item}>
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-surface hover:bg-surface-elevated border border-border rounded-2xl text-left transition-all duration-150 hover:shadow-card group"
        >
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-secondary group-hover:text-primary transition-colors shrink-0" />
            <span className="text-sm text-secondary group-hover:text-primary transition-colors">
              Search your vault...
            </span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="hidden sm:inline-flex text-[10px] font-mono text-secondary/50 bg-background border border-border px-1.5 py-0.5 rounded-md">⌘</kbd>
            <kbd className="hidden sm:inline-flex text-[10px] font-mono text-secondary/50 bg-background border border-border px-1.5 py-0.5 rounded-md">K</kbd>
          </div>
        </button>
      </motion.div>

      {/* Suggestions — only when urgent, max 2, very quiet */}
      {suggestions.length > 0 && (
        <motion.div variants={stagger.item} className="space-y-2">
          <p className="text-xs font-medium text-secondary px-0.5">Reminders</p>
          <div className="space-y-2">
            {suggestions.slice(0, 2).map(sug => (
              <div
                key={sug.id}
                onClick={() => sug.targetScreen && onNavigateToTab(sug.targetScreen as ActiveTab, sug.linkedItemId)}
                className="flex items-start gap-3 px-4 py-3 bg-surface border border-border rounded-xl cursor-pointer hover:bg-surface-elevated transition-all duration-150 group"
              >
                <div className={`mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${sug.type === 'urgent' ? 'bg-warning' : 'bg-secondary/30'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary leading-snug">{sug.title}</p>
                  <p className="text-xs text-secondary mt-0.5 line-clamp-1">{sug.description}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-secondary/40 group-hover:text-secondary transition-colors shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Continue — last accessed items */}
      {recentItems.length > 0 && (
        <motion.div variants={stagger.item} className="space-y-3">
          <p className="text-xs font-medium text-secondary px-0.5">Continue where you left off</p>
          <div className="space-y-1.5">
            {recentItems.map(item => (
              <Card
                key={item.id}
                interactive
                padding="sm"
                onClick={() => onNavigateToTab(item.tab, item.id)}
                className="flex items-center justify-between group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-primary leading-snug line-clamp-1">{item.title}</p>
                  <p className="text-xs text-secondary mt-0.5">{item.type} · {item.meta}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 pl-3">
                  <span className="text-[11px] text-secondary/60 hidden sm:block">{formatDate(item.date)}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-border group-hover:text-secondary transition-colors" />
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Collections Grid */}
      <motion.div variants={stagger.item} className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <p className="text-xs font-medium text-secondary">Collections</p>
          <Button variant="ghost" size="xs" onClick={onOpenQuickAdd}>
            Add item
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {COLLECTIONS.map(col => (
            <Card
              key={col.id}
              interactive
              padding="none"
              onClick={() => onNavigateToTab(col.id)}
              className="group p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-secondary group-hover:text-primary group-hover:border-border transition-colors">
                  {col.icon}
                </div>
                <span className="text-xs font-semibold text-secondary tabular-nums">{col.count}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-primary leading-snug">{col.label}</p>
                <p className="text-[11px] text-secondary mt-0.5 line-clamp-1 leading-relaxed">{col.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* 3D Pin Container Showcase — Featured Vault Security Badge */}
      <motion.div variants={stagger.item} className="pt-2 pb-6 flex justify-center w-full">
        <PinContainer
          title="Kapsüle Vault Security"
          onClick={() => onNavigateToTab('documents')}
          containerClassName="w-full max-w-sm"
        >
          <div className="flex flex-col p-4 w-[17rem] h-[12rem] sm:w-[20rem] sm:h-[13rem]">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm text-primary">
                Encrypted Vault Cloud
              </h3>
              <Badge variant="success" size="xs" dot>Protected</Badge>
            </div>
            <p className="text-[11px] text-secondary leading-relaxed">
              Your sensitive documents, warranties & notes are end-to-end encrypted.
            </p>
            <div className="flex-1 w-full rounded-xl mt-3 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-accent/20 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-primary font-medium">
                <span>Active Storage Items</span>
                <span className="font-bold text-accent tabular-nums">{docs.length + receipts.length + warranties.length + notes.length}</span>
              </div>
              <div className="text-[11px] text-secondary flex items-center justify-between">
                <span>Tap to view secure storage</span>
                <ArrowRight className="w-3 h-3 text-accent" />
              </div>
            </div>
          </div>
        </PinContainer>
      </motion.div>
    </motion.div>
  );
};

