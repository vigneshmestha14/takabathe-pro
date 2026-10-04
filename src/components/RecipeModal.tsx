import React from 'react';
import type { Recipe, Product } from '../data/mockData';
import { X, Clock, Flame, BookOpen, Plus, CheckCircle2 } from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product, qty: number) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  products,
  onAddToCart
}) => {
  if (!recipe) return null;

  const pairedProduct = products.find(p => p.name.toLowerCase().includes(recipe.pairedFish.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl glass-panel p-6 shadow-2xl ring-1 ring-white/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-slate-900/80 text-slate-300 ring-1 ring-white/10 hover:bg-slate-800"
        >
          <X className="size-5" />
        </button>

        {/* Recipe Header */}
        <div className="relative mb-4 h-56 w-full overflow-hidden rounded-2xl bg-slate-950 ring-1 ring-white/10">
          <img src={recipe.image} alt={recipe.title} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300 ring-1 ring-amber-500/40">
                {recipe.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-300 font-medium">
                <Clock className="size-3.5 text-cyan-400" /> Prep: {recipe.prepTime} | Cook: {recipe.cookTime}
              </span>
            </div>
            <h2 className="font-display text-2xl font-extrabold text-slate-100">{recipe.title}</h2>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="space-y-5 text-xs">
          
          {/* Paired Product Quick Add */}
          {pairedProduct && (
            <div className="rounded-2xl bg-gradient-to-r from-cyan-500/15 via-teal-500/10 to-transparent p-3.5 ring-1 ring-cyan-500/30 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-cyan-300">Order Fresh {pairedProduct.name}</p>
                <p className="text-slate-400">₹{pairedProduct.price} / {pairedProduct.unit} • Direct from Malpe Harbor</p>
              </div>
              <button
                onClick={() => {
                  onAddToCart(pairedProduct, 1);
                  onClose();
                }}
                className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 font-display font-bold text-slate-950 shadow-md hover:bg-cyan-400"
              >
                <Plus className="size-4 stroke-[3]" /> Add to Basket
              </button>
            </div>
          )}

          {/* Ingredients */}
          <div>
            <h3 className="font-display text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
              <BookOpen className="size-4 text-cyan-400" /> Ingredients Checklist:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-2 rounded-xl bg-slate-900/80 p-2.5 ring-1 ring-white/10 text-slate-300">
                  <CheckCircle2 className="size-4 text-teal-400 shrink-0" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="font-display text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
              <Flame className="size-4 text-amber-400" /> Step-by-Step Cooking Guide:
            </h3>
            <ol className="space-y-2.5">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 rounded-xl bg-slate-900/80 p-3 ring-1 ring-white/10">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300 ring-1 ring-amber-500/40">
                    {idx + 1}
                  </span>
                  <p className="text-slate-300 leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>

        </div>

      </div>
    </div>
  );
};
