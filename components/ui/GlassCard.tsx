import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../utils";

type GlassVariant = "default" | "elevated" | "thick" | "thin" | "solid";

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "onDrag" | "onDragStart" | "onDragEnd"> {
  variant?: GlassVariant;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(({
  variant = "default",
  interactive = false,
  padding = "md",
  className,
  children,
  ...props
}, ref) => {
  const variants = {
    default: "glass-bordered",
    elevated: "glass-elevated",
    thick: "glass-thick",
    thin: "glass border-none shadow-none bg-white/30 dark:bg-white/5",
    solid: "bg-card text-card-foreground border border-border shadow-sm",
  };

  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4 sm:p-5",
    lg: "p-6 sm:p-8",
  };

  if (interactive) {
    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        className={cn("glass-interactive rounded-2xl animate-morph", paddings[padding], className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div ref={ref} className={cn(variants[variant], "rounded-2xl", paddings[padding], className)} {...(props as any)}>
      {children}
    </div>
  );
});

GlassCard.displayName = "GlassCard";