import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Receipt,
  ShieldCheck,
  StickyNote,
  Bookmark,
  Search,
  CreditCard,
  Lock,
  ChevronRight,
  Sparkles,
  Shield,
  Key,
} from 'lucide-react';

/* ─── Types ─── */
interface OnboardingScreenProps {
  onComplete: () => void;
}

interface SlideConfig {
  headline: [string, string];
  description: string;
  hero: React.ReactNode;
}

/* ─── SVG Logotypes ─── */
const AppleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.12-1.96.99-3.1-.96.04-2.13.64-2.81 1.44-.61.71-1.14 1.87-.99 3.01 1.08.08 2.19-.53 2.81-1.35z" />
  </svg>
);

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

/* ─── Floating Container ─── */
const FloatingShape: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}> = ({ children, className = '', delay = 0, duration = 6, y = 10 }) => (
  <motion.div
    className={className}
    animate={{ y: [-y, y, -y] }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
  >
    {children}
  </motion.div>
);

/* ─── Hero 1: Redesigned Sculptural Vault Passbook Composition ─── */
const HeroComposition: React.FC = () => (
  <div className="relative w-full h-[360px] sm:h-[420px] flex items-center justify-center overflow-visible">
    {/* Background Glow Ring */}
    <div className="absolute w-[280px] h-[280px] rounded-full bg-neutral-200/40 dark:bg-neutral-800/30 blur-3xl -z-10" />

    {/* Layer 1: Back Card - Passport Vault Badge */}
    <FloatingShape className="absolute top-2 left-6 sm:left-14 z-10" delay={0.4} duration={7} y={8}>
      <div className="w-[180px] sm:w-[200px] h-[120px] rounded-3xl bg-neutral-900 text-white p-5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] rotate-[-12deg] border border-neutral-800 flex flex-col justify-between backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">PASSPORT // VAULT</span>
          <div className="w-5 h-5 rounded-full border border-neutral-700 flex items-center justify-center text-[10px]"></div>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-tight text-neutral-200">Republic Passport</p>
          <p className="text-[10px] text-neutral-500 font-mono mt-0.5">TR-98402941-B</p>
        </div>
        <div className="flex items-center justify-between border-t border-neutral-800/80 pt-2">
          <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ENCRYPTED
          </span>
          <span className="text-[9px] text-neutral-500 font-mono">2032 EXP</span>
        </div>
      </div>
    </FloatingShape>

    {/* Layer 2: Right Card - Insurance / Titanium Card */}
    <FloatingShape className="absolute top-10 right-4 sm:right-12 z-20" delay={1.2} duration={8} y={12}>
      <div className="w-[170px] sm:w-[190px] h-[130px] rounded-3xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] rotate-[10deg] border border-neutral-200 dark:border-neutral-700/80 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-6 h-4 rounded-md bg-amber-400/80 dark:bg-amber-500/80 border border-amber-300 dark:border-amber-600 shadow-sm" />
          <span className="text-[9px] font-mono font-bold tracking-wider text-neutral-400 uppercase">POLICY</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold tracking-tight">Kapsule Total Health</p>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500">Coverage: ₺500.000</p>
        </div>
        <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
          <span>**** 8841</span>
          <Shield className="w-3.5 h-3.5 text-neutral-400" />
        </div>
      </div>
    </FloatingShape>

    {/* Layer 3: Central Hero Floating Vault Capsule Card */}
    <FloatingShape className="absolute z-30" delay={0} duration={6} y={6}>
      <div className="w-[220px] sm:w-[240px] h-[160px] rounded-[32px] bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-700/90 p-6 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.2)] flex flex-col justify-between relative overflow-hidden group">
        {/* Decorative inner light effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-100 dark:bg-neutral-800/40 rounded-full blur-2xl -mr-10 -mt-10" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shadow-md">
              K
            </div>
            <div>
              <p className="text-xs font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Kapsule Vault</p>
              <p className="text-[9px] font-medium text-neutral-400">Master Record</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        </div>

        <div className="relative z-10 my-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Saklanan Öğeler</span>
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-mono">148 Öğe</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden p-0.5 border border-neutral-200/50 dark:border-neutral-700/50">
            <div className="w-[85%] h-full bg-neutral-900 dark:bg-neutral-100 rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-between relative z-10 text-[10px] text-neutral-400 font-mono">
          <span className="flex items-center gap-1"><Key className="w-3 h-3 text-neutral-400" /> End-to-End</span>
          <span className="text-neutral-900 dark:text-neutral-100 font-semibold">AES-256</span>
        </div>
      </div>
    </FloatingShape>

    {/* Layer 4: Bottom Left Floating Note Pill */}
    <FloatingShape className="absolute bottom-4 left-4 sm:left-10 z-40" delay={1.8} duration={7.5} y={10}>
      <div className="px-4 py-2.5 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200/80 dark:border-amber-700/50 text-amber-900 dark:text-amber-200 text-xs font-semibold shadow-lg flex items-center gap-2 backdrop-blur-md rotate-[-5deg]">
        <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        <span>Aklındaki her not güvende</span>
      </div>
    </FloatingShape>
  </div>
);

/* ─── Hero 2: Search Experience (Unchanged as requested) ─── */
const SEARCH_SUGGESTIONS = ['Pasaport', 'Apple fişi', 'Ev sigortası', 'MacBook garanti'];

const HeroSearch: React.FC = () => {
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSuggestion((prev) => (prev + 1) % SEARCH_SUGGESTIONS.length);
      setTypedText('');
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const word = SEARCH_SUGGESTIONS[activeSuggestion];
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i <= word.length) {
        setTypedText(word.slice(0, i));
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 80);
    return () => clearInterval(typeInterval);
  }, [activeSuggestion]);

  return (
    <div className="relative w-full h-[340px] sm:h-[400px] flex flex-col items-center justify-center gap-8 px-4">
      <FloatingShape y={4} duration={8}>
        <div className="w-full max-w-[360px] relative">
          <div className="flex items-center gap-3 px-6 py-5 rounded-[28px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]">
            <Search className="w-5 h-5 text-neutral-400 dark:text-neutral-500 shrink-0" />
            <span className="text-lg text-neutral-900 dark:text-neutral-100 font-medium tracking-tight">
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="inline-block w-[2px] h-5 bg-neutral-400 dark:bg-neutral-500 ml-0.5 align-middle"
              />
            </span>
          </div>
        </div>
      </FloatingShape>

      <div className="flex flex-col gap-2.5 w-full max-w-[320px]">
        <AnimatePresence mode="wait">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`${activeSuggestion}-${i}`}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1 - i * 0.25, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/40 dark:border-neutral-700/40"
            >
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                {i === 0 && <FileText className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />}
                {i === 1 && <Receipt className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />}
                {i === 2 && <ShieldCheck className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="h-1.5 w-20 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-1 w-14 rounded-full bg-neutral-100 dark:bg-neutral-700/60" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─── Hero 3: Enhanced Unified Vault ─── */
const HeroVault: React.FC = () => {
  const categories = [
    { icon: <FileText className="w-4 h-4" />, label: 'Belgeler' },
    { icon: <Receipt className="w-4 h-4" />, label: 'Fişler' },
    { icon: <CreditCard className="w-4 h-4" />, label: 'Abonelikler' },
    { icon: <ShieldCheck className="w-4 h-4" />, label: 'Garantiler' },
    { icon: <StickyNote className="w-4 h-4" />, label: 'Notlar' },
    { icon: <Bookmark className="w-4 h-4" />, label: 'Yer İmleri' },
  ];

  return (
    <div className="relative w-full h-[340px] sm:h-[400px] flex items-center justify-center">
      <FloatingShape y={6} duration={9}>
        <div className="relative">
          {/* Concentric rings */}
          <div className="absolute inset-0 -m-10 rounded-full border border-dashed border-neutral-200 dark:border-neutral-800 animate-spin-slow opacity-60 pointer-events-none" />

          {/* Central vault circle */}
          <div className="w-[190px] h-[190px] rounded-full bg-neutral-100 dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/80 flex items-center justify-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)]">
            <div className="w-[130px] h-[130px] rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-700/60 flex flex-col items-center justify-center gap-2 shadow-inner">
              <Lock className="w-8 h-8 text-neutral-900 dark:text-neutral-100" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">KAPSULE</span>
            </div>
          </div>

          {/* Orbiting category pills */}
          {categories.map((cat, i) => {
            const angle = i * 60 - 90;
            const radius = 145;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <motion.div
                key={cat.label}
                className="absolute top-1/2 left-1/2"
                style={{
                  x: x - 42,
                  y: y - 18,
                }}
                animate={{
                  y: [y - 18 - 4, y - 18 + 4, y - 18 - 4],
                }}
                transition={{
                  duration: 5 + i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
              >
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)]">
                  <span className="text-neutral-700 dark:text-neutral-300">{cat.icon}</span>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">{cat.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </FloatingShape>
    </div>
  );
};

/* ─── Page Indicator ─── */
const PageDots: React.FC<{ total: number; current: number }> = ({ total, current }) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <motion.div
        key={i}
        className="rounded-full"
        animate={{
          width: i === current ? 28 : 8,
          height: 8,
          backgroundColor:
            i === current
              ? 'var(--text-primary, #171717)'
              : 'var(--border, #e5e5e5)',
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    ))}
  </div>
);

/* ─── Main Onboarding Component ─── */
export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: SlideConfig[] = [
    {
      headline: ['Everything important.', 'One place.'],
      description: 'Hayatındaki önemli her şeyi tek bir dijital kasada güvenle sakla.',
      hero: <HeroComposition />,
    },
    {
      headline: ['Find anything.', 'Instantly.'],
      description: 'Her dosya, her fiş, her garanti — tek bir arama uzağında.',
      hero: <HeroSearch />,
    },
    {
      headline: ['Your digital vault.', 'Ready when you are.'],
      description: 'Her şey düzenli, uçtan uca şifreli ve dilediğin an hazır.',
      hero: <HeroVault />,
    },
  ];

  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-neutral-950 flex flex-col overflow-hidden select-none">
      {/* Top bar — Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex items-center justify-center pt-10 pb-2"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 shadow-md">
            <span className="text-base font-bold tracking-tight">K</span>
          </div>
          <span className="text-sm font-bold text-neutral-400 dark:text-neutral-500 tracking-wider uppercase">
            Kapsule
          </span>
        </div>
      </motion.div>

      {/* Content area */}
      <div className="flex-1 flex flex-col items-center justify-between px-6 sm:px-10 pb-10">
        {/* Hero + Text */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center"
            >
              {/* Hero */}
              {slides[currentSlide].hero}

              {/* Text */}
              <div className="text-center mt-2 space-y-3">
                <div>
                  <h1 className="text-[34px] sm:text-[42px] font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight leading-[1.08]">
                    {slides[currentSlide].headline[0]}
                  </h1>
                  <h1 className="text-[34px] sm:text-[42px] font-extrabold text-neutral-400 dark:text-neutral-500 tracking-tight leading-[1.08]">
                    {slides[currentSlide].headline[1]}
                  </h1>
                </div>
                <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-xs mx-auto">
                  {slides[currentSlide].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Controls */}
        <div className="w-full max-w-md flex flex-col items-center gap-6 mt-6">
          {/* CTA Buttons — last slide */}
          {isLastSlide ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col gap-3"
            >
              {/* Apple Auth */}
              <button
                onClick={onComplete}
                className="w-full h-14 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-base font-bold tracking-tight hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.3)]"
              >
                <AppleIcon className="w-5 h-5" />
                <span>Apple ile Devam Et</span>
              </button>

              {/* Google Auth */}
              <button
                onClick={onComplete}
                className="w-full h-14 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/80 text-neutral-900 dark:text-neutral-100 text-base font-bold tracking-tight hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]"
              >
                <GoogleIcon className="w-5 h-5" />
                <span>Google ile Devam Et</span>
              </button>

              {/* Email / Start option */}
              <button
                onClick={onComplete}
                className="w-full text-center text-xs font-bold text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 py-1 transition-colors"
              >
                E-posta ile Hesap Oluştur ya da Giriş Yap
              </button>
            </motion.div>
          ) : (
            <div className="w-full flex items-center justify-center">
              <button
                onClick={handleNext}
                className="w-full sm:w-auto h-14 px-12 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-base font-bold tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_14px_36px_-8px_rgba(0,0,0,0.25)]"
              >
                <span>Devam Et</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Dots + Skip */}
          <div className="flex items-center justify-between w-full px-2 pt-1">
            <PageDots total={3} current={currentSlide} />
            {!isLastSlide && (
              <button
                onClick={onComplete}
                className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                Atla
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
