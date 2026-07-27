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
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ActiveTab } from '../../types';
import { VaultStorageService } from '../../services/vaultStorage';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import SlideArrowButton from '../../components/ui/SlideArrowButton';
import { PinContainer } from '../../components/ui/3d-pin';
import { WalletCard } from '../../components/ui/WalletCard';

export interface HomeScreenProps {
  onNavigateToTab: (tab: ActiveTab, linkedItemId?: string) => void;
  onOpenSearch: () => void;
  onOpenQuickAdd: () => void;
}

const stagger = {
  container: { transition: { staggerChildren: 0.05 } },
  item: { 
    initial: { opacity: 0, y: 12 }, 
    animate: { opacity: 1, y: 0 }, 
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
  },
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
  const stats = VaultStorageService.getStats();
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
  const greeting = hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';

  const dateStr = now.toLocaleDateString('tr-TR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const COLLECTIONS = [
    { id: 'documents' as ActiveTab, label: 'Belgeler', count: docs.length, icon: <FileText className="w-4 h-4" />, desc: 'Pasaportlar, poliçeler, kontratlar' },
    { id: 'receipts' as ActiveTab, label: 'Fişler', count: receipts.length, icon: <Receipt className="w-4 h-4" />, desc: 'Satın alım geçmişi ve faturalar' },
    { id: 'subscriptions' as ActiveTab, label: 'Abonelikler', count: subscriptions.length, icon: <CreditCard className="w-4 h-4" />, desc: 'Aylık ve yıllık hizmetler' },
    { id: 'warranties' as ActiveTab, label: 'Garantiler', count: warranties.length, icon: <ShieldCheck className="w-4 h-4" />, desc: 'Cihaz ve ürün korumaları' },
    { id: 'notes' as ActiveTab, label: 'Notlar', count: notes.length, icon: <StickyNote className="w-4 h-4" />, desc: 'Önemli kodlar ve bilgiler' },
    { id: 'bookmarks' as ActiveTab, label: 'Yer İmleri', count: bookmarks.length, icon: <Bookmark className="w-4 h-4" />, desc: 'Kaydedilen bağlantılar' },
    { id: 'timeline' as ActiveTab, label: 'Zaman Akışı', count: '—', icon: <Clock className="w-4 h-4" />, desc: 'Hayat olayları ve geçmiş' },
  ];

  return (
    <motion.div
      className="space-y-10"
      initial="initial"
      animate="animate"
      variants={stagger.container}
    >
      {/* Greeting */}
      <motion.div variants={stagger.item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
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
          className="rounded-full px-8 bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-transform"
        >
          Yeni Ekle
        </Button>
      </motion.div>

      {/* Vault Insights — Premium Stats */}
      <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-1 flex flex-col gap-6 order-2 lg:order-1">
          <Card className="bg-primary dark:bg-accent text-primary-foreground border-none overflow-hidden relative group p-8 min-h-[160px] flex flex-col justify-between shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all duration-700 group-hover:scale-110">
              <TrendingUp className="w-24 h-24" />
            </div>
            <div className="relative z-10 space-y-1">
              <p className="text-[11px] font-bold text-primary-foreground/60 uppercase tracking-[2px]">Aylık Harcama</p>
              <h3 className="text-4xl font-bold tracking-tighter">
                {formatCurrency(stats.totalMonthlyCost, 'TL')}
              </h3>
            </div>
            <div className="relative z-10 text-xs font-medium text-primary-foreground/80">
              <span className="opacity-60">Yıllık tahmini: </span>
              <span>{formatCurrency(stats.totalAnnualCost, 'TL')}</span>
            </div>
          </Card>

          <Card className="bg-surface/50 dark:bg-white/5 border-border overflow-hidden relative group p-8 min-h-[160px] flex flex-col justify-between" interactive onClick={() => onNavigateToTab('warranties')}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-secondary uppercase tracking-[2px]">Garantiler</p>
                <h3 className="text-4xl font-bold text-primary tracking-tighter">
                  {stats.activeWarranties}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-primary shadow-soft group-hover:rotate-6 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              {stats.expiringWarrantiesCount > 0 ? (
                <Badge variant="warning" size="sm" dot className="rounded-full px-3 py-1 text-[10px]">
                  {stats.expiringWarrantiesCount} Yakın
                </Badge>
              ) : (
                <Badge variant="success" size="sm" dot className="rounded-full px-3 py-1 text-[10px]">Güvende</Badge>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 flex items-center justify-center order-1 lg:order-2 py-4">
          <div className="w-full max-w-[500px] flex justify-center">
            <WalletCard />
          </div>
        </div>
      </motion.div>

      {/* Collections Grid */}
      <motion.div variants={stagger.item} className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold text-primary tracking-tight">Koleksiyonlar</h2>
          <Button variant="ghost" size="sm" onClick={onOpenQuickAdd} className="text-accent hover:bg-accent/5">
            Tümünü Gör
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {COLLECTIONS.map((col, idx) => (
            <Card
              key={col.id}
              interactive
              padding="none"
              onClick={() => onNavigateToTab(col.id)}
              className={cn(
                "group relative overflow-hidden transition-all duration-500",
                "bg-surface/30 dark:bg-white/[0.02] border-border/40",
                idx === 0 && "col-span-2 row-span-1"
              )}
            >
              <div className="p-8 flex flex-col h-full justify-between min-h-[200px]">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-background border border-border/60 shadow-soft flex items-center justify-center text-secondary group-hover:text-accent transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
                    {col.icon}
                  </div>
                  <div className="text-2xl font-bold text-primary/20 group-hover:text-accent/20 tabular-nums transition-colors">
                    {col.count}
                  </div>
                </div>
                <div className="mt-8 space-y-2">
                  <p className="text-lg font-bold text-primary tracking-tight group-hover:translate-x-1 transition-transform">{col.label}</p>
                  <p className="text-[13px] text-secondary leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{col.desc}</p>
                </div>
              </div>
              
              {/* Apple-style subtle light effect */}
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-accent/5 rounded-full blur-[80px] group-hover:bg-accent/10 transition-all duration-700" />
            </Card>
          ))}
        </div>
      </motion.div>

      {/* 3D Pin Container Showcase — Featured Vault Security Badge */}
      <motion.div variants={stagger.item} className="pt-2 pb-6 flex justify-center w-full">
        <PinContainer
          title="Kapsüle Kasa Güvenliği"
          onClick={() => onNavigateToTab('documents')}
          containerClassName="w-full max-w-sm"
        >
          <div className="flex flex-col p-4 w-[17rem] h-[12rem] sm:w-[20rem] sm:h-[13rem]">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm text-primary">
                Şifreli Bulut Kasası
              </h3>
              <Badge variant="success" size="xs" dot>Korumalı</Badge>
            </div>
            <p className="text-[11px] text-secondary leading-relaxed">
              Hassas belgeleriniz, garantileriniz ve notlarınız uçtan uca şifrelenmiştir.
            </p>
            <div className="flex-1 w-full rounded-xl mt-3 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-accent/20 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-primary font-medium">
                <span>Aktif Depolama Öğeleri</span>
                <span className="font-bold text-accent tabular-nums">{docs.length + receipts.length + warranties.length + notes.length}</span>
              </div>
              <div className="text-[11px] text-secondary flex items-center justify-between">
                <span>Güvenli depolamayı görmek için tıkla</span>
                <ArrowRight className="w-3 h-3 text-accent" />
              </div>
            </div>
          </div>
        </PinContainer>
      </motion.div>
    </motion.div>
  );
};

