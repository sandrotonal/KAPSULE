import React, { useState } from 'react';
import { Moon, Bell, Lock, Download, RefreshCw, ChevronRight, Info, Sun } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { VaultStorageService } from '../../services/vaultStorage';

type ToggleProps = { checked: boolean; onChange: () => void; id: string };
const Toggle: React.FC<ToggleProps> = ({ checked, onChange, id }) => (
  <button
    role="switch"
    aria-checked={checked}
    id={id}
    onClick={onChange}
    className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent/30 ${checked ? 'bg-primary' : 'bg-border'}`}
  >
    <span
      className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white shadow-soft transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`}
    />
  </button>
);

const SettingsRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  description?: string;
  right?: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}> = ({ icon, label, description, right, danger, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3.5 group ${onClick ? 'cursor-pointer' : ''} ${onClick && danger ? 'hover:bg-danger-muted' : onClick ? 'hover:bg-surface-elevated' : ''} transition-colors`}
  >
    <span className={danger ? 'text-danger' : 'text-secondary group-hover:text-primary transition-colors'}>
      {icon}
    </span>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium ${danger ? 'text-danger' : 'text-primary'}`}>{label}</p>
      {description && <p className="text-xs text-secondary mt-0.5 line-clamp-1">{description}</p>}
    </div>
    {right}
    {onClick && !right && (
      <ChevronRight className="w-4 h-4 text-secondary/40 group-hover:text-secondary transition-colors shrink-0" />
    )}
  </div>
);

const SettingsSection: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-1.5">
    {title && <p className="text-xs font-medium text-secondary px-0.5">{title}</p>}
    <div className="bg-background border border-border rounded-2xl overflow-hidden divide-y divide-border">
      {children}
    </div>
  </div>
);

export const SettingsScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [toast, setToast] = useState('');

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleExport = () => {
    const data = {
      documents: VaultStorageService.getDocuments(),
      receipts: VaultStorageService.getReceipts(),
      subscriptions: VaultStorageService.getSubscriptions(),
      warranties: VaultStorageService.getWarranties(),
      notes: VaultStorageService.getNotes(),
      bookmarks: VaultStorageService.getBookmarks(),
      timeline: VaultStorageService.getTimeline(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kapsule_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast('Backup downloaded.');
    setTimeout(() => setToast(''), 2500);
  };

  const handleReset = () => {
    if (confirm('Reset vault to default demo data? This cannot be undone.')) {
      VaultStorageService.resetVault();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-7 max-w-lg">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-[-0.02em]">Settings</h1>
        <p className="text-sm text-secondary mt-0.5">Vault preferences and account details.</p>
      </div>

      {/* Success toast */}
      {toast && (
        <div className="px-4 py-2.5 bg-success-muted border border-success/20 rounded-xl text-sm font-medium text-success">
          {toast}
        </div>
      )}

      {/* Profile */}
      <div className="flex items-center gap-4 p-4 bg-background border border-border rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-semibold text-lg flex items-center justify-center shrink-0">
          A
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-primary tracking-[-0.01em]">Ali Can</p>
          <p className="text-sm text-secondary">Personal vault · Kapsule</p>
        </div>
        <Badge variant="success" size="sm" dot>Active</Badge>
      </div>

      {/* Appearance */}
      <SettingsSection title="Appearance">
        <SettingsRow
          icon={darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          label="Dark mode"
          description="Switch between light and dark interface"
          right={<Toggle checked={darkMode} onChange={toggleDark} id="dark-mode" />}
        />
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications">
        <SettingsRow
          icon={<Bell className="w-4 h-4" />}
          label="Warranty and renewal reminders"
          description="Get notified before important expiry dates"
          right={<Toggle checked={notifications} onChange={() => setNotifications(!notifications)} id="notifications" />}
        />
      </SettingsSection>

      {/* Security */}
      <SettingsSection title="Security">
        <SettingsRow
          icon={<Lock className="w-4 h-4" />}
          label="Auto-lock vault"
          description="Require authentication when idle"
          right={<Toggle checked={autoLock} onChange={() => setAutoLock(!autoLock)} id="autolock" />}
        />
      </SettingsSection>

      {/* Data */}
      <SettingsSection title="Data">
        <SettingsRow
          icon={<Download className="w-4 h-4" />}
          label="Export vault"
          description="Download a JSON backup of all your data"
          onClick={handleExport}
        />
        <SettingsRow
          icon={<RefreshCw className="w-4 h-4" />}
          label="Reset to demo data"
          description="Restore factory seed content"
          danger
          onClick={handleReset}
        />
      </SettingsSection>

      {/* About */}
      <SettingsSection>
        <SettingsRow
          icon={<Info className="w-4 h-4" />}
          label="Kapsule v1.0"
          description="Everything important. One place."
          right={<Badge variant="muted" size="xs">2026</Badge>}
        />
      </SettingsSection>
    </div>
  );
};
