import React, { useState } from 'react';
import type { Product } from '../data/mockData';
import { X, Star, MapPin, Sparkles, Flame, Plus, Check } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, weightOrQty: number, selectedCut?: string) => void;
  allProducts: Product[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  allProducts
}) => {
  if (!product) return null;

  const isFish = product.category === 'fish';
  const weightSteps = product.weightSteps || [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
  const [selectedWeight, setSelectedWeight] = useState<number>(1.0);
  const [selectedCut, setSelectedCut] = useState<string>(
    product.cutOptions ? product.cutOptions[0] : 'Whole Cleaned'
  );
  const [isAdded, setIsAdded] = useState(false);

  // Find paired masala recommendation
  const pairedMasala = allProducts.find((p) => p.category === 'masala');

  const totalPrice = Math.round(product.price * selectedWeight);

  const handleAdd = () => {
    onAddToCart(product, selectedWeight, isFish ? selectedCut : undefined);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

  const handleAddPairedMasala = () => {
    if (pairedMasala) {
      onAddToCart(pairedMasala, 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl glass-panel p-6 shadow-2xl ring-1 ring-white/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-slate-900/80 text-slate-300 ring-1 ring-white/10 hover:bg-slate-800"
        >
          <X className="size-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Image */}
          <div className="relative h-64 md:h-full w-full overflow-hidden rounded-2xl bg-slate-950 ring-1 ring-white/10">
            <img src={product.image} alt={product.name} className="size-full object-cover" />
            {product.tag && (
              <span className="absolute top-3 left-3 rounded-full bg-cyan-500 px-3 py-1 font-display text-xs font-bold text-slate-950">
                {product.tag}
              </span>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
              <Star className="size-4 fill-amber-400" />
              <span>{product.rating} Rating</span>
              <span className="text-slate-400">({product.reviewsCount} customer reviews)</span>
            </div>

            <h2 className="font-display text-2xl font-extrabold text-slate-100">
              {product.name}
            </h2>

            {product.harborOrigin && (
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                <MapPin className="size-3.5" />
                <span>{product.harborOrigin}</span>
              </div>
            )}

            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Flesh Texture & Bone Information */}
            {isFish && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-slate-900/80 p-2.5 ring-1 ring-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Bone Structure</span>
                  <span className="font-bold text-cyan-300">{product.boneType || 'Single Bone'}</span>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-2.5 ring-1 ring-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Flesh Texture</span>
                  <span className="font-bold text-teal-300">{product.texture || 'Delicate & Flaky'}</span>
                </div>
              </div>
            )}

            {/* Best Cooking Style */}
            {product.bestCookingStyle && (
              <div className="mt-3 flex items-center gap-2 text-xs">
                <Flame className="size-4 text-amber-400" />
                <span className="text-slate-400">Best For:</span>
                <span className="font-semibold text-slate-200">{product.bestCookingStyle}</span>
              </div>
            )}

            {/* Hand-Cut Customization for Fish */}
            {isFish && product.cutOptions && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Choose Custom Cutting Preference:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.cutOptions.map((cut) => (
                    <button
                      key={cut}
                      onClick={() => setSelectedCut(cut)}
                      className={`rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all ${
                        selectedCut === cut
                          ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400'
                          : 'bg-slate-900/60 text-slate-400 ring-1 ring-white/10 hover:bg-slate-800'
                      }`}
                    >
                      🔪 {cut}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Weight Step Buttons for Fish */}
            {isFish && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Select Weight (KG):
                </label>
                <div className="flex flex-wrap gap-2">
                  {weightSteps.map((step) => (
                    <button
                      key={step}
                      onClick={() => setSelectedWeight(step)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        selectedWeight === step
                          ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md'
                          : 'bg-slate-900/60 text-slate-300 ring-1 ring-white/10 hover:bg-slate-800'
                      }`}
                    >
                      {step} KG
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Masala Pairing Recommendation */}
            {isFish && pairedMasala && (
              <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent p-3 ring-1 ring-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-300">Pair with Tawa Fry Masala</p>
                    <p className="text-[11px] text-slate-400">Authentic stone-ground Byadgi chili paste</p>
                  </div>
                </div>
                <button
                  onClick={handleAddPairedMasala}
                  className="shrink-0 rounded-lg bg-amber-500 px-3 py-1 text-xs font-extrabold text-slate-950 hover:bg-amber-400"
                >
                  + Add ₹{pairedMasala.price}
                </button>
              </div>
            )}

            {/* Action Footer */}
            <div className="mt-6 flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div>
                <span className="font-display text-2xl font-extrabold text-cyan-300">
                  ₹{totalPrice}
                </span>
                <span className="ml-1 text-xs text-slate-400 font-semibold">
                  for {selectedWeight} {product.unit}
                </span>
              </div>

              <button
                onClick={handleAdd}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 font-display text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
              >
                {isAdded ? (
                  <>
                    <Check className="size-4 stroke-[3]" /> Added to Basket!
                  </>
                ) : (
                  <>
                    <Plus className="size-4 stroke-[2.5]" /> Add {selectedWeight} {product.unit} to Cart
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
