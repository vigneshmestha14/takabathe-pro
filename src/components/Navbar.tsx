import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  User,
  MapPin,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC<{ onOpenCart: () => void; onOpenAuth: () => void }> = ({
  onOpenCart,
  onOpenAuth
}) => {
  const { user, cartCount, location, setLocation, activeOrder } = useApp();
  const currentPath = useLocation().pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const locations = [
    'Udupi (576101)',
    'Manipal (576104)',
    'Mangalore (575001)',
    'Kundapura (576201)',
    'Malpe Harbor (576108)',
    'Surathkal (575014)'
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#07171d]/90 backdrop-blur-md border-b border-white/10 text-white transition-all">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 px-4 py-1 text-center text-[11px] font-bold tracking-wide text-slate-950 flex justify-between items-center overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2 mx-auto">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
          </span>
          <span>⚡ Morning Harbor Catch Landed 4:30 AM • Free Express Delivery in 45 Mins above ₹500</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex flex-col group">
              <span className="font-display text-2xl font-black tracking-tight text-emerald-400 group-hover:text-cyan-300 transition-colors">
                TAKABATHE
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase -mt-1">
                Fresh Fish & Masala
              </span>
            </Link>

            {/* Location Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-white/10"
              >
                <MapPin className="size-3.5 text-cyan-400" />
                <span>{location}</span>
                <ChevronDown className="size-3 text-slate-400" />
              </button>

              {showLocationDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-slate-900 border border-white/10 shadow-2xl z-50 py-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/5">
                    Select Delivery Location
                  </div>
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-800 flex items-center justify-between ${
                        location === loc ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-slate-300'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
            <Link
              to="/shop"
              className={`hover:text-cyan-400 transition-colors ${
                currentPath === '/shop' ? 'text-cyan-400 font-black border-b-2 border-cyan-400 pb-0.5' : 'text-slate-300'
              }`}
            >
              Fresh Fish
            </Link>
            <Link
              to="/shop?category=masala"
              className={`hover:text-cyan-400 transition-colors ${
                currentPath.includes('masala') ? 'text-cyan-400 font-black border-b-2 border-cyan-400 pb-0.5' : 'text-slate-300'
              }`}
            >
              Fish Masala
            </Link>
            <Link
              to="/shop?category=combo"
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Sparkles className="size-3.5" /> Offers & Combos
            </Link>
            <a
              href="#how-it-works"
              className="text-slate-300 hover:text-cyan-400 transition-colors"
            >
              How It Works
            </a>
            <Link
              to="/about"
              className="text-slate-300 hover:text-cyan-400 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            
            {/* Active Order Tracker Pill if exists */}
            {activeOrder && (
              <Link
                to={`/orders/${activeOrder.id}`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-pulse"
              >
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                Track Order #{activeOrder.id.slice(-4)}
              </Link>
            )}

            {/* Auth / Profile Link */}
            {user ? (
              <Link
                to="/account"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-bold text-slate-100"
              >
                <User className="size-3.5 text-cyan-400" />
                <span>{user.full_name?.split(' ')[0] || 'Account'}</span>
              </Link>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
              >
                <User className="size-3.5" />
                <span>Log In</span>
              </button>
            )}

            {/* Admin Dashboard button */}
            <Link
              to="/admin"
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold"
              title="Admin Portal"
            >
              <ShieldCheck className="size-3.5" />
              <span>Admin</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/10 text-white transition-transform active:scale-95"
              aria-label="Open Cart"
            >
              <ShoppingBag className="size-5 text-emerald-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-slate-950 ring-2 ring-[#07171d]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-white/10 mt-3 space-y-3">
            <div className="px-2 pb-2">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-cyan-400" />
                  <span>Delivering to: <strong>{location}</strong></span>
                </div>
                <ChevronDown className="size-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider px-2">
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-800/80 text-center text-slate-200 border border-white/5"
              >
                🐟 Fresh Fish
              </Link>
              <Link
                to="/shop?category=masala"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-800/80 text-center text-slate-200 border border-white/5"
              >
                🌶️ Fish Masalas
              </Link>
              <Link
                to="/shop?category=combo"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-amber-500/10 text-amber-300 text-center border border-amber-500/20"
              >
                ✨ Offers & Combos
              </Link>
              <Link
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-800/80 text-center text-slate-200 border border-white/5"
              >
                👤 My Account
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-slate-800/80 text-center text-slate-200 border border-white/5"
              >
                📦 Track Orders
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-amber-500/20 text-amber-300 text-center border border-amber-500/30"
              >
                🛡️ Admin Dashboard
              </Link>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
