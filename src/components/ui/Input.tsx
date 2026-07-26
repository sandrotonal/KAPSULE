import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  icon,
  iconRight,
  className,
  wrapperClassName,
  ...props
}, ref) => {
  return (
    <div className={cn("w-full flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label className="text-sm font-medium text-primary/80">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full group">
        {icon && (
          <div className="absolute left-3 text-secondary pointer-events-none z-10 group-focus-within:text-primary transition-colors duration-150">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-10 bg-surface text-primary placeholder:text-secondary/50",
            "text-sm rounded-xl border border-border",
            "px-3.5 transition-all duration-150",
            "focus:outline-none focus:border-accent/40 focus:bg-background focus:shadow-focus focus:ring-0",
            "hover:border-border hover:bg-surface-elevated",
            icon && "pl-9",
            iconRight && "pr-9",
            error && "border-danger/40 focus:border-danger/60 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]",
            className
          )}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 text-secondary pointer-events-none z-10">
            {iconRight}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-secondary">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
