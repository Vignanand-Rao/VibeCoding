import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
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

const COLOR_SWATCH_MAP: Record<string, string> = {
  Black: '#171717',
  White: '#F3F4F6',
  Blue: '#2563EB',
  Red: '#EF4444',
  Grey: '#6B7280',
  Green: '#10B981',
  Brown: '#854D0E',
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickAddToCart,
}) => {
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const categoryStyle =
    CATEGORY_STYLES[product.category] || {
      badge: 'bg-gray-800 border-gray-700 text-gray-300',
      text: 'text-gray-300',
    };

  const swatchColor = COLOR_SWATCH_MAP[product.color] || '#4B5563';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col bg-[#121212] border border-[#222222] rounded-2xl overflow-hidden hover:border-[#007BA7]/60 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.8),0_0_15px_rgba(0,123,167,0.25)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
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
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#0E0E0E] text-gray-400 p-6 text-center">
            <div className="p-4 rounded-2xl bg-[#007BA7]/10 text-[#007BA7] mb-2">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <span className="text-xs font-semibold text-gray-300 line-clamp-1">{product.name}</span>
            <span className="text-[11px] text-gray-500">{product.category}</span>
          </div>
        )}

        {/* Hover Quick View Overlay Pill */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-full bg-black/80 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-xl backdrop-blur-md">
            <Eye className="w-3.5 h-3.5 text-[#00A3DE]" />
            <span>View Details</span>
          </span>
        </div>

        {/* Category & Color Pill Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md shadow-sm ${categoryStyle.badge}`}
          >
            {product.category}
          </span>
          {product.color && (
            <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/75 border border-white/10 text-gray-300 backdrop-blur-md">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: swatchColor }}
              />
              {product.color}
            </span>
          )}
        </div>

        {/* Rating Floating Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/80 border border-white/10 backdrop-blur-md text-xs font-semibold text-white shadow-md z-10">
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

        <div className="pt-3 border-t border-[#222222] flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Price</span>
            <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Quick Add to Cart Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-[0_0_10px_#10B981]'
                : 'bg-[#181818] hover:bg-[#202020] text-gray-200 hover:text-white border-[#2E2E2E] hover:border-[#007BA7]'
            }`}
            title="Add item to cart"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#00A3DE]" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
