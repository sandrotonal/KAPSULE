import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ActiveTab } from '../types';

export interface MainLayoutProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  onOpenQuickAdd: () => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenQuickAdd,
  children,
}) => {
  return (
    <div className="min-h-screen bg-background text-primary flex">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onOpenSearch={onOpenSearch}
        onOpenQuickAdd={onOpenQuickAdd}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-30">
          <button
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2 active:opacity-70"
          >
            <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              K
            </div>
            <span className="text-[15px] font-semibold text-primary tracking-[-0.02em]">Kapsule</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-secondary text-xs active:scale-95 transition-transform"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Search
            </button>
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white active:scale-95 transition-transform"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto thin-scrollbar">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-10 pb-24 md:pb-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <MobileNav
          activeTab={activeTab}
          onTabChange={onTabChange}
          onOpenSearch={onOpenSearch}
          onOpenQuickAdd={onOpenQuickAdd}
        />
      </div>
    </div>
  );
};
