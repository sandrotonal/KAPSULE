import React from 'react';
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

export interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  onOpenQuickAdd: () => void;
}

type NavItem = { id: ActiveTab; label: string; icon: React.ReactNode };

const NAV_ITEMS: NavItem[] = [
  { id: 'home',          label: 'Home',           icon: <Home className="w-[15px] h-[15px]" /> },
  { id: 'documents',     label: 'Documents',      icon: <FileText className="w-[15px] h-[15px]" /> },
  { id: 'receipts',      label: 'Receipts',       icon: <Receipt className="w-[15px] h-[15px]" /> },
  { id: 'subscriptions', label: 'Subscriptions',  icon: <CreditCard className="w-[15px] h-[15px]" /> },
  { id: 'warranties',    label: 'Warranties',     icon: <ShieldCheck className="w-[15px] h-[15px]" /> },
  { id: 'notes',         label: 'Notes',          icon: <StickyNote className="w-[15px] h-[15px]" /> },
  { id: 'bookmarks',     label: 'Bookmarks',      icon: <Bookmark className="w-[15px] h-[15px]" /> },
  { id: 'timeline',      label: 'Timeline',       icon: <Clock className="w-[15px] h-[15px]" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenQuickAdd,
}) => {
  return (
    <aside className="hidden md:flex flex-col w-[220px] shrink-0 h-screen sticky top-0 bg-[#FAFAFA] border-r border-[#EBEBEB] select-none overflow-hidden">
      {/* Brand Header */}
      <div className="px-4 pt-5 pb-3">
        <button
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold tracking-tight shadow-soft shrink-0">
            K
          </div>
          <div className="leading-none">
            <p className="text-sm font-semibold text-primary tracking-[-0.02em]">Kapsule</p>
            <p className="text-[10px] text-secondary mt-0.5">Personal Vault</p>
          </div>
        </button>
      </div>

      {/* Search Trigger */}
      <div className="px-3 pb-3">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-surface border border-border text-secondary hover:text-primary transition-colors duration-150 group"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs flex-1 text-left">Search...</span>
          <kbd className="text-[10px] font-mono text-secondary/60 bg-surface-elevated px-1 rounded">⌘K</kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-sm transition-all duration-100 text-left",
                isActive
                  ? "bg-background text-primary font-medium shadow-soft border border-[#EBEBEB]"
                  : "text-secondary hover:text-primary hover:bg-background/60"
              )}
            >
              <span className={cn(
                "shrink-0 transition-colors",
                isActive ? "text-primary" : "text-secondary/80"
              )}>
                {item.icon}
              </span>
              <span className="text-[13px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-2 py-3 space-y-0.5 border-t border-[#EBEBEB]">
        {/* New Item */}
        <button
          onClick={onOpenQuickAdd}
          className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-sm text-secondary hover:text-primary hover:bg-background/60 transition-all duration-100 text-left"
        >
          <Plus className="w-[15px] h-[15px] shrink-0 text-secondary/80" />
          <span className="text-[13px]">New Item</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => onTabChange('settings')}
          className={cn(
            "w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-sm transition-all duration-100 text-left",
            activeTab === 'settings'
              ? "bg-background text-primary font-medium shadow-soft border border-[#EBEBEB]"
              : "text-secondary hover:text-primary hover:bg-background/60"
          )}
        >
          <Settings className={cn("w-[15px] h-[15px] shrink-0", activeTab === 'settings' ? "text-primary" : "text-secondary/80")} />
          <span className="text-[13px]">Settings</span>
        </button>
      </div>
    </aside>
  );
};
