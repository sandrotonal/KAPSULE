import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon, Sun, Bell, Lock, Download, Upload, RefreshCw, ChevronRight,
  LogOut, ShieldCheck, User, Trash2, CheckCircle2,
  AlertTriangle, KeyRound, Clock, Camera, X, Check, BookmarkCheck,
  Sparkles, Shield, FileText, Mail, Fingerprint, Zap, Crown, ChevronUp, ChevronDown, Crop
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { VaultStorageService } from '../../services/vaultStorage';
import { NotificationService } from '../../services/notificationService';
import { NativeShareService } from '../../services/nativeShare';
import { NativeBiometricsService } from '../../services/nativeBiometrics';
import { PrivacyPolicyModal, TermsOfServiceModal, SupportModal } from './LegalModals';
import { AvatarCropModal } from './AvatarCropModal';
import { useToast } from '../../components/ui/Toast';
import { triggerHaptic } from '../../utils/haptics';
import { cn } from '../../lib/utils';

/* ─────────────── Avatar Presets (Lucide Vector Icons) ─────────────── */

const AVATAR_PRESETS = [
  { id: 'user', label: 'Profil', Icon: User },
  { id: 'shield', label: 'Kalkan', Icon: Shield },
  { id: 'lock', label: 'Kasa', Icon: Lock },
  { id: 'fingerprint', label: 'Biyometrik', Icon: Fingerprint },
  { id: 'sparkles', label: 'Yıldız', Icon: Sparkles },
  { id: 'zap', label: 'Hızlı', Icon: Zap },
  { id: 'key', label: 'Anahtar', Icon: KeyRound },
  { id: 'crown', label: 'VIP', Icon: Crown },
];

