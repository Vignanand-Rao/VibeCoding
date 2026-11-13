import React from 'react';
import { Star, RotateCcw, X, SlidersHorizontal, Check, Palette } from 'lucide-react';
import { DualRangeSlider } from './DualRangeSlider';
import { FilterState } from '../types/product';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (updater: (prev: FilterState) => FilterState) => void;
  onResetFilters: () => void;
  catalogMinPrice: number;
  catalogMaxPrice: number;
  availableCategories: string[];
  availableColors: string[];
  totalMatches: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const COLOR_SWATCH_MAP: Record<string, { bg: string; border: string }> = {
  Black: { bg: '#171717', border: '#404040' },
  White: { bg: '#F3F4F6', border: '#D1D5DB' },
  Blue: { bg: '#2563EB', border: '#3B82F6' },
  Red: { bg: '#EF4444', border: '#F87171' },
  Grey: { bg: '#6B7280', border: '#9CA3AF' },
  Green: { bg: '#10B981', border: '#34D399' },
  Brown: { bg: '#854D0E', border: '#A16207' },
};

const PRICE_PRESETS: Array<{ label: string; range: [number, number] | null }> = [
  { label: 'All Prices', range: null },
  { label: 'Below ₹500', range: [0, 500] },
  { label: '₹500 – ₹1,000', range: [500, 1000] },
  { label: '₹1,000 – ₹2,500', range: [1000, 2500] },
  { label: '₹2,500 – ₹5,000', range: [2500, 5000] },
  { label: '₹5,000 – ₹10,000', range: [5000, 10000] },
  { label: 'Above ₹10,000', range: [10000, 85000] },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  catalogMinPrice,
  catalogMaxPrice,
  availableCategories,
  availableColors,
  totalMatches,
  isOpenMobile,
  onCloseMobile,
}) => {
  // Category checkbox handler (OR logic)
  const handleCategoryToggle = (category: string) => {
    onFilterChange((prev) => {
      const exists = prev.categories.includes(category);
      const updated = exists
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: updated };
    });
  };

  // Color checkbox handler (OR logic)
  const handleColorToggle = (color: string) => {
    onFilterChange((prev) => {
      const exists = prev.colors.includes(color);
      const updated = exists
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: updated };
    });
  };

  // Dual price range slider handler
  const handlePriceChange = (newRange: [number, number]) => {
    onFilterChange((prev) => ({
      ...prev,
      priceRange: newRange,
    }));
  };

  // Price preset handler
  const handlePricePreset = (range: [number, number] | null) => {
    onFilterChange((prev) => ({
      ...prev,
      priceRange: range ? [range[0], range[1]] : [catalogMinPrice, catalogMaxPrice],
    }));
  };

  // Rating radio button handler
  const handleRatingChange = (rating: number | null) => {
    onFilterChange((prev) => ({
      ...prev,
      minRating: rating,
    }));
  };

  // Check if any non-default filters are active
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.colors.length > 0 ||
    filters.minRating !== null ||
    filters.priceRange[0] > catalogMinPrice ||
    filters.priceRange[1] < catalogMaxPrice ||
    filters.sortBy !== 'default';

  const isPriceFiltered =
    filters.priceRange[0] > catalogMinPrice ||
    filters.priceRange[1] < catalogMaxPrice;

  const filterContent = (
    <div className="flex flex-col gap-6 text-gray-200">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#007BA7]/10 text-[#007BA7]">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-white">Filters</h2>
            <p className="text-xs text-gray-400">
              {totalMatches} matching {totalMatches === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        {/* Reset button inside sidebar */}
        <button
          onClick={onResetFilters}
          title="Reset all filters"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-[#2E2E2E] text-gray-300 hover:text-white hover:border-[#FF2E63] hover:bg-[#FF2E63]/10 transition-all duration-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#FF2E63]" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Category Filter Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Categories
          </h3>
          {filters.categories.length > 0 && (
            <span className="text-[11px] font-semibold text-[#007BA7] bg-[#007BA7]/15 px-2 py-0.5 rounded-full">
              {filters.categories.length} selected
            </span>
          )}
        </div>

        <div className="space-y-2">
          {availableCategories.map((category) => {
            const isChecked = filters.categories.includes(category);
            return (
              <label
                key={category}
                className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all duration-150 border select-none ${
                  isChecked
                    ? 'bg-[#007BA7]/10 border-[#007BA7]/50 text-white shadow-[0_0_10px_rgba(0,123,167,0.15)]'
                    : 'bg-[#141414] border-[#222222] text-gray-300 hover:border-[#333333] hover:bg-[#181818]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(category)}
                    className="sr-only"
                    aria-label={`Filter by ${category}`}
                  />
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                      isChecked
                        ? 'bg-[#007BA7] border-[#007BA7] text-white shadow-[0_0_6px_#007BA7]'
                        : 'border-[#444444] bg-[#0D0D0D]'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-sm font-medium">{category}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Color Filter Section */}
      <div className="flex flex-col gap-3 pt-2 border-t border-[#222222]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#007BA7]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Colour
            </h3>
          </div>
          {filters.colors.length > 0 && (
            <span className="text-[11px] font-semibold text-[#007BA7] bg-[#007BA7]/15 px-2 py-0.5 rounded-full">
              {filters.colors.length} selected
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {availableColors.map((col) => {
            const isChecked = filters.colors.includes(col);
            const swatch = COLOR_SWATCH_MAP[col] || { bg: '#4B5563', border: '#6B7280' };
            return (
              <label
                key={col}
                className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all border select-none ${
                  isChecked
                    ? 'bg-[#007BA7]/15 border-[#007BA7]/60 text-white shadow-[0_0_8px_rgba(0,123,167,0.2)]'
                    : 'bg-[#141414] border-[#222222] text-gray-300 hover:border-[#333333]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleColorToggle(col)}
                  className="sr-only"
                  aria-label={`Filter by ${col}`}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: swatch.bg, border: `1px solid ${swatch.border}` }}
                />
                <span className="text-xs font-medium truncate">{col}</span>
                {isChecked && <Check className="w-3 h-3 text-[#00A3DE] ml-auto shrink-0" />}
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Price Filter Section (Presets + Dual Handle Slider) */}
      <div className="flex flex-col gap-3 pt-2 border-t border-[#222222]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Price Range (₹)
          </h3>
          {isPriceFiltered && (
            <span className="text-[11px] font-semibold text-[#FF2E63] bg-[#FF2E63]/15 px-2 py-0.5 rounded-full">
              Custom Range
            </span>
          )}
        </div>

        {/* Quick Price Range Options */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-gray-500 font-medium block">Quick Select:</span>
          <div className="grid grid-cols-2 gap-1.5">
            {PRICE_PRESETS.map((preset) => {
              const isActive = preset.range === null
                ? !isPriceFiltered
                : Math.abs(filters.priceRange[0] - preset.range[0]) < 100 &&
                  Math.abs(filters.priceRange[1] - preset.range[1]) < 100;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePricePreset(preset.range)}
                  className={`text-left px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all ${
                    isActive
                      ? 'bg-[#FF2E63]/15 border-[#FF2E63]/60 text-white font-semibold shadow-[0_0_8px_rgba(255,46,99,0.2)]'
                      : 'bg-[#141414] border-[#222222] text-gray-400 hover:text-gray-200 hover:border-[#333333]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dual Handle Slider */}
        <div className="pt-2">
          <span className="text-[11px] text-gray-500 font-medium block mb-2">Adjust Custom Range:</span>
          <DualRangeSlider
            min={catalogMinPrice}
            max={catalogMaxPrice}
            value={filters.priceRange}
            onChange={handlePriceChange}
            step={250}
          />
        </div>
      </div>

      {/* 4. Minimum Star Rating Section (Radio buttons 1 to 5) */}
      <div className="flex flex-col gap-3 pt-2 border-t border-[#222222]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Minimum Rating
          </h3>
          {filters.minRating !== null && (
            <span className="text-[11px] font-semibold text-[#FF2E63] bg-[#FF2E63]/15 px-2 py-0.5 rounded-full">
              ≥ {filters.minRating} Stars
            </span>
          )}
        </div>

        <div className="space-y-1.5" role="radiogroup" aria-label="Minimum star rating">
          {/* All Ratings radio */}
          <label
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border ${
              filters.minRating === null
                ? 'bg-[#007BA7]/10 border-[#007BA7]/50 text-white'
                : 'bg-[#141414] border-[#222222] text-gray-300 hover:border-[#333333]'
            }`}
          >
            <input
              type="radio"
              name="min_rating"
              value=""
              checked={filters.minRating === null}
              onChange={() => handleRatingChange(null)}
              className="accent-[#007BA7] w-4 h-4 cursor-pointer"
            />
            <span className="text-sm font-medium">All Ratings</span>
          </label>

          {/* 5, 4, 3, 2, 1 Stars */}
          {[5, 4, 3, 2, 1].map((stars) => {
            const isSelected = filters.minRating === stars;
            return (
              <label
                key={stars}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-[#FF2E63]/10 border-[#FF2E63]/50 text-white shadow-[0_0_10px_rgba(255,46,99,0.15)]'
                    : 'bg-[#141414] border-[#222222] text-gray-300 hover:border-[#333333]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="min_rating"
                    value={stars}
                    checked={isSelected}
                    onChange={() => handleRatingChange(stars)}
                    className="accent-[#FF2E63] w-4 h-4 cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < stars
                            ? 'fill-[#FF2E63] text-[#FF2E63]'
                            : 'fill-transparent text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-400">
                  {stars} {stars === 1 ? 'star' : 'stars'} & above
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Active filter summary button */}
      {hasActiveFilters && (
        <div className="pt-3 border-t border-[#222222]">
          <button
            onClick={onResetFilters}
            className="w-full py-2.5 px-4 bg-[#FF2E63] hover:bg-[#E01E53] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_0_12px_rgba(255,46,99,0.4)] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 p-5 bg-[#101010] border border-[#222222] rounded-2xl shadow-xl backdrop-blur-md max-h-[calc(100vh-7rem)] overflow-y-auto">
          {filterContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          <div className="relative ml-auto w-full max-w-sm h-full bg-[#101010] border-l border-[#262626] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#262626]">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#007BA7]" />
                  Filters
                </h2>
                <button
                  onClick={onCloseMobile}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1c1c1c]"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {filterContent}
            </div>

            <div className="mt-8 pt-4 border-t border-[#262626]">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 bg-[#007BA7] hover:bg-[#00658A] text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(0,123,167,0.4)]"
              >
                View {totalMatches} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
