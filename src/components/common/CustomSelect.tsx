"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OptionItem {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  badge?: string;
}

interface CustomSelectProps {
  options: OptionItem[];
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  dropdownClassName?: string;
  align?: "left" | "right";
  searchable?: boolean;
  searchPlaceholder?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  icon,
  disabled = false,
  className,
  dropdownClassName,
  align = "left",
  searchable = true,
  searchPlaceholder = "Search...",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Filter options if searchable
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && options.length > 5) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable, options.length]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setSearchQuery("");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex].value);
      }
    }
  };

  const handleSelect = (val: string | number) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery("");
  };

  const isFilterActive = selectedOption && String(selectedOption.value) !== "";

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={cn("relative inline-block text-left select-none", className)}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group relative w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl border transition-all duration-200 cursor-pointer shadow-2xs outline-none",
          isOpen
            ? "bg-white border-blue-500 ring-4 ring-blue-500/15 text-slate-900 shadow-md shadow-blue-500/5"
            : isFilterActive
            ? "bg-blue-50/70 border-blue-200 hover:border-blue-300 text-blue-950 hover:bg-blue-50"
            : "bg-slate-50/90 hover:bg-white border-slate-200/90 hover:border-slate-300 text-slate-800",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {icon ? (
            <span
              className={cn(
                "shrink-0 transition-colors",
                isFilterActive || isOpen ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
              )}
            >
              {icon}
            </span>
          ) : selectedOption?.icon ? (
            <span className="shrink-0">{selectedOption.icon}</span>
          ) : null}

          <span className="truncate font-bold">
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          {selectedOption?.badge && (
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          <div
            className={cn(
              "w-5 h-5 rounded-lg flex items-center justify-center transition-colors",
              isOpen ? "bg-blue-100 text-blue-600" : "text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100"
            )}
          >
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-200",
                isOpen && "rotate-180 text-blue-600"
              )}
            />
          </div>
        </div>
      </button>

      {/* Popover Dropdown Card */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[220px] max-w-sm bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5 p-1.5 transition-all duration-200 origin-top",
            align === "right" ? "right-0" : "left-0",
            dropdownClassName
          )}
        >
          {/* Optional Search Bar for Long Option Lists */}
          {searchable && options.length > 5 && (
            <div className="p-1 mb-1 border-b border-slate-100">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  className="w-full pl-8 pr-7 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all text-slate-900"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div ref={listRef} className="max-h-60 overflow-y-auto space-y-0.5 scrollbar-thin py-0.5">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400 font-medium">
                No matching options found
              </div>
            ) : (
              filteredOptions.map((option, idx) => {
                const isSelected = String(option.value) === String(value);
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={cn(
                      "w-full text-left flex items-center justify-between gap-2.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-150 cursor-pointer",
                      isSelected
                        ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/20"
                        : isHighlighted
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 truncate">
                      {option.icon && (
                        <span
                          className={cn(
                            "shrink-0",
                            isSelected ? "text-white" : "text-slate-400"
                          )}
                        >
                          {option.icon}
                        </span>
                      )}
                      <div className="flex flex-col min-w-0 truncate">
                        <span className="truncate">{option.label}</span>
                        {option.description && (
                          <span
                            className={cn(
                              "text-[10px] font-normal truncate",
                              isSelected ? "text-blue-100" : "text-slate-400"
                            )}
                          >
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {option.badge && (
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {option.badge}
                        </span>
                      )}

                      {isSelected && (
                        <Check className="w-4 h-4 text-white shrink-0 stroke-[2.5]" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

