import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon, Sun, Bell, Lock, Download, Upload, RefreshCw, ChevronRight,
  LogOut, ShieldCheck, User, Trash2, CheckCircle2,
  AlertTriangle, KeyRound, Clock, Camera, X, Check, BookmarkCheck,
  Sparkles, Shield
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { VaultStorageService } from '../../services/vaultStorage';
import { NotificationService } from '../../services/notificationService';
import { useToast } from '../../components/ui/Toast';
import { triggerHaptic } from '../../utils/haptics';
import { cn } from '../../lib/utils';

/* ─────────────── Avatar Presets ─────────────── */

const AVATAR_PRESETS = [
  { id: 'shield', label: 'Kalkan', icon: '🛡️', bg: 'from-blue-500/20 to-indigo-500/20' },
  { id: 'gem', label: 'Elmas', icon: '💎', bg: 'from-emerald-500/20 to-teal-500/20' },
  { id: 'lock', label: 'Kilit', icon: '🔐', bg: 'from-amber-500/20 to-orange-500/20' },
  { id: 'rocket', label: 'Roket', icon: '🚀', bg: 'from-purple-500/20 to-pink-500/20' },
  { id: 'planet', label: 'Gezegen', icon: '🪐', bg: 'from-violet-500/20 to-fuchsia-500/20' },
  { id: 'star', label: 'Yıldız', icon: '⭐', bg: 'from-yellow-500/20 to-amber-500/20' },
];

/* ─────────────── Sub-Components ─────────────── */

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  id: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, id }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    id={id}
    onClick={() => {
      triggerHaptic.light();
      onChange();
    }}
    className={cn(
      "relative w-11 h-6 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent/40",
      checked ? "bg-accent" : "bg-surface-elevated dark:bg-white/10"
    )}
  >
    <span
      className={cn(
        "absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  right?: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  description,
  right,
  danger,
  onClick,
}) => (
  <div
    onClick={() => {
      if (onClick) {
        triggerHaptic.light();
        onClick();
      }
    }}
    onKeyDown={(event) => {
      if (!onClick) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick();
      }
    }}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    className={cn(
      "flex items-center gap-3.5 px-4 py-3.5 group rounded-xl transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-accent/30",
      onClick && "cursor-pointer active:scale-[0.99]",
      onClick && danger
        ? "hover:bg-red-500/10 text-red-500"
        : onClick
        ? "hover:bg-surface-elevated/70 dark:hover:bg-white/[0.04]"
        : ""
    )}
  >
    {/* Pure floating icon (no square box) */}
    <span
      className={cn(
        "shrink-0 transition-colors",
        danger ? "text-red-500" : "text-secondary/70 group-hover:text-accent"
      )}
    >
      {icon}
    </span>

    <div className="flex-1 min-w-0">
      <p className={cn("text-sm font-medium", danger ? "text-red-500" : "text-primary")}>
        {label}
      </p>
      {description && (
        <p className="text-xs text-secondary/60 mt-0.5 line-clamp-1 leading-tight">
          {description}
        </p>
      )}
    </div>

    {right && <div className="shrink-0">{right}</div>}
    {onClick && !right && (
      <ChevronRight className="w-4 h-4 text-secondary/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 stroke-[2]" />
    )}
  </div>
);

