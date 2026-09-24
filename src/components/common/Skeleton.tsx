import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-gray-200/80", className)} {...props} />;
}

export function TableSkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          <td className="py-4 px-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-44 mb-1.5" />
            <Skeleton className="h-3 w-28" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-5 w-20 rounded-full" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-4 w-16" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-5 w-14 rounded-full" />
          </td>
          <td className="py-4 px-4">
            <Skeleton className="h-5 w-20 rounded-full" />
          </td>
          <td className="py-4 px-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
          <Skeleton className="w-full h-44 rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
