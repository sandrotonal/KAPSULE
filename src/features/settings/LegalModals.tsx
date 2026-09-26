import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  Shield,
  FileText,
  Mail,
  X,
  CheckCircle2,
  Lock,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
  Download,
  Award,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { triggerHaptic } from '../../utils/haptics';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
}) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="legal-modal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className={cn(
            "fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4 select-none",
            !isOpen && "pointer-events-none"
          )}
          style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            onClick={() => {
              triggerHaptic.light();
              onClose();
            }}
            className={cn(
              "fixed inset-0 bg-black/60 backdrop-blur-md",
              !isOpen && "pointer-events-none"
            )}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className={cn(
              "relative w-full max-w-lg z-10 max-h-[88vh] flex flex-col",
              "bg-surface dark:bg-[#121316]",
              "border border-border/80 dark:border-white/10",
              "shadow-2xl shadow-black/50",
              "rounded-t-3xl sm:rounded-3xl overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 dark:border-white/[0.06] bg-surface/90 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-white/[0.06] border border-border/60 dark:border-white/[0.08] text-primary flex items-center justify-center shrink-0 shadow-xs">
                  {icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary tracking-tight">{title}</h3>
                  <p className="text-xs text-secondary/70 mt-0.5">{subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic.light();
                  onClose();
                }}
                className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-surface-elevated dark:hover:bg-white/5 transition-colors border border-border/40 hover:border-border"
                aria-label="Kapat"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto thin-scrollbar space-y-4 text-sm text-secondary/90 leading-relaxed">
              {children}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-border/50 dark:border-white/[0.06] bg-surface/50 dark:bg-white/[0.015] flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  triggerHaptic.light();
                  onClose();
                }}
              >
                Anladım
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

/* ──────────────────────────────────────────────────────────
   1. GİZLİLİK POLİTİKASI (Apple Guideline 5.1.1 Uyumlu)
   ────────────────────────────────────────────────────────── */

export const PrivacyPolicyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => (
  <ModalWrapper
    isOpen={isOpen}
    onClose={onClose}
    title="Gizlilik Politikası"
    subtitle="Apple App Store & Google Play Veri Güvenliği Standardı"
    icon={<Shield className="w-5 h-5 stroke-[1.8]" />}
  >
    <div className="space-y-3.5 text-xs sm:text-sm">
      {/* Verified Status Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-start gap-3 shadow-xs">
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
        <span className="text-xs leading-relaxed font-medium">
          Kapsüle, sıfır takipçi (Zero Tracker) ve yerel sandbox (Local Sandbox) mimarisi ile geliştirilmiştir. Belgeleriniz ve verileriniz asla uzaktaki bir sunucuya aktarılmaz.
        </span>
      </div>

      {/* Section 1 */}
      <div className="p-4 rounded-2xl bg-surface-elevated/50 dark:bg-white/[0.025] border border-border/60 dark:border-white/[0.06] space-y-1.5">
        <h4 className="font-semibold text-primary text-xs sm:text-sm flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-accent shrink-0" />
          <span>1. Cihaz İçi Kasa & Yerel Depolama</span>
        </h4>
        <p className="text-secondary/80 leading-relaxed text-xs sm:text-[13px]">
          Uygulamaya kaydettiğiniz tüm fiş, fatura, garanti belgeleri, abonelik bilgileri ve özel notlar yalnızca kendi cihazınızın izole depolama alanında (IndexedDB) saklanır. Harici bir bulut veritabanı bulunmaz.
        </p>
      </div>

      {/* Section 2 */}
      <div className="p-4 rounded-2xl bg-surface-elevated/50 dark:bg-white/[0.025] border border-border/60 dark:border-white/[0.06] space-y-1.5">
        <h4 className="font-semibold text-primary text-xs sm:text-sm flex items-center gap-2">
          <Lock className="w-4 h-4 text-accent shrink-0" />
          <span>2. Biyometrik Veriler & PIN Güvenliği</span>
        </h4>
        <p className="text-secondary/80 leading-relaxed text-xs sm:text-[13px]">
          Face ID, Touch ID veya cihaz PIN doğrulaması işletim sisteminizin donanımsal güvenlik çipi (Apple Secure Enclave / Android Keystore) tarafından denetlenir. Kapsüle hiçbir zaman biyometrik verilerinize erişemez veya bunları kaydedemez.
        </p>
      </div>

      {/* Section 3 */}
      <div className="p-4 rounded-2xl bg-surface-elevated/50 dark:bg-white/[0.025] border border-border/60 dark:border-white/[0.06] space-y-1.5">
        <h4 className="font-semibold text-primary text-xs sm:text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent shrink-0" />
          <span>3. Üçüncü Taraf Takip ve Reklamlar</span>
        </h4>
        <p className="text-secondary/80 leading-relaxed text-xs sm:text-[13px]">
          Kapsüle içinde hiçbir analitik kütüphanesi (Google Analytics, Firebase Tracking, Facebook SDK vb.) veya reklam ağı yer almaz. Kullanım alışkanlıklarınız profil çıkarımı için kullanılamaz.
        </p>
      </div>

      {/* Section 4 */}
      <div className="p-4 rounded-2xl bg-surface-elevated/50 dark:bg-white/[0.025] border border-border/60 dark:border-white/[0.06] space-y-1.5">
        <h4 className="font-semibold text-primary text-xs sm:text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent shrink-0" />
          <span>4. Veri Silme Hakkı (Apple Guideline 5.1.1v)</span>
        </h4>
        <p className="text-secondary/80 leading-relaxed text-xs sm:text-[13px]">
          Ayarlar menüsündeki &quot;Tüm Kayıtları Sıfırla&quot; seçeneğiyle, cihazınızda kayıtlı olan tüm verileri tek bir dokunuşla kalıcı olarak silebilirsiniz. Kapsüle bir bulut hesabı gerektirmediği için silme işlemi anında ve geri döndürülemez şekilde tamamlanır.
        </p>
      </div>

      <div className="pt-2 border-t border-border/50 dark:border-white/5 flex items-center justify-between text-[11px] text-secondary/60">
        <span>Son Güncelleme: Eylül 2026</span>
        <span>Sürüm 1.0.4 (Store Ready)</span>
      </div>
    </div>
  </ModalWrapper>
);

