import React from 'react';
import { Home, Receipt, ShieldCheck, Settings, Plus, Search, CreditCard } from 'lucide-react';
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
  { id: 'home', label: 'Ana Sayfa', icon: <Home className="w-5 h-5" /> },
  { id: 'receipts', label: 'Fişler', icon: <Receipt className="w-5 h-5" /> },
  { id: 'warranties', label: 'Garanti', icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 'subscriptions', label: 'Abonelik', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'settings', label: 'Ayarlar', icon: <Settings className="w-5 h-5" /> },
];

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const activeIndex = MAIN_TABS.findIndex(
    tab => tab.id === activeTab || (tab.id === 'subscriptions' && ['subscriptions', 'documents', 'notes', 'bookmarks', 'timeline'].includes(activeTab))
  );

  return (
    <nav
      className="md:hidden fixed left-0 right-0 z-40 select-none flex justify-center pointer-events-auto px-4"
      style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <FluidTabs
        activeIndex={activeIndex < 0 ? 0 : activeIndex}
        onActiveIndexChange={(idx) => onTabChange(MAIN_TABS[idx].id)}
        className="w-full max-w-[320px]"
      >
        <FluidTabs.List className="w-full justify-around bg-surface/90 backdrop-blur-2xl border border-border/80 shadow-2xl p-1.5 rounded-full">
          {MAIN_TABS.map((tab) => (
            <FluidTabs.Tab key={tab.id} label={tab.label} className="py-2.5 px-1 justify-center min-h-[44px]">
              <FluidTabsIcon>{tab.icon}</FluidTabsIcon>
            </FluidTabs.Tab>
          ))}
        </FluidTabs.List>
      </FluidTabs>
    </nav>
  );
};
