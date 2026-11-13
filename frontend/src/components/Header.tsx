import React, { useState } from 'react';
import { SlidersHorizontal, Sparkles, ShoppingBag, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { User } from '../types/auth';

interface HeaderProps {
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
  cartItemCount: number;
  onOpenCart: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileFilters,
  activeFilterCount,
  cartItemCount,
  onOpenCart,
  user,
  onOpenAuth,
  onLogout,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#007BA7] to-[#FF2E63] flex items-center justify-center p-[2px] shadow-[0_0_15px_rgba(0,123,167,0.4)]">
            <div className="w-full h-full bg-[#0A0A0A] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FF2E63]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Career<span className="text-[#FF2E63]">Fit</span>
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#007BA7]/20 text-[#00A3DE] border border-[#007BA7]/30">
                Store
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium hidden sm:block">
              Premium Multi-Filter Product Catalog
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141414] border border-[#262626] text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
            <span>FastAPI Server Live</span>
          </div>

          {/* Cart Icon Button with Counter Badge */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#007BA7] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#00A3DE]" />
            <span className="hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FF2E63] text-white text-[11px] font-bold flex items-center justify-center shadow-[0_0_8px_#FF2E63] animate-in zoom-in-50">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* User Authentication Profile Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#2E2E2E] text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#007BA7] text-white text-[10px] flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate hidden sm:inline">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#141414] border border-[#2E2E2E] shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-[#242424]">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-xl transition-colors mt-1 text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#007BA7] hover:bg-[#00658A] text-white text-xs font-bold shadow-[0_0_12px_rgba(0,123,167,0.3)] transition-all cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#2E2E2E] text-white text-xs font-semibold shadow-sm transition-all"
            aria-label="Open filter sidebar"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#007BA7]" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FF2E63] text-white text-[11px] font-bold flex items-center justify-center shadow-[0_0_8px_#FF2E63]">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