const renderAvatarContent = (avatarValue?: string, nameValue?: string, iconSize = "w-6 h-6") => {
  if (avatarValue?.startsWith('data:')) {
    return (
      <img
        src={avatarValue}
        alt="Profil"
        className="w-full h-full object-cover object-center pointer-events-none block shrink-0"
      />
    );
  }
  
  switch (avatarValue) {
    case 'shield':
      return <Shield className={cn(iconSize, "stroke-[1.8]")} />;
    case 'lock':
      return <Lock className={cn(iconSize, "stroke-[1.8]")} />;
    case 'fingerprint':
      return <Fingerprint className={cn(iconSize, "stroke-[1.8]")} />;
    case 'sparkles':
      return <Sparkles className={cn(iconSize, "stroke-[1.8]")} />;
    case 'zap':
      return <Zap className={cn(iconSize, "stroke-[1.8]")} />;
    case 'key':
      return <KeyRound className={cn(iconSize, "stroke-[1.8]")} />;
    case 'crown':
      return <Crown className={cn(iconSize, "stroke-[1.8]")} />;
    case 'user':
      return <User className={cn(iconSize, "stroke-[1.8]")} />;
    default:
      // If it's an old legacy emoji or empty, sanitize and show uppercase initial letter
      const initial = (nameValue || 'Kullanıcı').trim().charAt(0).toUpperCase() || 'K';
      return <span className="font-bold text-lg">{initial}</span>;
  }
};

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
  onReplayOnboarding?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onSettingsChange,
  onLock,
  onReplayOnboarding,
}) => {
  const [settings, setSettingsState] = useState(() => VaultStorageService.getSettings());
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');
  const [enableLockAfterPasscode, setEnableLockAfterPasscode] = useState(false);

  // Profile modal state
  const [nameInput, setNameInput] = useState(settings.profileName || '');
  const [emailInput, setEmailInput] = useState(settings.profileEmail || '');
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(settings.profileAvatar);
  const [isProfileCardExpanded, setIsProfileCardExpanded] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<'granted' | 'denied' | 'default' | 'unsupported'>('default');
  const [hasBiometricsHardware, setHasBiometricsHardware] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarUploadRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setNotificationPermission(NotificationService.getPermissionStatus());
    VaultStorageService.recordLogin();
    NativeBiometricsService.isAvailable().then(setHasBiometricsHardware);
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

    if (file.size > 5 * 1024 * 1024) {
      showToast('Fotoğraf en fazla 5 MB olabilir.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawSrc = event.target?.result as string;
      setCropImageSrc(rawSrc);
      setShowCropModal(true);
      triggerHaptic.light();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = (croppedBase64: string) => {
    setAvatarPreview(croppedBase64);
    const updated = VaultStorageService.saveSettings({
      profileAvatar: croppedBase64,
    });
    setSettingsState(updated);
    onSettingsChange?.();
    setShowCropModal(false);
    setCropImageSrc(null);
    triggerHaptic.success();
    showToast('Profil fotoğrafı kırpıldı ve kaydedildi.');
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

  const handleExport = async () => {
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
    const jsonString = JSON.stringify(data, null, 2);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `kapsule_kasa_yedek_${dateStr}.json`;

    const result = await NativeShareService.shareData({
      title: 'Kapsüle Kasa Yedeği',
      text: `Kapsüle Kişisel Kasa Yedeği (${dateStr})`,
      filename,
      dataString: jsonString,
      mimeType: 'application/json',
    });

    if (result.success) {
      triggerHaptic.success();
      showToast(result.method === 'native' ? 'Kasa yedeği paylaşıldı.' : 'Kasa yedeği JSON formatında indirildi.');
    }
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

      {/* Hidden File Input for Avatar Photo */}
      <input
        ref={avatarUploadRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarFileChange}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">Ayarlar</h1>
        <p className="text-sm text-secondary/70 mt-0.5">
          Kasa tercihleri, profil, güvenlik ve oturum hafızası.
        </p>
      </div>

      {/* ─── Interactive Sliding Drawer Profile Card (User Design Architecture) ─── */}
      <div
        onClick={() => {
          triggerHaptic.light();
          setIsProfileCardExpanded((prev) => !prev);
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isProfileCardExpanded}
        aria-label="Kullanıcı Kasa Profili"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerHaptic.light();
            setIsProfileCardExpanded((prev) => !prev);
          }
        }}
        className={cn(
          "relative w-full h-[270px] sm:h-[285px] rounded-[32px] p-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none cursor-pointer overflow-hidden border transform-gpu",
          "bg-white dark:bg-[#121316]",
          "border-zinc-200/90 dark:border-white/[0.08]",
          "shadow-[0_20px_45px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
        )}
      >
        {/* Top-Right Quick Action Button */}
        <div className="absolute top-3.5 right-3.5 z-30 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              avatarUploadRef.current?.click();
            }}
            className="p-2 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md border border-zinc-200/80 dark:border-white/15 text-zinc-700 dark:text-zinc-200 shadow-md hover:scale-105 active:scale-95 transition-all"
            title="Fotoğraf Değiştir"
          >
            <Camera className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>

        {/* ─── Hero / Profile Avatar Stage (Morphes from Full Card to Corner Squircle) ─── */}
        <div
          className={cn(
            "absolute overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-[1]",
            isProfileCardExpanded
              ? "w-[76px] h-[76px] top-3 left-3 rounded-2xl ring-4 ring-white dark:ring-[#121316] shadow-xl z-[3]"
              : "inset-1.5 rounded-[26px]"
          )}
        >
          {settings.profileAvatar?.startsWith('data:') ? (
            <div className="w-full h-full relative bg-zinc-900">
              <img
                src={settings.profileAvatar}
                alt="Profil"
                className="w-full h-full object-cover object-center"
              />
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none transition-opacity duration-300",
                  isProfileCardExpanded ? "opacity-0" : "opacity-100"
                )}
              />
            </div>
          ) : (
            <div className="w-full h-full relative flex items-center justify-center bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-md">
              <div className="relative z-10 transition-transform duration-500">
                {renderAvatarContent(settings.profileAvatar, settings.profileName, isProfileCardExpanded ? "w-8 h-8" : "w-12 h-12 sm:w-14 sm:h-14")}
              </div>
            </div>
          )}
        </div>

        {/* ─── Bottom Sliding Tray (Toggles on Click, Seamless & Balanced) ─── */}
        <div
          className={cn(
            "absolute bottom-1.5 left-1.5 right-1.5 z-[2] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu",
            "bg-zinc-950 dark:bg-[#16171b] text-white backdrop-blur-2xl",
            "border border-white/10 dark:border-white/[0.08]",
            "shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_15px_35px_rgba(0,0,0,0.35)]",
            isProfileCardExpanded
              ? "top-[20%] rounded-tl-[44px] rounded-tr-[26px] rounded-b-[26px]"
              : "top-[75%] rounded-[26px]"
          )}
        >
          {/* Collapsed State Bar (Resting View) */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-[64px] px-5 flex items-center justify-between transition-all duration-300 pointer-events-auto",
              isProfileCardExpanded ? "opacity-0 pointer-events-none -translate-y-2" : "opacity-100 translate-y-0"
            )}
          >
            <div className="min-w-0 pr-3">
              <p className="text-sm font-bold text-white tracking-tight truncate">
                {settings.profileName || 'Kullanıcı'}
              </p>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                {settings.profileEmail || 'Kişisel Kasa · Çevrimdışı'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs shrink-0 font-medium">
              <span className="text-[11px] hidden sm:inline">Genişlet</span>
              <div className={cn(
                "w-6 h-6 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-400",
                isProfileCardExpanded ? "rotate-180" : "rotate-0"
              )}>
                <ChevronUp className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* Expanded State Full View (Clean, Balanced & No Clutter) */}
          <div
            className={cn(
              "absolute inset-0 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300",
              isProfileCardExpanded
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-2 pointer-events-none"
            )}
          >
            {/* Top info section (clears the top-left avatar squircle) */}
            <div className="pt-1 pl-22 sm:pl-24 pr-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                    {settings.profileName || 'Kullanıcı'}
                  </h3>
                  <p className="text-xs text-zinc-400 truncate mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    {settings.profileEmail || 'Kişisel Kasa · Çevrimdışı'}
                  </p>
                </div>
                <Badge variant="muted" size="sm" className="bg-white/10 text-white/90 border-white/10 shrink-0">
                  Yerel
                </Badge>
              </div>
            </div>

            {/* Bottom action buttons: Symmetrically centered & equally spaced across entire card */}
            <div className="pt-3 border-t border-white/10 w-full mt-auto">
              <div className={cn(
                "grid gap-2 sm:gap-2.5 w-full",
                onLock && settings.passcode ? "grid-cols-3" : "grid-cols-2"
              )}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic.medium();
                    setNameInput(settings.profileName || '');
                    setEmailInput(settings.profileEmail || '');
                    setAvatarPreview(settings.profileAvatar);
                    setShowProfileModal(true);
                  }}
                  className="w-full py-2.5 px-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs shadow-md hover:bg-zinc-100 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
                  <span className="truncate">Profili Düzenle</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    avatarUploadRef.current?.click();
                  }}
                  className="w-full py-2.5 px-2.5 rounded-xl bg-white/10 text-zinc-200 hover:text-white hover:bg-white/15 active:scale-95 transition-all flex items-center justify-center gap-1.5 text-xs font-medium border border-white/10"
                >
                  <Camera className="w-3.5 h-3.5 stroke-[2] shrink-0" />
                  <span className="truncate">Fotoğraf</span>
                </button>

                {onLock && settings.passcode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic.medium();
                      onLock();
                    }}
                    className="w-full py-2.5 px-2.5 rounded-xl bg-white/10 text-zinc-300 hover:text-white hover:bg-white/15 active:scale-95 transition-all flex items-center justify-center gap-1.5 text-xs font-medium border border-white/10"
                  >
                    <LogOut className="w-3.5 h-3.5 stroke-[2] shrink-0" />
                    <span className="truncate">Kilitle</span>
                  </button>
                )}
              </div>
            </div>
          </div>
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
                  className="text-xs bg-surface-elevated dark:bg-zinc-800 border border-border/70 dark:border-zinc-700/80 rounded-lg px-2.5 py-1 text-primary focus:outline-none focus:border-accent cursor-pointer transition-colors"
                >
                  <option value={3} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">3 Gün Önce</option>
                  <option value={7} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">7 Gün Önce (Önerilen)</option>
                  <option value={14} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">14 Gün Önce</option>
                  <option value={30} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">30 Gün Önce</option>
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
        {hasBiometricsHardware && (
          <SettingsRow
            icon={<Fingerprint className="w-4 h-4 stroke-[1.8]" />}
            label="Biyometrik Kilit (Face ID / Parmak İzi)"
            description="PIN yerine yüz veya parmak izi ile anında kilit aç"
            right={
              <Toggle
                checked={settings.biometricsEnabled !== false}
                onChange={async () => {
                  const target = settings.biometricsEnabled === false;
                  if (target) {
                    const enrolled = await NativeBiometricsService.enrollBiometrics(settings.profileName || 'Kapsule');
                    if (enrolled) {
                      updateSetting('biometricsEnabled', true);
                      showToast('Biyometrik kilit aktif edildi.');
                    } else {
                      showToast('Biyometrik yetkilendirme tamamlanamadı.', 'warning');
                    }
                  } else {
                    NativeBiometricsService.clearEnrollment();
                    updateSetting('biometricsEnabled', false);
                    showToast('Biyometrik kilit kapatıldı.');
                  }
                }}
                id="biometrics-toggle"
              />
            }
          />
        )}
        {settings.autoLock && (
          <SettingsRow
            icon={<Clock className="w-4 h-4 stroke-[1.8]" />}
            label="Kilit Zaman Aşımı"
            description="Uygulama arka plana geçtiğinde kilitlenme süresi"
            right={
              <select
                value={settings.autoLockTimeout || 'immediate'}
                onChange={(e) => updateSetting('autoLockTimeout', e.target.value as any)}
                className="text-xs bg-surface-elevated dark:bg-zinc-800 border border-border/70 dark:border-zinc-700/80 rounded-lg px-2.5 py-1 text-primary focus:outline-none focus:border-accent cursor-pointer transition-colors"
              >
                <option value="immediate" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Hemen Kilitle</option>
                <option value="1m" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">1 Dakika Sonra</option>
                <option value="5m" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">5 Dakika Sonra</option>
                <option value="15m" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">15 Dakika Sonra</option>
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

      {/* ─── 6. Yasal & Destek (Store Compliance) ─── */}
      <SettingsSection title="Yasal & Destek">
        <SettingsRow
          icon={<Shield className="w-4 h-4 stroke-[1.8]" />}
          label="Gizlilik Politikası"
          description="Veri güvenliği, yerel sandbox ve sıfır takipçi politikası"
          onClick={() => setShowPrivacyModal(true)}
        />
        <SettingsRow
          icon={<FileText className="w-4 h-4 stroke-[1.8]" />}
          label="Kullanım Koşulları"
          description="Hizmet şartları ve yerel yedekleme sorumluluğu"
          onClick={() => setShowTermsModal(true)}
        />
        <SettingsRow
          icon={<Mail className="w-4 h-4 stroke-[1.8]" />}
          label="Destek & Geri Bildirim"
          description="Geliştirici ekiple iletişime geç veya soru sor"
          onClick={() => setShowSupportModal(true)}
        />
      </SettingsSection>

      {/* ─── 7. App Info ─── */}
      <div className="p-4 rounded-3xl bg-surface/40 dark:bg-white/[0.015] border border-border/50 dark:border-white/[0.04] text-center space-y-2">
        <p className="text-xs font-semibold text-primary tracking-tight">Kapsüle v1.0.4</p>
        <p className="text-[11px] text-secondary/60">
          Tamamen Çevrimdışı · Sıfır Takipçi · Yerel Sandbox Güvenliği
        </p>
        {onReplayOnboarding && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onReplayOnboarding}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-secondary hover:text-primary bg-surface dark:bg-white/[0.04] border border-border/60 hover:border-border transition-colors active:scale-95 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Tanıtım Turunu İzle</span>
            </button>
          </div>
        )}
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
                transition={{ duration: 0.16 }}
                onClick={() => setShowProfileModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "relative w-full max-w-sm z-10",
                  "bg-white dark:bg-[#121316]",
                  "border border-zinc-200/80 dark:border-white/[0.08]",
                  "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]",
                  "rounded-t-3xl sm:rounded-3xl p-6 overflow-hidden transform-gpu"
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-white/[0.05]">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">Profili Düzenle</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Kasa kimliği ve profil ikonu</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <X className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 pt-4">
                  {/* Avatar Picker Section */}
                  <div className="flex flex-col items-center gap-3">
                    {/* Squircle Avatar Preview */}
                    <div className="relative group cursor-pointer shrink-0 w-20 h-20" onClick={() => avatarUploadRef.current?.click()}>
                      <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-white/[0.06] text-zinc-900 dark:text-zinc-100 font-bold text-2xl flex items-center justify-center overflow-hidden border border-zinc-300 dark:border-white/15 shadow-sm transition-transform group-hover:scale-105 shrink-0">
                        {renderAvatarContent(avatarPreview, nameInput, "w-8 h-8")}
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 stroke-[2]" />
                        <span className="text-[10px] font-semibold mt-0.5">Değiştir</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => avatarUploadRef.current?.click()}
                        className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors"
                      >
                        Fotoğraf Yükle
                      </button>
                      {avatarPreview && (
                        <>
                          <span className="text-secondary/40 text-xs">·</span>
                          <button
                            type="button"
                            onClick={() => setAvatarPreview(undefined)}
                            className="text-xs text-red-500 font-semibold hover:text-red-600 transition-colors"
                          >
                            Kaldır
                          </button>
                        </>
                      )}
                    </div>

                    {/* Preset Vector Icons Row (No Emojis!) */}
                    <div className="flex items-center justify-center gap-1.5 pt-1 flex-wrap">
                      {AVATAR_PRESETS.map((p) => {
                        const isSelected = avatarPreview === p.id;
                        const Icon = p.Icon;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setAvatarPreview(p.id);
                              triggerHaptic.light();
                            }}
                            className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90",
                              isSelected
                                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm"
                                : "bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-transparent hover:border-zinc-300 dark:hover:border-white/10"
                            )}
                            title={p.label}
                          >
                            <Icon className="w-4 h-4 stroke-[1.8]" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                      Kullanıcı Adı
                    </label>
                    <input
                      type="text"
                      placeholder="Örn. Ali Can"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm bg-zinc-50 dark:bg-white/[0.035] border border-zinc-200/80 dark:border-white/[0.08] rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:bg-white dark:focus:bg-white/[0.06] transition-all"
                    />
                  </div>

                  {/* Vault Title / Email Input */}
                  <div>
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                      Kasa Başlığı / Açıklama
                    </label>
                    <input
                      type="text"
                      placeholder="Örn. Kişisel Kasa"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm bg-zinc-50 dark:bg-white/[0.035] border border-zinc-200/80 dark:border-white/[0.08] rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-white focus:bg-white dark:focus:bg-white/[0.06] transition-all"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowProfileModal(false)}
                      className="flex-1 h-11 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-11 rounded-xl text-sm font-semibold text-white bg-zinc-900 dark:bg-white dark:text-zinc-950 hover:opacity-90 transition-all active:scale-[0.98] shadow-sm"
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

      {/* ─── Avatar Crop & Frame Alignment Modal ─── */}
      <AvatarCropModal
        isOpen={showCropModal}
        imageSrc={cropImageSrc}
        onClose={() => {
          setShowCropModal(false);
          setCropImageSrc(null);
        }}
        onCropComplete={handleCropComplete}
      />

      {/* ─── Legal & App Store Compliance Modals ─── */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
};
