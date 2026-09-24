"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import axios from "axios";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductGrid } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Pagination } from "@/components/products/Pagination";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { DeleteConfirmModal } from "@/components/products/DeleteConfirmModal";
import { TableSkeletonRows, CardSkeletonGrid } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Loader } from "@/components/common/Loader";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useProductStore } from "@/context/ProductContext";
import { productService } from "@/services/productService";
import { Category, Product, ProductFormData } from "@/types/product";
import { Package, Layers, AlertTriangle, Star } from "lucide-react";

function DashboardContent() {
  const { params, setUrlParams } = useUrlParams();
  const {
    addProduct,
    updateProduct,
    deleteProduct,
    applyLocalOverrides,
    localCreatedProducts,
    localUpdatedProducts,
    localDeletedIds,
  } = useProductStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load categories once
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const list = await productService.getCategories();
        if (isMounted) setCategories(list);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        if (isMounted) setIsCategoriesLoading(false);
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchProducts = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    const { page, limit, search, category, sortBy, order } = params;
    const skip = (page - 1) * limit;

    try {
      let rawProducts: Product[] = [];
      let rawTotal = 0;

      if (search && search.trim()) {
        const response = await productService.searchProducts({
          q: search.trim(),
          limit,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        });
        rawProducts = response.products || [];
        rawTotal = response.total || 0;

        if (category) {
          rawProducts = rawProducts.filter(
            (p) => p.category?.toLowerCase() === category.toLowerCase()
          );
        }
      } else if (category) {
        const response = await productService.getProductsByCategory({
          category,
          limit,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        });
        rawProducts = response.products || [];
        rawTotal = response.total || 0;
      } else {
        const response = await productService.getProducts({
          limit,
          skip,
          sortBy,
          order,
          signal: controller.signal,
        });
        rawProducts = response.products || [];
        rawTotal = response.total || 0;
      }

      const overridden = applyLocalOverrides(rawProducts, rawTotal, {
        category,
        search,
        page,
      });

      setProducts(overridden.products);
      setTotalCount(overridden.total);
      setIsLoading(false);
    } catch (err: unknown) {
      if (
        axios.isCancel(err) ||
        (err instanceof Error &&
          (err.name === "CanceledError" ||
            err.name === "AbortError" ||
            err.message === "canceled" ||
            (err as { code?: string }).code === "ERR_CANCELED"))
      ) {
        return;
      }
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load products. Please check your connection.";
      setError(message);
      setIsLoading(false);
    }
  }, [
    params.page,
    params.limit,
    params.search,
    params.category,
    params.sortBy,
    params.order,
    applyLocalOverrides,
  ]);

  useEffect(() => {
    fetchProducts();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts, localCreatedProducts, localUpdatedProducts, localDeletedIds]);

  const handleSearchChange = (q: string) => {
    setUrlParams({ q: q || null, page: 1 });
  };

  const handleCategoryChange = (cat: string) => {
    setUrlParams({ category: cat || null, page: 1 });
  };

  const handleSortChange = (option: string) => {
    if (!option) {
      setUrlParams({ sortBy: null, order: null });
    } else {
      const [field, dir] = option.split("-");
      setUrlParams({ sortBy: field, order: dir, page: 1 });
    }
  };

  const handlePageSizeChange = (limit: number) => {
    setUrlParams({ limit, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setUrlParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setUrlParams({ q: null, category: null, sortBy: null, order: null, page: 1 });
  };

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData: ProductFormData) => {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, formData);
    } else {
      await addProduct(formData);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct.id);
    }
  };

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const avgRating =
    products.length > 0
      ? (products.reduce((acc, p) => acc + (p.rating || 0), 0) / products.length).toFixed(1)
      : "4.5";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/75">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header Title & Metrics Widgets */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Products Inventory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Real-time catalog control, live inventory management and product editing.
            </p>
          </div>

          {/* Top Quick Stats Row */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
            <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2 shadow-xs shrink-0">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Package className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Catalog</span>
                <span className="text-xs font-black text-slate-900 mt-0.5">{totalCount} items</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2 shadow-xs shrink-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Categories</span>
                <span className="text-xs font-black text-slate-900 mt-0.5">{categories.length || 24} total</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2 shadow-xs shrink-0">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Low Stock</span>
                <span className="text-xs font-black text-slate-900 mt-0.5">{lowStockCount} items</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2 shadow-xs shrink-0">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Avg Rating</span>
                <span className="text-xs font-black text-slate-900 mt-0.5">{avgRating} / 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter, Search & Sorting Controls */}
        <ProductFilters
          search={params.search}
          category={params.category}
          sortOption={params.sortOption}
          pageSize={params.limit}
          categories={categories}
          isCategoriesLoading={isCategoriesLoading}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onPageSizeChange={handlePageSizeChange}
          onAddProduct={handleOpenAddModal}
          onResetFilters={handleResetFilters}
        />

        {/* Product Data Content */}
        {error ? (
          <ErrorState
            title="Unable to fetch products"
            message={error}
            onRetry={fetchProducts}
            isRetrying={isLoading}
          />
        ) : isLoading ? (
          <div>
            <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-4 w-16 text-center">Item</th>
                    <th className="py-4 px-4">Title & Brand</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Rating</th>
                    <th className="py-4 px-4">Stock Status</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <TableSkeletonRows count={params.limit > 10 ? 10 : params.limit} />
                </tbody>
              </table>
            </div>
            <div className="block md:hidden">
              <CardSkeletonGrid count={6} />
            </div>
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No matching products found"
            description="No products matched your search or category filters. Try clearing filters or adding a new product."
            onReset={handleResetFilters}
          />
        ) : (
          <div className="space-y-4">
            <ProductTable
              products={products}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />

            <ProductGrid
              products={products}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />

            <Pagination
              currentPage={params.page}
              totalItems={totalCount}
              pageSize={params.limit}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>

      <Footer />

      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedProduct}
        categories={categories}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        product={selectedProduct}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<Loader message="Loading dashboard..." />}>
        <DashboardContent />
      </Suspense>
    </AuthGuard>
  );
}
