import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import type { Product } from '../data/mockData';
import { Search, SlidersHorizontal } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, addToCart, isLoadingProducts } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'low-high' | 'high-low'>('recommended');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [
    { id: 'all', name: 'All Products', icon: '🌊' },
    { id: 'fish', name: 'Fresh Fish', icon: '🐟' },
    { id: 'masala', name: 'Fish Masala', icon: '🌶️' },
    { id: 'combo', name: 'Ready-to-Cook', icon: '✨' }
  ];

  // Filtering
  let filtered = products.filter((p) => {
    const matchesCategory = categoryParam === 'all' || p.category === categoryParam;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting
  if (sortBy === 'low-high') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'high-low') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Title */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Coastal Seafood Market</span>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-white">Daily Harbor Catalog</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Hand-cut fresh coastal catches & stone-ground fish masalas. Prices calculated per KG.
        </p>
      </div>

      {/* Controls Bar: Search & Category Pills */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-3xl border border-white/10">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Surmai, Pomfret, Prawns, Masalas..."
            className="w-full bg-slate-950/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 border border-white/10 outline-none focus:border-cyan-400"
          />
        </div>

        {/* Sorting selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold whitespace-nowrap">
            <SlidersHorizontal className="size-4 text-cyan-400" />
            <span>Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 rounded-2xl px-3 py-2 text-xs font-bold text-slate-200 border border-white/10 outline-none"
          >
            <option value="recommended">Recommended</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSearchParams({ category: cat.id })}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              categoryParam === cat.id
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/5'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Loading state or Empty State or Product Grid */}
      {isLoadingProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-slate-900/60 rounded-3xl animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-slate-900/40 rounded-3xl border border-white/10">
          <div className="text-4xl">🐟</div>
          <h3 className="font-display text-lg font-bold text-white">No products found</h3>
          <p className="text-xs text-slate-400">Try changing your search term or selecting another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
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
      )}

      {/* Modal */}
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

    </div>
  );
};
