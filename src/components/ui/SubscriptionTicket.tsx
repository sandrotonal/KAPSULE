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
        className="relative h-[180px] w-[340px] flex bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-200"
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
          className="absolute left-0 top-0 h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          width={64}
          height={180}
          viewBox="0 0 64 180"
          fill="#e8e8e8"
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
          <div className="relative h-full border-l-2 border-dashed border-gray-300">
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
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: 'skewX(-20deg)'
          }}
        />

        <div className="relative flex-1 flex flex-col justify-between p-4 pl-16 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {logoUrl ? (
                  <img src={logoUrl} alt={name} className="w-6 h-6 object-contain rounded" />
                ) : (
                  <CreditCard className="w-5 h-5 text-accent" />
                )}
                <h3 className="font-bold text-sm text-gray-800 truncate">{name}</h3>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{category}</p>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 tabular-nums">
                {formatCurrency(price, currency)}
              </p>
              <p className="text-[9px] text-gray-400">/{billingCycle === 'monthly' ? 'ay' : 'yıl'}</p>
            </div>
          </div>

          <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <p className="text-gray-400 mb-0.5">Yenileme</p>
              <p className="font-semibold text-gray-700">
                {renewal.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Kalan Gün</p>
              <p className="font-semibold text-gray-700">{daysUntilRenewal} gün</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${statusColors[status]} text-white text-[9px] font-bold`}>
              {statusText[status]}
            </div>
            <div className="flex items-center gap-1 text-[9px] text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{currentTime.toLocaleTimeString('tr-TR')}</span>
            </div>
          </div>

          <motion.div
            className="absolute bottom-0 right-0 p-3"
            animate={{
              backgroundColor: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#6366F1']
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ zIndex: -1, borderTopLeftRadius: '1rem' }}
          >
            <Calendar className="w-5 h-5 text-white" />
          </motion.div>
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
