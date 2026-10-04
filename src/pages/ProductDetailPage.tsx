import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Anchor
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, addToCart } = useApp();

  const product = products.find(
    (p) => p.id === slug || p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug
  ) || products[0];

  const [qty, setQty] = useState(1.0);
  const [selectedCut, setSelectedCut] = useState<string>(
    product?.cutOptions?.[0] || 'Tawa Fry Steaks'
  );
  const [selectedCleaning, setSelectedCleaning] = useState<string>('Cleaned & Gutted');
  const [specialInstructions] = useState<string>('');

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-display text-2xl font-extrabold text-white">Product Not Found</h2>
        <Link to="/shop" className="text-cyan-400 font-bold hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  const calculatedPrice = Math.round(product.price * qty);

  const cuts = product.cutOptions || [
    'Tawa Fry Steaks',
    'Curry Cut (Medium Cubes)',
    'Fillet (Boneless)',
    'Whole Cleaned & Scaled'
  ];

  const cleaningOptions = [
    'Cleaned & Gutted (Standard)',
    'Cleaned + Scaled + Slitted',
    'As-is (Uncleaned Harbor Catch)'
  ];

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      qty,
      selectedCut,
      selectedCleaning,
      specialInstructions,
      image: product.image
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Daily Catch Board</span>
      </Link>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        
        {/* Left Product Image */}
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 sm:h-96 object-cover"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                {product.tag}
              </span>
            )}
          </div>

          {/* Harbor origin note */}
          {product.harborOrigin && (
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-3">
              <Anchor className="size-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-cyan-300 block">Harbor Origin Verification</span>
                <p className="text-xs text-slate-300">{product.harborOrigin}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Info & Selection */}
        <div className="space-y-6">
          
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1">{product.description}</p>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Price ({qty} {product.unit})</span>
              <span className="font-display text-3xl font-black text-cyan-300">₹{calculatedPrice}</span>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Base: ₹{product.price} / {product.unit}</span>
          </div>

          {/* Quantity selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-200">Select Quantity ({product.unit})</label>
            <div className="grid grid-cols-4 gap-2">
              {[0.5, 1.0, 1.5, 2.0].map((step) => (
                <button
                  key={step}
                  onClick={() => setQty(step)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    qty === step
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                      : 'bg-slate-900 text-slate-300 border-white/10 hover:bg-slate-800'
                  }`}
                >
                  {step} {product.unit}
                </button>
              ))}
            </div>
          </div>

          {/* Cut options */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-200">Select Cut Preference</label>
            <div className="grid grid-cols-2 gap-2">
              {cuts.map((cut: string) => (
                <button
                  key={cut}
                  onClick={() => setSelectedCut(cut)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                    selectedCut === cut
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-white/5 hover:bg-slate-800'
                  }`}
                >
                  {cut}
                </button>
              ))}
            </div>
          </div>

          {/* Cleaning preference */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-200">Cleaning Option</label>
            <div className="space-y-1.5">
              {cleaningOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedCleaning(opt)}
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold text-left border transition-all flex items-center justify-between ${
                    selectedCleaning === opt
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 border-white/5 hover:bg-slate-800'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedCleaning === opt && <CheckCircle2 className="size-4 text-teal-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 py-4 font-display text-sm font-black text-slate-950 shadow-xl shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <ShoppingBag className="size-5" />
            <span>Add {qty} {product.unit} to Cart • ₹{calculatedPrice}</span>
          </button>

        </div>

      </div>

    </div>
  );
};
