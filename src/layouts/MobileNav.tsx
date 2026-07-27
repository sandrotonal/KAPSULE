import React from 'react';
import { Home, FileText, ShieldCheck, Settings, Plus, Search, CreditCard } from 'lucide-react';
import { ActiveTab } from '../types';
import { cn } from '../lib/utils';
import FluidTabs, { FluidTabsIcon, FluidTabsLabel } from '../components/ui/FluidTabs';

export interface MobileNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  onOpenQuickAdd: () => void;
}

const MAIN_TABS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: 'home',      label: 'Ana Sayfa', icon: <Home className="w-5 h-5" /> },
  { id: 'documents', label: 'Belgeler',  icon: <FileText className="w-5 h-5" /> },
  { id: 'warranties',label: 'Garanti',   icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 'subscriptions', label: 'Diğer', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'settings',  label: 'Ayarlar',   icon: <Settings className="w-5 h-5" /> },
];

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const activeIndex = MAIN_TABS.findIndex(
    tab => tab.id === activeTab || (tab.id === 'subscriptions' && ['subscriptions','receipts','notes','bookmarks','timeline'].includes(activeTab))
  );

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 select-none flex justify-center pointer-events-auto">
      <FluidTabs
        activeIndex={activeIndex < 0 ? 0 : activeIndex}
        onActiveIndexChange={(idx) => onTabChange(MAIN_TABS[idx].id)}
        className="w-full max-w-lg"
      >
        <FluidTabs.List className="w-full justify-around bg-surface/90 backdrop-blur-2xl border border-border/80 shadow-2xl p-1.5 rounded-full">
          {MAIN_TABS.map((tab) => (
            <FluidTabs.Tab key={tab.id} label={tab.label} className="py-2.5 px-3 justify-center min-h-[44px]">
              <FluidTabsIcon>{tab.icon}</FluidTabsIcon>
            </FluidTabs.Tab>
          ))}
        </FluidTabs.List>
      </FluidTabs>
    </nav>
  );
};
