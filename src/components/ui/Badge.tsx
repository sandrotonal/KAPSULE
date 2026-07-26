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
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  outline: 'bg-secondary',
  muted: 'bg-secondary/50',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
}) => {
  const variants = {
    default: "bg-vault-100 text-vault-600 border-transparent",
    accent: "bg-accent-soft text-accent border-transparent",
    success: "bg-success-muted text-success border-transparent",
    warning: "bg-warning-muted text-warning border-transparent",
    danger: "bg-danger-muted text-danger border-transparent",
    outline: "bg-transparent text-secondary border border-border",
    muted: "bg-surface text-secondary/70 border-transparent",
  };

  const sizes = {
    xs: "text-[10px] px-1.5 py-0.5 rounded font-medium gap-1",
    sm: "text-xs px-2 py-0.5 rounded-md font-medium gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap select-none",
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
