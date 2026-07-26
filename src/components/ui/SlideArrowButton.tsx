import { ArrowRight } from "lucide-react";
import type React from "react";

interface SlideArrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "primary" | "secondary" | "accent";
}

export default function SlideArrowButton({
  text = "Get Started",
  variant = "primary",
  className = "",
  ...props
}: SlideArrowButtonProps) {
  const isPrimary = variant === "primary";
  
  return (
    <button
      className={`group/slide relative inline-flex items-center justify-center overflow-hidden rounded-full border border-border bg-surface hover:bg-surface-elevated p-1 text-sm font-semibold text-primary shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${className}`}
      {...props}
    >
      {/* Sliding Pill Background */}
      <div
        className="absolute left-0 top-0 flex h-full w-9 items-center justify-end rounded-full bg-accent transition-all duration-300 ease-in-out group-hover/slide:w-full"
      >
        <span className="mr-2 text-accent-foreground transition-transform duration-300 ease-in-out group-hover/slide:translate-x-0.5">
          <ArrowRight size={16} />
        </span>
      </div>
      
      {/* Button Label */}
      <span className="relative left-2 z-10 whitespace-nowrap px-6 py-1.5 font-semibold text-primary transition-all duration-300 ease-in-out group-hover/slide:-left-2 group-hover/slide:text-accent-foreground">
        {text}
      </span>
    </button>
  );
}
