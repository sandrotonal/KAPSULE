import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Fingerprint } from 'lucide-react';
import { NativeBiometricsService } from '../../services/nativeBiometrics';
import { triggerHaptic } from '../../utils/haptics';

export interface PasscodeLockProps {
  correctPasscode: string;
  biometricsEnabled?: boolean;
  onSuccess: () => void;
}

export const PasscodeLock: React.FC<PasscodeLockProps> = ({
  correctPasscode,
  biometricsEnabled = true,
  onSuccess,
}) => {
  const [code, setCode] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [hasBiometrics, setHasBiometrics] = useState<boolean>(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  useEffect(() => {
    // Check if device supports biometrics
    NativeBiometricsService.isAvailable().then(available => {
      setHasBiometrics(available);
      if (available && biometricsEnabled) {
        // Attempt quick unlock on opening
        NativeBiometricsService.authenticate().then(authed => {
          if (authed) {
            triggerHaptic.success();
            onSuccess();
          }
        });
      }
    });
  }, [biometricsEnabled, onSuccess]);

  useEffect(() => {
    let t: any;
    if (code.length === 4) {
      if (code === correctPasscode) {
        setIsError(false);
        setFailedAttempts(0);
        triggerHaptic.success();
        t = setTimeout(() => {
          onSuccess();
        }, 200);
      } else {
        setIsError(true);
        triggerHaptic.error();
        setFailedAttempts((prev) => {
          const next = prev + 1;
          if (next >= 5) {
            setLockoutSeconds(30);
            return 0;
          }
          return next;
        });
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
    if (lockoutSeconds > 0) {
      triggerHaptic.error();
      return;
    }
    if (code.length < 4 && !isError) {
      triggerHaptic.light();
      setCode(prev => prev + num);
    }
  };

  const handleDelete = () => {
    if (lockoutSeconds > 0) return;
    if (code.length > 0 && !isError) {
      triggerHaptic.light();
      setCode(prev => prev.slice(0, -1));
    }
  };

  const handleBiometricClick = async () => {
    if (lockoutSeconds > 0) return;
    triggerHaptic.medium();
    const success = await NativeBiometricsService.authenticate();
    if (success) {
      triggerHaptic.success();
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-primary transition-colors duration-300">
      <div className="w-full max-w-xs px-6 flex flex-col items-center space-y-8 select-none">

        {/* Header */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <img src="/logo.png" alt="Kapsule Logo" className="w-12 h-12 object-contain dark:invert select-none mb-1" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold tracking-tight">Kapsule Kilitli</h2>
            {lockoutSeconds > 0 ? (
              <p className="text-xs text-danger font-semibold animate-pulse">
                Güvenlik kilidi: {lockoutSeconds}s sonra tekrar deneyin
              </p>
            ) : failedAttempts >= 3 ? (
              <p className="text-xs text-amber-500 font-medium">
                Kalan deneme hakkı: {5 - failedAttempts}
              </p>
            ) : (
              <p className="text-xs text-secondary font-medium">Devam etmek için şifrenizi girin</p>
            )}
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

          {/* Bottom row: Biometric Button on left if available */}
          {hasBiometrics ? (
            <button
              type="button"
              onClick={handleBiometricClick}
              aria-label="Biyometrik kilit aç (Face ID / Parmak İzi)"
              className="w-16 h-16 rounded-full bg-surface/70 hover:bg-surface-elevated text-accent flex items-center justify-center active:scale-90 transition-all mx-auto outline-none border border-accent/20"
            >
              <Fingerprint className="w-6 h-6 stroke-[1.8]" />
            </button>
          ) : (
            <div className="w-16 h-16" aria-hidden="true" />
          )}

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

      </div>
    </div>
  );
};
