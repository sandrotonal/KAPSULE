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
          <div className="absolute left-3.5 text-secondary pointer-events-none z-10 group-focus-within:text-primary transition-colors duration-150">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-12 bg-surface text-primary placeholder:text-secondary/50",
            "text-[15px] rounded-xl border border-border/60",
            "px-4 transition-all duration-200 ease-out",
            "focus:outline-none focus:border-accent focus:bg-surface focus:ring-0",
            "hover:border-border",
            icon && "pl-10",
            iconRight && "pr-10",
            error && "border-danger focus:border-danger",
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={descriptionId}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3.5 text-secondary pointer-events-none z-10">
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

export default Input;
