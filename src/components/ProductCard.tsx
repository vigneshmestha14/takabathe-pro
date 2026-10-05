import React, { useState } from 'react';
import type { Product } from '../data/mockData';
import { Check, Eye, Anchor } from 'lucide-react';

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
  
  const [selectedWeightIndex, setSelectedWeightIndex] = useState<number>(1);
  const [selectedCut, setSelectedCut] = useState<string>(
    product.cutOptions ? product.cutOptions[0] : 'Whole Cleaned'
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentQty = isFish ? weightSteps[selectedWeightIndex] : 1;
  const calculatedPrice = Math.round(product.price * currentQty);

  const handleAdd = () => {
    onAddToCart(product, currentQty, isFish ? selectedCut : undefined);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="flex flex-col rounded-3xl bg-slate-900/90 p-4 border border-white/10 shadow-xl backdrop-blur-xl transition-all hover:border-cyan-500/40">
      
      {/* Top Details Row */}
      <div className="flex gap-3">
        
        {/* Photo Container */}
        <div
          onClick={() => onQuickView(product)}
          className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-slate-950 border border-white/10 cursor-pointer group"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Eye className="size-5 text-cyan-300" />
          </div>

          {/* Local Name Badge on Image */}
          {product.localName && (
            <span className="absolute bottom-1.5 left-1.5 right-1.5 px-1.5 py-0.5 rounded-lg bg-slate-950/90 text-center font-display text-[10px] font-black text-amber-300 border border-amber-500/30">
              {product.localName}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <h3
                onClick={() => onQuickView(product)}
                className="font-display text-base font-bold text-slate-100 cursor-pointer hover:text-cyan-300 transition-colors line-clamp-1"
              >
                {product.name}
              </h3>
              {product.localName && (
                <span className="text-[11px] font-extrabold text-amber-400 block -mt-0.5">
                  ({product.localName})
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2">
            {product.description}
          </p>

          {/* Price Tag */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30">
            <span className="font-display text-base font-black text-cyan-300">
              ₹{calculatedPrice}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              / {currentQty} {product.unit}
            </span>
          </div>

          {/* Boat & Harbor provenance */}
          {product.boatName && (
            <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
              <Anchor className="size-3 text-emerald-400 shrink-0" />
              <span>{product.boatName} • {product.freshnessPercent || 98}% Fresh</span>
            </p>
          )}
        </div>

      </div>

      {/* Hand-Cut Preference for Fish */}
      {isFish && product.cutOptions && (
        <div className="mt-3 pt-2.5 border-t border-white/10">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-300">Select Cut:</span>
            <select
              value={selectedCut}
              onChange={(e) => setSelectedCut(e.target.value)}
              className="rounded-xl bg-slate-950 px-2.5 py-1 text-xs font-bold text-cyan-300 border border-white/10 outline-none"
            >
              {product.cutOptions.map((cut) => (
                <option key={cut} value={cut}>
                  🔪 {cut}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Bottom Controls Row */}
      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-white/5">
        
        {/* Weight Stepper */}
        {isFish ? (
          <div className="flex items-center rounded-2xl bg-slate-950 border border-white/10 p-1">
            <button
              aria-label="Less weight"
              onClick={() => setSelectedWeightIndex((prev) => Math.max(0, prev - 1))}
              disabled={selectedWeightIndex === 0}
              className="size-7 rounded-xl bg-slate-800 font-bold text-slate-200 hover:bg-slate-700 disabled:opacity-30 grid place-items-center"
            >
              −
            </button>

            <span className="w-14 text-center text-xs font-black text-cyan-300">
              {weightSteps[selectedWeightIndex]} KG
            </span>

            <button
              aria-label="More weight"
              onClick={() => setSelectedWeightIndex((prev) => Math.min(weightSteps.length - 1, prev + 1))}
              disabled={selectedWeightIndex === weightSteps.length - 1}
              className="size-7 rounded-xl bg-cyan-500 text-slate-950 font-black hover:bg-cyan-400 disabled:opacity-30 grid place-items-center"
            >
              +
            </button>
          </div>
        ) : (
          <span className="text-xs font-bold text-slate-400">1 Pack</span>
        )}

        {/* Add Button */}
        <button
          disabled={!product.isAvailable}
          onClick={handleAdd}
          className={`flex-1 py-2.5 rounded-2xl font-display text-xs font-black transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1.5 ${
            addedAnimation
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/20'
          }`}
        >
          {addedAnimation ? (
            <span className="flex items-center gap-1"><Check className="size-4 stroke-[3]" /> Added</span>
          ) : product.isAvailable ? (
            'Add to Basket'
          ) : (
            'Sold Out'
          )}
        </button>

      </div>

    </div>
  );
};
