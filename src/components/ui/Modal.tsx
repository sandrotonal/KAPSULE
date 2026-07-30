import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  hideHeader?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
  hideHeader = false,
}) => {
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Focus trap - improved timing
      const timer = setTimeout(() => firstFocusRef.current?.focus(), 100);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const portal = typeof document !== 'undefined' ? document.body : null;
  if (!portal) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
          />

          {/* Sheet (mobile) / Modal (desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative w-full bg-background z-10",
              "border border-border shadow-modal",
              "max-h-[90vh] flex flex-col",
              // Mobile: bottom sheet
              "rounded-t-3xl sm:rounded-2xl",
              widths[maxWidth]
            )}
          >
            {/* Drag indicator — mobile only */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-8 h-1 rounded-full bg-border" />
            </div>

            {/* Header */}
            {!hideHeader && (title || subtitle) && (
              <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
                <div className="space-y-0.5 min-w-0 pr-4">
                  {title && (
                    <h3 className="text-base font-semibold text-primary leading-snug">{title}</h3>
                  )}
                  {subtitle && (
                    <p className="text-xs text-secondary">{subtitle}</p>
                  )}
                </div>
                <button
                  ref={firstFocusRef}
                  onClick={onClose}
                  className="shrink-0 p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-surface transition-colors"
                  aria-label="Kapat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Content — scrollable */}
            <div className="overflow-y-auto thin-scrollbar flex-1 p-5">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    portal
  );
};
