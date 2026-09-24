"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, ProductFormData } from "@/types/product";
import { productService } from "@/services/productService";
import { useToast } from "@/context/ToastContext";

interface ApplyOverridesParams {
  category?: string;
  search?: string;
  page?: number;
}

interface ProductContextType {
  localCreatedProducts: Product[];
  localUpdatedProducts: Record<number, Partial<Product>>;
  localDeletedIds: number[];
  addProduct: (data: ProductFormData) => Promise<Product>;
  updateProduct: (id: number, data: Partial<ProductFormData>) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  applyLocalOverrides: (
    apiProducts: Product[],
    apiTotal: number,
    params?: ApplyOverridesParams
  ) => { products: Product[]; total: number };
  getProductByIdWithOverrides: (id: number | string) => Promise<Product>;
  resetLocalOverrides: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const LOCAL_STORAGE_CREATED = "admin_local_created_products";
const LOCAL_STORAGE_UPDATED = "admin_local_updated_products";
const LOCAL_STORAGE_DELETED = "admin_local_deleted_products";

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [localCreatedProducts, setLocalCreatedProducts] = useState<Product[]>([]);
  const [localUpdatedProducts, setLocalUpdatedProducts] = useState<Record<number, Partial<Product>>>({});
  const [localDeletedIds, setLocalDeletedIds] = useState<number[]>([]);
  const { showToast } = useToast();

  // Load local state from sessionStorage on client mount
  useEffect(() => {
    try {
      const storedCreated = sessionStorage.getItem(LOCAL_STORAGE_CREATED);
      const storedUpdated = sessionStorage.getItem(LOCAL_STORAGE_UPDATED);
      const storedDeleted = sessionStorage.getItem(LOCAL_STORAGE_DELETED);

      if (storedCreated) setLocalCreatedProducts(JSON.parse(storedCreated));
      if (storedUpdated) setLocalUpdatedProducts(JSON.parse(storedUpdated));
      if (storedDeleted) setLocalDeletedIds(JSON.parse(storedDeleted));
    } catch (e) {
      console.error("Error reading product overrides", e);
    }
  }, []);

  const saveLocalState = (
    created: Product[],
    updated: Record<number, Partial<Product>>,
    deleted: number[]
  ) => {
    try {
      sessionStorage.setItem(LOCAL_STORAGE_CREATED, JSON.stringify(created));
      sessionStorage.setItem(LOCAL_STORAGE_UPDATED, JSON.stringify(updated));
      sessionStorage.setItem(LOCAL_STORAGE_DELETED, JSON.stringify(deleted));
    } catch (e) {
      console.error("Failed to save product overrides in sessionStorage", e);
    }
  };

