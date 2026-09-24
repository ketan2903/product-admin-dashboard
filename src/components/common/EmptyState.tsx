import React from "react";
import { PackageOpen, RotateCcw } from "lucide-react";
import { Button } from "@/components/common/Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  resetText?: string;
}

export function EmptyState({
  title = "No products found",
  description = "Try adjusting your search query, clearing filters, or adding a new product.",
  onReset,
  resetText = "Reset Filters",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm my-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shadow-inner">
        <PackageOpen className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mt-1.5 mb-6 leading-relaxed">{description}</p>
      {onReset && (
        <Button variant="secondary" onClick={onReset} leftIcon={<RotateCcw className="w-4 h-4" />}>
          {resetText}
        </Button>
      )}
    </div>
  );
}
