import { CatalogMetadata, FilterState, ProductsApiResponse } from '../types/product';

const API_BASE = '/api';

export async function fetchCatalogMetadata(): Promise<CatalogMetadata> {
  const response = await fetch(`${API_BASE}/meta`);
  if (!response.ok) {
    throw new Error(`Failed to load catalog metadata: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchFilteredProducts(
  filters: FilterState,
  signal?: AbortSignal
): Promise<ProductsApiResponse> {
  const params = new URLSearchParams();

  // Multi-category support
  if (filters.categories && filters.categories.length > 0) {
    filters.categories.forEach((cat) => params.append('category', cat));
  }

  // Price boundaries
  if (filters.priceRange && filters.priceRange.length === 2) {
    const [min, max] = filters.priceRange;
    params.set('min_price', min.toString());
    params.set('max_price', max.toString());
  }

  // Minimum rating
  if (filters.minRating !== null && filters.minRating > 0) {
    params.set('min_rating', filters.minRating.toString());
  }

  // Sorting
  if (filters.sortBy) {
    params.set('sort_by', filters.sortBy);
  }

  const url = `${API_BASE}/products?${params.toString()}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Server error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
