export type SortOption =
  | "price-asc"
  | "price-desc"
  | "rating-asc"
  | "rating-desc"
  | "title-asc"
  | "title-desc"
  | "";

export interface ProductFilterParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}