  const addProduct = async (data: ProductFormData): Promise<Product> => {
    try {
      const apiResponse = await productService.addProduct(data);
      
      const newId = Date.now();
      const newProduct: Product = {
        ...apiResponse,
        id: newId,
        isLocalCreated: true,
        images: data.images && data.images.length > 0 ? data.images : [data.thumbnail || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"],
        thumbnail: data.thumbnail || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        reviews: [],
        rating: data.rating || 5.0,
      };

      const updatedCreated = [newProduct, ...localCreatedProducts];
      setLocalCreatedProducts(updatedCreated);
      saveLocalState(updatedCreated, localUpdatedProducts, localDeletedIds);

      showToast("success", "Product Added", `"${newProduct.title}" was successfully created.`);
      return newProduct;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to create product";
      showToast("error", "Error", msg);
      throw error;
    }
  };

  const updateProduct = async (id: number, data: Partial<ProductFormData>): Promise<Product> => {
    try {
      const isLocal = localCreatedProducts.some((p) => p.id === id);
      let updatedObj: Product;

      if (isLocal) {
        const existing = localCreatedProducts.find((p) => p.id === id)!;
        updatedObj = { ...existing, ...data, isLocalEdited: true };
        const updatedCreated = localCreatedProducts.map((p) => (p.id === id ? updatedObj : p));
        setLocalCreatedProducts(updatedCreated);
        saveLocalState(updatedCreated, localUpdatedProducts, localDeletedIds);
      } else {
        const apiResponse = await productService.updateProduct(id, data);
        updatedObj = { ...apiResponse, ...data, isLocalEdited: true };
        const newUpdated = {
          ...localUpdatedProducts,
          [id]: { ...(localUpdatedProducts[id] || {}), ...data, isLocalEdited: true },
        };
        setLocalUpdatedProducts(newUpdated);
        saveLocalState(localCreatedProducts, newUpdated, localDeletedIds);
      }

      showToast("success", "Product Updated", `"${updatedObj.title}" was successfully updated.`);
      return updatedObj;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to update product";
      showToast("error", "Error", msg);
      throw error;
    }
  };

  const deleteProduct = async (id: number): Promise<void> => {
    try {
      const isLocal = localCreatedProducts.some((p) => p.id === id);

      if (isLocal) {
        const updatedCreated = localCreatedProducts.filter((p) => p.id !== id);
        setLocalCreatedProducts(updatedCreated);
        saveLocalState(updatedCreated, localUpdatedProducts, localDeletedIds);
      } else {
        await productService.deleteProduct(id);
        const newDeleted = [...localDeletedIds, id];
        setLocalDeletedIds(newDeleted);
        saveLocalState(localCreatedProducts, localUpdatedProducts, newDeleted);
      }

      showToast("success", "Product Deleted", "Product was successfully removed.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to delete product";
      showToast("error", "Error", msg);
      throw error;
    }
  };

  const applyLocalOverrides = useCallback(
    (apiProducts: Product[], apiTotal: number, params?: ApplyOverridesParams) => {
      const { category, search, page } = params || {};
      
      // Filter out deleted items
      let filtered = apiProducts.filter((p) => !localDeletedIds.includes(p.id));

      // Apply modifications
      filtered = filtered.map((p) => {
        if (localUpdatedProducts[p.id]) {
          return { ...p, ...localUpdatedProducts[p.id], isLocalEdited: true };
        }
        return p;
      });

      // Filter locally created items that match category and search
      let matchingCreated = localCreatedProducts;
      if (category) {
        matchingCreated = matchingCreated.filter(
          (p) => p.category?.toLowerCase() === category.toLowerCase()
        );
      }
      if (search) {
        matchingCreated = matchingCreated.filter((p) =>
          p.title?.toLowerCase().includes(search.toLowerCase())
        );
      }

      const total = Math.max(0, apiTotal - localDeletedIds.length + matchingCreated.length);

      // Prepend local created items only on page 1
      const isFirstPage = !page || Number(page) <= 1;
      const combined = isFirstPage ? [...matchingCreated, ...filtered] : filtered;

      return {
        products: combined,
        total,
      };
    },
    [localDeletedIds, localUpdatedProducts, localCreatedProducts]
  );

  const getProductByIdWithOverrides = useCallback(
    async (id: number | string): Promise<Product> => {
      const numericId = Number(id);

      // Check if it is in locally created products
      const localItem = localCreatedProducts.find((p) => p.id === numericId);
      if (localItem) return localItem;

      // Check if it was locally deleted
      if (localDeletedIds.includes(numericId)) {
        throw new Error("Product not found (deleted)");
      }

      // Fetch from API
      const product = await productService.getProductById(numericId);

      // Apply local edits if any
      if (localUpdatedProducts[numericId]) {
        return { ...product, ...localUpdatedProducts[numericId], isLocalEdited: true };
      }

      return product;
    },
    [localCreatedProducts, localDeletedIds, localUpdatedProducts]
  );

  const resetLocalOverrides = () => {
    setLocalCreatedProducts([]);
    setLocalUpdatedProducts({});
    setLocalDeletedIds([]);
    sessionStorage.removeItem(LOCAL_STORAGE_CREATED);
    sessionStorage.removeItem(LOCAL_STORAGE_UPDATED);
    sessionStorage.removeItem(LOCAL_STORAGE_DELETED);
    showToast("info", "Reset Local State", "All local product modifications have been cleared.");
  };

  return (
    <ProductContext.Provider
      value={{
        localCreatedProducts,
        localUpdatedProducts,
        localDeletedIds,
        addProduct,
        updateProduct,
        deleteProduct,
        applyLocalOverrides,
        getProductByIdWithOverrides,
        resetLocalOverrides,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProductStore() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductStore must be used within a ProductProvider");
  }
  return context;
}
