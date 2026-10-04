import React, { useState } from 'react';
import type { Product } from '../data/mockData';
import { Plus, Minus, Star, MapPin, Eye, Check, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, weightOrQty: number, selectedCut?: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView
}) => {
  const isFish = product.category === 'fish';
  const weightSteps = product.weightSteps || [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
  
  const [selectedWeightIndex, setSelectedWeightIndex] = useState<number>(1); // Default 1.0 KG
  const [selectedCut, setSelectedCut] = useState<string>(
    product.cutOptions ? product.cutOptions[0] : 'Whole Cleaned'
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentQty = isFish ? weightSteps[selectedWeightIndex] : 1;
  const totalPrice = Math.round(product.price * currentQty);

  const handleAdd = () => {
    onAddToCart(product, currentQty, isFish ? selectedCut : undefined);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="glass-card group flex flex-col justify-between overflow-hidden rounded-2xl p-4 shadow-xl">
      <div>
        {/* Top Image & Badges */}
        <div className="relative mb-3.5 h-48 w-full overflow-hidden rounded-xl bg-slate-950/40 ring-1 ring-white/10">
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Tag Badge */}
          {product.tag && (
            <div className="absolute top-2.5 left-2.5 rounded-full bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-cyan-400 ring-1 ring-cyan-500/30 backdrop-blur-md">
              {product.tag}
            </div>
          )}

          {/* Quick View Button */}
          <button
            onClick={() => onQuickView(product)}
            className="absolute top-2.5 right-2.5 grid size-8 place-items-center rounded-full bg-slate-900/80 text-slate-200 ring-1 ring-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-500 hover:text-slate-950"
            title="Quick View Details"
          >
            <Eye className="size-4" />
          </button>

          {/* Origin & Rating info overlay */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-200">
            {product.harborOrigin ? (
              <span className="flex items-center gap-1 rounded-md bg-slate-950/60 px-2 py-0.5 backdrop-blur-md">
                <MapPin className="size-3 text-cyan-400" />
                {product.harborOrigin.split('•')[0]}
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-md bg-slate-950/60 px-2 py-0.5 backdrop-blur-md text-amber-300">
                <Flame className="size-3" /> Ready to Cook
              </span>
            )}

            <div className="flex items-center gap-1 rounded-md bg-slate-950/60 px-2 py-0.5 backdrop-blur-md text-amber-400">
              <Star className="size-3 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400">({product.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-slate-100 leading-snug group-hover:text-cyan-300 transition-colors">
              {product.name}
            </h3>
          </div>

          <p className="mt-1 text-xs text-slate-400 line-clamp-2">
            {product.description}
          </p>

          {/* Bone Type badge for fish */}
          {product.boneType && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-300 ring-1 ring-white/10">
              <span className="text-teal-400">Bone:</span> {product.boneType}
            </div>
          )}
        </div>

        {/* Cut Preference Dropdown for Fish */}
        {isFish && product.cutOptions && (
          <div className="mb-3">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Select Hand-Cut Style:
            </label>
            <select
              value={selectedCut}
              onChange={(e) => setSelectedCut(e.target.value)}
              className="w-full rounded-xl bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200 ring-1 ring-white/10 outline-none focus:ring-1 focus:ring-cyan-400"
            >
              {product.cutOptions.map((cut) => (
                <option key={cut} value={cut} className="bg-slate-900 text-slate-200">
                  🔪 {cut}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Price & Weight Selector Footer */}
      <div className="mt-2 pt-3 border-t border-slate-800/80">
        
        {/* Price display */}
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <span className="font-display text-2xl font-extrabold text-cyan-300">
              ₹{totalPrice}
            </span>
            <span className="ml-1 text-xs font-semibold text-slate-400">
              for {currentQty} {product.unit}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            (₹{product.price} / {product.unit})
          </span>
        </div>

        {/* Weight Selector for Fish */}
        {isFish && (
          <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-900/80 p-1 ring-1 ring-white/10">
            <button
              onClick={() => setSelectedWeightIndex((prev) => Math.max(0, prev - 1))}
              disabled={selectedWeightIndex === 0}
              className="grid size-8 place-items-center rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-30"
              aria-label="Decrease Weight"
            >
              <Minus className="size-4" />
            </button>

            <span className="text-xs font-bold text-cyan-300">
              {weightSteps[selectedWeightIndex]} KG
            </span>

            <button
              onClick={() => setSelectedWeightIndex((prev) => Math.min(weightSteps.length - 1, prev + 1))}
              disabled={selectedWeightIndex === weightSteps.length - 1}
              className="grid size-8 place-items-center rounded-lg text-cyan-400 hover:bg-slate-800 disabled:opacity-30"
              aria-label="Increase Weight"
            >
              <Plus className="size-4" />
            </button>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAdd}
          disabled={!product.isAvailable}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 font-display text-sm font-bold transition-all shadow-md active:scale-95 ${
            addedAnimation
              ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
              : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-cyan-500/20'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="size-4 stroke-[3]" /> Added to Basket!
            </>
          ) : (
            <>
              <Plus className="size-4 stroke-[2.5]" /> Add {currentQty} {product.unit} to Cart
            </>
          )}
        </button>

      </div>
    </div>
  );
};
