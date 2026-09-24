"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { RatingBadge, StockBadge, Badge } from "@/components/common/Badge";
import { Eye, Edit2, Trash2, Sparkles, ImageOff, ArrowUpRight } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 select-none">
              <th className="py-4 px-4 w-16 text-center">Item</th>
              <th className="py-4 px-4">Title & Brand</th>
              <th className="py-4 px-4">Category</th>
              <th className="py-4 px-4">Price</th>
              <th className="py-4 px-4">Rating</th>
              <th className="py-4 px-4">Stock Status</th>
              <th className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {products.map((product) => {
              const originalPrice = product.discountPercentage
                ? product.price / (1 - product.discountPercentage / 100)
                : null;

              return (
                <tr
                  key={product.id}
                  className="hover:bg-blue-50/40 transition-colors group"
                >
                  {/* Image */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="relative w-12 h-12 mx-auto rounded-xl border border-slate-200/80 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs group-hover:border-blue-300 transition-colors">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-200"
                        />
                      ) : (
                        <ImageOff className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                  </td>

                  {/* Title & Brand */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 flex items-center gap-1"
                        >
                          {product.title}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                        </Link>
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
                      <span className="text-xs text-slate-400 font-medium mt-0.5">
                        {product.brand || "General Brand"}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <Badge variant="primary" size="sm">
                      {product.category}
                    </Badge>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900">
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
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4">
                    <RatingBadge rating={product.rating} />
                  </td>

                  {/* Stock */}
                  <td className="py-3.5 px-4">
                    <StockBadge stock={product.stock} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all shadow-xs border border-transparent hover:border-blue-200"
                        title="View Specifications & Reviews"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50/80 rounded-xl transition-all shadow-xs border border-transparent hover:border-amber-200"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-all shadow-xs border border-transparent hover:border-rose-200"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
