import React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "purple" | "indigo";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200/80",
    primary: "bg-blue-50 text-blue-700 border-blue-200/80 font-semibold",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold",
    warning: "bg-amber-50 text-amber-700 border-amber-200/80 font-semibold",
    danger: "bg-rose-50 text-rose-700 border-rose-200/80 font-semibold",
    purple: "bg-purple-50 text-purple-700 border-purple-200/80 font-semibold",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/80 font-semibold",
  };

  const sizes = {
    sm: "text-[11px] px-2.5 py-0.5",
    md: "text-xs px-3 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border shadow-sm transition-colors select-none",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function RatingBadge({ rating }: { rating: number }) {
  const numRating = Number(rating) || 0;
  const getRatingColor = (rate: number) => {
    if (rate >= 4.5) return "bg-amber-50 text-amber-800 border-amber-200/80";
    if (rate >= 3.5) return "bg-blue-50 text-blue-800 border-blue-200/80";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-xs select-none",
        getRatingColor(numRating)
      )}
    >
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
      <span>{numRating.toFixed(1)}</span>
    </span>
  );
}

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        Out of stock
      </span>
    );
  }
  if (stock <= 10) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulseGlow" />
        Low stock ({stock})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      {stock} in stock
    </span>
  );
}
