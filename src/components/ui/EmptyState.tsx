import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from './Button';
import { triggerHaptic } from '../../utils/haptics';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const handleAction = () => {
    triggerHaptic.light();
    if (onAction) onAction();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full py-16 px-6 flex flex-col items-center justify-center text-center select-none"
    >
      <div className="w-16 h-16 rounded-3xl bg-surface border border-border/80 flex items-center justify-center text-secondary shadow-soft mb-5 group-hover:scale-105 transition-transform">
        {icon}
      </div>

      <h3 className="text-base font-bold text-primary tracking-tight mb-1">{title}</h3>
      <p className="text-xs text-secondary max-w-xs leading-relaxed mb-6 opacity-80">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={handleAction}
          variant="primary"
          size="sm"
          className="rounded-2xl px-5 h-10 shadow-md font-semibold text-xs"
          icon={<Plus className="w-4 h-4" />}
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};
