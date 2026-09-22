import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, AlertTriangle } from 'lucide-react';

interface WarrantyTicketProps {
  productName: string;
  brand: string;
  imageUrl?: string;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'expiring_soon' | 'expired';
  daysRemaining: number;
}

export const WarrantyTicket: React.FC<WarrantyTicketProps> = ({
  productName,
  brand,
  imageUrl,
  purchaseDate,
  expiryDate,
  status,
  daysRemaining
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

  const purchase = new Date(purchaseDate);
  const expiry = new Date(expiryDate);

  const statusColors = {
    active: 'from-green-400 to-emerald-500',
    expiring_soon: 'from-yellow-400 to-orange-500',
    expired: 'from-red-400 to-red-600'
  };

  const statusText = {
    active: 'Aktif',
    expiring_soon: 'Sona Eriyor',
    expired: 'Süresi Doldu'
  };

  const statusIcons = {
    active: <Shield className="w-3.5 h-3.5" />,
    expiring_soon: <AlertTriangle className="w-3.5 h-3.5" />,
    expired: <AlertTriangle className="w-3.5 h-3.5" />
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
        className="relative h-[180px] w-[340px] flex bg-gradient-to-br from-white to-blue-50 rounded-2xl overflow-hidden shadow-lg border border-blue-200"
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
          fill="#dbeafe"
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
          <div className="relative h-full border-l-2 border-dashed border-border/60">
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
            filter: 'blur(10px)',
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)'
          }}
        />

        <div className="relative flex-1 flex flex-col justify-between p-4 pl-16 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {imageUrl ? (
                  <img src={imageUrl} alt={productName} className="w-6 h-6 object-contain rounded" />
                ) : (
                  <Shield className="w-5 h-5 text-blue-500" />
                )}
                <h3 className="font-bold text-sm text-gray-800 truncate">{productName}</h3>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{brand}</p>
            </div>
            
            <div className="text-right">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${statusColors[status]} text-white text-[9px] font-bold`}>
                {statusIcons[status]}
                <span>{statusText[status]}</span>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-gradient-to-r from-transparent via-blue-300 to-transparent my-2" />

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <p className="text-gray-400 mb-0.5">Satın Alma</p>
              <p className="font-semibold text-gray-700">
                {purchase.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Bitiş Tarihi</p>
              <p className="font-semibold text-gray-700">
                {expiry.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="text-[10px]">
              <p className="text-gray-400 mb-0.5">Kalan Süre</p>
              <p className="font-bold text-gray-700 text-base">
                {daysRemaining > 0 ? `${daysRemaining} gün` : 'Süresi doldu'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{currentTime.toLocaleTimeString('tr-TR')}</span>
            </div>
          </div>

          <motion.div
            className="absolute bottom-0 right-0 p-3"
            animate={{
              backgroundColor: status === 'active' ? ['#3B82F6', '#10B981', '#3B82F6'] :
                              status === 'expiring_soon' ? ['#F59E0B', '#EF4444', '#F59E0B'] :
                              ['#DC2626', '#991B1B', '#DC2626']
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ zIndex: -1, borderTopLeftRadius: '1rem' }}
          >
            <Shield className="w-5 h-5 text-white" />
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
