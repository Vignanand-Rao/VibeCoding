import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-[#121212] border border-[#222222] rounded-2xl overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="aspect-square w-full bg-[#1C1C1C]" />

          {/* Details skeleton */}
          <div className="p-5 flex flex-col gap-3">
            <div className="h-4 bg-[#222222] rounded w-3/4" />
            <div className="h-3 bg-[#1C1C1C] rounded w-full" />
            <div className="h-3 bg-[#1C1C1C] rounded w-2/3" />

            <div className="pt-3 border-t border-[#222222] flex items-center justify-between mt-2">
              <div className="h-6 bg-[#222222] rounded w-16" />
              <div className="h-4 bg-[#222222] rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