/* ──────────────────────────────────────────────────────────
   2. KULLANIM KOŞULLARI (Terms of Service)
   ────────────────────────────────────────────────────────── */

export const TermsOfServiceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => (
  <ModalWrapper
    isOpen={isOpen}
    onClose={onClose}
    title="Kullanım Koşulları"
    subtitle="Hizmet Şartları ve Sorumluluk Çerçevesi"
    icon={<FileText className="w-5 h-5 stroke-[1.8]" />}
  >
    <div className="space-y-3.5 text-xs sm:text-sm">
      {/* Intro Highlight */}
      <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-white/[0.04] border border-border/60 dark:border-white/[0.06] text-primary flex items-start gap-3 shadow-xs">
        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <span className="text-xs leading-relaxed font-medium">
          Kapsüle, kişisel verilerinizi, garanti sürelerinizi ve abonelik periyotlarınızı düzenlemenize yardımcı olan bağımsız ve çevrimdışı bir kişisel kasa yardımcısıdır.
        </span>
      </div>

      {/* Section 1 */}
      <div className="p-4 rounded-2xl bg-surface-elevated/50 dark:bg-white/[0.025] border border-border/60 dark:border-white/[0.06] space-y-1.5">
        <h4 className="font-semibold text-primary text-xs sm:text-sm flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-accent shrink-0" />
          <span>1. Hizmetin Niteliği & Çevrimdışı Çalışma</span>
        </h4>
        <p className="text-secondary/80 leading-relaxed text-xs sm:text-[13px]">
          Kapsüle, fiş, fatura ve garanti belgelerinizi yerel sandbox ortamında arşivlemeniz için çevrimdışı çalışan bağımsız bir dijital kasa asistanıdır.
        </p>
      </div>

      {/* Section 2 */}
      <div className="p-4 rounded-2xl bg-surface-elevated/50 dark:bg-white/[0.025] border border-border/60 dark:border-white/[0.06] space-y-1.5">
        <h4 className="font-semibold text-primary text-xs sm:text-sm flex items-center gap-2">
          <Download className="w-4 h-4 text-accent shrink-0" />
          <span>2. Yerel Yedekleme & Kullanıcı Sorumluluğu</span>
        </h4>
        <p className="text-secondary/80 leading-relaxed text-xs sm:text-[13px]">
          Kapsüle verileri buluta otomatik yüklemez. Cihaz kaybı, fabrika ayarlarına dönme veya telefon değişimi durumlarında veri kaybı yaşamamak için &quot;Ayarlar &gt; Kasayı Dışa Aktar&quot; özelliğini kullanarak düzenli aralıklarla JSON yedek dosyanızı saklamanız kullanıcının sorumluluğundadır.
        </p>
      </div>

      {/* Section 3 */}
      <div className="p-4 rounded-2xl bg-surface-elevated/50 dark:bg-white/[0.025] border border-border/60 dark:border-white/[0.06] space-y-1.5">
        <h4 className="font-semibold text-primary text-xs sm:text-sm flex items-center gap-2">
          <Award className="w-4 h-4 text-accent shrink-0" />
          <span>3. Fikri Mülkiyet & Telif Hakları</span>
        </h4>
        <p className="text-secondary/80 leading-relaxed text-xs sm:text-[13px]">
          Kapsüle&apos;ye ait tüm tasarım, kod mimarisi, logo ve arayüz unsurları telif hakları ile korunmaktadır. İzinsiz çoğaltılamaz veya ticari amaçla kopyalanamaz.
        </p>
      </div>

      {/* Section 4 */}
      <div className="p-4 rounded-2xl bg-surface-elevated/50 dark:bg-white/[0.025] border border-border/60 dark:border-white/[0.06] space-y-1.5">
        <h4 className="font-semibold text-primary text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-accent shrink-0" />
          <span>4. Sorumluluk Çerçevesi & Garanti Takibi</span>
        </h4>
        <p className="text-secondary/80 leading-relaxed text-xs sm:text-[13px]">
          Kapsüle, işletim sistemi bildirim gecikmeleri veya kullanıcı tarafından girilen hatalı tarihlerden ötürü doğabilecek garanti süre aşımı ya da abonelik yenilenmesi gibi durumlardan hukuki olarak sorumlu tutulamaz.
        </p>
      </div>

      <div className="pt-2 border-t border-border/50 dark:border-white/5 flex items-center justify-between text-[11px] text-secondary/60">
        <span>Son Güncelleme: Eylül 2026</span>
        <span>Kapsüle Mobil Kasa</span>
      </div>
    </div>
  </ModalWrapper>
);

