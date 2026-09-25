import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { VaultCategory } from './types';
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
import { PasscodeLock } from './components/common/PasscodeLock';
import { OnboardingScreen } from './features/onboarding/OnboardingScreen';
import { VaultStorageService } from './services/vaultStorage';
import { storageAdapter } from './services/storageAdapter';
import { NotificationService } from './services/notificationService';
import { NativeStatusBarService } from './services/nativeStatusBar';
import { SplashScreen } from '@capacitor/splash-screen';
import { ToastProvider, useToast } from './components/ui/Toast';

const ONBOARDING_KEY = 'kapsule_onboarding_complete';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddInitialType, setQuickAddInitialType] = useState<VaultCategory>('document');
  
  // Interactivity and linking states
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(undefined);
  
  const [settings, setSettings] = useState(() => VaultStorageService.getSettings());
  const [isLocked, setIsLocked] = useState(() => settings.autoLock && Boolean(settings.passcode));
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return localStorage.getItem(ONBOARDING_KEY) !== 'true';
    } catch {
      return true;
    }
  });
  const { showToast } = useToast();

  const handleOnboardingComplete = () => {
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (e) {
      console.error('Failed to save onboarding state', e);
    }
    setShowOnboarding(false);
  };

  // Sync dark theme and native status bar on settings update
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    NativeStatusBarService.syncWithTheme(Boolean(settings.darkMode));
  }, [settings.darkMode]);

  // Hydrate persistent storage and run background notification check
  useEffect(() => {
    storageAdapter.hydrateFromPreferences()
      .then(() => {
        const synced = VaultStorageService.getSettings();
        setSettings(synced);
        if (synced.autoLock && synced.passcode) {
          setIsLocked(true);
        }
      })
      .catch(() => {})
      .finally(() => {
        SplashScreen.hide().catch(() => {});
      });

    try {
      NotificationService.runDailyCheck();
    } catch (e) {
      console.error('Failed to run notification check', e);
    }
  }, []);

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

  const handleNavigateToTab = (tab: ActiveTab, linkedItemId?: string) => {
    setSelectedItemId(linkedItemId);
    setActiveTab(tab);
  };

  const handleTabChange = (tab: ActiveTab) => {
    setSelectedItemId(undefined); // Clear deep link target when navigating away manually
    setActiveTab(tab);
  };

  const getContextualCategory = (tab: ActiveTab): VaultCategory => {
    switch (tab) {
      case 'receipts': return 'receipt';
      case 'warranties': return 'warranty';
      case 'subscriptions': return 'subscription';
      case 'documents': return 'document';
      case 'notes': return 'note';
      case 'bookmarks': return 'bookmark';
      default: return 'receipt';
    }
  };

  const handleOpenQuickAdd = (specificType?: VaultCategory) => {
    setQuickAddInitialType(specificType || getContextualCategory(activeTab));
    setIsQuickAddOpen(true);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            key={`home-${refreshKey}`}
            onNavigateToTab={handleNavigateToTab}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenQuickAdd={() => handleOpenQuickAdd('receipt')}
            onOpenQuickAddFor={(cat) => handleOpenQuickAdd(cat)}
          />
        );
      case 'documents':
        return (
          <DocumentsScreen
            key={`documents-${refreshKey}`}
            selectedItemId={selectedItemId}
            onOpenAdd={() => handleOpenQuickAdd('document')}
          />
        );
      case 'receipts':
        return (
          <ReceiptsScreen
            key={`receipts-${refreshKey}`}
            selectedItemId={selectedItemId}
            onOpenAdd={() => handleOpenQuickAdd('receipt')}
          />
        );
      case 'subscriptions':
        return (
          <SubscriptionsScreen
            key={`subscriptions-${refreshKey}`}
            selectedItemId={selectedItemId}
            onOpenAdd={() => handleOpenQuickAdd('subscription')}
          />
        );
      case 'warranties':
        return (
          <WarrantiesScreen
            key={`warranties-${refreshKey}`}
            selectedItemId={selectedItemId}
            onOpenAdd={() => handleOpenQuickAdd('warranty')}
            onViewReceipt={(receiptId) => handleNavigateToTab('receipts', receiptId)}
          />
        );
      case 'notes':
        return (
          <NotesScreen
            key={`notes-${refreshKey}`}
            selectedItemId={selectedItemId}
            onOpenAdd={() => handleOpenQuickAdd('note')}
          />
        );
      case 'bookmarks':
        return (
          <BookmarksScreen
            key={`bookmarks-${refreshKey}`}
            selectedItemId={selectedItemId}
            onOpenAdd={() => handleOpenQuickAdd('bookmark')}
          />
        );
      case 'timeline':
        return (
          <TimelineScreen
            key={`timeline-${refreshKey}`}
            onNavigateToTab={handleNavigateToTab}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            key={`settings-${refreshKey}`}
            onSettingsChange={() => setSettings(VaultStorageService.getSettings())}
            onLock={() => setIsLocked(true)}
            onReplayOnboarding={() => setShowOnboarding(true)}
          />
        );
      default:
        return (
          <HomeScreen
            key={`home-${refreshKey}`}
            onNavigateToTab={handleNavigateToTab}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onOpenQuickAddFor={(cat) => { setQuickAddInitialType(cat); setIsQuickAddOpen(true); }}
          />
        );
    }
  };

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (isLocked && settings.passcode) {
    return (
      <PasscodeLock
        correctPasscode={settings.passcode}
        biometricsEnabled={settings.biometricsEnabled !== false}
        onSuccess={() => setIsLocked(false)}
      />
    );
  }

  return (
    <MainLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onOpenSearch={() => setIsSearchOpen(true)}
      onOpenQuickAdd={() => handleOpenQuickAdd()}
    >
      {renderActiveScreen()}

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToTab={handleNavigateToTab}
      />

      {/* Quick Add Item Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        initialType={quickAddInitialType}
        onClose={() => {
            setIsQuickAddOpen(false);
            setQuickAddInitialType('document'); // reset so next generic add starts fresh
          }}
        onSuccess={() => {
          // Increment trigger key to refresh active sub-screen data
          setRefreshKey(prev => prev + 1);
          showToast('Kasaya eklendi.');
        }}
      />
    </MainLayout>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
