import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Tag
} from 'lucide-react';
import { CartItem } from '../types/cart';
import { User } from '../types/auth';
import { apiCheckout } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  user: User | null;
  onOpenAuth: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  user,
  onOpenAuth,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{ order_id: string; total: number } | null>(null);

  if (!isOpen) return null;

  // Real-time calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= 499 || subtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : 49;
  const discount = appliedPromo === 'CAREERFIT10' ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (promoCode.trim().toUpperCase() === 'CAREERFIT10') {
      setAppliedPromo('CAREERFIT10');
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code. Try "CAREERFIT10" for 10% off.');
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);

    try {
      const res = await apiCheckout(cart, grandTotal, user);
      setConfirmedOrder({
        order_id: res.order_id,
        total: grandTotal,
      });
      onClearCart();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => {
          setConfirmedOrder(null);
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-[#101010] border-l border-[#262626] shadow-2xl flex flex-col z-10">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#007BA7]/15 text-[#00A3DE]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Your Cart</h2>
              <p className="text-xs text-gray-400">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-gray-400 hover:text-[#FF2E63] transition-colors p-1"
                title="Clear all cart items"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => {
                setConfirmedOrder(null);
                onClose();
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1C1C1C] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {confirmedOrder ? (
          /* Order Confirmation View */
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Order Confirmed!</h3>
            <p className="text-xs text-gray-400 max-w-xs mb-4">
              Thank you for shopping with CareerFit Store. Your items are being prepared for dispatch.
            </p>

            <div className="p-4 rounded-2xl bg-[#161616] border border-[#242424] w-full max-w-xs mb-6 text-left space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Order Reference:</span>
                <span className="font-mono font-bold text-[#00A3DE]">{confirmedOrder.order_id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Customer:</span>
                <span className="font-semibold text-white">{user ? user.name : 'Guest Customer'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total Paid:</span>
                <span className="font-bold text-[#FF2E63]">₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setConfirmedOrder(null);
                onClose();
              }}
              className="w-full max-w-xs py-3 bg-[#007BA7] hover:bg-[#00658A] text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(0,123,167,0.35)]"
            >
              Continue Shopping
            </button>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Cart State */
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center text-gray-600 mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Your cart is empty</h3>
            <p className="text-xs text-gray-400 max-w-xs mb-6">
              Looks like you haven&apos;t added any items yet. Explore the catalog and find what fits you best.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#FF2E63] hover:bg-[#E01E53] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_12px_rgba(255,46,99,0.35)]"
            >
              Explore Products
            </button>
          </div>
        ) : (
          /* Cart Item List */
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#141414] border border-[#222222] hover:border-[#333333] transition-all"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1A1A1A] shrink-0 border border-[#2A2A2A]">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate" title={item.product.name}>
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400">{item.product.category}</span>
                    <span className="text-[10px] text-gray-400">• {item.product.color}</span>
                  </div>
                  <div className="text-xs font-bold text-white mt-1">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    {item.quantity > 1 && (
                      <span className="text-[10px] text-gray-500 font-normal ml-1">
                        (₹{item.product.price.toLocaleString('en-IN')} each)
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-gray-500 hover:text-[#FF2E63] p-1 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2 py-0.5 text-gray-400 hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 py-0.5 text-xs font-bold text-white tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2 py-0.5 text-gray-400 hover:text-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="pt-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder='Promo code (try "CAREERFIT10")'
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#007BA7] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none uppercase font-mono"
                  />
                  <Tag className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-xs font-bold text-white rounded-xl transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <span className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Code &quot;{appliedPromo}&quot; applied: 10% discount!
                </span>
              )}
              {promoError && (
                <span className="text-[11px] text-red-400 mt-1 block">{promoError}</span>
              )}
            </form>
          </div>
        )}

        {/* Footer Checkout Summary */}
        {!confirmedOrder && cart.length > 0 && (
          <div className="p-5 border-t border-[#222222] bg-[#0E0E0E] space-y-3">
            {/* User notification if guest */}
            {!user && (
              <div className="p-2.5 rounded-xl bg-[#007BA7]/10 border border-[#007BA7]/30 flex items-center justify-between text-xs text-gray-300">
                <span>Want to save this order to your account?</span>
                <button
                  onClick={onOpenAuth}
                  className="text-[#00A3DE] font-bold underline underline-offset-2 ml-1"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Promo Discount (10%)</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                {isFreeDelivery ? (
                  <span className="font-semibold text-emerald-400">FREE</span>
                ) : (
                  <span className="font-semibold text-white">₹{deliveryFee}</span>
                )}
              </div>
              <div className="pt-2 border-t border-[#242424] flex justify-between text-sm font-bold text-white">
                <span>Grand Total</span>
                <span className="text-lg text-[#FF2E63]">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full py-3.5 bg-[#FF2E63] hover:bg-[#E01E53] disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-[0_0_15px_rgba(255,46,99,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {checkoutLoading ? (
                <span>Placing Your Order...</span>
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
