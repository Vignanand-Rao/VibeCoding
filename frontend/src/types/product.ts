export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  rating_count: number;
  image: string;
  description: string;
}

export type SortOption = 'default' | 'price_asc' | 'rating_desc';

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  minRating: number | null;
  sortBy: SortOption;
}

export interface ProductsApiResponse {
  products: Product[];
  total: number;
  all_total: number;
  applied_filters: {
    categories: string[];
    min_price: number | null;
    max_price: number | null;
    min_rating: number | null;
    sort_by: string;
  };
}

export interface CatalogMetadata {
  categories: string[];
  min_price: number;
  max_price: number;
  total_products: number;
}
