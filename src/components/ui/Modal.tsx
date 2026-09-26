import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useIsMobile } from '../../hooks/useMediaQuery';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hideHeader?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
  hideHeader = false,
  className,
}) => {
  const isMobile = useIsMobile();
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Retain content during exit animation so closing sheet doesn't collapse to 0 height
  const childrenRef = useRef<React.ReactNode>(children);
  const titleRef = useRef<string | undefined>(title);
  const subtitleRef = useRef<string | undefined>(subtitle);

  if (isOpen) {
    if (children) childrenRef.current = children;
    if (title !== undefined) titleRef.current = title;
    if (subtitle !== undefined) subtitleRef.current = subtitle;
  }

  const displayChildren = isOpen ? children : (childrenRef.current ?? children);
  const displayTitle = isOpen ? title : (titleRef.current ?? title);
  const displaySubtitle = isOpen ? subtitle : (subtitleRef.current ?? subtitle);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus management & body overflow lock
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      const active = document.activeElement;
      const isInputActive = active && (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.tagName === 'SELECT'
      );
      if (!isInputActive) {
        firstFocusRef.current?.focus();
      }
    }, 100);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
  };

  const portal = typeof document !== 'undefined' ? document.body : null;
  if (!portal) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop — Clean native blur with instant tap response */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/25 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet (mobile bottom slide) / Modal (desktop center zoom) */}
          <motion.div
            key="modal-sheet"
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.96, y: 12 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.96, y: 12 }}
            transition={
              isMobile
                ? { type: 'spring', damping: 32, stiffness: 360, mass: 0.8 }
                : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }
            }
            className={cn(
              "relative w-full bg-background z-10",
              "border border-border/70 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18)] dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.75)]",
              "max-h-[90vh] flex flex-col",
              "rounded-t-[32px] sm:rounded-3xl overflow-hidden",
              widths[maxWidth],
              className
            )}
            style={{
              paddingBottom: isMobile ? 'max(0.75rem, env(safe-area-inset-bottom, 16px))' : undefined,
            }}
          >
            {/* Drag indicator — mobile only */}
            <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-9 h-1 rounded-full bg-border" />
            </div>

            {/* Header */}
            {!hideHeader && (displayTitle || displaySubtitle) && (
              <div className="flex items-start justify-between px-5 py-4 border-b border-border shrink-0">
                <div className="space-y-0.5 min-w-0 pr-4">
                  {displayTitle && (
                    <h3 className="text-base font-semibold text-primary leading-snug">{displayTitle}</h3>
                  )}
                  {displaySubtitle && (
                    <p className="text-xs text-secondary">{displaySubtitle}</p>
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
              {displayChildren}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portal
  );
};
