import { CatalogMetadata, FilterState, ProductsApiResponse, Product } from '../types/product';
import { User } from '../types/auth';
import { CartItem } from '../types/cart';

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

  if (filters.categories && filters.categories.length > 0) {
    filters.categories.forEach((cat) => params.append('category', cat));
  }

  if (filters.colors && filters.colors.length > 0) {
    filters.colors.forEach((col) => params.append('color', col));
  }

  if (filters.priceRange && filters.priceRange.length === 2) {
    const [min, max] = filters.priceRange;
    params.set('min_price', min.toString());
    params.set('max_price', max.toString());
  }

  if (filters.minRating !== null && filters.minRating > 0) {
    params.set('min_rating', filters.minRating.toString());
  }

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

export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to load product details: ${response.statusText}`);
  }
  return response.json();
}

export async function apiLogin(email: string, password: string): Promise<{ token: string; user: User; message: string }> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to sign in. Please verify your credentials.');
  }

  return response.json();
}

export async function apiSignup(name: string, email: string, password: string): Promise<{ token: string; user: User; message: string }> {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Registration failed. Please check the entered data.');
  }

  return response.json();
}

export async function apiCheckout(cartItems: CartItem[], totalAmount: number, user?: User | null): Promise<{ order_id: string; message: string; items_count: number }> {
  const payload = {
    items: cartItems.map((item) => ({
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    })),
    total_amount: totalAmount,
    customer_name: user?.name || 'Valued Customer',
    customer_email: user?.email || 'customer@example.com',
  };

  const response = await fetch(`${API_BASE}/cart/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Checkout failed. Please try again.');
  }

  return response.json();
}
