import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Delete, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface PasscodeLockProps {
  correctPasscode: string;
  onSuccess: () => void;
  onResetData: () => void;
}

export const PasscodeLock: React.FC<PasscodeLockProps> = ({
  correctPasscode = '1234',
  onSuccess,
  onResetData,
}) => {
  const [code, setCode] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    let t: any;
    if (code.length === 4) {
      if (code === correctPasscode) {
        setIsError(false);
        t = setTimeout(() => {
          onSuccess();
        }, 200);
      } else {
        setIsError(true);
        t = setTimeout(() => {
          setCode('');
          setIsError(false);
        }, 600);
      }
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [code, correctPasscode, onSuccess]);

  const handleKeyPress = (num: string) => {
    if (code.length < 4 && !isError) {
      setCode(prev => prev + num);
    }
  };

  const handleDelete = () => {
    if (code.length > 0 && !isError) {
      setCode(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-primary transition-colors duration-300">
      <div className="w-full max-w-xs px-6 flex flex-col items-center space-y-8 select-none">

        {/* Header */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface border border-border/80 flex items-center justify-center p-2.5 shadow-soft overflow-hidden">
            <img src="/src/assets/logo.png" alt="Kapsule Logo" className="w-full h-full object-contain dark:invert" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold tracking-tight">Kapsule Kilitli</h2>
            <p className="text-xs text-secondary font-medium">Devam etmek için şifrenizi girin</p>
          </div>
        </div>

        {/* Dots */}
        <motion.div
          animate={isError ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-4 py-2"
        >
          {[0, 1, 2, 3].map(index => {
            const filled = code.length > index;
            return (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-150 ${isError
                  ? 'bg-danger border-danger'
                  : filled
                    ? 'bg-primary border-primary scale-110 shadow-soft'
                    : 'border-border bg-surface'
                  }`}
              />
            );
          })}
        </motion.div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-x-6 gap-y-4 w-full pt-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              aria-label={`${num} rakamını gir`}
              className="w-16 h-16 rounded-full bg-surface hover:bg-surface-elevated border border-border/80 text-xl font-medium flex items-center justify-center active:scale-90 transition-all select-none mx-auto outline-none focus:ring-2 focus:ring-accent/20"
            >
              {num}
            </button>
          ))}

          {/* Bottom row */}
          <button
            onClick={onResetData}
            title="Kasayı sıfırla"
            aria-label="Kasayı sıfırla"
            className="w-16 h-16 rounded-full text-secondary hover:text-danger flex items-center justify-center active:scale-90 transition-all mx-auto outline-none text-xs"
          >
            Sıfırla
          </button>

          <button
            onClick={() => handleKeyPress('0')}
            aria-label="0 rakamını gir"
            className="w-16 h-16 rounded-full bg-surface hover:bg-surface-elevated border border-border/80 text-xl font-medium flex items-center justify-center active:scale-90 transition-all select-none mx-auto outline-none focus:ring-2 focus:ring-accent/20"
          >
            0
          </button>

          <button
            onClick={handleDelete}
            aria-label="Son rakamı sil"
            className="w-16 h-16 rounded-full text-secondary hover:text-primary flex items-center justify-center active:scale-90 transition-all mx-auto outline-none"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Hint */}
        <div className="text-center pt-2">
          <p className="text-[10px] text-secondary/60">Demo şifre 1234</p>
        </div>
      </div>
    </div>
  );
};
