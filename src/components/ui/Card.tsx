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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || !props.onClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      props.onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <motion.div
      whileHover={interactive ? { 
        y: -4, 
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
      } : undefined}
      whileTap={interactive ? { scale: 0.98, y: 0 } : undefined}
      className={cn(
        "bg-background/40 backdrop-blur-xl border transition-all duration-500 rounded-[2rem]",
        selected
          ? "border-accent ring-4 ring-accent/5 shadow-card"
          : "border-border shadow-soft hover:shadow-card hover:border-border-subtle",
        interactive && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
        paddings[padding],
        className
      )}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </motion.div>
  );
};
