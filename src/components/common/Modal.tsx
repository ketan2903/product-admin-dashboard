"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  maxWidth = "lg",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Frosted Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className={cn(
          "relative w-full bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-200/90 overflow-hidden transform transition-all z-10 my-6 animate-fadeIn",
          maxWidthClasses[maxWidth]
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/40">
            <div className="flex items-center gap-3.5">
              {icon && (
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-xl transition-all cursor-pointer shrink-0 ml-2"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 sm:p-6 max-h-[calc(85vh-130px)] overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}
