import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  message?: string;
  className?: string;
}

export function Loader({ message = "Loading data...", className }: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
      <div className="relative">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <div className="absolute inset-0 rounded-full blur-sm bg-blue-400/20 -z-10" />
      </div>
      {message && <p className="mt-4 text-sm font-medium text-gray-600">{message}</p>}
    </div>
  );
}
