import React, { useState } from 'react';
import { Moon, Bell, Lock, Download, RefreshCw, ChevronRight, Info, Sun, LogOut } from 'lucide-react';
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
    className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent/30 ${checked ? 'bg-accent' : 'bg-border'}`}
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

export interface SettingsScreenProps {
  onSettingsChange?: () => void;
  onLock?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onSettingsChange,
  onLock,
}) => {
  const [settings, setSettingsState] = useState(() => VaultStorageService.getSettings());
  const [toast, setToast] = useState('');
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');

  const updateSetting = (key: 'darkMode' | 'notifications' | 'autoLock', value: boolean) => {
    const updated = VaultStorageService.saveSettings({ [key]: value });
    setSettingsState(updated);
    if (onSettingsChange) {
      onSettingsChange();
    }
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
        <div className="w-12 h-12 rounded-full bg-primary text-background font-semibold text-lg flex items-center justify-center shrink-0 uppercase">
          {settings.profileName ? settings.profileName.charAt(0) : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-primary tracking-[-0.01em]">{settings.profileName || 'User'}</p>
          <p className="text-sm text-secondary">{settings.profileEmail || 'Personal vault'}</p>
        </div>
        <div className="flex items-center gap-2">
          {onLock && (
            <Button
              variant="ghost"
              size="xs"
              icon={<LogOut className="w-3.5 h-3.5" />}
              onClick={onLock}
            >
              Lock
            </Button>
          )}
          <Badge variant="success" size="sm" dot>Active</Badge>
        </div>
      </div>

      {/* Appearance */}
      <SettingsSection title="Appearance">
        <SettingsRow
          icon={settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          label="Dark mode"
          description="Switch between light and dark interface"
          right={<Toggle checked={settings.darkMode} onChange={() => updateSetting('darkMode', !settings.darkMode)} id="dark-mode" />}
        />
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications">
        <SettingsRow
          icon={<Bell className="w-4 h-4" />}
          label="Warranty and renewal reminders"
          description="Get notified before important expiry dates"
          right={<Toggle checked={settings.notifications} onChange={() => updateSetting('notifications', !settings.notifications)} id="notifications" />}
        />
      </SettingsSection>

      {/* Security & Passcode */}
      <SettingsSection title="Security & Passcode">
        <SettingsRow
          icon={<Lock className="w-4 h-4" />}
          label="Auto-lock vault on start"
          description="Require 4-digit passcode when opening app"
          right={<Toggle checked={settings.autoLock} onChange={() => updateSetting('autoLock', !settings.autoLock)} id="autolock" />}
        />
        <SettingsRow
          icon={<Lock className="w-4 h-4" />}
          label="Change 4-digit Passcode"
          description={`Current passcode: ${settings.passcode || '1234'}`}
          onClick={() => setShowPasscodeModal(true)}
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

      {/* Change Passcode Modal */}
      {showPasscodeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-primary">Change Passcode</h3>
            <p className="text-xs text-secondary">Enter a new 4-digit numeric code for your vault lock.</p>
            <input
              type="password"
              maxLength={4}
              placeholder="e.g. 5678"
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 bg-background border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowPasscodeModal(false)}>Cancel</Button>
              <Button
                variant="primary"
                size="sm"
                disabled={newPasscode.length !== 4}
                onClick={() => {
                  VaultStorageService.saveSettings({ passcode: newPasscode });
                  setSettingsState(prev => ({ ...prev, passcode: newPasscode }));
                  setShowPasscodeModal(false);
                  setNewPasscode('');
                  setToast('Passcode updated successfully.');
                  setTimeout(() => setToast(''), 2500);
                }}
              >
                Save Passcode
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
