import React, { useState } from 'react';
import type { Product } from '../data/mockData';
import { Check, Eye } from 'lucide-react';

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
  const calculatedPrice = Math.round(product.price * currentQty);

  const handleAdd = () => {
    onAddToCart(product, currentQty, isFish ? selectedCut : undefined);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="flex flex-col rounded-[18px] bg-white/85 p-3.5 ring-1 ring-[#0e2a33]/10 shadow-[0_1px_2px_rgba(14,42,51,.06)] backdrop-blur-xl transition-all hover:bg-white">
      
      {/* Top Details Row */}
      <div className="flex gap-3">
        
        {/* Photo Container */}
        <div
          onClick={() => onQuickView(product)}
          className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#f1f5f9] outline outline-black/5 cursor-pointer group"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Eye className="size-5 text-white" />
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <h3
              onClick={() => onQuickView(product)}
              className="font-display text-[15px] leading-tight font-semibold text-[#0e2a33] cursor-pointer hover:text-[#e05638]"
            >
              {product.name}
            </h3>
          </div>

          <p className="mt-0.5 text-[12px] text-[#0e2a33]/65 line-clamp-2">
            {product.description}
          </p>

          {/* Price Tag */}
          <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#e05638]/10 px-2 py-0.5 ring-1 ring-[#e05638]/25">
            <span className="font-display text-[15px] font-bold text-[#e05638]">
              ₹{calculatedPrice}
            </span>
            <span className="text-[11px] font-medium text-[#a8331a]/80">
              / {currentQty} {product.unit}
            </span>
          </div>

          <p className="mt-1 text-[10px] text-[#0e2a33]/40">
            {product.harborOrigin ? product.harborOrigin.split('•')[0] : 'Fresh harbor catch'}
          </p>
        </div>

      </div>

      {/* Hand-Cut Preference for Fish */}
      {isFish && product.cutOptions && (
        <div className="mt-2.5 pt-2 border-t border-[#0e2a33]/5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-[#0e2a33]/60">Cut style:</span>
            <select
              value={selectedCut}
              onChange={(e) => setSelectedCut(e.target.value)}
              className="rounded-lg bg-[#f1f5f9] px-2 py-1 text-[11px] font-semibold text-[#0e2a33] ring-1 ring-[#0e2a33]/10 outline-none"
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
      <div className="mt-3 flex items-center justify-between">
        
        {/* Weight Stepper */}
        {isFish ? (
          <div className="flex items-center rounded-full bg-[#e2e8f0] ring-1 ring-[#0e2a33]/15">
            <button
              aria-label="Less weight"
              onClick={() => setSelectedWeightIndex((prev) => Math.max(0, prev - 1))}
              disabled={selectedWeightIndex === 0}
              className="grid size-9 place-items-center text-lg font-semibold text-[#0e2a33]/70 hover:text-[#0e2a33] disabled:opacity-30"
            >
              −
            </button>

            <span className="w-16 text-center text-sm font-semibold text-[#0e2a33]">
              {weightSteps[selectedWeightIndex]} KG
            </span>

            <button
              aria-label="More weight"
              onClick={() => setSelectedWeightIndex((prev) => Math.min(weightSteps.length - 1, prev + 1))}
              disabled={selectedWeightIndex === weightSteps.length - 1}
              className="grid size-9 place-items-center text-lg font-semibold text-[#e05638] disabled:opacity-30"
            >
              +
            </button>
          </div>
        ) : (
          <span className="text-xs font-semibold text-[#0e2a33]/70">1 Pack</span>
        )}

        {/* Add Button */}
        <button
          disabled={!product.isAvailable}
          onClick={handleAdd}
          className={`rounded-full px-4 py-2 font-display text-[13px] font-semibold ring-1 transition-transform active:scale-95 disabled:opacity-40 ${
            addedAnimation
              ? 'bg-emerald-600 text-white ring-emerald-600'
              : 'bg-[#e05638] text-white ring-[#e05638] hover:bg-[#c9472b]'
          }`}
        >
          {addedAnimation ? (
            <span className="flex items-center gap-1"><Check className="size-3.5 stroke-[3]" /> Added</span>
          ) : product.isAvailable ? (
            'Add'
          ) : (
            'Sold out'
          )}
        </button>

      </div>

    </div>
  );
};
