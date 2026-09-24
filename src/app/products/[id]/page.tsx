"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ImageGallery } from "@/components/products/ImageGallery";
import { ProductReviews } from "@/components/products/ProductReviews";
import { RatingBadge, StockBadge, Badge } from "@/components/common/Badge";
import { Loader } from "@/components/common/Loader";
import { ErrorState } from "@/components/common/ErrorState";
import { useProductStore } from "@/context/ProductContext";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/product";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Tag,
  FileQuestion,
} from "lucide-react";
import { Button } from "@/components/common/Button";

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { getProductByIdWithOverrides } = useProductStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      setIsNotFound(false);

      try {
        const data = await getProductByIdWithOverrides(id);
        if (isMounted) {
          setProduct(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : "Failed to load product";
          if (
            errorMessage.includes("404") ||
            errorMessage.includes("not found") ||
            errorMessage.includes("deleted")
          ) {
            setIsNotFound(true);
          } else {
            setError(errorMessage);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id, getProductByIdWithOverrides]);

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:border-blue-200 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </button>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 shadow-sm">
              <Loader message="Loading product details..." />
            </div>
          ) : isNotFound ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm max-w-lg mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
              <p className="text-sm text-gray-500 mt-2 mb-6">
                The product with ID "#{id}" does not exist, was removed, or is invalid.
              </p>
              <Link href="/">
                <Button variant="primary">Return to Dashboard</Button>
              </Link>
            </div>
          ) : error ? (
            <ErrorState
              title="Failed to load product"
              message={error}
              onRetry={() => window.location.reload()}
            />
          ) : product ? (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div>
                    <ImageGallery
                      images={product.images}
                      thumbnail={product.thumbnail}
                      title={product.title}
                    />
                  </div>

                  <div className="flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="primary" size="md">
                          {product.category}
                        </Badge>
                        {product.brand && (
                          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                            {product.brand}
                          </span>
                        )}
                        {product.isLocalCreated && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                            <Sparkles className="w-3 h-3" /> Locally Created
                          </span>
                        )}
                        {product.isLocalEdited && !product.isLocalCreated && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                            Locally Edited
                          </span>
                        )}
                      </div>

                      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        {product.title}
                      </h1>

                      <div className="flex items-center gap-3">
                        <RatingBadge rating={product.rating} />
                        <StockBadge stock={product.stock} />
                        {product.sku && (
                          <span className="text-xs text-gray-400 font-mono">
                            SKU: {product.sku}
                          </span>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 flex items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-black text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.discountPercentage ? (
                          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                            Save {product.discountPercentage}%
                          </span>
                        ) : null}
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Description
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                        {product.warrantyInformation && (
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-500 mb-1 font-semibold">
                              <ShieldCheck className="w-4 h-4 text-blue-600" /> Warranty
                            </div>
                            <span className="font-bold text-gray-900">
                              {product.warrantyInformation}
                            </span>
                          </div>
                        )}

                        {product.shippingInformation && (
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-500 mb-1 font-semibold">
                              <Truck className="w-4 h-4 text-indigo-600" /> Shipping
                            </div>
                            <span className="font-bold text-gray-900">
                              {product.shippingInformation}
                            </span>
                          </div>
                        )}

                        {product.returnPolicy && (
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-500 mb-1 font-semibold">
                              <RotateCcw className="w-4 h-4 text-emerald-600" /> Return Policy
                            </div>
                            <span className="font-bold text-gray-900">
                              {product.returnPolicy}
                            </span>
                          </div>
                        )}
                      </div>

                      {product.tags && product.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-2">
                          <Tag className="w-3.5 h-3.5 text-gray-400" />
                          {product.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <ProductReviews reviews={product.reviews} />
              </div>
            </div>
          ) : null}
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
