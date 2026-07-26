import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
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
  ...props
}, ref) => {
  const base = [
    "inline-flex items-center justify-center font-medium select-none",
    "transition-all duration-150 ease-out",
    "active:scale-[0.975]",
    "disabled:opacity-40 disabled:pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
  ].join(' ');

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-vault-800 shadow-soft",
    secondary: "bg-surface text-primary hover:bg-surface-elevated border border-border",
    ghost: "text-secondary hover:text-primary hover:bg-surface",
    danger: "text-danger hover:bg-danger-muted border border-danger/20",
    outline: "border border-border text-primary hover:bg-surface",
  };

  const sizes = {
    xs: "text-xs px-3 py-1.5 rounded-lg gap-1.5 h-8",
    sm: "text-sm px-4 py-2 rounded-xl gap-1.5 h-10",
    md: "text-sm px-5 py-2.5 rounded-xl gap-2 h-12",
    lg: "text-[16px] px-6 py-3 rounded-2xl gap-2 h-14",
  };

  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
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
