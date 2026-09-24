"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  thumbnail: string;
  title: string;
}

export function ImageGallery({ images = [], thumbnail, title }: ImageGalleryProps) {
  const allImages = Array.from(new Set([thumbnail, ...images].filter(Boolean)));
  const [selectedImage, setSelectedImage] = useState<string>(allImages[0] || "");

  if (allImages.length === 0) {
    return (
      <div className="w-full h-80 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center">
        <ImageOff className="w-12 h-12 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full h-80 sm:h-96 rounded-2xl border border-gray-200 bg-white p-6 flex items-center justify-center shadow-sm overflow-hidden group">
        <Image
          src={selectedImage || allImages[0]}
          alt={title}
          width={400}
          height={400}
          priority
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={cn(
                "relative w-20 h-20 rounded-xl border-2 bg-white p-1 shrink-0 overflow-hidden transition-all",
                selectedImage === img
                  ? "border-blue-600 ring-2 ring-blue-500/20 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`${title} preview ${idx + 1}`}
                width={70}
                height={70}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
