import React, { lazy, Suspense, useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { VaultCategory } from './types';
import { MainLayout } from './layouts/MainLayout';
import { SearchModal } from './features/search/SearchModal';
import { QuickAddModal } from './components/common/QuickAddModal';
import { VaultStorageService } from './services/vaultStorage';
import { storageAdapter } from './services/storageAdapter';
import { NotificationService } from './services/notificationService';
import { NativeStatusBarService } from './services/nativeStatusBar';
import { SplashScreen } from '@capacitor/splash-screen';
import { ToastProvider, useToast } from './components/ui/Toast';

const HomeScreen = lazy(() => import('./features/home/HomeScreen').then(module => ({ default: module.HomeScreen })));
const DocumentsScreen = lazy(() => import('./features/documents/DocumentsScreen').then(module => ({ default: module.DocumentsScreen })));
const ReceiptsScreen = lazy(() => import('./features/receipts/ReceiptsScreen').then(module => ({ default: module.ReceiptsScreen })));
const SubscriptionsScreen = lazy(() => import('./features/subscriptions/SubscriptionsScreen').then(module => ({ default: module.SubscriptionsScreen })));
const WarrantiesScreen = lazy(() => import('./features/warranties/WarrantiesScreen').then(module => ({ default: module.WarrantiesScreen })));
const NotesScreen = lazy(() => import('./features/notes/NotesScreen').then(module => ({ default: module.NotesScreen })));
const BookmarksScreen = lazy(() => import('./features/bookmarks/BookmarksScreen').then(module => ({ default: module.BookmarksScreen })));
const TimelineScreen = lazy(() => import('./features/timeline/TimelineScreen').then(module => ({ default: module.TimelineScreen })));
const SettingsScreen = lazy(() => import('./features/settings/SettingsScreen').then(module => ({ default: module.SettingsScreen })));
const PasscodeLock = lazy(() => import('./components/common/PasscodeLock').then(module => ({ default: module.PasscodeLock })));
const OnboardingScreen = lazy(() => import('./features/onboarding/OnboardingScreen').then(module => ({ default: module.OnboardingScreen })));

const ScreenLoading: React.FC = () => (
  <div className="screen-loading" role="status" aria-label="Ekran yükleniyor">
    <div className="capsule-loader" aria-hidden="true">
      <div className="capsule-loader__scene">
        <div className="capsule-loader__shadow" />
        <div className="capsule-loader__cube capsule-loader__cube--one">
          <span className="capsule-loader__face capsule-loader__face--front" />
          <span className="capsule-loader__face capsule-loader__face--top" />
          <span className="capsule-loader__face capsule-loader__face--side" />
        </div>
        <div className="capsule-loader__cube capsule-loader__cube--two">
          <span className="capsule-loader__face capsule-loader__face--front" />
          <span className="capsule-loader__face capsule-loader__face--top" />
          <span className="capsule-loader__face capsule-loader__face--side" />
        </div>
        <div className="capsule-loader__cube capsule-loader__cube--three">
          <span className="capsule-loader__face capsule-loader__face--front" />
          <span className="capsule-loader__face capsule-loader__face--top" />
          <span className="capsule-loader__face capsule-loader__face--side" />
        </div>
      </div>
    </div>
    <span className="screen-loading__label">Hazırlanıyor</span>
  </div>
);

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

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
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
            onOpenSearch={handleOpenSearch}
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
            onOpenSearch={handleOpenSearch}
            onOpenQuickAdd={() => handleOpenQuickAdd()}
            onOpenQuickAddFor={(cat) => handleOpenQuickAdd(cat)}
          />
        );
    }
  };

  if (showOnboarding) {
    return (
      <Suspense fallback={<ScreenLoading />}>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </Suspense>
    );
  }

  if (isLocked && settings.passcode) {
    return (
      <Suspense fallback={<ScreenLoading />}>
        <PasscodeLock
          correctPasscode={settings.passcode}
          biometricsEnabled={settings.biometricsEnabled !== false}
          onSuccess={() => setIsLocked(false)}
        />
      </Suspense>
    );
  }

  const handleGlobalRefresh = async () => {
    setRefreshKey(prev => prev + 1);
    showToast('Kasa güncellendi.');
  };

  return (
    <MainLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onOpenSearch={handleOpenSearch}
      onOpenQuickAdd={() => handleOpenQuickAdd()}
      onRefresh={handleGlobalRefresh}
    >
      <Suspense fallback={<ScreenLoading />}>
        {renderActiveScreen()}
      </Suspense>

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
        }}
        onSuccess={() => {
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
