import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Printer } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'print';

export interface ToastMessage {
  id: string;
  message: string;
  type?: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    
    // Trigger physical haptic feedback on mobile devices
    if (type === 'success') {
      triggerHaptic.success();
    } else if (type === 'error') {
      triggerHaptic.error();
    } else if (type === 'warning') {
      triggerHaptic.warning();
    } else {
      triggerHaptic.light();
    }

    setToasts(prev => [...prev.slice(-2), { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Floating Apple Dynamic Island Style Toast Container */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-surface/90 dark:bg-[#16181d]/95 text-primary border border-border/80 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/50 backdrop-blur-2xl select-none"
            >
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.2]" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 stroke-[2.2]" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-accent shrink-0 stroke-[2.2]" />}
              {toast.type === 'print' && <Printer className="w-4 h-4 text-accent shrink-0 stroke-[2.2]" />}
              
              <span className="text-xs font-medium tracking-tight text-primary">
                {toast.message}
              </span>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="ml-1 text-secondary/40 hover:text-primary transition-colors p-0.5 rounded-full"
                aria-label="Kapat"
              >
                <X className="w-3.5 h-3.5 stroke-[2]" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
