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
  const descriptionId = props.id
    ? error
      ? `${props.id}-error`
      : hint
        ? `${props.id}-hint`
        : undefined
    : undefined;

  return (
    <div className={cn("w-full flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label htmlFor={props.id} className="text-sm font-medium text-primary/80">
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
            "w-full h-12 bg-surface text-primary placeholder:text-secondary/50",
            "text-[16px] rounded-xl border border-border",
            "px-4 transition-all duration-300 cubic-bezier(0.16,1,0.3,1)",
            "focus:outline-none focus:border-accent/40 focus:bg-background focus:shadow-focus focus:ring-0",
            "hover:border-border hover:bg-surface-elevated",
            icon && "pl-9",
            iconRight && "pr-9",
            error && "border-danger/40 focus:border-danger/60 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]",
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={descriptionId}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 text-secondary pointer-events-none z-10">
            {iconRight}
          </div>
        )}
      </div>
      {error && (
        <p id={props.id ? `${props.id}-error` : undefined} className="text-xs text-danger" role="alert">{error}</p>
      )}
      {hint && !error && (
        <p id={props.id ? `${props.id}-hint` : undefined} className="text-xs text-secondary">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
