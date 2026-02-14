
import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils";

interface GlassIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost";
}

export const GlassIconButton = forwardRef<HTMLButtonElement, GlassIconButtonProps>(
  ({ size = "md", variant = "default", className, children, ...props }, ref) => {
    const sizes = { sm: "h-8 w-8 p-1.5", md: "h-10 w-10 p-2", lg: "h-12 w-12 p-3" };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all",
          variant === "default"
            ? "glass-interactive text-foreground"
            : "hover:bg-muted text-muted-foreground hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:opacity-50 disabled:pointer-events-none",
          sizes[size],
          className
        )}
        {...props}
      >
        <span className={cn("flex items-center justify-center w-full h-full")}>{children}</span>
      </motion.button>
    );
  }
);
GlassIconButton.displayName = "GlassIconButton";
