import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'outline' | 'muted';
  size?: 'xs' | 'sm';
  dot?: boolean;
  className?: string;
}

const dotColors = {
  default: 'bg-secondary',
  accent: 'bg-accent',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  outline: 'bg-secondary',
  muted: 'bg-secondary/60',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
}) => {
  const variants = {
    default: "bg-surface/80 text-primary border border-border/60",
    accent: "bg-accent/10 text-accent border border-accent/20",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
    outline: "bg-transparent text-secondary border border-border/80",
    muted: "bg-surface/60 text-secondary border border-border/40",
  };

  const sizes = {
    xs: "text-[11px] px-2 py-0.5 rounded-full font-medium gap-1.5",
    sm: "text-xs px-2.5 py-1 rounded-full font-medium gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap select-none font-medium tracking-tight transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />
      )}
      {children}
    </span>
  );
};

export default Badge;
