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

const VAULT_PREVIEW_ITEMS = [
  { label: 'Belge', icon: FileText },
  { label: 'Fiş', icon: Receipt },
  { label: 'Garanti', icon: ShieldCheck },
  { label: 'Abonelik', icon: CreditCard },
];

/* ─── Hero 1: Minimal Vault Mechanism ─── */
const HeroComposition: React.FC = () => {
  const [activeItem, setActiveItem] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveItem((current) => (current + 1) % VAULT_PREVIEW_ITEMS.length);
    }, 1800);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[350px] sm:h-[410px] flex items-center justify-center overflow-visible" aria-label="Kapsule kasa açılış animasyonu">
      <div className="absolute h-[286px] w-[286px] rounded-full bg-[radial-gradient(circle,rgba(23,23,23,0.08)_0%,rgba(245,245,245,0)_68%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,rgba(10,10,10,0)_68%)]" />

      <motion.div
        className="relative h-[262px] w-[262px] rounded-full"
        animate={{ rotate: [0, 0.8, -0.8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {Array.from({ length: 48 }).map((_, index) => (
          <span
            key={index}
            className={`absolute left-1/2 top-1/2 h-3 w-px rounded-full ${
              index % 4 === 0 ? 'bg-neutral-400 dark:bg-neutral-600' : 'bg-neutral-200 dark:bg-neutral-800'
            }`}
            style={{ transform: `rotate(${index * 7.5}deg) translateY(-128px)` }}
          />
        ))}

        <motion.div
          className="absolute inset-5 rounded-full border border-neutral-300 dark:border-neutral-800"
          animate={{ rotate: 360 }}
          transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-12 rounded-full border border-dashed border-neutral-300/80 dark:border-neutral-700"
          animate={{ rotate: -360 }}
          transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
        />

        <div className="absolute inset-[76px] rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-[0_30px_70px_-28px_rgba(0,0,0,0.7)] flex items-center justify-center">
          <motion.div
            className="absolute inset-3 rounded-full border border-white/10 dark:border-neutral-950/10"
            animate={{ scale: [1, 1.04, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <img src="/src/assets/logo.png" alt="Kapsule Logo" className="relative h-12 w-12 object-contain dark:invert" />
        </div>

        {VAULT_PREVIEW_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeItem;
          const angle = index * 90 - 90;
          const radius = 104;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <motion.button
              key={item.label}
              type="button"
              aria-label={item.label}
              aria-pressed={isActive}
              onClick={() => setActiveItem(index)}
              className={`absolute left-1/2 top-1/2 h-12 w-12 rounded-full border flex items-center justify-center transition-colors ${
                isActive
                  ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                  : 'border-neutral-200 bg-white text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400'
              }`}
              style={{ x: x - 24, y: y - 24 }}
              animate={{
                scale: isActive ? 1.16 : 0.92,
                opacity: isActive ? 1 : 0.72,
              }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <Icon className="w-4 h-4" />
            </motion.button>
          );
        })}

        <div className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {VAULT_PREVIEW_ITEMS.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-label={`${item.label} göstergesi`}
              onClick={() => setActiveItem(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeItem
                  ? 'w-7 bg-neutral-950 dark:bg-white'
                  : 'w-2 bg-neutral-200 dark:bg-neutral-800'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Hero 2: Search Experience (Unchanged as requested) ─── */
const SEARCH_SUGGESTIONS = ['Belge başlığı', 'Satıcı adı', 'Garanti kaydı', 'Not içeriği'];

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
      headline: ['Her önemli şey.', 'Tek kasada.'],
      description: 'Belgelerini, fişlerini ve hatırlatmalarını sakin bir düzende tut.',
      hero: <HeroComposition />,
    },
    {
      headline: ['Find anything.', 'Instantly.'],
      description: 'Her dosya, her fiş, her garanti — tek bir arama uzağında.',
      hero: <HeroSearch />,
    },
    {
      headline: ['Your digital vault.', 'Ready when you are.'],
      description: 'Her şey düzenli; kayıtlarını dilediğin an ekleyip bulabilirsin.',
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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[22px] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-center p-2 shadow-sm overflow-hidden">
            <img src="/src/assets/logo.png" alt="Kapsule" className="w-full h-full object-contain dark:invert" />
          </div>
          <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 tracking-wider uppercase">
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
              <button
                onClick={onComplete}
                className="w-full h-14 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-base font-bold tracking-tight hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.3)]"
              >
                <span>Kasamı Oluştur</span>
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
