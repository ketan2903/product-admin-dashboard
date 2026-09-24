"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { parseSafeInteger } from "@/lib/utils";

export interface UrlParamsState {
  page: number;
  limit: number;
  search: string;
  category: string;
  sortBy: string;
  order: "asc" | "desc";
  sortOption: string;
}

export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read and safely parse params from current URL
  const params: UrlParamsState = useMemo(() => {
    const rawPage = searchParams.get("page");
    const rawLimit = searchParams.get("limit");
    const search = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const sortBy = searchParams.get("sortBy") || "";
    const rawOrder = searchParams.get("order");
    const order: "asc" | "desc" = rawOrder === "desc" ? "desc" : "asc";

    const page = parseSafeInteger(rawPage, 1, 1, 1000);
    const limit = [10, 20, 50].includes(Number(rawLimit)) ? Number(rawLimit) : 10;

    const sortOption = sortBy ? `${sortBy}-${order}` : "";

    return {
      page,
      limit,
      search,
      category,
      sortBy,
      order,
      sortOption,
    };
  }, [searchParams]);

  // Update URL params helper
  const setUrlParams = useCallback(
    (newParams: Partial<Record<string, string | number | null | undefined>>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      const query = current.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return {
    params,
    setUrlParams,
  };
}
