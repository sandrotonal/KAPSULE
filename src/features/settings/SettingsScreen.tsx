import React, { useState } from 'react';
import { Moon, Bell, Lock, Download, RefreshCw, ChevronRight, Info, Sun, LogOut } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { VaultStorageService } from '../../services/vaultStorage';
import { useToast } from '../../components/ui/Toast';

type ToggleProps = { checked: boolean; onChange: () => void; id: string };
const Toggle: React.FC<ToggleProps> = ({ checked, onChange, id }) => (
  <button
    role="switch"
    aria-checked={checked}
    id={id}
    onClick={onChange}
    className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent/30 ${checked ? 'bg-accent' : 'bg-surface-elevated'}`}
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
    onKeyDown={(event) => {
      if (!onClick) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick();
      }
    }}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    className={`flex items-center gap-3 px-4 py-3.5 group rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 ${onClick ? 'cursor-pointer' : ''} ${onClick && danger ? 'hover:bg-danger-muted' : onClick ? 'hover:bg-surface-elevated' : ''} transition-colors`}
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

const getTodayISO = () => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().split('T')[0];
};

export interface SettingsScreenProps {
  onSettingsChange?: () => void;
  onLock?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onSettingsChange,
  onLock,
}) => {
  const [settings, setSettingsState] = useState(() => VaultStorageService.getSettings());
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');
  const [enableLockAfterPasscode, setEnableLockAfterPasscode] = useState(false);
  const { showToast } = useToast();

  const updateSetting = (key: 'darkMode' | 'notifications' | 'autoLock', value: boolean) => {
    const updated = VaultStorageService.saveSettings({ [key]: value });
    setSettingsState(updated);
    if (onSettingsChange) {
      onSettingsChange();
    }
  };

  const handleAutoLockChange = () => {
    if (settings.autoLock) {
      updateSetting('autoLock', false);
      return;
    }

    if (!settings.passcode) {
      setEnableLockAfterPasscode(true);
      setShowPasscodeModal(true);
      return;
    }

    updateSetting('autoLock', true);
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
    a.download = `kapsule_backup_${getTodayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Yedek indirildi.');
  };

  const handleReset = () => {
    if (confirm('Kasadaki tüm kayıtları silmek istiyor musunuz? Bu işlem geri alınamaz.')) {
      VaultStorageService.clearVaultData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-7 max-w-lg">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-[-0.02em]">Ayarlar</h1>
        <p className="text-sm text-secondary mt-0.5">Kasa tercihleri, güvenlik ve veri yönetimi.</p>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-4 p-4 bg-background border border-border rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-primary text-background font-semibold text-lg flex items-center justify-center shrink-0 uppercase">
          {settings.profileName ? settings.profileName.charAt(0) : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-primary tracking-[-0.01em]">{settings.profileName || 'Kullanıcı'}</p>
          <p className="text-sm text-secondary">{settings.profileEmail || 'Kişisel kasa'}</p>
        </div>
        <div className="flex items-center gap-2">
          {onLock && settings.passcode && (
            <Button
              variant="ghost"
              size="xs"
              icon={<LogOut className="w-3.5 h-3.5" />}
              onClick={onLock}
            >
              Kilitle
            </Button>
          )}
          <Badge variant="muted" size="sm">Yerel kasa</Badge>
        </div>
      </div>

      {/* Appearance */}
      <SettingsSection title="Görünüm">
        <SettingsRow
          icon={settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          label="Koyu mod"
          description="Aydınlık ve koyu görünüm arasında geçiş yap"
          right={<Toggle checked={settings.darkMode} onChange={() => updateSetting('darkMode', !settings.darkMode)} id="dark-mode" />}
        />
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Bildirimler">
        <SettingsRow
          icon={<Bell className="w-4 h-4" />}
          label="Garanti ve yenileme hatırlatmaları"
          description="Önemli tarihler yaklaşmadan önce haber ver"
          right={<Toggle checked={settings.notifications} onChange={() => updateSetting('notifications', !settings.notifications)} id="notifications" />}
        />
      </SettingsSection>

      {/* Security & Passcode */}
      <SettingsSection title="Güvenlik">
        <SettingsRow
          icon={<Lock className="w-4 h-4" />}
          label="Açılışta kasayı kilitle"
          description="Kapsule açılırken 4 haneli şifre iste"
          right={<Toggle checked={settings.autoLock} onChange={handleAutoLockChange} id="autolock" />}
        />
        <SettingsRow
          icon={<Lock className="w-4 h-4" />}
          label="4 haneli şifreyi değiştir"
          description="Kasa kilidi için yeni bir şifre belirle"
          onClick={() => setShowPasscodeModal(true)}
        />
      </SettingsSection>

      {/* Data */}
      <SettingsSection title="Veriler">
        <SettingsRow
          icon={<Download className="w-4 h-4" />}
          label="Kasayı dışa aktar"
          description="Tüm kayıtlarının JSON yedeğini indir"
          onClick={handleExport}
        />
        <SettingsRow
          icon={<RefreshCw className="w-4 h-4" />}
          label="Tüm kayıtları sil"
          description="Kasadaki kayıtları kalıcı olarak kaldır"
          danger
          onClick={handleReset}
        />
      </SettingsSection>

      {/* Change Passcode Modal */}
      {showPasscodeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-primary">Şifreyi değiştir</h3>
            <p className="text-xs text-secondary">Kasa kilidi için yeni 4 haneli sayısal şifre gir.</p>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              aria-label="Yeni 4 haneli şifre"
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 bg-background border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => { setShowPasscodeModal(false); setEnableLockAfterPasscode(false); }}>İptal</Button>
              <Button
                variant="primary"
                size="sm"
                disabled={newPasscode.length !== 4}
                onClick={() => {
                  const updated = VaultStorageService.saveSettings({
                    passcode: newPasscode,
                    autoLock: enableLockAfterPasscode || settings.autoLock,
                  });
                  setSettingsState(updated);
                  onSettingsChange?.();
                  setShowPasscodeModal(false);
                  setNewPasscode('');
                  setEnableLockAfterPasscode(false);
                  showToast('Şifre güncellendi.');
                }}
              >
                Kaydet
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
