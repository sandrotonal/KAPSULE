import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Shield, FileText, Mail, X, CheckCircle2, Lock, Smartphone, ExternalLink } from 'lucide-react';
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
        <div
          className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4 select-none"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              triggerHaptic.light();
              onClose();
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className={cn(
              "relative w-full max-w-lg z-10 max-h-[85vh] flex flex-col",
              "bg-surface dark:bg-[#121316]",
              "border border-border/80 dark:border-white/10",
              "shadow-2xl shadow-black/40",
              "rounded-t-3xl sm:rounded-3xl overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 dark:border-white/[0.06] bg-surface/80 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
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
                className="p-2 rounded-xl text-secondary/60 hover:text-primary hover:bg-surface-elevated dark:hover:bg-white/5 transition-colors"
                aria-label="Kapat"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 overflow-y-auto thin-scrollbar space-y-4 text-sm text-secondary/80 leading-relaxed">
              {children}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-border/40 dark:border-white/[0.06] bg-surface/50 dark:bg-white/[0.015] flex justify-end">
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
        </div>
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
    <div className="space-y-4 text-xs sm:text-sm">
      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
        <span className="text-xs leading-relaxed font-medium">
          Kapsüle, sıfır takipçi (Zero Tracker) ve yerel sandbox (Local Sandbox) mimarisi ile inşa edilmiştir. Verileriniz asla uzaktaki bir sunucuya iletilmez.
        </span>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-primary text-xs sm:text-sm flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-accent" />
          1. Veri Depolama & Cihaz İçi Kasa
        </h4>
        <p>
          Uygulamaya kaydettiğiniz belgeler, garanti süreleri, faturalar/fişler, abonelik bilgileri ve özel notlar yalnızca sizin cihazınızda (IndexedDB & şifreli yerel depolama) barındırılır.
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-primary text-xs sm:text-sm flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-accent" />
          2. Biyometrik Veriler & PIN Güvenliği
        </h4>
        <p>
          Face ID, Touch ID veya cihaz PIN doğrulaması işletim sisteminizin donanımsal güvenlik çipi (Apple Secure Enclave / Android Keystore) tarafından denetlenir. Kapsüle hiçbir zaman biyometrik verilerinize erişemez veya bunları kaydedemez.
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-primary text-xs sm:text-sm flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-accent" />
          3. Üçüncü Taraf Takip ve Reklamlar
        </h4>
        <p>
          Kapsüle içinde hiçbir analitik kütüphanesi (Google Analytics, Firebase Tracking, Facebook SDK vb.) veya reklam ağı yer almaz. Kullanım alışkanlıklarınız profil çıkarımı için kullanılamaz.
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-primary text-xs sm:text-sm flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-accent" />
          4. Veri Silme Hakkı (Apple Guideline 5.1.1v)
        </h4>
        <p>
          Ayarlar sekmesindeki "Tüm Kayıtları Sıfırla" seçeneğiyle, cihazınızda kayıtlı olan tüm verileri tek bir dokunuşla kalıcı olarak silebilirsiniz. Kapsüle bir bulut hesabı gerektirmediği için silme işlemi anında ve geri döndürülemez şekilde tamamlanır.
        </p>
      </div>

      <p className="text-[11px] text-secondary/60 pt-2 border-t border-border/40 dark:border-white/5">
        Son Güncelleme: Eylül 2026 · Sürüm 1.0.4
      </p>
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
    <div className="space-y-4 text-xs sm:text-sm">
      <div className="space-y-2">
        <h4 className="font-semibold text-primary text-xs sm:text-sm">1. Hizmetin Niteliği</h4>
        <p>
          Kapsüle, kişisel verilerinizi, garanti sürelerinizi ve abonelik döngülerinizi organize etmenize yardımcı olan bağımsız bir dijital kasa asistanıdır.
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-primary text-xs sm:text-sm">2. Yedekleme Sorumluluğu</h4>
        <p>
          Kapsüle verileri buluta otomatik yüklemez. Cihaz kaybı, fabrika ayarlarına dönme veya telefon değişimi durumlarında veri kaybı yaşamamak için "Ayarlar &gt; Kasayı Dışa Aktar" özelliğini kullanarak düzenli aralıklarla yedek dosyanızı (JSON) saklamanız kullanıcının sorumluluğundadır.
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-primary text-xs sm:text-sm">3. Fikri Mülkiyet</h4>
        <p>
          Kapsüle'ye ait tüm tasarım, kod mimarisi, logo ve arayüz unsurları telif hakları ile korunmaktadır. İzinsiz çoğaltılamaz veya ticari amaçla kopyalanamaz.
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-primary text-xs sm:text-sm">4. Sorumluluk Reddi</h4>
        <p>
          Kapsüle, bildirim gecikmeleri veya kullanıcı tarafından girilen hatalı tarihlerden ötürü doğabilecek garanti süre aşımı ya da abonelik yenilenmesi gibi durumlardan hukuki olarak sorumlu tutulamaz.
        </p>
      </div>

      <p className="text-[11px] text-secondary/60 pt-2 border-t border-border/40 dark:border-white/5">
        Son Güncelleme: Eylül 2026 · Kapsüle Mobil Kasa
      </p>
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
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Kapsüle ile ilgili soru, öneri veya karşılaştığınız teknik durumları doğrudan geliştirici ekibe iletebilirsiniz.
        </p>

        <div className="p-4 rounded-2xl bg-surface-elevated/70 dark:bg-white/[0.03] border border-border/70 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary/70">E-Posta:</span>
            <span className="font-mono text-primary font-medium">destek@kapsule.app</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary/70">Uygulama Sürümü:</span>
            <span className="font-mono text-primary">v1.0.4 (Build 104)</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondary/70">Yanıt Süresi:</span>
            <span className="text-emerald-500 font-medium">Genellikle 24 saat içinde</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSendEmail}
            className="w-full h-11 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent/90 shadow-md shadow-accent/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>E-Posta ile İletişime Geç</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
