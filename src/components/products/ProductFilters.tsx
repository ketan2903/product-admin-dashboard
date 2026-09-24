"use client";

import React, { useState, useEffect } from "react";
import { Category } from "@/types/product";
import { Search, X, Plus, Filter, ArrowUpDown, Info } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useDebounce } from "@/hooks/useDebounce";

interface ProductFiltersProps {
  search: string;
  category: string;
  sortOption: string;
  pageSize: number;
  categories: Category[];
  isCategoriesLoading?: boolean;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortOption: string) => void;
  onPageSizeChange: (size: number) => void;
  onAddProduct: () => void;
  onResetFilters: () => void;
}

export function ProductFilters({
  search,
  category,
  sortOption,
  pageSize,
  categories,
  isCategoriesLoading = false,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onPageSizeChange,
  onAddProduct,
  onResetFilters,
}: ProductFiltersProps) {
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, search, onSearchChange]);

  const hasActiveFilters = !!search || !!category || !!sortOption;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products by title, keyword, brand..."
            className="w-full pl-10 pr-10 py-2.5 text-sm font-medium rounded-2xl border border-slate-200 bg-slate-50/70 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                onSearchChange("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Button
          variant="primary"
          onClick={onAddProduct}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shrink-0 rounded-2xl shadow-md shadow-blue-600/20 font-bold"
        >
          Add Product
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50/90 border border-slate-200/90 rounded-xl px-2.5 py-1 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={isCategoriesLoading}
              className="text-xs sm:text-sm font-semibold bg-transparent text-slate-700 focus:outline-none cursor-pointer pr-1"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50/90 border border-slate-200/90 rounded-xl px-2.5 py-1 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-xs sm:text-sm font-semibold bg-transparent text-slate-700 focus:outline-none cursor-pointer pr-1"
            >
              <option value="">Default Sort</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchInput("");
                onResetFilters();
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Items per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="text-xs font-bold rounded-xl border border-slate-200/90 bg-slate-50 px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {search && category && (
        <div className="flex items-center gap-2 bg-blue-50/80 border border-blue-200/70 text-blue-900 text-xs px-3.5 py-2.5 rounded-2xl animate-fadeIn">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Search & Category active:</strong> DummyJSON API performs global search; results are filtered locally by category.
          </span>
        </div>
      )}
    </div>
  );
}
