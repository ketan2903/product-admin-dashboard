"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { RatingBadge, StockBadge, Badge } from "@/components/common/Badge";
import { Eye, Edit2, Trash2, Sparkles, ImageOff, ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const originalPrice = product.discountPercentage
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group">
      <div>
        <div className="relative w-full h-48 bg-slate-50/80 border-b border-slate-100 flex items-center justify-center p-4">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={200}
              height={160}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <ImageOff className="w-8 h-8 text-slate-300" />
          )}

          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <Badge variant="primary" size="sm">
              {product.category}
            </Badge>
            {product.isLocalCreated && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full shadow-xs">
                <Sparkles className="w-2.5 h-2.5" /> NEW
              </span>
            )}
            {product.isLocalEdited && !product.isLocalCreated && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full shadow-xs">
                EDITED
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <RatingBadge rating={product.rating} />
          </div>
        </div>

        <div className="p-4 space-y-1.5">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            {product.brand || "General Brand"}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="block font-extrabold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
          >
            {product.title}
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 border-t border-slate-100 mt-2">
        <div className="flex items-center justify-between py-2.5">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.discountPercentage ? (
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded-md">
                  -{Math.round(product.discountPercentage)}%
                </span>
              ) : null}
            </div>
            {originalPrice && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <StockBadge stock={product.stock} />
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-blue-600 bg-blue-50/80 hover:bg-blue-100 rounded-xl transition-all shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" /> Specs & Reviews
          </Link>
          <button
            onClick={() => onEdit(product)}
            className="inline-flex items-center justify-center p-2 text-amber-600 bg-amber-50/80 hover:bg-amber-100 rounded-xl transition-all shadow-xs border border-transparent hover:border-amber-200"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="inline-flex items-center justify-center p-2 text-rose-600 bg-rose-50/80 hover:bg-rose-100 rounded-xl transition-all shadow-xs border border-transparent hover:border-rose-200"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  onEdit,
  onDelete,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  return (
    <div className="block md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
