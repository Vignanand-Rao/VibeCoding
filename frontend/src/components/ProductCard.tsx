import React, { useState } from 'react';
import { Star, ImageOff } from 'lucide-react';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

const CATEGORY_STYLES: Record<string, { badge: string; text: string }> = {
  Electronics: {
    badge: 'bg-[#007BA7]/15 border-[#007BA7]/40 text-[#00A3DE]',
    text: 'text-[#00A3DE]',
  },
  Apparel: {
    badge: 'bg-[#FF2E63]/15 border-[#FF2E63]/40 text-[#FF5784]',
    text: 'text-[#FF5784]',
  },
  Footwear: {
    badge: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
    text: 'text-emerald-400',
  },
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  const categoryStyle =
    CATEGORY_STYLES[product.category] || {
      badge: 'bg-gray-800 border-gray-700 text-gray-300',
      text: 'text-gray-300',
    };

  return (
    <div className="group relative flex flex-col bg-[#121212] border border-[#222222] rounded-2xl overflow-hidden hover:border-[#007BA7]/60 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.8),0_0_15px_rgba(0,123,167,0.25)] transition-all duration-300 transform hover:-translate-y-1">
      {/* Image container */}
      <div className="relative aspect-square w-full bg-[#181818] overflow-hidden flex items-center justify-center">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-600 gap-2 p-4 text-center">
            <ImageOff className="w-10 h-10 stroke-[1.5]" />
            <span className="text-xs">{product.name}</span>
          </div>
        )}

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md ${categoryStyle.badge}`}
          >
            {product.category}
          </span>
        </div>

        {/* Rating Floating Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/80 border border-white/10 backdrop-blur-md text-xs font-semibold text-white">
          <Star className="w-3.5 h-3.5 fill-[#FF2E63] text-[#FF2E63]" />
          <span>{product.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Card Details */}
      <div className="flex flex-col flex-1 p-5 justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <h4
            className="text-base font-semibold text-white group-hover:text-[#00A3DE] transition-colors line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h4>
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-3 border-t border-[#222222] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Price</span>
            <span className="text-xl font-extrabold text-white tracking-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(product.rating)
                      ? 'fill-[#FF2E63] text-[#FF2E63]'
                      : 'fill-transparent text-gray-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-500">({product.rating_count})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
