
import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "danger" | "subtle" | "brand";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ variant = "default", size = "md", loading, icon, className, children, disabled, ...props }, ref) => {
    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
      icon: "h-10 w-10 p-2 flex items-center justify-center",
    };

    const variants = {
      default: "glass-interactive text-foreground hover:text-primary animate-morph",
      primary: "bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/25 border border-white/10 animate-morph",
      danger: "bg-destructive text-destructive-foreground hover:brightness-110 border border-red-500/20 animate-morph",
      subtle: "glass hover:bg-muted/50 text-muted-foreground hover:text-foreground animate-morph",
      brand: "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 border-0 hover:shadow-primary/40 hover:scale-[1.02] animate-morph",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          "disabled:opacity-50 disabled:pointer-events-none",
          sizes[size],
          variants[variant],
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon && <span className={variant === 'primary' || variant === 'brand' || variant === 'danger' ? 'text-white' : 'text-slate-700 dark:text-slate-200'}>{icon}</span>}
        {children}
      </motion.button>
    );
  }
);
GlassButton.displayName = "GlassButton";
