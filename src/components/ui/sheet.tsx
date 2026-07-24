"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useRef, useState, createContext, useContext, useCallback } from "react";
import type { ReactNode } from "react";

interface SheetContextType {
  open: boolean;
  onClose: () => void;
}

const SheetContext = createContext<SheetContextType>({ open: false, onClose: () => {} });

export function useSheet() {
  return useContext(SheetContext);
}

interface SheetProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sheet({ children, open: controlledOpen, onOpenChange }: SheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onClose = useCallback(() => {
    setInternalOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  return (
    <SheetContext.Provider value={{ open, onClose }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({ children, asChild, onClick }: { children: ReactNode; asChild?: boolean; onClick?: () => void }) {
  const { onClose } = useSheet();
  return (
    <div onClick={() => { onClose(); onClick?.(); }}>
      {children}
    </div>
  );
}

interface SheetContentProps {
  children: ReactNode;
  side?: "left" | "right";
  className?: string;
}

export function SheetContent({ children, side = "right", className }: SheetContentProps) {
  const { open, onClose } = useSheet();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={cn(
          "absolute inset-y-0 flex w-full max-w-xs flex-col bg-white shadow-xl dark:bg-gray-900",
          side === "left" ? "left-0" : "right-0",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
