import React from 'react';
import { motion } from 'framer-motion';
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
  const mainRef = React.useRef<HTMLElement>(null);

  // Always reset scroll to top when changing pages/tabs
  React.useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

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
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto thin-scrollbar"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          <div
            className="max-w-5xl mx-auto px-6 sm:px-10 py-8 sm:py-16 md:pb-16"
            style={{ paddingBottom: 'calc(6.5rem + env(safe-area-inset-bottom, 0px))' }}
          >
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.15,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="transform-gpu will-change-[transform,opacity]"
            >
              {children}
            </motion.div>
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
