import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { MainLayout } from './layouts/MainLayout';
import { HomeScreen } from './features/home/HomeScreen';
import { DocumentsScreen } from './features/documents/DocumentsScreen';
import { ReceiptsScreen } from './features/receipts/ReceiptsScreen';
import { SubscriptionsScreen } from './features/subscriptions/SubscriptionsScreen';
import { WarrantiesScreen } from './features/warranties/WarrantiesScreen';
import { NotesScreen } from './features/notes/NotesScreen';
import { BookmarksScreen } from './features/bookmarks/BookmarksScreen';
import { TimelineScreen } from './features/timeline/TimelineScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { SearchModal } from './features/search/SearchModal';
import { QuickAddModal } from './components/common/QuickAddModal';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Global Cmd+K search hotkey handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToTab={setActiveTab}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          />
        );
      case 'documents':
        return <DocumentsScreen onOpenAdd={() => setIsQuickAddOpen(true)} />;
      case 'receipts':
        return <ReceiptsScreen onOpenAdd={() => setIsQuickAddOpen(true)} />;
      case 'subscriptions':
        return <SubscriptionsScreen onOpenAdd={() => setIsQuickAddOpen(true)} />;
      case 'warranties':
        return <WarrantiesScreen onOpenAdd={() => setIsQuickAddOpen(true)} />;
      case 'notes':
        return <NotesScreen onOpenAdd={() => setIsQuickAddOpen(true)} />;
      case 'bookmarks':
        return <BookmarksScreen onOpenAdd={() => setIsQuickAddOpen(true)} />;
      case 'timeline':
        return <TimelineScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return (
          <HomeScreen
            onNavigateToTab={setActiveTab}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          />
        );
    }
  };

  return (
    <MainLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onOpenSearch={() => setIsSearchOpen(true)}
      onOpenQuickAdd={() => setIsQuickAddOpen(true)}
    >
      {renderActiveScreen()}

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToTab={setActiveTab}
      />

      {/* Quick Add Item Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={() => {
          // Re-render current tab
          setActiveTab(prev => prev);
        }}
      />
    </MainLayout>
  );
}

export default App;
