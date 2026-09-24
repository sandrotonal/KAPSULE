import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CreditCard, ChevronUp } from 'lucide-react';
import { VaultStorageService } from '../../services/vaultStorage';
import { formatCurrency, cn } from '../../lib/utils';
import { triggerHaptic } from '../../utils/haptics';

interface CardData {
  id: string;
  name: string;
  categoryBadge: string;
  value: string;
  cardNumber: string;
  validThru: string;
  issuer: string;
  cardTheme: string;
  chipColor: 'gold' | 'silver';
  delay: number;
}

export const WalletCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cardOrder, setCardOrder] = useState<string[]>(['docs', 'warranties', 'subs']);
  const [switchingCardId, setSwitchingCardId] = useState<string | null>(null);

  const stats = VaultStorageService.getStats();

  const cardsMap: Record<string, CardData> = useMemo(() => ({
    docs: {
      id: 'docs',
      name: 'BELGE KASASI',
      categoryBadge: 'PLATINUM VAULT',
      value: `${stats.documentCount} Evrak`,
      cardNumber: `4192  8830  ${stats.documentCount.toString().padStart(4, '0')}  7710`,
      validThru: '12/30',
      issuer: 'TITANIUM',
      cardTheme: 'bg-gradient-to-tr from-zinc-900 via-neutral-800 to-zinc-700 text-white border-zinc-600/60',
      chipColor: 'silver',
      delay: 0.1,
    },
    warranties: {
      id: 'warranties',
      name: 'GARANTİ KORUMASI',
      categoryBadge: 'OBSIDIAN SHIELD',
      value: `${stats.activeWarranties} Aktif`,
      cardNumber: `5412  7500  ${stats.activeWarranties.toString().padStart(4, '0')}  9022`,
      validThru: '08/29',
      issuer: 'CENTURION',
      cardTheme: 'bg-gradient-to-tr from-black via-zinc-950 to-neutral-900 text-white border-amber-500/40',
      chipColor: 'gold',
      delay: 0.2,
    },
    subs: {
      id: 'subs',
      name: 'ABONELİK KARTI',
      categoryBadge: 'SAPPHIRE ACCENT',
      value: formatCurrency(stats.totalMonthlyCost, 'TL'),
      cardNumber: `4820  1049  ${stats.activeSubscriptions.toString().padStart(4, '0')}  4829`,
      validThru: '05/28',
      issuer: 'KAPSÜLE',
      cardTheme: 'bg-gradient-to-tr from-indigo-900 via-accent to-purple-900 text-white border-white/25',
      chipColor: 'gold',
      delay: 0.3,
    },
  }), [stats]);

  const orderedCards = useMemo(() => {
    return cardOrder.map((id) => cardsMap[id]).filter(Boolean);
  }, [cardOrder, cardsMap]);

  // Toggle open / close for the leather pocket
  const handleToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isOpen) {
      triggerHaptic.light();
      setIsOpen(false);
    } else {
      triggerHaptic.medium();
      setIsOpen(true);
    }
  };

  // Switch card to front on tap
  const handleCardClick = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // If wallet is closed, open it with clicked card in front
    if (!isOpen) {
      triggerHaptic.medium();
      setIsOpen(true);
      if (cardOrder[cardOrder.length - 1] !== cardId) {
        setSwitchingCardId(cardId);
        setCardOrder((prev) => [...prev.filter((id) => id !== cardId), cardId]);
        setTimeout(() => setSwitchingCardId(null), 380);
      }
      return;
    }

    const isFront = cardOrder[cardOrder.length - 1] === cardId;
    if (isFront) {
      // If front card is tapped again, cycle next card forward with a fluid flick
      triggerHaptic.light();
      const nextCardId = cardOrder[0];
      setSwitchingCardId(nextCardId);
      setCardOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
      setTimeout(() => setSwitchingCardId(null), 380);
    } else {
      // Move tapped background card smoothly to the front
      triggerHaptic.medium();
      setSwitchingCardId(cardId);
      setCardOrder((prev) => [...prev.filter((id) => id !== cardId), cardId]);
      setTimeout(() => setSwitchingCardId(null), 380);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4 w-full max-w-[400px]">
      <div
        className="relative w-full max-w-[380px] h-[300px] flex justify-center items-end select-none"
        style={{ perspective: '1200px' }}
      >
        {/* Leather Cardholder Back Lining */}
        <div className="absolute bottom-0 w-[350px] sm:w-[360px] h-[230px] rounded-[30px_30px_42px_42px] bg-neutral-900 dark:bg-black border border-neutral-800 dark:border-white/5 z-0 shadow-2xl pointer-events-none" />

        {/* Dynamic Realistic Credit Cards */}
        {orderedCards.map((card, index) => {
          const isFront = index === orderedCards.length - 1;
          const isSwitching = switchingCardId === card.id;

          // Slot positioning calculations
          let bottom = 52 + index * 28;
          let yOffset = 0;
          let rotate = 0;
          let xOffset = 0;
          let scale = 1;
          let zIndex = (index + 1) * 10;

          if (isOpen) {
            if (index === 0) {
              // Back card
              bottom = 52;
              yOffset = -116;
              rotate = -8;
              xOffset = -22;
              scale = 0.98;
              zIndex = 10;
            } else if (index === 1) {
              // Middle card
              bottom = 80;
              yOffset = -76;
              rotate = 1.5;
              xOffset = 0;
              scale = 1.0;
              zIndex = 20;
            } else {
              // Front card (Hero)
              bottom = 108;
              yOffset = -38;
              rotate = 7.5;
              xOffset = 22;
              scale = 1.03;
              zIndex = 35;
            }
          }

          // Elevation when card is actively switching over other cards
          if (isSwitching) {
            zIndex = 50;
          }

          return (
            <motion.div
              key={card.id}
              role="button"
              tabIndex={0}
              aria-label={`${card.name} kartı`}
              onClick={(e) => handleCardClick(card.id, e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(card.id, e as unknown as React.MouseEvent);
                }
              }}
              className={cn(
                'absolute left-1/2 -translate-x-1/2 w-[330px] sm:w-[342px] h-[175px] rounded-[22px] p-5 border group overflow-hidden flex flex-col justify-between cursor-pointer transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                card.cardTheme,
                isOpen
                  ? isFront
                    ? 'shadow-[0_24px_48px_rgba(0,0,0,0.65)] border-white/35'
                    : 'shadow-[0_16px_32px_rgba(0,0,0,0.45)]'
                  : 'shadow-[0_8px_18px_rgba(0,0,0,0.35)]'
              )}
              style={{ bottom: `${bottom}px`, zIndex }}
              initial={{ y: -40, opacity: 0 }}
              animate={{
                y: isSwitching && isOpen ? [yOffset - 32, yOffset] : yOffset,
                rotate: isSwitching && isOpen ? [rotate - 6, rotate] : rotate,
                x: `calc(-50% + ${xOffset}px)`,
                scale: isSwitching && isOpen ? [1.08, scale] : scale,
                opacity: 1,
              }}
              whileHover={
                isOpen
                  ? {
                      scale: scale + 0.04,
                      y: yOffset - 14,
                      zIndex: 60,
                      transition: { type: 'spring', stiffness: 400, damping: 24 },
                    }
                  : {
                      y: -8,
                      transition: { type: 'spring', stiffness: 350, damping: 25 },
                    }
              }
              whileTap={{ scale: 0.98 }}
              transition={{
                type: 'spring',
                stiffness: isSwitching ? 320 : (isOpen ? 270 : 320),
                damping: isSwitching ? 22 : (isOpen ? 22 : 28),
                mass: 0.85,
                delay: isSwitching ? 0 : (isOpen ? index * 0.07 : (2 - index) * 0.05),
              }}
            >
              {/* Card Holographic Sheen Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.09] to-white/0 pointer-events-none" />

              {/* Card Header: Category Badge + Issuer */}
              <div className="relative flex justify-between items-center z-10">
                <span className="text-[9px] uppercase tracking-[2px] font-bold text-white/85 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                  {card.categoryBadge}
                </span>
                <span className="text-[11px] font-black tracking-widest text-white/90">
                  {card.issuer}
                </span>
              </div>

              {/* Card Middle: EMV Chip + Contactless Wave + Value */}
              <div className="relative flex items-center justify-between z-10 py-1">
                <div className="flex items-center gap-2.5">
                  {/* EMV Metallic IC Chip */}
                  <div
                    className={cn(
                      'w-10 h-7 rounded-[5px] border relative overflow-hidden flex items-center justify-center shadow-md',
                      card.chipColor === 'gold'
                        ? 'bg-gradient-to-br from-[#f3e092] via-[#d4af37] to-[#997300] border-[#fceebb]/80'
                        : 'bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 border-zinc-100/80'
                    )}
                  >
                    <div className="w-full h-[1px] bg-black/30 absolute top-1/2 -translate-y-1/2" />
                    <div className="h-full w-[1px] bg-black/30 absolute left-1/3" />
                    <div className="h-full w-[1px] bg-black/30 absolute right-1/3" />
                    <div className="w-3.5 h-2 rounded-[2px] border border-black/25 bg-white/20" />
                  </div>

                  {/* Contactless Wave Icon */}
                  <svg
                    className="w-4 h-4 text-white/80 rotate-90"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M5 8a10 10 0 0 1 14 0" />
                    <path d="M8.5 11.5a5 5 0 0 1 7 0" />
                    <path d="M12 15h.01" />
                  </svg>
                </div>

                <div className="text-right">
                  <span className="text-xs uppercase tracking-wider text-white/60 block font-bold">
                    DEĞER
                  </span>
                  <span className="text-lg font-black tracking-tight text-white tabular-nums">
                    {card.value}
                  </span>
                </div>
              </div>

              {/* Card Embossed Number */}
              <div className="relative z-10 font-mono text-sm sm:text-[15px] font-bold tracking-[2.5px] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9),0_0_1px_rgba(255,255,255,0.4)]">
                {card.cardNumber}
              </div>

              {/* Card Footer: Cardholder & Expiry */}
              <div className="relative flex justify-between items-end z-10 pt-0.5">
                <div>
                  <span className="text-[7px] uppercase tracking-[1.5px] text-white/60 block font-bold">
                    KART SAHİBİ
                  </span>
                  <span className="text-[11px] font-bold tracking-wider text-white uppercase [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                    ÖMER ÖZBAY
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[7px] uppercase tracking-[1.5px] text-white/60 block font-bold">
                    GEÇERLİLİK
                  </span>
                  <span className="text-[11px] font-mono font-bold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                    {card.validThru}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Luxury Saddle Leather Pocket with Ergonomic Thumb Notch */}
        <motion.div
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Cüzdanı kapat' : 'Cüzdanı aç'}
          onClick={(e) => handleToggle(e)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
          className="absolute bottom-0 w-[350px] sm:w-[360px] h-[180px] z-40 drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-b-[42px]"
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.15 }}
        >
          <svg className="w-full h-full pointer-events-none" viewBox="0 0 360 180" fill="none">
            {/* Rich Luxury Cardholder Leather Base */}
            <path
              d="M 0 32 C 0 16, 12 14, 24 14 L 125 14 C 142 14, 152 38, 180 38 C 208 38, 218 14, 235 14 L 336 14 C 348 14, 360 16, 360 32 L 360 142 C 360 168, 336 178, 305 178 L 55 178 C 24 178, 0 168, 0 142 Z"
              className="fill-neutral-900 dark:fill-[#121214]"
            />
            {/* Fine Saddle Perimeter Stitching */}
            <path
              d="M 12 36 C 12 22, 20 22, 28 22 L 123 22 C 143 22, 150 44, 180 44 C 210 44, 217 22, 237 22 L 332 22 C 340 22, 348 22, 348 36 L 348 138 C 348 160, 330 168, 302 168 L 58 168 C 30 168, 12 160, 12 138 Z"
              className="stroke-neutral-600/70 dark:stroke-neutral-500/50"
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
            {/* Debossed Kapsüle Insignia Crest */}
            <path
              d="M 172 155 L 188 155 M 180 148 L 180 162"
              className="stroke-neutral-700 dark:stroke-neutral-600"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Cardholder Center Face: Privacy Balance Display & Toggle */}
          <div className="absolute top-[60px] w-full text-center z-50 flex flex-col items-center gap-1.5 px-6 pointer-events-none">
            <div className="relative h-7 w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!isOpen ? (
                  <motion.div
                    key="stars"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="text-neutral-400 text-xl tracking-[6px] font-light"
                  >
                    ••••••
                  </motion.div>
                ) : (
                  <motion.div
                    key="balance"
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="text-2xl font-bold tracking-tight text-white tabular-nums"
                  >
                    {formatCurrency(stats.totalAnnualCost, 'TL')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-neutral-400 text-[10px] uppercase tracking-[2.5px] font-bold">
              Yıllık Tahmini Gider
            </div>

            <motion.div
              animate={{
                scale: isOpen ? 1.06 : 1,
                borderColor: isOpen ? 'rgba(99, 102, 241, 0.4)' : 'rgba(64, 64, 64, 0.8)',
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="mt-2 w-8 h-8 rounded-full bg-neutral-800 border flex items-center justify-center shadow-lg text-accent"
            >
              {isOpen ? (
                <Eye className="w-4 h-4 text-accent" />
              ) : (
                <EyeOff className="w-4 h-4 text-neutral-400" />
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Clean frameless toggle action — 100% Light/Dark mode compatible */}
      <motion.button
        type="button"
        onClick={(e) => handleToggle(e)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className="inline-flex items-center gap-1.5 py-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer select-none whitespace-nowrap bg-transparent border-0 shadow-none focus:outline-none focus-visible:underline active:opacity-75"
      >
        <CreditCard
          className={cn(
            'w-3.5 h-3.5 transition-colors',
            isOpen ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-500'
          )}
        />
        <span>{isOpen ? 'Cüzdanı Kapat' : 'Kartları Gör'}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-neutral-400 dark:text-neutral-500"
        >
          <ChevronUp className="w-3 h-3 stroke-[2]" />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default WalletCard;
