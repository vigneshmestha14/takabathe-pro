import React from 'react';
import { Anchor, ShoppingBag, Sun, Moon, Search, UserCheck } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAdminModal: () => void;
  onOpenTrackingModal: () => void;
  hasActiveOrder: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  isDarkMode,
  onToggleTheme,
  isAdmin,
  onToggleAdmin,
  searchQuery,
  onSearchChange,
  onOpenAdminModal,
  onOpenTrackingModal,
  hasActiveOrder
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-3 pb-2 backdrop-blur-xl transition-all">
      <div className="mx-auto max-w-6xl rounded-2xl glass-panel p-3.5 shadow-2xl ring-1 ring-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 text-slate-950 shadow-lg shadow-cyan-500/20">
              <Anchor className="size-6 text-slate-950 stroke-[2.5]" />
              <div className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  TAKABATHE
                </h1>
                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-cyan-400 ring-1 ring-cyan-500/30 uppercase">
                  PRO
                </span>
              </div>
              <p className="text-[11px] font-medium tracking-wide text-slate-400">
                Fresh Fish Delivered By The KG • 100% Catch of the Day
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Pomfret, Surmai, Prawns, Tawa Masala..."
              className="w-full rounded-xl bg-slate-900/60 pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Active Order Tracker Button */}
            {hasActiveOrder && (
              <button
                onClick={onOpenTrackingModal}
                className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30 hover:bg-emerald-500/25 transition-all animate-bounce"
              >
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                Track Order
              </button>
            )}

            {/* Admin Toggle */}
            <button
              onClick={() => {
                onToggleAdmin();
                if (!isAdmin) onOpenAdminModal();
              }}
              title="Shop Owner / Harbor Admin Portal"
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                isAdmin
                  ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                  : 'bg-slate-800/80 text-slate-300 ring-1 ring-white/10 hover:bg-slate-700/80'
              }`}
            >
              <UserCheck className="size-3.5" />
              <span className="hidden sm:inline">{isAdmin ? 'Harbor Admin On' : 'Owner Portal'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              title="Toggle Theme"
              className="grid size-10 place-items-center rounded-xl bg-slate-800/80 text-slate-300 ring-1 ring-white/10 hover:bg-slate-700/80 transition-all"
            >
              {isDarkMode ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-cyan-400" />}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 font-display text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all hover:brightness-110"
            >
              <ShoppingBag className="size-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-slate-950 px-2 py-0.5 text-xs font-extrabold text-cyan-300">
                  {cartCount} • ₹{cartTotal}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 relative md:hidden">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search fresh fish, cuts or masalas..."
            className="w-full rounded-xl bg-slate-900/60 pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

      </div>
    </header>
  );
};
