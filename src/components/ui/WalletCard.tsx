import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, FileText, CreditCard } from 'lucide-react';
import { VaultStorageService } from '../../services/vaultStorage';
import { formatCurrency, cn } from '../../lib/utils';

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
  const [isHovered, setIsHovered] = useState(false);
  const stats = VaultStorageService.getStats();

  const dynamicCards: CardData[] = useMemo(() => [
    {
      id: 'docs',
      name: 'BELGE KASASI',
      categoryBadge: 'PLATINUM VAULT',
      value: `${stats.documentCount} Evrak`,
      cardNumber: `4192  8830  ${stats.documentCount.toString().padStart(4, '0')}  7710`,
      validThru: '12/30',
      issuer: 'TITANIUM',
      cardTheme: 'bg-gradient-to-tr from-zinc-900 via-neutral-800 to-zinc-700 text-white border-zinc-600/60 shadow-[0_10px_25px_rgba(0,0,0,0.5)]',
      chipColor: 'silver',
      delay: 0.1,
    },
    {
      id: 'warranties',
      name: 'GARANTİ KORUMASI',
      categoryBadge: 'OBSIDIAN SHIELD',
      value: `${stats.activeWarranties} Aktif`,
      cardNumber: `5412  7500  ${stats.activeWarranties.toString().padStart(4, '0')}  9022`,
      validThru: '08/29',
      issuer: 'CENTURION',
      cardTheme: 'bg-gradient-to-tr from-black via-zinc-950 to-neutral-900 text-white border-amber-500/40 shadow-[0_10px_25px_rgba(0,0,0,0.6)]',
      chipColor: 'gold',
      delay: 0.2,
    },
    {
      id: 'subs',
      name: 'ABONELİK KARTI',
      categoryBadge: 'SAPPHIRE ACCENT',
      value: formatCurrency(stats.totalMonthlyCost, 'TL'),
      cardNumber: `4820  1049  ${stats.activeSubscriptions.toString().padStart(4, '0')}  4829`,
      validThru: '05/28',
      issuer: 'KAPSÜLE',
      cardTheme: 'bg-gradient-to-tr from-indigo-900 via-accent to-purple-900 text-white border-white/25 shadow-[0_15px_30px_rgba(99,102,241,0.35)]',
      chipColor: 'gold',
      delay: 0.3,
    },
  ], [stats]);

  return (
    <div className="flex flex-col items-center gap-5 py-4 w-full max-w-[400px]">
      <motion.div
        className="relative w-full max-w-[380px] h-[300px] cursor-pointer flex justify-center items-end select-none"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Leather Cardholder Back Lining */}
        <div className="absolute bottom-0 w-[350px] sm:w-[360px] h-[230px] rounded-[30px_30px_42px_42px] bg-neutral-900 dark:bg-black border border-neutral-800 dark:border-white/5 z-0 shadow-2xl" />

        {/* Dynamic Realistic Credit Cards */}
        {dynamicCards.map((card, index) => {
          const bottom = 52 + (index * 28);
          const zIndex = (index + 1) * 10;

          let yOffset = 0;
          let rotate = 0;
          let xOffset = 0;

          if (isHovered) {
            if (index === 0) {
              yOffset = -105;
              rotate = -7;
              xOffset = -18;
            } else if (index === 1) {
              yOffset = -72;
              rotate = 2;
              xOffset = 0;
            } else if (index === 2) {
              yOffset = -35;
              rotate = 7;
              xOffset = 18;
            }
          }

          return (
            <motion.div
              key={card.id}
              className={cn(
                "absolute left-1/2 -translate-x-1/2 w-[330px] sm:w-[342px] h-[175px] rounded-[22px] p-5 border group overflow-hidden flex flex-col justify-between",
                card.cardTheme
              )}
              style={{ bottom: `${bottom}px`, zIndex }}
              initial={{ y: -50, opacity: 0 }}
              animate={{ 
                y: yOffset, 
                rotate: rotate,
                x: `calc(-50% + ${xOffset}px)`,
                opacity: 1,
                scale: isHovered ? 1.02 : 1
              }}
              whileHover={{ 
                scale: 1.08, 
                rotate: 0, 
                x: '-50%',
                y: yOffset - 22,
                zIndex: 100,
                transition: { type: 'spring', stiffness: 400, damping: 25 }
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 220, 
                damping: 22,
                delay: isHovered ? 0 : card.delay 
              }}
            >
              {/* Card Holographic Sheen Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.08] to-white/0 pointer-events-none" />

              {/* Card Header: Category Badge + Issuer */}
              <div className="relative flex justify-between items-center z-10">
                <span className="text-[9px] uppercase tracking-[2px] font-bold text-white/80 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
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
                  <div className={cn(
                    "w-10 h-7 rounded-[5px] border relative overflow-hidden flex items-center justify-center shadow-md",
                    card.chipColor === 'gold'
                      ? "bg-gradient-to-br from-[#f3e092] via-[#d4af37] to-[#997300] border-[#fceebb]/80"
                      : "bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 border-zinc-100/80"
                  )}>
                    <div className="w-full h-[1px] bg-black/30 absolute top-1/2 -translate-y-1/2" />
                    <div className="h-full w-[1px] bg-black/30 absolute left-1/3" />
                    <div className="h-full w-[1px] bg-black/30 absolute right-1/3" />
                    <div className="w-3.5 h-2 rounded-[2px] border border-black/25 bg-white/20" />
                  </div>

                  {/* Contactless Wave Icon */}
                  <svg className="w-4 h-4 text-white/80 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 8a10 10 0 0 1 14 0" />
                    <path d="M8.5 11.5a5 5 0 0 1 7 0" />
                    <path d="M12 15h.01" />
                  </svg>
                </div>

                <div className="text-right">
                  <span className="text-xs uppercase tracking-wider text-white/60 block font-bold">DEĞER</span>
                  <span className="text-lg font-black tracking-tight text-white tabular-nums">{card.value}</span>
                </div>
              </div>

              {/* Card Embossed Number */}
              <div className="relative z-10 font-mono text-sm sm:text-[15px] font-bold tracking-[2.5px] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9),0_0_1px_rgba(255,255,255,0.4)]">
                {card.cardNumber}
              </div>

              {/* Card Footer: Cardholder & Expiry */}
              <div className="relative flex justify-between items-end z-10 pt-0.5">
                <div>
                  <span className="text-[7px] uppercase tracking-[1.5px] text-white/60 block font-bold">KART SAHİBİ</span>
                  <span className="text-[11px] font-bold tracking-wider text-white uppercase [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                    ÖMER ÖZBAY
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[7px] uppercase tracking-[1.5px] text-white/60 block font-bold">GEÇERLİLİK</span>
                  <span className="text-[11px] font-mono font-bold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                    {card.validThru}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Luxury Saddle Leather Pocket with Ergonomic Thumb Notch */}
        <div className="absolute bottom-0 w-[350px] sm:w-[360px] h-[180px] z-40 drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]">
          <svg className="w-full h-full" viewBox="0 0 360 180" fill="none">
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
          <div className="absolute top-[60px] w-full text-center z-50 flex flex-col items-center gap-1.5 px-6">
            <div className="relative h-7 w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!isHovered ? (
                  <motion.div
                    key="stars"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="text-neutral-400 text-xl tracking-[6px] font-light"
                  >
                    ••••••
                  </motion.div>
                ) : (
                  <motion.div
                    key="balance"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
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
              animate={{ opacity: isHovered ? 1 : 0.7, scale: isHovered ? 1.05 : 1 }}
              className="mt-2 w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shadow-lg text-accent"
            >
               {isHovered ? (
                 <Eye className="w-4 h-4 text-accent" />
               ) : (
                 <EyeOff className="w-4 h-4 text-neutral-400" />
               )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Sleek cardholder instruction badge */}
      <div className="flex items-center gap-2 text-xs font-semibold text-secondary/80 bg-surface/70 px-4 py-2 rounded-full border border-border/50 shadow-soft">
        <CreditCard className="w-3.5 h-3.5 text-accent" />
        <span>Kartları çekmek ve detayları görmek için dokun</span>
      </div>
    </div>
  );
};

export default WalletCard;
