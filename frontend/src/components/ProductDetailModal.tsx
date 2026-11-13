import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Zap,
  Plus,
  Minus
} from 'lucide-react';
import { Product } from '../types/product';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

const COLOR_SWATCH_MAP: Record<string, string> = {
  Black: '#171717',
  White: '#F3F4F6',
  Blue: '#2563EB',
  Red: '#EF4444',
  Grey: '#6B7280',
  Green: '#10B981',
  Brown: '#854D0E',
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const originalPrice = Math.round(product.price * 1.25);
  const discountPercent = 20;
  const swatchColor = COLOR_SWATCH_MAP[product.color] || '#4B5563';

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuy = () => {
    onBuyNow(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#101010] border border-[#262626] rounded-3xl shadow-2xl z-10 overflow-y-auto flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-gray-400 hover:text-white hover:bg-black/90 border border-white/10 transition-colors cursor-pointer"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Image & Gallery */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 bg-[#151515] flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#222222]">
          <div className="relative aspect-square w-full max-w-md rounded-2xl overflow-hidden border border-[#282828] bg-[#1A1A1A] shadow-inner group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {/* Discount Badge */}
            <div className="absolute top-3 left-3 bg-[#FF2E63] text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-lg">
              {discountPercent}% OFF
            </div>
            {/* Color Badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-white/10 backdrop-blur-md text-xs font-semibold text-gray-200">
              <span
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: swatchColor }}
              />
              <span>{product.color} Edition</span>
            </div>
          </div>

          {/* Flipkart / Amazon Trust Badges */}
          <div className="grid grid-cols-3 gap-3 w-full mt-6 text-center">
            <div className="p-3 bg-[#111111] border border-[#222222] rounded-xl flex flex-col items-center gap-1 text-gray-400">
              <Truck className="w-4 h-4 text-[#00A3DE]" />
              <span className="text-[10px] font-semibold">Free Delivery</span>
            </div>
            <div className="p-3 bg-[#111111] border border-[#222222] rounded-xl flex flex-col items-center gap-1 text-gray-400">
              <RotateCcw className="w-4 h-4 text-[#FF5784]" />
              <span className="text-[10px] font-semibold">7 Days Replace</span>
            </div>
            <div className="p-3 bg-[#111111] border border-[#222222] rounded-xl flex flex-col items-center gap-1 text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-semibold">1 Year Warranty</span>
            </div>
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Actions */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category & Brand Header */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#007BA7]/15 text-[#00A3DE] border border-[#007BA7]/30">
                {product.category}
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                In Stock • Verified Authentic
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {product.name}
            </h2>

            {/* Star Rating Breakdown */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FF2E63]/15 border border-[#FF2E63]/30 text-white font-bold text-xs">
                <span>{product.rating.toFixed(1)}</span>
                <Star className="w-3.5 h-3.5 fill-[#FF2E63] text-[#FF2E63]" />
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(product.rating)
                        ? 'fill-[#FF2E63] text-[#FF2E63]'
                        : 'fill-transparent text-gray-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {product.rating_count.toLocaleString('en-IN')} ratings &amp; reviews
              </span>
            </div>

            {/* Pricing Section (Amazon / Flipkart Style) */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#242424] space-y-1">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-[#FF2E63] bg-[#FF2E63]/15 px-2 py-0.5 rounded">
                  Save ₹{(originalPrice - product.price).toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Inclusive of all taxes • EMI options available from ₹{Math.round(product.price / 6).toLocaleString('en-IN')}/mo
              </p>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Overview
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications Highlights */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Key Features
              </h4>
              <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                <li>Color variant: <span className="font-semibold text-white">{product.color}</span></li>
                <li>Certified Grade-A materials with rigorous quality inspection</li>
                <li>Eligible for Pay on Delivery &amp; Express Courier Dispatch</li>
                <li>Official manufacturer warranty included in the box</li>
              </ul>
            </div>
          </div>

          {/* Purchase Actions & Quantity Selector */}
          <div className="mt-6 pt-5 border-t border-[#222222] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">Quantity</span>
              <div className="flex items-center bg-[#181818] border border-[#2E2E2E] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-[#252525] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-white min-w-8 text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3 py-1.5 text-gray-400 hover:text-white hover:bg-[#252525] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-[0_0_15px_#10B981]'
                    : 'bg-[#181818] hover:bg-[#202020] text-white border-[#007BA7] hover:border-[#00A3DE] shadow-sm'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#00A3DE]" />
                <span>{addedAnimation ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={handleBuy}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#FF2E63] hover:bg-[#E01E53] text-white transition-all shadow-[0_0_15px_rgba(255,46,99,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