/* ──────────────────────────────────────────────────────────
   3. DESTEK & GERİ BİLDİRİM (Support Modal)
   ────────────────────────────────────────────────────────── */

export const SupportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    triggerHaptic.light();
    navigator.clipboard?.writeText('destek@kapsule.app');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    triggerHaptic.medium();
    window.location.href = 'mailto:destek@kapsule.app?subject=Kapsule Destek ve Geri Bildirim v1.0.4';
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Destek & İletişim"
      subtitle="Geliştirici ekiple iletişime geçin"
      icon={<Mail className="w-5 h-5 stroke-[1.8]" />}
    >
      <div className="space-y-3.5 text-xs sm:text-sm">
        <p className="text-secondary/80 text-xs sm:text-[13px]">
          Kapsüle ile ilgili soru, öneri veya karşılaştığınız teknik durumları doğrudan geliştirici ekibe iletebilirsiniz.
        </p>

        {/* Quick Contact & Diagnostics Card */}
        <div className="p-4 rounded-2xl bg-surface-elevated/60 dark:bg-white/[0.03] border border-border/70 dark:border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary/70">E-Posta:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-primary font-medium">destek@kapsule.app</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="p-1 rounded-md hover:bg-surface-elevated dark:hover:bg-white/10 text-secondary hover:text-primary transition-colors"
                title="E-posta adresini kopyala"
                aria-label="E-posta adresini kopyala"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary/70">Uygulama Sürümü:</span>
            <span className="font-mono text-primary">v1.0.4 (Build 104)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary/70">Yanıt Süresi:</span>
            <span className="text-emerald-500 font-medium">Genellikle 24 saat içinde</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary/70">Mimari:</span>
            <span className="text-secondary/90 font-medium">Sıfır Sunucu · Yerel Sandbox</span>
          </div>
        </div>

        {/* Direct Action Button */}
        <div>
          <button
            type="button"
            onClick={handleSendEmail}
            className="w-full h-11 rounded-xl text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>E-Posta ile İletişime Geç</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>

        {/* Sıkça Sorulan Sorular (Quick FAQ) */}
        <div className="pt-2 border-t border-border/50 dark:border-white/5 space-y-2">
          <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-accent" />
            <span>Sıkça Sorulan Sorular</span>
          </p>

          <div className="p-3 rounded-xl bg-surface-elevated/40 dark:bg-white/[0.02] border border-border/50 dark:border-white/[0.05] space-y-1">
            <p className="text-xs font-medium text-primary">Yeni telefona geçerken verilerim silinir mi?</p>
            <p className="text-[11px] text-secondary/70 leading-relaxed">
              Ayarlar menüsünden &quot;Kasayı Dışa Aktar&quot; seçeneğiyle JSON yedeğinizi indirin. Yeni telefonunuzda &quot;Yedekten Geri Yükle&quot;ye dokunarak saniyeler içinde tüm kayıtlarınızı geri yükleyebilirsiniz.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated/40 dark:bg-white/[0.02] border border-border/50 dark:border-white/[0.05] space-y-1">
            <p className="text-xs font-medium text-primary">Kapsüle internet olmadan çalışır mı?</p>
            <p className="text-[11px] text-secondary/70 leading-relaxed">
              Evet! Kapsüle %100 yerel ve çevrimdışı mimariye sahiptir. İnternet bağlantınız olmasa bile kasanıza erişebilir ve kayıt ekleyebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
