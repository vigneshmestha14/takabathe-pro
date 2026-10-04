import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { cart, updateCartQty, removeFromCart, cartSubtotal } = useApp();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const deliveryFee = cartSubtotal >= 500 || cartSubtotal === 0 ? 0 : 49;
  const total = cartSubtotal + deliveryFee;

  const handleProceedToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Slide-over Drawer Panel */}
      <div className="relative z-10 h-full w-full max-w-md bg-slate-900 border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        
        {/* Top Bar */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-5 text-cyan-400" />
              <h2 className="font-display text-xl font-extrabold text-white">Your Coastal Cart</h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Cart Item List */}
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="text-4xl">🐟</div>
              <h3 className="font-display text-lg font-bold text-white">Your cart is empty</h3>
              <p className="text-xs text-slate-400">Add some fresh harbor catch to proceed.</p>
            </div>
          ) : (
            <div className="py-4 space-y-3">
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-400">
                        {item.selectedCut || 'Standard Cut'} • ₹{item.price}/{item.unit}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId, item.selectedCut)}
                      className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-2 py-1">
                      <button
                        onClick={() => updateCartQty(item.productId, item.selectedCut, item.qty - (item.unit === 'KG' ? 0.5 : 1))}
                        className="px-1.5 font-bold text-slate-300 hover:text-white"
                      >
                        -
                      </button>
                      <span className="font-bold text-cyan-300">{item.qty} {item.unit}</span>
                      <button
                        onClick={() => updateCartQty(item.productId, item.selectedCut, item.qty + (item.unit === 'KG' ? 0.5 : 1))}
                        className="px-1.5 font-bold text-cyan-400"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-display font-extrabold text-white text-sm">
                      ₹{Math.round(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cart.length > 0 && (
          <div className="border-t border-white/10 pt-4 space-y-3">
            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Delivery</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-white font-extrabold text-base pt-2 border-t border-white/10">
                <span>Total Amount</span>
                <span className="text-cyan-300 font-display">₹{total}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 font-display text-sm font-black text-slate-950 shadow-xl shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Proceed to 5-Step Checkout</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
