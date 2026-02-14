
import React, { forwardRef } from "react";
import { cn } from "../../utils";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  error?: boolean;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ leftIcon, error, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-10 rounded-[var(--radius-lg)] px-4",
            "glass-bordered", /* Use the refined global utility */
            "text-foreground font-bold placeholder:text-muted-foreground/70", /* Use system colors */
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
            "transition-all duration-200",
            leftIcon && "pl-10",
            error && "ring-2 ring-destructive border-destructive",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
GlassInput.displayName = "GlassInput";
