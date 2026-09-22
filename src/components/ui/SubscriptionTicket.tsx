import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface SubscriptionTicketProps {
  name: string;
  logoUrl?: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  renewalDate: string;
  category: string;
  status: 'active' | 'cancelling' | 'paused';
}

export const SubscriptionTicket: React.FC<SubscriptionTicketProps> = ({
  name,
  logoUrl,
  price,
  currency,
  billingCycle,
  renewalDate,
  category,
  status
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let lastUpdate = Date.now();

    const updateTime = () => {
      const now = Date.now();
      if (now - lastUpdate >= 50) {
        setCurrentTime(new Date(now));
        lastUpdate = now;
      }
      animationFrameId = requestAnimationFrame(updateTime);
    };

    animationFrameId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const currencySymbol = currency === 'TL' || currency === 'TRY' ? '₺' : 
                        currency === 'USD' ? '$' : 
                        currency === 'EUR' ? '€' : '₺';

  const renewal = new Date(renewalDate);
  const daysUntilRenewal = Math.ceil((renewal.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const statusColors = {
    active: 'from-emerald-400 to-green-500',
    cancelling: 'from-orange-400 to-red-500',
    paused: 'from-gray-400 to-gray-500'
  };

  const statusText = {
    active: 'Aktif',
    cancelling: 'İptal Ediliyor',
    paused: 'Duraklatıldı'
  };

  return (
    <motion.div
      className="relative perspective-1000"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative h-[180px] w-[340px] flex bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-md dark:shadow-2xl border border-gray-200/80 dark:border-white/10 text-gray-900 dark:text-zinc-100"
        animate={{
          rotateY: isHovered ? 0 : [0, -5, 5, 0],
          y: isHovered ? -10 : 0
        }}
        transition={{
          rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 0.3 }
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg
          className="absolute left-0 top-0 h-full fill-zinc-200/80 dark:fill-zinc-800"
          xmlns="http://www.w3.org/2000/svg"
          width={64}
          height={180}
          viewBox="0 0 64 180"
        >
          {Array.from({ length: 35 }).map((_, i) => (
            <motion.path
              key={i}
              d={`M44 ${12 + i * 4}V${11 + i * 4}H20V${12 + i * 4}H44Z`}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, delay: i * 0.05, repeat: Infinity }}
            />
          ))}
        </svg>

        <div className="absolute top-0 left-[50px] w-[2px] h-full flex items-center justify-center z-10">
          <div className="relative h-full border-l-2 border-dashed border-gray-300 dark:border-zinc-700">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background" />
          </div>
        </div>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            x: [-100, 400]
          }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
          style={{ 
            width: '80px', 
            height: '100%', 
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
            transform: 'skewX(-20deg)'
          }}
        />

        <div className="relative flex-1 flex flex-col justify-between p-4 pl-16 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {logoUrl ? (
                  <img src={logoUrl} alt={name} className="w-6 h-6 object-contain rounded" />
                ) : (
                  <CreditCard className="w-5 h-5 text-accent" />
                )}
                <h3 className="font-bold text-sm text-gray-900 dark:text-zinc-100 truncate">{name}</h3>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{category}</p>
            </div>
            
            <div className="text-right shrink-0 pl-2">
              <p className="text-lg font-bold text-gray-900 dark:text-zinc-100 tabular-nums">
                {formatCurrency(price, currency)}
              </p>
              <p className="text-[9px] text-gray-400 dark:text-zinc-500">/{billingCycle === 'monthly' ? 'ay' : 'yıl'}</p>
            </div>
          </div>

          <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-zinc-700 to-transparent my-2" />

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <p className="text-gray-400 dark:text-zinc-500 mb-0.5">Yenileme</p>
              <p className="font-semibold text-gray-700 dark:text-zinc-300">
                {renewal.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
              </p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-zinc-500 mb-0.5">Kalan Gün</p>
              <p className="font-semibold text-gray-700 dark:text-zinc-300">{daysUntilRenewal} gün</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${statusColors[status]} text-white text-[9px] font-bold`}>
              {statusText[status]}
            </div>
            <div className="flex items-center gap-1 text-[9px] text-gray-400 dark:text-zinc-500">
              <Clock className="w-3 h-3" />
              <span>{currentTime.toLocaleTimeString('tr-TR')}</span>
            </div>
          </div>
        </div>

        <motion.div
          className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-black/10 to-transparent"
          animate={{
            x: [200, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: 'blur(20px)' }}
        />
      </motion.div>
    </motion.div>
  );
};
