import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { RecipeModal } from '../components/RecipeModal';
import type { Product, Recipe } from '../data/mockData';
import { RECIPES } from '../data/mockData';
import {
  Anchor,
  Flame,
  ArrowRight,
  Sparkles,
  ChefHat
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, addToCart } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const categories = [
    { id: 'all', name: 'All Fresh Catch', icon: '🐟' },
    { id: 'fish', name: 'Fresh Fish', icon: '🐠' },
    { id: 'masala', name: 'Fish Masala', icon: '🌶️' },
    { id: 'combo', name: 'Ready-to-Cook', icon: '✨' }
  ];

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-12 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0e2a33] via-[#091b22] to-[#07171d] pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 size-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-8 items-center">
          
          {/* Left Text */}
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
              <Anchor className="size-4 animate-spin-slow" />
              <span>Direct from Malpe & Mangalore Docks</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              Fresh Fish. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                Cut Your Way.
              </span> <br />
              Delivered.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed font-medium">
              Morning catch landed at 4:30 AM, hand-cut, scaled, and ice-packed to your exact preference. Zero formalin, 100% chemical-free coastal fish.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <Link
                to="/shop"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3.5 font-display text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Shop Fresh Fish</span>
                <ArrowRight className="size-4" />
              </Link>

              <a
                href="#catch-board"
                className="flex items-center gap-2 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-white/10 px-6 py-3.5 font-display text-sm font-bold text-slate-200 transition-all"
              >
                <Flame className="size-4 text-amber-400" />
                <span>View Today's Catch</span>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 text-center md:text-left">
              <div>
                <span className="block font-display text-xl font-extrabold text-cyan-300">4:30 AM</span>
                <span className="text-[11px] text-slate-400 font-semibold">Morning Dock Landing</span>
              </div>
              <div>
                <span className="block font-display text-xl font-extrabold text-emerald-400">100%</span>
                <span className="text-[11px] text-slate-400 font-semibold">Chemical Free</span>
              </div>
              <div>
                <span className="block font-display text-xl font-extrabold text-amber-400">45 Mins</span>
                <span className="text-[11px] text-slate-400 font-semibold">Ice-Packed Delivery</span>
              </div>
            </div>

          </div>

          {/* Right Hero Image Card */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group bg-slate-900">
              <img
                src="./images/surmai.png"
                alt="Fresh Surmai Steaks"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="size-3.5 fill-amber-400" />
                <span>Surmai Steaks • ₹1,150 / KG</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-cyan-300">⚓ Malpe Deep Sea Harbor</span>
                  <span className="text-emerald-400">Landed 4:30 AM Today</span>
                </div>
                <p className="text-xs text-slate-300">
                  Thick tawa steaks with rich omega-3 oils. Scaled & cut to your order.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CATEGORIES NAV BAR */}
      <section id="catch-board" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white">Today's Fresh Catch Board</h2>
            <p className="text-xs text-slate-400">Prices per KG • Freshly cut on order</p>
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/5'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
              onAddToCart={(p, qty, cut) =>
                addToCart({
                  productId: p.id,
                  name: p.name,
                  price: p.price,
                  unit: p.unit,
                  qty,
                  selectedCut: cut,
                  image: p.image
                })
              }
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-slate-900/60 rounded-3xl border border-white/10 p-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Harbor to Home Process</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">How TAKABATHE Works</h2>
            <p className="text-xs text-slate-400">We eliminate middle-men to deliver the freshest ocean catch directly from Malpe harbor.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-white/5 space-y-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-cyan-500/20 text-cyan-400 font-extrabold font-display text-lg">
                1
              </div>
              <h3 className="font-display font-extrabold text-slate-100 text-sm">4:30 AM Harbor Landing</h3>
              <p className="text-xs text-slate-400">Our buyers hand-select prime catch as boats dock at Malpe & Mangalore ports.</p>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-5 border border-white/5 space-y-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 font-extrabold font-display text-lg">
                2
              </div>
              <h3 className="font-display font-extrabold text-slate-100 text-sm">Hand-Cut to Preference</h3>
              <p className="text-xs text-slate-400">Steaks, curry cut, or boneless fillet — skilled fish butchers prep to your exact specifications.</p>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-5 border border-white/5 space-y-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-amber-500/20 text-amber-400 font-extrabold font-display text-lg">
                3
              </div>
              <h3 className="font-display font-extrabold text-slate-100 text-sm">Packed in Crushed Ice</h3>
              <p className="text-xs text-slate-400">Zero formalin or chemicals. Sealed in insulated temperature-monitored cold boxes.</p>
            </div>

            <div className="bg-slate-900/90 rounded-2xl p-5 border border-white/5 space-y-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-teal-500/20 text-teal-400 font-extrabold font-display text-lg">
                4
              </div>
              <h3 className="font-display font-extrabold text-slate-100 text-sm">45 Min Express Delivery</h3>
              <p className="text-xs text-slate-400">Delivered directly to your doorstep in Udupi, Manipal, Mangalore & Kundapura.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED RECIPES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Coastal Kitchen</span>
            <h2 className="font-display text-2xl font-extrabold text-white">Chef's Coastal Recipes</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {RECIPES.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="group cursor-pointer rounded-3xl bg-slate-900/80 border border-white/10 p-5 flex flex-col sm:flex-row gap-5 hover:border-cyan-400/50 transition-all shadow-lg"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full sm:w-40 h-40 rounded-2xl object-cover group-hover:scale-105 transition-transform"
              />
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-[11px] font-bold text-cyan-400">
                  <ChefHat className="size-4" />
                  <span>{recipe.difficulty} • {recipe.prepTime} prep</span>
                </div>
                <h3 className="font-display text-base font-extrabold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {recipe.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Best paired with {recipe.pairedFish}. Includes step-by-step instructions and spice blend secrets.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 pt-2">
                  <span>Read Full Recipe</span>
                  <ArrowRight className="size-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          allProducts={products}
          onAddToCart={(p, qty, cut) =>
            addToCart({
              productId: p.id,
              name: p.name,
              price: p.price,
              unit: p.unit,
              qty,
              selectedCut: cut,
              image: p.image
            })
          }
        />
      )}

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          products={products}
          onClose={() => setSelectedRecipe(null)}
          onAddToCart={(p, qty) =>
            addToCart({
              productId: p.id,
              name: p.name,
              price: p.price,
              unit: p.unit,
              qty,
              image: p.image
            })
          }
        />
      )}

    </div>
  );
};
