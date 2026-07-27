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
    <div className="min-h-screen bg-background text-primary flex selection:bg-accent/10 selection:text-accent">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onOpenSearch={onOpenSearch}
        onOpenQuickAdd={onOpenQuickAdd}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto thin-scrollbar scroll-smooth">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10 sm:py-16 pb-32 md:pb-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.99 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
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
