import React, { useState } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import kapsuleVault3D from '../../assets/kapsule_vault_3d.png';
import scanner3D from '../../assets/scanner_3d.png';
import kapsuleLogoClean from '../../assets/kapsule_logo_clean.png';

/* ─── Types ─── */
interface OnboardingScreenProps {
  onComplete: () => void;
}

/* ─── Slide 1: 3D Capsule Vault (Clean, Centered, Backgroundless) ─── */
const Slide1Vault: React.FC = () => {
  return (
    <div className="relative w-full max-w-[320px] h-[250px] sm:h-[280px] flex flex-col items-center justify-end pb-3">
      {/* Subtle ambient light pool */}
      <div className="absolute w-52 h-52 rounded-full bg-neutral-200/40 dark:bg-white/[0.03] blur-3xl pointer-events-none" />

      {/* Floating 3D Capsule Vault */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        animate={{
          y: [-7, 5, -7],
          rotateZ: [-1, 1, -1],
        }}
        transition={{
          duration: 4.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <img
          src={kapsuleVault3D}
          alt="Kapsüle 3D Kasa"
          style={{ clipPath: 'inset(0 0 11.5% 0)' }}
          className="h-[195px] sm:h-[225px] w-auto max-w-[170px] sm:max-w-[190px] object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_24px_45px_rgba(0,0,0,0.7)] select-none pointer-events-none"
        />
      </motion.div>

      {/* Ambient Floor Shadow - Stationary on ground plane, scales softly with height */}
      <motion.div
        className="w-24 sm:w-28 h-2 rounded-full bg-neutral-900/[0.12] dark:bg-black/60 blur-sm mt-3"
        animate={{
          scale: [0.92, 1.08, 0.92],
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{
          duration: 4.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

/* ─── Slide 2: 3D Holographic AI Scanner (Clean, No Clutter Badges) ─── */
const Slide2Scanner: React.FC = () => {
  return (
    <div className="relative w-full max-w-[320px] h-[250px] sm:h-[280px] flex flex-col items-center justify-end pb-3">
      {/* Subtle ambient light pool */}
      <div className="absolute w-52 h-52 rounded-full bg-neutral-200/40 dark:bg-white/[0.03] blur-3xl pointer-events-none" />

      {/* Floating 3D Scanner */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        animate={{
          y: [-6, 5, -6],
          rotateZ: [-0.8, 0.8, -0.8],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative">
          <img
            src={scanner3D}
            alt="3D Akıllı Tarayıcı"
            className="h-[170px] sm:h-[195px] w-auto object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.16)] dark:drop-shadow-[0_24px_45px_rgba(0,0,0,0.7)] select-none pointer-events-none"
          />

          {/* Smooth Subtle Scan Light Line */}
          <motion.div
            className="absolute left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-transparent via-neutral-400 to-transparent dark:via-white/80 shadow-[0_0_10px_rgba(255,255,255,0.6)] z-20 pointer-events-none"
            style={{ top: '25%' }}
            animate={{
              top: ['22%', '52%', '22%'],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>

      {/* Ambient Floor Shadow - Stationary on ground plane */}
      <motion.div
        className="w-32 sm:w-36 h-2 rounded-full bg-neutral-900/[0.12] dark:bg-black/60 blur-sm mt-3"
        animate={{
          scale: [0.94, 1.06, 0.94],
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

/* ─── Slide 3: Large Backgroundless Kapsüle Logo Hero ─── */
const Slide3LogoHero: React.FC = () => {
  return (
    <div className="relative w-full max-w-[320px] h-[250px] sm:h-[280px] flex flex-col items-center justify-end pb-3">
      {/* Subtle ambient light pool */}
      <div className="absolute w-52 h-52 rounded-full bg-neutral-200/40 dark:bg-white/[0.03] blur-3xl pointer-events-none" />

      {/* Floating Large Backgroundless Kapsüle Logo */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        animate={{
          y: [-7, 5, -7],
          rotateZ: [-1, 1, -1],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <img
          src={kapsuleLogoClean}
          alt="Kapsüle Logo"
          className="h-[140px] sm:h-[165px] w-auto object-contain dark:invert select-none pointer-events-none drop-shadow-[0_16px_28px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_40px_rgba(255,255,255,0.18)]"
        />
      </motion.div>

      {/* Ambient Floor Shadow - Stationary on ground plane */}
      <motion.div
        className="w-24 sm:w-28 h-2 rounded-full bg-neutral-900/[0.12] dark:bg-black/60 blur-sm mt-4"
        animate={{
          scale: [0.92, 1.08, 0.92],
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

/* ─── Main Onboarding Screen ─── */
export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      component: <Slide1Vault />,
      tag: 'KAPSÜLE KASASI',
      title: 'Her önemli evrak.',
      titleAccent: 'Tek güvenli kasada.',
      description:
        'Fiş, fatura, garanti belgesi ve aboneliklerini dağınıklıktan kurtar; akıllı kişisel kasan cebinde olsun.',
      ctaText: 'Devam Et',
    },
    {
      component: <Slide2Scanner />,
      tag: 'AKILLI TARAYICI',
      title: 'Kameranı doğrult.',
      titleAccent: 'Saniyeler içinde ayrışsın.',
      description:
        'Fiş veya fatura görüntünü yükle; tutar, satıcı ve garanti süresi yapay zekâ ile anında kütüphanene işlensin.',
      ctaText: 'Devam Et',
    },
    {
      component: <Slide3LogoHero />,
      tag: 'GÜVENLİ & ÇEVRİMDIŞI',
      title: 'Tamamen cihazında.',
      titleAccent: 'Yalnızca senin gözün için.',
      description:
        'Kayıtların sunucularda depolanmaz, cihazından dışarı çıkmaz. Uçtan uca şifreleme ile mutlak gizlilik.',
      ctaText: 'Kasamı Başlat',
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

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // Support touch swipe gestures
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -40 && currentSlide < slides.length - 1) {
      handleNext();
    } else if (info.offset.x > 40 && currentSlide > 0) {
      handlePrev();
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 flex flex-col justify-between overflow-hidden select-none">
      {/* ─── Top Bar: Segmented Story Bar + Logo + Skip ─── */}
      <div className="w-full max-w-lg mx-auto px-6 pt-10 pb-2 flex flex-col gap-5 z-30">
        {/* Segmented Story Indicators */}
        <div className="w-full flex items-center gap-1.5">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="flex-1 h-1 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 overflow-hidden cursor-pointer"
            >
              <motion.div
                className="h-full bg-neutral-900 dark:bg-white rounded-full"
                initial={false}
                animate={{
                  width: i <= currentSlide ? '100%' : '0%',
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          ))}
        </div>

        {/* Header: Logo mark + Skip button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={kapsuleLogoClean}
              alt="Kapsüle Logo"
              className="h-6 w-auto object-contain dark:invert select-none pointer-events-none"
            />
            <span className="text-xs font-bold tracking-widest uppercase text-neutral-900 dark:text-neutral-200">
              KAPSÜLE
            </span>
          </div>

          {!isLastSlide ? (
            <button
              type="button"
              onClick={onComplete}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800/60 transition-colors active:scale-95"
            >
              Atla
            </button>
          ) : (
            <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 tracking-wide uppercase">
              Son Adım
            </span>
          )}
        </div>
      </div>

      {/* ─── Middle Section: Clean 3D Visual Hero + Typography (Swipeable) ─── */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="flex-1 w-full max-w-lg mx-auto flex flex-col items-center justify-center px-6 cursor-grab active:cursor-grabbing"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 24, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -24, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center text-center"
          >
            {/* 3D Visual Hero (No Floating Badges) */}
            <div className="w-full flex items-center justify-center">
              {slides[currentSlide].component}
            </div>

            {/* Typography — Clean, Neutral, Quiet Luxury */}
            <div className="mt-5 sm:mt-7 space-y-2.5 max-w-sm">
              <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-neutral-600 dark:text-neutral-300 bg-neutral-100/90 dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/60 px-3.5 py-1 rounded-full shadow-xs">
                {slides[currentSlide].tag}
              </span>

              <h1 className="text-[26px] sm:text-[32px] font-extrabold tracking-tight leading-[1.15] text-neutral-900 dark:text-neutral-50">
                {slides[currentSlide].title} <br />
                <span className="text-neutral-400 dark:text-neutral-500 font-semibold">
                  {slides[currentSlide].titleAccent}
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed px-2">
                {slides[currentSlide].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ─── Bottom Ergonomic Thumb-Zone: Primary Button (NO Sparkles) ─── */}
      <div className="w-full max-w-lg mx-auto px-6 pb-10 pt-4 flex flex-col items-center gap-4 z-30">
        <motion.button
          type="button"
          onClick={handleNext}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-base font-bold tracking-tight bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xl transition-all duration-200 active:scale-[0.98]"
        >
          <span>{slides[currentSlide].ctaText}</span>
          {isLastSlide ? (
            <ArrowRight className="w-5 h-5 stroke-[2]" />
          ) : (
            <ChevronRight className="w-5 h-5 stroke-[2]" />
          )}
        </motion.button>

        {/* Micro Page Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? 'w-6 bg-neutral-900 dark:bg-white'
                  : 'w-1.5 bg-neutral-300 dark:bg-neutral-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
