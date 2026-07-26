import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  selected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  className,
  padding = 'md',
  selected = false,
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <motion.div
      whileHover={interactive ? { y: -1, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } } : undefined}
      whileTap={interactive ? { scale: 0.995, y: 0 } : undefined}
      className={cn(
        "bg-background rounded-2xl border transition-all duration-200",
        selected
          ? "border-accent/30 ring-2 ring-accent/10 shadow-card"
          : "border-border shadow-card",
        interactive && "hover:shadow-card-hover cursor-pointer",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
