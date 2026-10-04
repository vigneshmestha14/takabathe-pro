import React, { useState } from 'react';
import type { OrderItem } from '../data/mockData';
import { X, Trash2, Plus, Minus, ShoppingBag, Clock, MapPin, ShieldCheck, Phone, User } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (orderDetails: {
    customerName: string;
    phone: string;
    address: string;
    deliverySlot: string;
    items: OrderItem[];
    total: number;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderPlaced
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('Morning 7:00 AM - 9:00 AM (Express Catch)');
  const [isPlacing, setIsPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = items.reduce((acc, item) => acc + Math.round(item.price * item.qty), 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleQuickAddressFill = () => {
    setCustomerName('Vignesh Mestha');
    setPhone('+91 98765 43210');
    setAddress('Flat 402, SeaBreeze Apartments, Beach Road, Malpe - 576108');
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (address.trim().length < 10) {
      setErrorMsg('Please provide complete delivery address');
      return;
    }

    setErrorMsg('');
    setIsPlacing(true);

    // Trigger celebratory confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      onOrderPlaced({
        customerName,
        phone,
        address,
        deliverySlot,
        items,
        total
      });
      setIsPlacing(false);
      onClearCart();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md glass-panel flex flex-col justify-between shadow-2xl border-l border-white/10">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid size-10 place-items-center rounded-xl bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30">
                <ShoppingBag className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-slate-100">Your Fresh Basket</h2>
                <p className="text-xs text-slate-400">{items.length} items selected</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="grid size-9 place-items-center rounded-full bg-slate-900/80 text-slate-400 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-slate-900 text-slate-500 ring-1 ring-white/10">
                  <ShoppingBag className="size-8" />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-200">Your basket is empty</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Add today's morning catch or fish masalas to start your order.
                </p>
              </div>
            ) : (
              <>
                {/* Item List */}
                <div className="space-y-3">
                  {items.map((item) => {
                    const itemTotal = Math.round(item.price * item.qty);
                    return (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between rounded-xl bg-slate-900/80 p-3 ring-1 ring-white/10"
                      >
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="size-14 rounded-lg object-cover ring-1 ring-white/10"
                            />
                          )}
                          <div>
                            <h4 className="font-display text-sm font-bold text-slate-100">
                              {item.name}
                            </h4>
                            {item.selectedCut && (
                              <span className="block text-[11px] font-semibold text-cyan-400">
                                🔪 {item.selectedCut}
                              </span>
                            )}
                            <span className="text-xs text-slate-400">
                              ₹{item.price} / {item.unit}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                          <span className="font-display text-sm font-bold text-cyan-300">
                            ₹{itemTotal}
                          </span>

                          <div className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-2 py-0.5 ring-1 ring-white/10">
                            <button
                              onClick={() => onUpdateQty(item.productId, item.qty - (item.unit === 'KG' ? 0.5 : 1))}
                              className="text-slate-400 hover:text-cyan-400"
                            >
                              <Minus className="size-3" />
                            </button>

                            <span className="text-xs font-bold text-slate-200 min-w-[2.5rem] text-center">
                              {item.qty} {item.unit}
                            </span>

                            <button
                              onClick={() => onUpdateQty(item.productId, item.qty + (item.unit === 'KG' ? 0.5 : 1))}
                              className="text-slate-400 hover:text-cyan-400"
                            >
                              <Plus className="size-3" />
                            </button>

                            <button
                              onClick={() => onRemoveItem(item.productId)}
                              className="ml-1 text-rose-400 hover:text-rose-300"
                              title="Remove item"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Time Slot */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Clock className="size-4 text-amber-400" /> Choose Preferred Delivery Slot:
                  </label>
                  <select
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                    className="w-full rounded-xl bg-slate-900/90 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10 outline-none focus:ring-1 focus:ring-cyan-400"
                  >
                    <option value="Morning 7:00 AM - 9:00 AM (Express Catch)">
                      🌅 Morning 7:00 AM - 9:00 AM (Express Harbor Catch)
                    </option>
                    <option value="Afternoon 12:00 PM - 2:00 PM">
                      ☀️ Afternoon 12:00 PM - 2:00 PM
                    </option>
                    <option value="Evening 5:00 PM - 7:00 PM">
                      🌆 Evening 5:00 PM - 7:00 PM
                    </option>
                  </select>
                </div>

                {/* Customer Checkout Form */}
                <form onSubmit={handleCheckout} className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Delivery Information</span>
                    <button
                      type="button"
                      onClick={handleQuickAddressFill}
                      className="text-[11px] font-semibold text-cyan-400 hover:underline"
                    >
                      + Quick Demo Fill
                    </button>
                  </div>

                  <div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Your Full Name"
                        className="w-full rounded-xl bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 ring-1 ring-white/10 outline-none focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Mobile Number (for delivery SMS)"
                        className="w-full rounded-xl bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 ring-1 ring-white/10 outline-none focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 size-4 text-slate-400" />
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Full Delivery Address (Flat no, building, street, area)"
                        className="w-full rounded-xl bg-slate-900/90 pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 ring-1 ring-white/10 outline-none focus:ring-1 focus:ring-cyan-400 resize-none"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="rounded-lg bg-rose-500/20 p-2 text-xs font-semibold text-rose-300 ring-1 ring-rose-500/30">
                      {errorMsg}
                    </div>
                  )}

                  {/* Free Cleaning Guarantee */}
                  <div className="rounded-xl bg-emerald-500/10 p-2.5 ring-1 ring-emerald-500/20 flex items-center gap-2 text-xs text-emerald-400">
                    <ShieldCheck className="size-4 shrink-0" />
                    <span>Free Hand-Cutting, Scaled, Gutted & Packed in Insulated Ice Box!</span>
                  </div>
                </form>
              </>
            )}

          </div>

          {/* Drawer Footer Price Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Hand-Cutting & Ice Packing</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Express Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-400 font-bold">FREE (Orders &gt; ₹500)</span>
                  ) : (
                    <span>₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-100 pt-1 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="font-display text-xl text-cyan-300">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isPlacing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 py-3.5 font-display text-base font-extrabold text-slate-950 shadow-xl shadow-cyan-500/25 active:scale-98 transition-all hover:brightness-110 disabled:opacity-50"
              >
                {isPlacing ? 'Placing Express Order...' : `Place Order • ₹${total}`}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
