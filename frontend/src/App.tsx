import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductGrid } from './components/ProductGrid';
import { SortDropdown } from './components/SortDropdown';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { EmptyState } from './components/EmptyState';
import { useDebounce } from './hooks/useDebounce';
import { fetchCatalogMetadata, fetchFilteredProducts } from './services/api';
import { FilterState, Product, SortOption, CatalogMetadata } from './types/product';
import { AlertCircle, RotateCcw, X } from 'lucide-react';

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

export const App: React.FC = () => {
  // Catalog metadata from backend
  const [catalogMeta, setCatalogMeta] = useState<CatalogMetadata>({
    categories: ['Electronics', 'Apparel', 'Footwear'],
    min_price: DEFAULT_MIN_PRICE,
    max_price: DEFAULT_MAX_PRICE,
    total_products: 24,
  });

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [DEFAULT_MIN_PRICE, DEFAULT_MAX_PRICE],
    minRating: null,
    sortBy: 'default',
  });

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [allTotal, setAllTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Debounce the price slider so slider is buttery smooth and doesn't flood backend
  const debouncedPriceRange = useDebounce<[number, number]>(filters.priceRange, 250);

  // Track initialization
  const isInitializedRef = useRef(false);

  // 1. Initial metadata fetch on mount
  useEffect(() => {
    let isMounted = true;
    async function initCatalog() {
      try {
        const meta = await fetchCatalogMetadata();
        if (isMounted) {
          const roundedMin = Math.floor(meta.min_price);
          const roundedMax = Math.ceil(meta.max_price);
          setCatalogMeta({
            ...meta,
            min_price: roundedMin,
            max_price: roundedMax,
          });
          setFilters((prev) => ({
            ...prev,
            priceRange: [roundedMin, roundedMax],
          }));
          isInitializedRef.current = true;
        }
      } catch (err) {
        console.error('Failed to load metadata, using fallback defaults:', err);
        isInitializedRef.current = true;
      }
    }
    initCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch products whenever filters or debounced price changes
  const loadProducts = useCallback(async (activeFilters: FilterState) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFilteredProducts(activeFilters);
      setProducts(response.products);
      setTotalCount(response.total);
      setAllTotal(response.all_total);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while fetching products.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Construct effective filters with the debounced price range
    const effectiveFilters: FilterState = {
      ...filters,
      priceRange: debouncedPriceRange,
    };
    loadProducts(effectiveFilters);
  }, [
    filters.categories,
    filters.minRating,
    filters.sortBy,
    debouncedPriceRange,
    loadProducts,
  ]);

  // Handle Reset Filters
  const handleResetFilters = () => {
    const defaultRange: [number, number] = [
      catalogMeta.min_price,
      catalogMeta.max_price,
    ];
    setFilters({
      categories: [],
      priceRange: defaultRange,
      minRating: null,
      sortBy: 'default',
    });
  };

  // Sort dropdown change
  const handleSortChange = (newSort: SortOption) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: newSort,
    }));
  };

  // Quick remove single filter tag
  const removeCategoryFilter = (cat: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat),
    }));
  };

  const removeRatingFilter = () => {
    setFilters((prev) => ({
      ...prev,
      minRating: null,
    }));
  };

  const resetPriceRange = () => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [catalogMeta.min_price, catalogMeta.max_price],
    }));
  };

  // Active filter count for badge
  const activeFilterCount =
    filters.categories.length +
    (filters.minRating !== null ? 1 : 0) +
    (filters.priceRange[0] > catalogMeta.min_price ||
    filters.priceRange[1] < catalogMeta.max_price
      ? 1
      : 0);

  const isPriceFiltered =
    filters.priceRange[0] > catalogMeta.min_price ||
    filters.priceRange[1] < catalogMeta.max_price;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Header
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sidebar - Sticky Filters */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={handleResetFilters}
            catalogMinPrice={catalogMeta.min_price}
            catalogMaxPrice={catalogMeta.max_price}
            availableCategories={catalogMeta.categories}
            totalMatches={totalCount}
            isOpenMobile={isMobileFiltersOpen}
            onCloseMobile={() => setIsMobileFiltersOpen(false)}
          />

          {/* Right Section - Product Grid & Controls */}
          <section className="flex-1 w-full min-w-0">
            {/* Control Bar: Product Count + Active Filter Tags + Sort By */}
            <div className="bg-[#101010] border border-[#222222] rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Result count & description */}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      Products
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#007BA7]/15 text-[#00A3DE] border border-[#007BA7]/30">
                      {totalCount} of {allTotal || catalogMeta.total_products} items
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Showing real-time results powered by FastAPI backend filtering
                  </p>
                </div>

                {/* Sort By Dropdown (Top-Right) */}
                <SortDropdown
                  value={filters.sortBy}
                  onChange={handleSortChange}
                />
              </div>

              {/* Active Filter Chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-[#222222]">
                  <span className="text-xs text-gray-400 font-medium">
                    Active Filters:
                  </span>

                  {/* Category Chips */}
                  {filters.categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => removeCategoryFilter(cat)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#007BA7]/15 text-[#00A3DE] border border-[#007BA7]/40 hover:bg-[#007BA7]/25 transition-colors group cursor-pointer"
                    >
                      <span>{cat}</span>
                      <X className="w-3 h-3 group-hover:text-white" />
                    </button>
                  ))}

                  {/* Price Chip */}
                  {isPriceFiltered && (
                    <button
                      onClick={resetPriceRange}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FF2E63]/15 text-[#FF5784] border border-[#FF2E63]/40 hover:bg-[#FF2E63]/25 transition-colors group cursor-pointer"
                    >
                      <span>
                        ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      </span>
                      <X className="w-3 h-3 group-hover:text-white" />
                    </button>
                  )}

                  {/* Rating Chip */}
                  {filters.minRating !== null && (
                    <button
                      onClick={removeRatingFilter}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FF2E63]/15 text-[#FF5784] border border-[#FF2E63]/40 hover:bg-[#FF2E63]/25 transition-colors group cursor-pointer"
                    >
                      <span>≥ {filters.minRating} Stars</span>
                      <X className="w-3 h-3 group-hover:text-white" />
                    </button>
                  )}

                  {/* Clear All Text Button */}
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-gray-400 hover:text-[#FF2E63] font-medium underline underline-offset-4 ml-1 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 mb-6 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#FF2E63] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">Failed to load products</h4>
                  <p className="text-xs text-red-300 mt-1">{error}</p>
                  <button
                    onClick={() => loadProducts(filters)}
                    className="mt-3 px-3 py-1.5 bg-red-900/50 hover:bg-red-800/60 border border-red-700/60 rounded-lg text-xs font-semibold text-white transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Retry Request
                  </button>
                </div>
              </div>
            )}

            {/* Grid Content / Loading / Empty State */}
            {loading ? (
              <LoadingSkeleton />
            ) : products.length === 0 ? (
              <EmptyState onResetFilters={handleResetFilters} />
            ) : (
              <ProductGrid products={products} />
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0A0A0A] border-t border-[#1F1F1F] py-6 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            CareerFit Store &copy; 2026. Built with Python FastAPI &amp; React Vite.
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#007BA7]" /> Cerulean Blue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF2E63]" /> Neon Rose
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0A0A0A] border border-gray-600" /> Jet Black
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
