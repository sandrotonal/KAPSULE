import React from 'react';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { BrandAvatar } from './BrandAvatar';

interface ReceiptTicketProps {
  merchant: string;
  merchantLogo?: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
  orderId: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export const ReceiptTicket: React.FC<ReceiptTicketProps> = ({
  merchant,
  merchantLogo,
  amount,
  currency,
  date,
  category,
  orderId,
  items = []
}) => {
  const currencySymbol = currency === 'TL' || currency === 'TRY' ? '₺' : 
                        currency === 'USD' ? '$' : 
                        currency === 'EUR' ? '€' : '₺';

  const purchaseDate = new Date(date);
  const formattedDate = purchaseDate.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = purchaseDate.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div
      className="relative perspective-1000"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="relative h-[180px] w-[340px] flex bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-md dark:shadow-2xl"
      >
        <svg
          className="absolute left-0 top-0 h-full fill-zinc-200/80 dark:fill-zinc-800"
          xmlns="http://www.w3.org/2000/svg"
          width={64}
          height={180}
          viewBox="0 0 64 180"
        >
          {Array.from({ length: 35 }).map((_, i) => (
            <path
              key={i}
              d={`M44 ${12 + i * 4}V${11 + i * 4}H20V${12 + i * 4}H44Z`}
              opacity={0.55}
            />
          ))}
        </svg>

        <div className="absolute top-0 left-[50px] w-[2px] h-full flex items-center justify-center z-10">
          <div className="relative h-full border-l-2 border-dashed border-gray-300 dark:border-zinc-700">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background" />
          </div>
        </div>

        <div className="relative flex-1 flex flex-col justify-between p-4 pl-16 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-1">
                <BrandAvatar
                  name={merchant}
                  brand={merchant}
                  imageUrl={merchantLogo}
                  size="sm"
                  className="w-7 h-7 rounded-lg shrink-0 border border-border/40"
                />
                <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-sm tracking-tight capitalize line-clamp-1">{merchant}</h3>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{category}</p>
            </div>
            
            <div className="text-right shrink-0 pl-2">
              <p className="text-lg font-bold text-gray-900 dark:text-zinc-100 tabular-nums">
                {formatCurrency(amount, currency)}
              </p>
            </div>
          </div>

          <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-zinc-700 to-transparent my-2" />

          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div>
              <p className="text-gray-400 dark:text-zinc-500 mb-0.5">Sipariş No</p>
              <p className="font-semibold text-gray-700 dark:text-zinc-300 truncate">#{orderId.slice(0, 6)}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-zinc-500 mb-0.5">Tarih</p>
              <p className="font-semibold text-gray-700 dark:text-zinc-300">{formattedDate}</p>
            </div>
            <div>
              <p className="text-gray-400 dark:text-zinc-500 mb-0.5">Saat</p>
              <p className="font-semibold text-gray-700 dark:text-zinc-300">{formattedTime}</p>
            </div>
          </div>

          {items.length > 0 && (
            <>
              <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-zinc-700 to-transparent my-2" />
              <div className="space-y-1 max-h-12 overflow-y-auto custom-scrollbar">
                {items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[9px] text-gray-600 dark:text-zinc-400">
                    <span className="truncate flex-1">{item.name}</span>
                    <span className="ml-2">{item.quantity}x</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-zinc-200">{item.price.toFixed(2)} {currencySymbol}</span>
                  </div>
                ))}
                {items.length > 2 && (
                  <p className="text-[8px] text-gray-400 dark:text-zinc-500 italic">+{items.length - 2} ürün daha</p>
                )}
              </div>
            </>
          )}
        </div>

      </motion.div>
    </motion.div>
  );
};
