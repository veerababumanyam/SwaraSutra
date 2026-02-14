import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils";

interface GlassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children?: React.ReactNode;
}

export function GlassModal({ open, onOpenChange, title, children }: GlassModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className={cn(
                  "fixed z-50 w-full overflow-hidden",
                  "glass-responsive-elevated",
                  "max-h-[90vh] overflow-y-auto",
                  // Mobile: bottom sheet
                  "inset-x-0 bottom-0 rounded-t-2xl safe-bottom",
                  // Desktop: centered modal
                  "sm:inset-auto sm:left-1/2 sm:top-1/2",
                  "sm:-translate-x-1/2 sm:-translate-y-1/2",
                  "sm:max-w-md sm:rounded-2xl sm:max-h-[85vh]"
                )}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Mobile drag handle */}
                <div className="sm:hidden flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 rounded-full bg-white/30 dark:bg-white/20" />
                </div>
                
                <div className="p-4 sm:p-6">
                  {title && (
                    <Dialog.Title className="text-lg font-semibold glass-text mb-4 pr-8">
                      {title}
                    </Dialog.Title>
                  )}
                  {children}
                </div>

                <Dialog.Close
                  className={cn(
                    "absolute right-3 top-3 sm:right-4 sm:top-4",
                    "rounded-full p-2 min-h-[44px] min-w-[44px]",
                    "flex items-center justify-center",
                    "glass-interactive opacity-70 hover:opacity-100",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  )}
                >
                  <X className="h-5 w-5 sm:h-4 sm:w-4 text-foreground" />
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}