import apiClient from "@/lib/axios";
import { Category, Product, ProductFormData, ProductsResponse } from "@/types/product";

export interface FetchProductsOptions {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  signal?: AbortSignal;
  delay?: number;
}

export interface SearchProductsOptions extends FetchProductsOptions {
  q: string;
}

export interface CategoryProductsOptions extends FetchProductsOptions {
  category: string;
}

export const productService = {
  async getProducts(options: FetchProductsOptions = {}): Promise<ProductsResponse> {
    const { limit = 10, skip = 0, sortBy, order, signal, delay } = options;
    const params: Record<string, string | number> = { limit, skip };
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (delay) params.delay = delay;

    const response = await apiClient.get<ProductsResponse>("/products", {
      params,
      signal,
    });
    return response.data;
  },

  async searchProducts(options: SearchProductsOptions): Promise<ProductsResponse> {
    const { q, limit = 10, skip = 0, sortBy, order, signal, delay } = options;
    const params: Record<string, string | number> = { q, limit, skip };
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (delay) params.delay = delay;

    const response = await apiClient.get<ProductsResponse>("/products/search", {
      params,
      signal,
    });
    return response.data;
  },

  async getCategories(signal?: AbortSignal): Promise<Category[]> {
    const response = await apiClient.get<Array<Category | string>>("/products/categories", {
      signal,
    });
    return response.data.map((cat) => {
      if (typeof cat === "string") {
        return {
          slug: cat,
          name: cat.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          url: `/products/category/${cat}`,
        };
      }
      return {
        slug: cat.slug,
        name: cat.name || cat.slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        url: cat.url,
      };
    });
  },

  async getProductsByCategory(options: CategoryProductsOptions): Promise<ProductsResponse> {
    const { category, limit = 10, skip = 0, sortBy, order, signal, delay } = options;
    const params: Record<string, string | number> = { limit, skip };
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (delay) params.delay = delay;

    const response = await apiClient.get<ProductsResponse>(
      `/products/category/${encodeURIComponent(category)}`,
      {
        params,
        signal,
      }
    );
    return response.data;
  },

  async getProductById(id: number | string, signal?: AbortSignal): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`, { signal });
    return response.data;
  },

  async addProduct(data: ProductFormData): Promise<Product> {
    const response = await apiClient.post<Product>("/products/add", data);
    return response.data;
  },

  async updateProduct(id: number, data: Partial<ProductFormData>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: number): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> {
    const response = await apiClient.delete<{ id: number; isDeleted: boolean; deletedOn: string }>(
      `/products/${id}`
    );
    return response.data;
  },
};
