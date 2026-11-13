import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onResetFilters: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onResetFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#121212] border border-[#222222] rounded-3xl my-6 shadow-inner">
      <div className="p-4 rounded-2xl bg-[#FF2E63]/10 text-[#FF2E63] mb-4">
        <SearchX className="w-10 h-10" />
      </div>

      {/* EXACT REQUIRED STRING */}
      <h3 className="text-xl font-bold text-white mb-2">
        No items match your criteria.
      </h3>

      <p className="text-sm text-gray-400 max-w-md mb-6 leading-relaxed">
        Try adjusting your category selection, expanding your price range, or lowering the minimum rating requirement to see available items.
      </p>

      {/* Visible Reset Filters Button */}
      <button
        onClick={onResetFilters}
        className="flex items-center gap-2 px-6 py-3 bg-[#FF2E63] hover:bg-[#E01E53] text-white font-semibold text-sm rounded-xl shadow-[0_0_15px_rgba(255,46,99,0.35)] hover:shadow-[0_0_20px_rgba(255,46,99,0.5)] transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
};
