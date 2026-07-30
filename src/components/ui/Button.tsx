import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  ariaLabel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  className,
  children,
  icon,
  iconRight,
  loading,
  disabled,
  ariaLabel,
  ...props
}, ref) => {
  const base = [
    "inline-flex items-center justify-center font-medium select-none",
    "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "active:scale-[0.96]",
    "disabled:opacity-40 disabled:pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
  ].join(' ');

  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-soft active:scale-95",
    secondary: "bg-surface/50 backdrop-blur-md text-primary hover:bg-surface-elevated border border-border/60",
    ghost: "text-secondary hover:text-accent hover:bg-accent/5",
    danger: "text-danger hover:bg-danger-muted border border-danger/20",
    outline: "border border-border/80 text-primary hover:bg-surface",
  };

  const sizes = {
    xs: "text-xs px-3 py-1.5 rounded-full gap-1.5 h-8",
    sm: "text-sm px-4 py-2 rounded-full gap-1.5 h-10",
    md: "text-sm px-6 py-2.5 rounded-full gap-2 h-12",
    lg: "text-base px-8 py-3 rounded-full gap-2.5 h-14 font-semibold",
  };

  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <>
          {icon && <span className="shrink-0 opacity-80">{icon}</span>}
          <span>{children}</span>
          {iconRight && <span className="shrink-0 opacity-60">{iconRight}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';
