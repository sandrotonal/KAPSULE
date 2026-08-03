import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReceiptData {
  shopName: string;
  address: string;
  city: string;
  zipCode: string;
  orderNumber: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
  logo?: string;
  currency?: string;
}

interface PrinterReceiptProps {
  data: ReceiptData;
  onPrint?: () => void;
  onPrintComplete?: () => void;
}

export const PrinterReceipt: React.FC<PrinterReceiptProps> = ({ data, onPrint, onPrintComplete }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDisplayed, setIsDisplayed] = useState(false);

  const currencySymbol = data.currency === 'TL' || data.currency === 'TRY' ? '₺' : 
                        data.currency === 'USD' ? '$' : 
                        data.currency === 'EUR' ? '€' : '₺';

  const playPrintSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    setTimeout(() => {
      oscillator.frequency.value = 400;
    }, 100);
    setTimeout(() => {
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.stop(audioContext.currentTime + 0.2);
    }, 200);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setIsDisplayed(false);
    playPrintSound();
    
    setTimeout(() => {
      setIsPrinting(false);
      setIsDisplayed(true);
      onPrint?.();
      onPrintComplete?.();
    }, 1200);
  };

  const handleReset = () => {
    setIsDisplayed(false);
    setIsPrinting(false);
  };

  return (
    <div className="relative select-none font-mono text-sm">
      <div className="relative w-80">
        <div 
          className="relative h-20 rounded-b-lg bg-gradient-to-b from-[#dcdac4] to-[#c0beaa] border-2 border-[#c0beaa] shadow-[0_16px_32px_0px_rgba(0,0,0,0.12),0_-30px_16px_0px_rgba(0,0,0,0.06)]"
        >
          <div className="absolute -top-[30px] left-0 w-full h-[70px] rounded-t-xl border-b-2 border-black/20 bg-[#dcdac4] z-[2]"
            style={{
              filter: 'brightness(1.12)',
              boxShadow: '0 12px 16px -12px rgba(255,255,255,0.3) inset, 0 -6px 16px -6px rgba(0,0,0,0.2) inset, 0 6px 8px -6px rgba(0,0,0,0.25)'
            }}
          />

          <div className="absolute top-5 left-[30px] w-[260px] h-10 rounded-b bg-gradient-to-t from-[#dcdac4] to-[#c0beaa] border-b border-black/20 shadow-[0_4px_4px_-2px_rgba(0,0,0,0.25)] z-[1]" />

          <div 
            className="absolute -top-[10px] left-[30px] w-40 h-8 bg-black rounded-md border-[3px] border-[#c0beaa] flex items-center px-2 z-[2] font-['Courier_New',Courier,monospace] text-[0.8em] text-[#5aff5a]"
            style={{
              backgroundImage: 'linear-gradient(transparent 0, rgba(255,255,255,0.13) 90%, transparent 100%)',
              backgroundSize: '100% 8px',
              backgroundRepeat: 'no-repeat',
              boxShadow: '-1px -1px 2px 0 rgba(255,255,255,0.6) inset, 1px 1px 5px 1px #000 inset, 0 0 1px 2px rgba(0,0,0,0.13)',
              filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.13))'
            }}
          >
            {!isPrinting ? (
              <span className="text-[#5aff5a]">Click to print</span>
            ) : (
              <div className="flex gap-0">
                {['P', 'r', 'i', 'n', 't', 'i', 'n', 'g', '.', '.', '.'].map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isPrinting ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handlePrint}
            disabled={isPrinting || isDisplayed}
            className="absolute -top-[30px] right-0 m-4 w-12 h-9 flex items-center justify-center text-xl bg-[#dcdac4] border border-black/6 rounded-md cursor-pointer transition-all duration-100 z-[2] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              boxShadow: isPrinting 
                ? '2px 2px 2px 0 rgba(0,0,0,0.13) inset, -2px -2px 2px 0 rgba(255,255,255,0.6) inset, 0 0px 4px 0px rgba(255,255,255,0.6)'
                : '1px 1px 2px 0 rgba(255,255,255,0.5) inset, -1px -1px 2px 0 rgba(0,0,0,0.13) inset, 0 2px 6px 0px rgba(0,0,0,0.13)'
            }}
          >
            🖨
          </button>
        </div>

        <AnimatePresence>
          <motion.div
            className="absolute top-0 left-11"
            initial={{ y: '-100%', clipPath: 'inset(100% -100px -100px -100px)' }}
            animate={
              isPrinting
                ? { y: '10%', clipPath: 'inset(-20% -100px -100px -100px)' }
                : isDisplayed
                ? { y: '-40%', scale: 1.2, clipPath: 'inset(-20% -100px -100px -100px)' }
                : { y: '-100%', clipPath: 'inset(100% -100px -100px -100px)' }
            }
            transition={{
              duration: isPrinting ? 1.2 : 0.4,
              ease: isPrinting ? 'easeIn' : [0, 0.63, 0.96, 1.1]
            }}
            style={{
              filter: 'drop-shadow(0 0 12px rgba(0,0,0,0.06))',
              zIndex: isDisplayed ? 5 : 2
            }}
          >
            <div 
              className="relative flex flex-col gap-4 p-4 w-[200px] min-h-40 text-xs font-['Azeret_Mono','Roboto_Mono',monospace] text-[#444] bg-[#f5f5f5]"
              style={{
                boxShadow: '0 12px 12px 0 rgba(0,0,0,0.06), 0 24px 24px 0 rgba(0,0,0,0.06), 0 36px 36px 0 rgba(0,0,0,0.06)'
              }}
            >
              <div 
                className="absolute -top-2 left-0 w-full h-2"
                style={{
                  background: `linear-gradient(-45deg, #f5f5f5 4px, transparent 0), linear-gradient(45deg, #f5f5f5 4px, transparent 0)`,
                  backgroundPosition: '4px 0',
                  backgroundRepeat: 'repeat-x',
                  backgroundSize: '8px 8px'
                }}
              />
              
              <div 
                className="absolute -bottom-2 left-0 w-full h-2"
                style={{
                  background: `linear-gradient(225deg, #f5f5f5 4px, transparent 0), linear-gradient(135deg, #f5f5f5 4px, transparent 0)`,
                  backgroundPosition: '0 100%',
                  backgroundRepeat: 'repeat-x',
                  backgroundSize: '8px 8px'
                }}
              />

              <div className="flex justify-between py-1">
                <div className="text-[1.1em] font-semibold">
                  {data.shopName} <br />
                  {data.address} <br />
                  {data.city} <br />
                  {data.zipCode}
                </div>
                <div className="w-12 text-3xl rotate-[10deg] grayscale">
                  {data.logo || '👕'}
                </div>
              </div>

              <div className="py-1 border-b border-dashed border-[#ccc]">
                Order No. #{data.orderNumber} <br />
                {data.date}
              </div>

              <table className="w-full text-left leading-6">
                <thead>
                  <tr>
                    <th className="font-semibold">Ürün</th>
                    <th className="font-semibold">Adet</th>
                    <th className="font-semibold text-right">Fiyat</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.quantity} x</td>
                      <td className="text-right">{item.price.toFixed(2)} {currencySymbol}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-dashed border-[#ccc]">
                    <td colSpan={2}>Ara Toplam</td>
                    <td className="text-right">{data.subtotal.toFixed(2)} {currencySymbol}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>KDV ({(data.taxRate * 100).toFixed(0)}%)</td>
                    <td className="text-right">{data.tax.toFixed(2)} {currencySymbol}</td>
                  </tr>
                  <tr className="border-t border-dashed border-[#ccc] font-semibold">
                    <td colSpan={2}>Toplam</td>
                    <td className="text-right">{data.total.toFixed(2)} {currencySymbol}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-center text-center py-1">
                Teşekkürler!
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {isDisplayed && (
          <button
            onClick={handleReset}
            className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Tekrar yazdır
          </button>
        )}
      </div>
    </div>
  );
};
