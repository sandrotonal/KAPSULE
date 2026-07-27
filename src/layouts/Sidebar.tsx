import {
  Home,
  FileText,
  Receipt,
  CreditCard,
  ShieldCheck,
  StickyNote,
  Bookmark,
  Clock,
  Settings,
  Search,
  Plus,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { cn } from '../lib/utils';
import { LineSidebar } from '../components/ui/LineSidebar';
import { Button } from '../components/ui/Button';

export interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  onOpenQuickAdd: () => void;
}

type NavItem = { id: ActiveTab; label: string; icon: React.ReactNode };

const NAV_ITEMS: NavItem[] = [
  { id: 'home',          label: 'Ana Sayfa',       icon: <Home className="w-[15px] h-[15px]" /> },
  { id: 'documents',     label: 'Belgeler',        icon: <FileText className="w-[15px] h-[15px]" /> },
  { id: 'receipts',      label: 'Fişler',          icon: <Receipt className="w-[15px] h-[15px]" /> },
  { id: 'subscriptions', label: 'Abonelikler',     icon: <CreditCard className="w-[15px] h-[15px]" /> },
  { id: 'warranties',    label: 'Garantiler',      icon: <ShieldCheck className="w-[15px] h-[15px]" /> },
  { id: 'notes',         label: 'Notlar',          icon: <StickyNote className="w-[15px] h-[15px]" /> },
  { id: 'bookmarks',     label: 'Yer İmleri',      icon: <Bookmark className="w-[15px] h-[15px]" /> },
  { id: 'timeline',      label: 'Zaman Akışı',     icon: <Clock className="w-[15px] h-[15px]" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenQuickAdd,
}) => {
  return (
    <aside className="hidden md:flex flex-col w-[260px] shrink-0 h-screen sticky top-0 bg-background border-r border-border/40 select-none overflow-hidden">
      {/* Brand Header */}
      <div className="px-6 pt-8 pb-6">
        <button
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold tracking-tight shadow-soft shrink-0 group-hover:scale-105 transition-transform">
            K
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold text-primary tracking-tight">Kapsule</p>
            <p className="text-[11px] text-secondary font-medium uppercase tracking-widest opacity-60">Vault System</p>
          </div>
        </button>
      </div>

      {/* Search Trigger */}
      <div className="px-4 pb-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-surface/50 border border-border/60 text-secondary hover:text-primary transition-all duration-200 group hover:shadow-soft"
        >
          <Search className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100" />
          <span className="text-[13px] flex-1 text-left font-medium">Ara...</span>
          <kbd className="text-[10px] font-mono text-secondary/40 bg-background px-1.5 py-0.5 rounded-md border border-border/40">⌘K</kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-2">
        <LineSidebar
          items={NAV_ITEMS}
          activeId={activeTab}
          onItemClick={(idx, item) => onTabChange(item.id as ActiveTab)}
          accentColor="#4F46E5"
          textColor="var(--text-secondary)"
          markerColor="var(--border)"
          showIndex={false}
          showMarker={true}
          markerLength={12}
          markerGap={12}
          tickScale={0}
          itemGap={8}
          fontSize={0.85}
          maxShift={8}
        />
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 py-6 space-y-2 border-t border-border/40">
        {/* New Item */}
        <Button
          onClick={onOpenQuickAdd}
          variant="primary"
          size="sm"
          className="w-full rounded-2xl h-11 justify-start px-4"
          icon={<Plus className="w-4 h-4" />}
        >
          Yeni Ekle
        </Button>

        {/* Settings */}
        <button
          onClick={() => onTabChange('settings')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-[13px] font-medium transition-all duration-200 text-left",
            activeTab === 'settings'
              ? "bg-surface text-primary shadow-soft border border-border/60"
              : "text-secondary hover:text-primary hover:bg-surface/50"
          )}
        >
          <Settings className={cn("w-4 h-4 shrink-0", activeTab === 'settings' ? "text-primary" : "text-secondary/60")} />
          <span>Ayarlar</span>
        </button>
      </div>
    </aside>
  );
};
