import React from 'react';
import {
  FileText,
  Receipt,
  CreditCard,
  ShieldCheck,
  StickyNote,
  Bookmark,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ActiveTab } from '../../types';
import { VaultCategory } from '../../types';
import { VaultStorageService } from '../../services/vaultStorage';
import { formatCurrency, cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { WalletCard } from '../../components/ui/WalletCard';
import { TiltCard } from '../../components/ui/TiltCard';
import { SpendingCard } from '../../components/ui/SpendingCard';
import { WarrantyCard } from '../../components/ui/WarrantyCard';
import { staggerContainer, staggerItem } from '../../lib/motion';

export interface HomeScreenProps {
  onNavigateToTab: (tab: ActiveTab, linkedItemId?: string) => void;
  onOpenSearch: () => void;
  onOpenQuickAdd: () => void;
  onOpenQuickAddFor: (category: VaultCategory) => void;
}



export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToTab,
  onOpenSearch,
  onOpenQuickAdd,
  onOpenQuickAddFor,
}) => {
  const docs = VaultStorageService.getDocuments();
  const receipts = VaultStorageService.getReceipts();
  const subscriptions = VaultStorageService.getSubscriptions();
  const warranties = VaultStorageService.getWarranties();
  const notes = VaultStorageService.getNotes();
  const bookmarks = VaultStorageService.getBookmarks();
  const stats = VaultStorageService.getStats();

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';

  const dateStr = now.toLocaleDateString('tr-TR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const COLLECTIONS: {
    id: ActiveTab;
    category: VaultCategory;
    label: string;
    count: number;
    icon: React.ReactNode;
    desc: string;
  }[] = [
    {
      id: 'documents',
      category: 'document',
      label: 'Belgeler',
      count: docs.length,
      icon: <FileText className="w-4 h-4" />,
      desc: 'Dosya ve evrak kayıtları',
    },
    {
      id: 'receipts',
      category: 'receipt',
      label: 'Fişler',
      count: receipts.length,
      icon: <Receipt className="w-4 h-4" />,
      desc: 'Alım geçmişi, faturalar',
    },
    {
      id: 'subscriptions',
      category: 'subscription',
      label: 'Abonelikler',
      count: subscriptions.length,
      icon: <CreditCard className="w-4 h-4" />,
      desc: 'Aylık & yıllık hizmetler',
    },
    {
      id: 'warranties',
      category: 'warranty',
      label: 'Garantiler',
      count: warranties.length,
      icon: <ShieldCheck className="w-4 h-4" />,
      desc: 'Cihaz & ürün korumaları',
    },
    {
      id: 'notes',
      category: 'note',
      label: 'Notlar',
      count: notes.length,
      icon: <StickyNote className="w-4 h-4" />,
      desc: 'Önemli kodlar & bilgiler',
    },
    {
      id: 'bookmarks',
      category: 'bookmark',
      label: 'Yer İmleri',
      count: bookmarks.length,
      icon: <Bookmark className="w-4 h-4" />,
      desc: 'Kaydedilen bağlantılar',
    },
  ];

  const totalItems = docs.length + receipts.length + warranties.length + notes.length + bookmarks.length + subscriptions.length;

  return (
    <motion.div
      className="space-y-10"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Greeting */}
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
        <div className="space-y-2">
          <p className="text-[13px] text-secondary font-medium tracking-wide uppercase opacity-70">{dateStr}</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight leading-[1.1]">
            {greeting}
          </h1>
          <p className="text-lg text-secondary/80 font-medium">Önemli her şey, tek bir yerde.</p>
        </div>
        <Button
          onClick={onOpenQuickAdd}
          size="lg"
          className="w-full sm:w-auto rounded-full px-8 h-12 bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-transform shadow-md font-bold"
        >
          Yeni Ekle
        </Button>
      </motion.div>

      {/* Vault Insights — Premium Stats */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-1 flex flex-col gap-6 order-2 lg:order-1">
          <TiltCard className="rounded-3xl" intensity={6}>
            <SpendingCard
              onOpenQuickAdd={() => onOpenQuickAddFor('receipt')}
              onNavigateToTab={(tab) => onNavigateToTab(tab)}
            />
          </TiltCard>

          <TiltCard className="rounded-3xl" intensity={6}>
            <WarrantyCard onNavigateToTab={(tab) => onNavigateToTab(tab)} />
          </TiltCard>
        </div>

        <div className="lg:col-span-2 flex items-center justify-center order-1 lg:order-2 py-2">
          <div className="w-full max-w-[420px] flex justify-center">
            <WalletCard />
          </div>
        </div>
      </motion.div>

      {/* Collections — Minimal Modern Grid */}
      <motion.div variants={staggerItem} className="space-y-5">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-primary tracking-tight">Koleksiyonlar</h2>
            <p className="text-xs text-secondary/60 mt-0.5">{totalItems} kayıt</p>
          </div>
          <button
            onClick={onOpenQuickAdd}
            className="text-xs font-semibold text-accent hover:text-accent/70 transition-colors flex items-center gap-1"
            aria-label="Yeni öğe ekle"
          >
            Yeni ekle
            <ArrowRight className="w-3 h-3" />
          </button>
        </header>

        <nav className="grid grid-cols-2 sm:grid-cols-3 gap-3" aria-label="Koleksiyon kategorileri">
          {COLLECTIONS.map((col, i) => (
            <motion.button
              key={col.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigateToTab(col.id)}
              className={cn(
                'group relative flex flex-col gap-3 p-4 rounded-2xl text-left',
                'border border-border/60 bg-surface/50 hover:bg-surface',
                'hover:border-accent/40 hover:shadow-soft',
                'transition-all duration-200 overflow-hidden',
              )}
            >
              {/* Subtle accent wash on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent/[0.07] to-transparent pointer-events-none" />

              <div className="relative flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-background border border-border/80 flex items-center justify-center text-secondary group-hover:text-accent group-hover:border-accent/30 transition-colors">
                  {col.icon}
                </div>
                <span className="text-xs font-bold text-secondary/50 group-hover:text-secondary tabular-nums transition-colors">
                  {col.count}
                </span>
              </div>

              <div className="relative">
                <p className="text-sm font-semibold text-primary leading-snug">{col.label}</p>
                <p className="text-[11px] text-secondary/60 mt-0.5 leading-relaxed line-clamp-1">{col.desc}</p>
              </div>
            </motion.button>
          ))}
        </nav>
      </motion.div>

      {/* Archive Summary */}
      <motion.div variants={staggerItem} className="pb-2">
        <Card className="p-5 bg-background border-border" interactive onClick={() => onNavigateToTab('timeline')}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-secondary uppercase tracking-[1.4px]">Arşiv Özeti</p>
              <h3 className="text-lg font-semibold text-primary mt-1">
                Toplam {totalItems} kayıt
              </h3>
            </div>
            <ArrowRight className="w-4 h-4 text-secondary" />
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
