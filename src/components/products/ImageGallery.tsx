"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  thumbnail: string;
  title: string;
}

export function ImageGallery({ images = [], thumbnail, title }: ImageGalleryProps) {
  const allImages = useMemo(() => {
    return Array.from(new Set([thumbnail, ...images].filter(Boolean)));
  }, [thumbnail, images]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-slide every 3.5s if 2+ images exist
  useEffect(() => {
    if (allImages.length < 2 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [allImages.length, isPaused]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  }, [allImages.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  }, [allImages.length]);

  if (allImages.length === 0) {
    return (
      <div className="w-full h-80 sm:h-96 bg-slate-50 rounded-3xl border border-slate-200/90 flex flex-col items-center justify-center text-slate-400">
        <ImageOff className="w-12 h-12 stroke-[1.5]" />
        <span className="text-xs font-semibold mt-2">No images available</span>
      </div>
    );
  }

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allImages.length - 1;

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Main Large Showcase Image */}
      <div
        className="relative w-full h-80 sm:h-96 lg:h-[420px] rounded-3xl border border-slate-200/90 bg-white p-6 flex items-center justify-center shadow-xs overflow-hidden group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={allImages[currentIndex]}
            alt={`${title} - view ${currentIndex + 1}`}
            width={500}
            height={500}
            priority
            className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
          />
        </div>

        {/* Directional Controls (< and >) */}
        {allImages.length >= 2 && (
          <>
            {/* Previous Arrow Button (<) */}
            <button
              onClick={handlePrev}
              aria-label="Previous Image"
              title="Previous Image"
              className={cn(
                "absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 z-10",
                hasPrev
                  ? "bg-white/95 text-slate-900 border border-slate-200 shadow-md hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-110 active:scale-95 cursor-pointer font-black ring-2 ring-black/5"
                  : "bg-white/60 text-slate-300 border border-slate-100 shadow-2xs hover:bg-white hover:text-slate-700 opacity-60 hover:opacity-100"
              )}
            >
              <ChevronLeft className={cn("w-5 h-5", hasPrev ? "stroke-[3]" : "stroke-[2]")} />
            </button>

            {/* Next Arrow Button (>) */}
            <button
              onClick={handleNext}
              aria-label="Next Image"
              title="Next Image"
              className={cn(
                "absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 z-10",
                hasNext
                  ? "bg-white/95 text-slate-900 border border-slate-200 shadow-md hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-110 active:scale-95 cursor-pointer font-black ring-2 ring-black/5"
                  : "bg-white/60 text-slate-300 border border-slate-100 shadow-2xs hover:bg-white hover:text-slate-700 opacity-60 hover:opacity-100"
              )}
            >
              <ChevronRight className={cn("w-5 h-5", hasNext ? "stroke-[3]" : "stroke-[2]")} />
            </button>

            {/* Image Counter Badge */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs z-10">
              <span>{currentIndex + 1}</span>
              <span className="text-slate-400">/</span>
              <span>{allImages.length}</span>
            </div>

            {/* Bottom Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full z-10">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    currentIndex === idx
                      ? "w-5 bg-blue-500 shadow-xs"
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  )}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modern Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto py-2 px-1 scrollbar-thin">
          {allImages.map((img, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl p-2 shrink-0 transition-all duration-200 cursor-pointer flex items-center justify-center overflow-hidden",
                  isActive
                    ? "bg-blue-50/40 border-2 border-blue-600 shadow-sm ring-4 ring-blue-500/15 scale-102"
                    : "bg-slate-50/70 border border-slate-200/90 hover:border-slate-300 hover:bg-white opacity-70 hover:opacity-100 hover:scale-102"
                )}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain p-0.5"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
