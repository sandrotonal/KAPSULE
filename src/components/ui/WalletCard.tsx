import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CreditCard, ShieldCheck, FileText, Lock } from 'lucide-react';
import { VaultStorageService } from '../../services/vaultStorage';
import { formatCurrency, cn } from '../../lib/utils';

interface CardData {
  id: string;
  name: string;
  label: string;
  value: string;
  number: string;
  gradientClass: string;
  accentTextClass: string;
  icon: React.ReactNode;
  delay: number;
}

export const WalletCard: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const stats = VaultStorageService.getStats();

  const dynamicCards: CardData[] = useMemo(() => [
    {
      id: 'docs',
      name: 'Belgeler',
      label: 'TOPLAM DOSYA',
      value: `${stats.documentCount} Kayıt`,
      number: `KPSL ${stats.documentCount.toString().padStart(4, '0')} DOC`,
      gradientClass: 'bg-zinc-800 dark:bg-zinc-900 border-zinc-700/80 dark:border-white/10 text-white',
      accentTextClass: 'text-zinc-400',
      icon: <FileText className="w-5 h-5 text-accent" />,
      delay: 0.1,
    },
    {
      id: 'warranties',
      name: 'Garantiler',
      label: 'KORUMA PLANI',
      value: `${stats.activeWarranties} Aktif`,
      number: `EXP ${stats.expiringWarrantiesCount} YAKINDA`,
      gradientClass: 'bg-zinc-900 dark:bg-black border-accent/25 text-white',
      accentTextClass: 'text-accent',
      icon: <ShieldCheck className="w-5 h-5 text-accent" />,
      delay: 0.2,
    },
    {
      id: 'subs',
      name: 'Abonelikler',
      label: 'AYLIK ÖDEME',
      value: formatCurrency(stats.totalMonthlyCost, 'TL'),
      number: `${stats.activeSubscriptions} AKTİF SERVİS`,
      gradientClass: 'bg-accent text-white border-accent/40 shadow-lg shadow-accent/20',
      accentTextClass: 'text-white/80',
      icon: <CreditCard className="w-5 h-5 text-white" />,
      delay: 0.3,
    },
  ], [stats]);

  return (
    <div className="flex flex-col items-center gap-5 py-4 w-full max-w-[400px]">
      <motion.div
        className="relative w-full max-w-[380px] h-[280px] cursor-pointer flex justify-center items-end select-none"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Vault Sleeve Back Plate */}
        <div className="absolute bottom-0 w-[350px] sm:w-[360px] h-[220px] bg-surface/50 dark:bg-zinc-950/90 rounded-[28px_28px_44px_44px] z-0 border border-border/50 dark:border-white/5 shadow-[inset_0_12px_24px_rgba(0,0,0,0.2)]" />

        {/* Dynamic Cards Stack */}
        {dynamicCards.map((card, index) => {
          const bottom = 48 + (index * 26);
          const zIndex = (index + 1) * 10;

          let yOffset = 0;
          let rotate = 0;
          let xOffset = 0;

          if (isHovered) {
            if (index === 0) {
              yOffset = -95;
              rotate = -8;
              xOffset = -18;
            } else if (index === 1) {
              yOffset = -65;
              rotate = 2;
              xOffset = 0;
            } else if (index === 2) {
              yOffset = -28;
              rotate = 6;
              xOffset = 18;
            }
          }

          return (
            <motion.div
              key={card.id}
              className={cn(
                "absolute left-1/2 -translate-x-1/2 w-[330px] sm:w-[340px] h-[165px] rounded-[24px] p-6 shadow-xl group overflow-hidden border",
                card.gradientClass
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
                y: yOffset - 20,
                zIndex: 100,
                transition: { type: 'spring', stiffness: 400, damping: 25 }
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 22,
                delay: isHovered ? 0 : card.delay 
              }}
            >
              <div className="relative flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-[2px] opacity-70 font-bold">{card.name}</span>
                    <span className="text-xl font-bold tracking-tight leading-none">{card.value}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shrink-0">
                    {card.icon}
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[8px] uppercase tracking-widest opacity-60 block mb-0.5">{card.label}</span>
                    <span className="text-[11px] font-mono font-medium tracking-wider">{card.number}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-70">
                    <div className="w-6 h-4 rounded-sm bg-white/20 border border-white/10" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Frosted Titanium Digital Vault Sleeve (Front) */}
        <div className="absolute bottom-0 w-[350px] sm:w-[360px] h-[175px] z-40 rounded-[28px_28px_44px_44px] bg-surface/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-border/70 dark:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col items-center justify-center px-6 overflow-hidden">
          {/* Subtle Top Metallic Bevel Highlight */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          
          <div className="w-full flex flex-col items-center gap-1.5 pt-1 text-center">
            <div className="relative h-7 w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!isHovered ? (
                  <motion.div
                    key="stars"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="text-secondary/50 text-xl tracking-[6px] font-light"
                  >
                    ••••••
                  </motion.div>
                ) : (
                  <motion.div
                    key="balance"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-2xl font-bold tracking-tight text-primary tabular-nums"
                  >
                    {formatCurrency(stats.totalAnnualCost, 'TL')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="text-[10px] uppercase tracking-[2.5px] font-bold text-secondary/70">
              Yıllık Tahmini Gider
            </div>
            
            <motion.div 
              animate={{ opacity: isHovered ? 1 : 0.7, scale: isHovered ? 1.05 : 1 }}
              className="mt-2 w-8 h-8 rounded-full bg-surface border border-border/70 flex items-center justify-center shadow-soft text-accent"
            >
               {isHovered ? (
                 <Eye className="w-4 h-4" />
               ) : (
                 <EyeOff className="w-4 h-4 text-secondary/70" />
               )}
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Sleek helper hint */}
      <div className="flex items-center gap-2 text-xs font-semibold text-secondary/80 bg-surface/60 px-4 py-2 rounded-full border border-border/50 shadow-soft">
        <Lock className="w-3.5 h-3.5 text-accent" />
        <span>Kapsül kartlarını görmek için kasaya dokun</span>
      </div>
    </div>
  );
};

export default WalletCard;
