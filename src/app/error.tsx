"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/common/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full text-center bg-white rounded-3xl border border-gray-200 p-8 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          {error.message || "An unexpected error occurred while rendering the page."}
        </p>
        <Button
          variant="primary"
          onClick={() => reset()}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="w-full rounded-xl"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
