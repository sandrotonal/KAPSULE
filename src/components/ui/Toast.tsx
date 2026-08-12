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
      
      {/* Floating Apple-Grade Subtle Toast Container */}
      <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-[110] flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-full bg-neutral-900/90 dark:bg-neutral-100/90 text-white dark:text-neutral-900 border border-neutral-800 dark:border-neutral-200 shadow-2xl backdrop-blur-xl select-none"
            >
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 dark:text-rose-600 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 dark:text-blue-600 shrink-0" />}
              {toast.type === 'print' && <Printer className="w-4 h-4 text-violet-400 dark:text-violet-600 shrink-0" />}
              
              <span className="text-xs font-semibold tracking-tight leading-none">
                {toast.message}
              </span>

              <button
                onClick={() => removeToast(toast.id)}
                className="ml-1 opacity-60 hover:opacity-100 transition-opacity p-0.5"
              >
                <X className="w-3.5 h-3.5" />
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