const SettingsSection: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="space-y-2">
    {title && (
      <p className="text-xs font-semibold text-secondary/70 uppercase tracking-wider px-1">
        {title}
      </p>
    )}
    <div className="bg-surface/50 dark:bg-white/[0.025] border border-border/70 dark:border-white/[0.07] rounded-2xl overflow-hidden divide-y divide-border/40 dark:divide-white/[0.05]">
      {children}
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');
  const [enableLockAfterPasscode, setEnableLockAfterPasscode] = useState(false);

  // Profile modal state
  const [nameInput, setNameInput] = useState(settings.profileName || '');
  const [emailInput, setEmailInput] = useState(settings.profileEmail || '');
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(settings.profileAvatar);
  const [notificationPermission, setNotificationPermission] = useState<'granted' | 'denied' | 'default' | 'unsupported'>('default');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarUploadRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setNotificationPermission(NotificationService.getPermissionStatus());
    VaultStorageService.recordLogin();
  }, []);

  const updateSetting = async <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) => {
    if (key === 'notifications' && value === true) {
      const granted = await NotificationService.requestPermission();
      setNotificationPermission(NotificationService.getPermissionStatus());
      if (!granted) {
        showToast('Tarayıcı bildirim izni verilmedi.', 'warning');
      } else {
        showToast('Bildirimler ve hatırlatmalar aktif.');
      }
    }

    const updated = VaultStorageService.saveSettings({ [key]: value });
    setSettingsState(updated);
    onSettingsChange?.();
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

  const handleTestNotification = async () => {
    triggerHaptic.medium();
    const sent = await NotificationService.sendTestNotification();
    if (sent) {
      showToast('Test bildirimi başarıyla gönderildi.');
    } else {
      showToast('Bildirim izni kapalı veya desteklenmiyor.', 'warning');
    }
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Fotoğraf en fazla 2 MB olabilir.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarPreview(base64);
      triggerHaptic.light();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = VaultStorageService.saveSettings({
      profileName: nameInput.trim() || undefined,
      profileEmail: emailInput.trim() || undefined,
      profileAvatar: avatarPreview,
    });
    setSettingsState(updated);
    setShowProfileModal(false);
    triggerHaptic.success();
    showToast('Profil ve hesap bilgileri güncellendi.');
    onSettingsChange?.();
  };

  const handleExport = () => {
    triggerHaptic.light();
    const data = {
      documents: VaultStorageService.getDocuments(),
      receipts: VaultStorageService.getReceipts(),
      subscriptions: VaultStorageService.getSubscriptions(),
      warranties: VaultStorageService.getWarranties(),
      notes: VaultStorageService.getNotes(),
      bookmarks: VaultStorageService.getBookmarks(),
      timeline: VaultStorageService.getTimeline(),
      settings: VaultStorageService.getSettings(),
      exportedAt: new Date().toISOString(),
      version: '1.0.4',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    a.download = `kapsule_kasa_yedek_${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Kasa yedeği JSON formatında indirildi.');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const res = VaultStorageService.restoreBackup(content);
        if (res.success) {
          triggerHaptic.success();
          showToast(res.message);
          setSettingsState(VaultStorageService.getSettings());
          onSettingsChange?.();
        } else {
          triggerHaptic.error();
          showToast(res.message, 'warning');
        }
      } catch {
        triggerHaptic.error();
        showToast('Yedek dosyası işlenirken hata oluştu.', 'warning');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearCache = () => {
    triggerHaptic.light();
    VaultStorageService.clearCache();
    showToast('Oturum ve form taslakları tazelendi.');
  };

  const handleConfirmReset = () => {
    triggerHaptic.heavy();
    VaultStorageService.clearVaultData();
    setShowResetModal(false);
    showToast('Tüm kasa kayıtları temizlendi.');
    window.location.reload();
  };

  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  return (
    <div className="space-y-6 max-w-lg pb-14 select-none">
      {/* Hidden File Input for Backup Restore */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportFile}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">Ayarlar</h1>
        <p className="text-sm text-secondary/70 mt-0.5">
          Kasa tercihleri, profil, güvenlik ve oturum hafızası.
        </p>
      </div>

      {/* ─── Profile & Account Card ─── */}
      <div className="p-4 bg-surface/70 dark:bg-white/[0.03] border border-border/80 dark:border-white/[0.08] rounded-3xl shadow-sm">
        <div className="flex items-center gap-3.5">
          {/* Avatar circle with photo or initial */}
          <div className="relative group shrink-0">
            <div className="w-13 h-13 rounded-full bg-accent/15 text-accent font-bold text-lg flex items-center justify-center overflow-hidden border border-accent/20">
              {settings.profileAvatar ? (
                settings.profileAvatar.startsWith('data:') ? (
                  <img
                    src={settings.profileAvatar}
                    alt="Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">{settings.profileAvatar}</span>
                )
              ) : (
                <span className="text-xl uppercase">
                  {settings.profileName ? settings.profileName.charAt(0) : 'U'}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setNameInput(settings.profileName || '');
                setEmailInput(settings.profileEmail || '');
                setAvatarPreview(settings.profileAvatar);
                setShowProfileModal(true);
              }}
              className="absolute -bottom-1 -right-1 p-1 rounded-full bg-accent text-white shadow-md hover:scale-105 transition-transform"
              title="Fotoğrafı Değiştir"
            >
              <Camera className="w-3 h-3 stroke-[2]" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold text-primary tracking-tight truncate">
                {settings.profileName || 'Kullanıcı'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setNameInput(settings.profileName || '');
                  setEmailInput(settings.profileEmail || '');
                  setAvatarPreview(settings.profileAvatar);
                  setShowProfileModal(true);
                }}
                className="text-xs text-accent font-medium hover:underline"
              >
                Düzenle
              </button>
            </div>
            <p className="text-xs text-secondary/70 truncate mt-0.5">
              {settings.profileEmail || 'Kişisel Kasa · Çevrimdışı'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onLock && settings.passcode && (
              <Button
                variant="ghost"
                size="xs"
                icon={<LogOut className="w-3.5 h-3.5 stroke-[2]" />}
                onClick={() => {
                  triggerHaptic.medium();
                  onLock();
                }}
              >
                Kilitle
              </Button>
            )}
            <Badge variant="muted" size="sm">Yerel</Badge>
          </div>
        </div>

        {/* Security & Active Session Footer */}
        <div className="mt-3.5 pt-3 border-t border-border/40 dark:border-white/[0.04] flex items-center justify-between text-[11px] text-secondary/60">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 stroke-[2]" />
            Cihaz İçi Şifrelenmiş Sandbox
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 stroke-[2]" />
            {settings.lastLoginTime ? `Giriş: ${settings.lastLoginTime}` : 'Aktif Oturum'}
          </span>
        </div>
      </div>

      {/* ─── 1. Görünüm (Appearance) ─── */}
      <SettingsSection title="Görünüm">
        <SettingsRow
          icon={settings.darkMode ? <Moon className="w-4 h-4 stroke-[1.8]" /> : <Sun className="w-4 h-4 stroke-[1.8]" />}
          label="Koyu Mod"
          description="Aydınlık ve koyu tema arasında geçiş yap"
          right={
            <Toggle
              checked={settings.darkMode}
              onChange={() => updateSetting('darkMode', !settings.darkMode)}
              id="dark-mode"
            />
          }
        />
      </SettingsSection>

      {/* ─── 2. Kasa & Oturum Hafızası (Memory & Persistence) ─── */}
      <SettingsSection title="Kasa Hafızası & Oturum">
        <SettingsRow
          icon={<BookmarkCheck className="w-4 h-4 stroke-[1.8]" />}
          label="Beni Hatırla & Oturumu Koru"
          description="Tarayıcı kapansa bile kasa girişini ve ayarları localde sakla"
          right={
            <Toggle
              checked={settings.rememberMe !== false}
              onChange={() => updateSetting('rememberMe', settings.rememberMe === false)}
              id="remember-me"
            />
          }
        />
        <SettingsRow
          icon={<Clock className="w-4 h-4 stroke-[1.8]" />}
          label="Form & Taslak Hafızası"
          description="Kayıt eklerken yarım kalırsa form bilgilerini otomatik hatırla"
          right={
            <Toggle
              checked={settings.draftMemory !== false}
              onChange={() => updateSetting('draftMemory', settings.draftMemory === false)}
              id="draft-memory"
            />
          }
        />
        <SettingsRow
          icon={<RefreshCw className="w-4 h-4 stroke-[1.8]" />}
          label="Geçici Belleği & Taslakları Temizle"
          description="Kayıtlarına zarar vermeden form önbelleğini sıfırla"
          onClick={handleClearCache}
        />
      </SettingsSection>

      {/* ─── 3. Bildirimler & Hatırlatmalar ─── */}
      <SettingsSection title="Bildirimler & Hatırlatmalar">
        <SettingsRow
          icon={<Bell className="w-4 h-4 stroke-[1.8]" />}
          label="Garanti ve Yenileme Hatırlatmaları"
          description="Önemli tarihler yaklaşmadan önce haberdar ol"
          right={
            <Toggle
              checked={settings.notifications}
              onChange={() => updateSetting('notifications', !settings.notifications)}
              id="notifications"
            />
          }
        />
        {settings.notifications && (
          <>
            <SettingsRow
              icon={<CheckCircle2 className="w-4 h-4 stroke-[1.8] text-emerald-500" />}
              label="Bildirim İzni Durumu"
              description="Tarayıcı veya cihaz bildirim yetkisi"
              right={
                <Badge
                  variant={notificationPermission === 'granted' ? 'success' : 'warning'}
                  size="sm"
                >
                  {notificationPermission === 'granted' ? 'Aktif' : 'İzin Bekleniyor'}
                </Badge>
              }
            />
            <SettingsRow
              icon={<Clock className="w-4 h-4 stroke-[1.8]" />}
              label="Hatırlatma Süresi"
              description="Sona erme gününden kaç gün önce uyarı verilsin"
              right={
                <select
                  value={settings.reminderDaysBefore || 7}
                  onChange={(e) => updateSetting('reminderDaysBefore', Number(e.target.value))}
                  className="text-xs bg-surface-elevated dark:bg-white/10 border border-border/70 dark:border-white/10 rounded-lg px-2.5 py-1 text-primary focus:outline-none focus:border-accent"
                >
                  <option value={3}>3 Gün Önce</option>
                  <option value={7}>7 Gün Önce (Önerilen)</option>
                  <option value={14}>14 Gün Önce</option>
                  <option value={30}>30 Gün Önce</option>
                </select>
              }
            />
            <div className="px-4 py-2.5 bg-surface-elevated/40 dark:bg-white/[0.015] flex justify-end">
              <Button
                variant="ghost"
                size="xs"
                icon={<Bell className="w-3.5 h-3.5 stroke-[1.8]" />}
                onClick={handleTestNotification}
              >
                Test Bildirimi Gönder
              </Button>
            </div>
          </>
        )}
      </SettingsSection>

      {/* ─── 4. Güvenlik & Kasa Kilidi ─── */}
      <SettingsSection title="Güvenlik & PIN Kilidi">
        <SettingsRow
          icon={<Lock className="w-4 h-4 stroke-[1.8]" />}
          label="Açılışta Kasayı Kilitle"
          description="Kapsule açılırken 4 haneli PIN şifre doğrulaması iste"
          right={
            <Toggle
              checked={settings.autoLock}
              onChange={handleAutoLockChange}
              id="autolock"
            />
          }
        />
        <SettingsRow
          icon={<KeyRound className="w-4 h-4 stroke-[1.8]" />}
          label="4 Haneli PIN Kodunu Belirle / Değiştir"
          description={settings.passcode ? 'PIN tanımlandı ve aktif' : 'Henüz kilit şifresi tanımlanmadı'}
          onClick={() => setShowPasscodeModal(true)}
        />
        {settings.autoLock && (
          <SettingsRow
            icon={<Clock className="w-4 h-4 stroke-[1.8]" />}
            label="Kilit Zaman Aşımı"
            description="Uygulama arka plana geçtiğinde kilitlenme süresi"
            right={
              <select
                value={settings.autoLockTimeout || 'immediate'}
                onChange={(e) => updateSetting('autoLockTimeout', e.target.value as any)}
                className="text-xs bg-surface-elevated dark:bg-white/10 border border-border/70 dark:border-white/10 rounded-lg px-2.5 py-1 text-primary focus:outline-none focus:border-accent"
              >
                <option value="immediate">Hemen Kilitle</option>
                <option value="1m">1 Dakika Sonra</option>
                <option value="5m">5 Dakika Sonra</option>
                <option value="15m">15 Dakika Sonra</option>
              </select>
            }
          />
        )}
        {onLock && settings.passcode && (
          <SettingsRow
            icon={<LogOut className="w-4 h-4 stroke-[1.8]" />}
            label="Kasayı Şimdi Kilitle"
            description="Kasa oturumunu kapat ve PIN ekranına geç"
            onClick={onLock}
          />
        )}
      </SettingsSection>

      {/* ─── 5. Veriler & Yedekleme ─── */}
      <SettingsSection title="Veriler & Yedekleme">
        <SettingsRow
          icon={<Download className="w-4 h-4 stroke-[1.8]" />}
          label="Kasayı Dışa Aktar"
          description="Tüm kayıtlarının JSON formatında yedeğini indir"
          onClick={handleExport}
        />
        <SettingsRow
          icon={<Upload className="w-4 h-4 stroke-[1.8]" />}
          label="Yedekten Geri Yükle"
          description="Daha önce aldığın JSON yedek dosyasını içeri aktar"
          onClick={() => fileInputRef.current?.click()}
        />
        <SettingsRow
          icon={<Trash2 className="w-4 h-4 stroke-[1.8]" />}
          label="Tüm Kayıtları Sıfırla"
          description="Kasadaki tüm verileri kalıcı olarak temizle"
          danger
          onClick={() => setShowResetModal(true)}
        />
      </SettingsSection>

      {/* ─── 6. App Info ─── */}
      <div className="p-4 rounded-3xl bg-surface/40 dark:bg-white/[0.015] border border-border/50 dark:border-white/[0.04] text-center space-y-1">
        <p className="text-xs font-semibold text-primary tracking-tight">Kapsüle v1.0.4</p>
        <p className="text-[11px] text-secondary/60">
          Tamamen Çevrimdışı · Sıfır Takipçi · Yerel Sandbox Güvenliği
        </p>
      </div>

      {/* ═══════════════════════════════════════════
         PORTALED HIGH-END MODALS
         ═══════════════════════════════════════════ */}

      {portalTarget && createPortal(
        <AnimatePresence>
          {/* 1. Lüks Profil & Avatar Modalı */}
          {showProfileModal && (
            <div
              className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 sm:p-4"
              role="dialog"
              aria-modal="true"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowProfileModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className={cn(
                  "relative w-full max-w-sm z-10",
                  "bg-surface dark:bg-[#13151b]",
                  "border border-border/80 dark:border-white/10",
                  "shadow-2xl shadow-black/40",
                  "rounded-t-3xl sm:rounded-3xl p-6 overflow-hidden"
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border/40 dark:border-white/[0.05]">
                  <div>
                    <h3 className="text-base font-bold text-primary tracking-tight">Profili Düzenle</h3>
                    <p className="text-xs text-secondary/70 mt-0.5">Kasa kimliği ve profil resmi</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="p-1.5 rounded-xl text-secondary/60 hover:text-primary hover:bg-surface-elevated transition-colors"
                  >
                    <X className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 pt-4">
                  {/* Avatar Picker Section */}
                  <div className="flex flex-col items-center gap-3">
                    {/* Hidden Photo File Input */}
                    <input
                      ref={avatarUploadRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFileChange}
                    />

                    {/* Circular Avatar Preview */}
                    <div className="relative group cursor-pointer" onClick={() => avatarUploadRef.current?.click()}>
                      <div className="w-20 h-20 rounded-full bg-accent/15 text-accent font-bold text-2xl flex items-center justify-center overflow-hidden border-2 border-accent shadow-md">
                        {avatarPreview ? (
                          avatarPreview.startsWith('data:') ? (
                            <img
                              src={avatarPreview}
                              alt="Profil Önizleme"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">{avatarPreview}</span>
                          )
                        ) : (
                          <span className="text-2xl uppercase">
                            {nameInput ? nameInput.charAt(0) : 'U'}
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 stroke-[2]" />
                        <span className="text-[9px] font-semibold mt-0.5">Değiştir</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => avatarUploadRef.current?.click()}
                        className="text-xs text-accent font-medium hover:underline"
                      >
                        Fotoğraf Yükle
                      </button>
                      {avatarPreview && (
                        <>
                          <span className="text-secondary/40 text-xs">·</span>
                          <button
                            type="button"
                            onClick={() => setAvatarPreview(undefined)}
                            className="text-xs text-red-500 font-medium hover:underline"
                          >
                            Kaldır
                          </button>
                        </>
                      )}
                    </div>

                    {/* Preset Avatars Row */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {AVATAR_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setAvatarPreview(p.icon);
                            triggerHaptic.light();
                          }}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm transition-transform active:scale-90",
                            avatarPreview === p.icon
                              ? "ring-2 ring-accent scale-105 bg-accent/20"
                              : "bg-surface-elevated/70 dark:bg-white/[0.04] hover:bg-surface-elevated"
                          )}
                          title={p.label}
                        >
                          {p.icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="text-xs font-medium text-secondary/80 block mb-1">
                      Kullanıcı Adı
                    </label>
                    <input
                      type="text"
                      placeholder="Örn. Ali Can"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm bg-surface/60 dark:bg-white/[0.04] border border-border/80 dark:border-white/10 rounded-xl text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                    />
                  </div>

                  {/* Vault Title / Email Input */}
                  <div>
                    <label className="text-xs font-medium text-secondary/80 block mb-1">
                      Kasa Başlığı / Açıklama
                    </label>
                    <input
                      type="text"
                      placeholder="Örn. Kişisel Kasa"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm bg-surface/60 dark:bg-white/[0.04] border border-border/80 dark:border-white/10 rounded-xl text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowProfileModal(false)}
                      className="flex-1 h-11 rounded-xl text-sm font-medium text-secondary border border-border/80 dark:border-white/10 hover:bg-surface-elevated transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-11 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent/90 shadow-md shadow-accent/20 transition-all active:scale-[0.98]"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* 2. PIN Şifre Belirleme / Değiştirme Modalı */}
          {showPasscodeModal && (
            <div
              className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 sm:p-4"
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowPasscodeModal(false);
                  setEnableLockAfterPasscode(false);
                  setNewPasscode('');
                }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className={cn(
                  "relative w-full max-w-sm z-10",
                  "bg-surface dark:bg-[#13151b]",
                  "border border-border/80 dark:border-white/10",
                  "shadow-2xl shadow-black/40",
                  "rounded-t-3xl sm:rounded-3xl p-6 overflow-hidden space-y-4"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-primary">Kasa PIN Şifresi</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasscodeModal(false);
                      setEnableLockAfterPasscode(false);
                      setNewPasscode('');
                    }}
                    className="p-1 rounded-lg text-secondary/60 hover:text-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-secondary/70">
                  Kasa kilidi için 4 haneli sayısal bir şifre girin.
                </p>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  aria-label="Yeni 4 haneli şifre"
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full text-center text-3xl tracking-[0.5em] font-mono py-3 bg-surface/50 dark:bg-white/[0.04] border border-border/80 dark:border-white/10 rounded-xl text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowPasscodeModal(false);
                      setEnableLockAfterPasscode(false);
                      setNewPasscode('');
                    }}
                  >
                    İptal
                  </Button>
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
                      triggerHaptic.success();
                      showToast('Kasa şifresi başarıyla kaydedildi.');
                    }}
                  >
                    Kaydet
                  </Button>
                </div>
              </motion.div>
            </div>
          )}

          {/* 3. Kasayı Sıfırlama Onay Modalı */}
          {showResetModal && (
            <div
              className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 sm:p-4"
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowResetModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                className={cn(
                  "relative w-full max-w-sm z-10",
                  "bg-surface dark:bg-[#13151b]",
                  "border border-red-500/20",
                  "shadow-2xl shadow-black/40",
                  "rounded-t-3xl sm:rounded-3xl p-6 overflow-hidden space-y-4"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary">Kasayı Sıfırlamak İstiyor Musunuz?</h3>
                  <p className="text-xs text-secondary/70 mt-1 leading-relaxed">
                    Kasadaki tüm belgeler, fişler, garantiler, abonelikler ve notlar kalıcı olarak silinecektir. Bu işlem geri alınamaz.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResetModal(false)}
                  >
                    Vazgeç
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleConfirmReset}
                  >
                    Evet, Hepsini Sil
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        portalTarget
      )}
    </div>
  );
};
