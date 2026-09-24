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
      {/* Pure floating icon (no square background box, no border) */}
      <div className="mb-4 flex items-center justify-center text-secondary/50 [&>svg]:w-10 [&>svg]:h-10 [&>svg]:stroke-[1.3] transition-colors">
        {icon}
      </div>

      <h3 className="text-base font-bold text-primary tracking-tight mb-1">{title}</h3>
      <p className="text-xs text-secondary max-w-sm leading-relaxed mb-6 opacity-80">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={handleAction}
          variant="primary"
          size="sm"
          className="rounded-full px-5 h-10 shadow-sm font-semibold text-xs"
          icon={<Plus className="w-3.5 h-3.5 stroke-[2]" />}
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};
