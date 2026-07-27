import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CreditCard, ShieldCheck, FileText, Zap } from 'lucide-react';
import { VaultStorageService } from '../../services/vaultStorage';

interface CardData {
  id: string;
  name: string;
  label: string;
  value: string;
  number: string;
  color: string;
  textColor?: string;
  icon: React.ReactNode;
  delay: number;
}

export const WalletCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Real stats from storage
  const stats = useMemo(() => VaultStorageService.getStats(), [isHovered]); // Re-fetch on hover to be safe, though stats are static here

  const dynamicCards: CardData[] = useMemo(() => [
    {
      id: 'docs',
      name: 'Belgeler',
      label: 'TOPLAM DOSYA',
      value: `${stats.documentCount} Kayıt`,
      number: `KPSL ${stats.documentCount.toString().padStart(4, '0')} DOC`,
      color: 'bg-indigo-600',
      icon: <FileText className="w-5 h-5" />,
      delay: 0.1,
    },
    {
      id: 'warranties',
      name: 'Garantiler',
      label: 'KORUMA PLANI',
      value: `${stats.activeWarranties} Aktif`,
      number: `EXP ${stats.expiringWarrantiesCount} YAKINDA`,
      color: 'bg-emerald-500',
      icon: <ShieldCheck className="w-5 h-5" />,
      delay: 0.2,
    },
    {
      id: 'subs',
      name: 'Abonelikler',
      label: 'AYLIK ÖDEME',
      value: `₺${stats.totalMonthlyCost.toLocaleString('tr-TR')}`,
      number: `${stats.activeSubscriptions} AKTİF SERVİS`,
      color: 'bg-[#1a1a1a]',
      textColor: 'text-white',
      icon: <Zap className="w-5 h-5" />,
      delay: 0.3,
    }
  ], [stats]);

  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <motion.div
        className="relative w-[320px] h-[260px] cursor-pointer flex justify-center items-end select-none"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Wallet Container Back */}
        <div className="absolute bottom-0 w-[300px] h-[210px] bg-zinc-900 rounded-[28px_28px_65px_65px] z-0 shadow-[inset_0_20px_40px_rgba(0,0,0,0.6),inset_0_5px_15px_rgba(0,0,0,0.4)]" />

        {/* Dynamic Cards */}
        {dynamicCards.map((card, index) => {
          const bottom = 45 + (index * 25); // Stacked base positions
          const zIndex = (index + 1) * 10;

          let yOffset = 0;
          let rotate = 0;
          let xOffset = 0;

          if (isHovered) {
            // Natural fan-out effect with better spacing
            if (index === 0) { // bottom card (docs)
              yOffset = -90;
              rotate = -8;
              xOffset = -15;
            } else if (index === 1) { // middle card (warranties)
              yOffset = -60;
              rotate = 2;
              xOffset = 0;
            } else if (index === 2) { // top card (subs)
              yOffset = -25;
              rotate = 6;
              xOffset = 15;
            }
          }

          return (
            <motion.div
              key={card.id}
              className={`absolute left-1/2 -translate-x-1/2 w-[280px] h-[155px] rounded-[22px] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_-5px_20px_rgba(0,0,0,0.3)] ${card.color} ${card.textColor || 'text-white'} group overflow-hidden border border-white/5`}
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
              {/* Card Grain/Texture Effect */}
              <div className="absolute inset-0 opacity-[0.4] pointer-events-none bg-noise mix-blend-overlay" />
              
              <div className="relative flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-[2px] opacity-60 font-bold">{card.name}</span>
                    <span className="text-lg font-bold tracking-tight leading-none">{card.value}</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
                    {card.icon}
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[8px] uppercase tracking-widest opacity-50 block mb-0.5">{card.label}</span>
                    <span className="text-[11px] font-mono font-medium tracking-wider">{card.number}</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-4 rounded-sm bg-white/20 border border-white/5" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Pocket Front (Leather-like feel) */}
        <div className="absolute bottom-0 w-[300px] h-[170px] z-40 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]">
          <svg className="w-full h-full" viewBox="0 0 300 170" fill="none">
            <path d="M 0 25 C 0 15, 8 12, 15 12 C 30 12, 35 30, 50 30 L 250 30 C 265 30, 270 12, 285 12 C 292 12, 300 15, 300 25 L 300 130 C 300 160, 280 170, 250 170 L 50 170 C 20 170, 0 160, 0 130 Z" fill="#1e341e" />
            <path d="M 12 28 C 12 22, 16 20, 20 20 C 32 20, 38 36, 52 36 L 248 36 C 262 36, 268 20, 280 20 C 284 20, 288 22, 288 28 L 288 130 C 288 155, 275 160, 250 160 L 50 160 C 25 160, 12 155, 12 130 Z" stroke="#3d5635" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
          </svg>
          
          <div className="absolute top-[55px] w-full text-center z-50 flex flex-col items-center gap-2 px-6">
            <div className="relative h-7 w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!isHovered ? (
                  <motion.div
                    key="stars"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="text-[#698263] text-2xl tracking-[6px] font-light"
                  >
                    ••••••
                  </motion.div>
                ) : (
                  <motion.div
                    key="balance"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-[#a7c59e] text-2xl font-bold tracking-tight"
                  >
                    ₺{stats.totalAnnualCost.toLocaleString('tr-TR')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="text-[#698263] text-[10px] uppercase tracking-[3px] font-bold">Toplam Varlık Değeri</div>
            
            <motion.div 
              animate={{ opacity: isHovered ? 1 : 0.4, scale: isHovered ? 1.1 : 1 }}
              className="mt-3 p-1.5 rounded-full bg-[#1e341e]/50 border border-[#3d5635]/50"
            >
               {isHovered ? (
                 <Eye className="w-4 h-4 text-[#3be60b]" />
               ) : (
                 <EyeOff className="w-4 h-4 text-[#698263]" />
               )}
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
        <CreditCard className="w-3.5 h-3.5" />
        <span>Kapsül verilerini görmek için cüzdana dokun</span>
      </div>
    </div>
  );
};