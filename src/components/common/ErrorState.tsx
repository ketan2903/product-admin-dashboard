import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/common/Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title = "Failed to load data",
  message = "An error occurred while fetching information from the server. Please try again.",
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-rose-50/50 rounded-2xl border border-rose-200/80 my-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 max-w-md mt-1.5 mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          isLoading={isRetrying}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-500"
        >
          Retry
        </Button>
      )}
    </div>
  );
}
