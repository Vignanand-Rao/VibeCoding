import React from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { SortOption } from '../types/product';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-xs font-semibold text-gray-400 hidden sm:inline-flex items-center gap-1.5">
        <ArrowUpDown className="w-3.5 h-3.5 text-[#007BA7]" />
        <span>Sort By:</span>
      </label>
      <div className="relative inline-block">
        <select
          id="sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="appearance-none bg-[#141414] text-gray-200 text-xs sm:text-sm font-medium pl-3 pr-8 py-2 rounded-xl border border-[#2A2A2A] hover:border-[#007BA7] focus:border-[#007BA7] focus:ring-1 focus:ring-[#007BA7] focus:outline-none transition-colors cursor-pointer shadow-sm"
          aria-label="Sort products"
        >
          <option value="default" className="bg-[#141414] text-gray-200">
            Default Order
          </option>
          <option value="price_asc" className="bg-[#141414] text-gray-200">
            Price: Low to High
          </option>
          <option value="rating_desc" className="bg-[#141414] text-gray-200">
            Top Rated First
          </option>
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
