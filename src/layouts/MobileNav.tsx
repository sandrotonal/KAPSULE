import React from 'react';
import { Home, FileText, ShieldCheck, Settings, Plus, Search, CreditCard } from 'lucide-react';
import { ActiveTab } from '../types';
import { cn } from '../lib/utils';

export interface MobileNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  onOpenQuickAdd: () => void;
}

const MAIN_TABS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: 'home',      label: 'Home',      icon: <Home className="w-5 h-5" /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="w-5 h-5" /> },
  { id: 'warranties',label: 'Warranties',icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 'subscriptions', label: 'More', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'settings',  label: 'Settings',  icon: <Settings className="w-5 h-5" /> },
];

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border pb-safe select-none">
      <div className="flex items-center h-[54px] px-2">
        {MAIN_TABS.map((tab) => {
          const isActive = activeTab === tab.id || (tab.id === 'subscriptions' && ['subscriptions','receipts','notes','bookmarks','timeline'].includes(activeTab));
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-xl transition-all duration-150 active:scale-95",
                isActive ? "text-primary" : "text-secondary"
              )}
            >
              <span className={cn("transition-transform duration-150", isActive && "scale-[1.08]")}>
                {tab.icon}
              </span>
              <span className={cn(
                "text-[10px] font-medium leading-none transition-all",
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
