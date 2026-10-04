import React, { useState } from 'react';
import type { Product, Order } from '../data/mockData';
import { X, Lock, KeyRound, ShieldCheck, Edit3, Save, Plus, ToggleLeft, ToggleRight } from 'lucide-react';

interface OwnerAdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onAddProduct: (prod: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const OwnerAdminPortal: React.FC<OwnerAdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onUpdateProduct,
  onAddProduct,
  onUpdateOrderStatus
}) => {
  if (!isOpen) return null;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'inventory' | 'add'>('analytics');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // New product form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'fish' | 'masala'>('fish');
  const [price, setPrice] = useState(750);
  const [harborOrigin, setHarborOrigin] = useState('Malpe Deep Sea Harbor • Landed 4:30 AM');
  const [description, setDescription] = useState('');

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1408' || pin === '0000' || pin === '1234') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect Owner Passcode. Try 1408');
    }
  };

  const handleSavePrice = (id: string) => {
    onUpdateProduct(id, { price: tempPrice });
    setEditingPriceId(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name,
      category,
      price,
      unit: category === 'fish' ? 'KG' : 'pack',
      rating: 5.0,
      reviewsCount: 1,
      description: description || 'Harbor fresh catch prepped today.',
      harborOrigin,
      isAvailable: true,
      image: category === 'fish' ? './images/pomfret.png' : 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      weightSteps: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
    };

    onAddProduct(newProd);
    setName('');
    setDescription('');
    setActiveTab('inventory');
  };

  // Analytics Math
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0) + 18450; // Mock baseline
  const totalOrdersCount = orders.length + 12;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl glass-panel p-6 shadow-2xl ring-1 ring-white/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-slate-900/80 text-slate-400 hover:text-white"
        >
          <X className="size-5" />
        </button>

        {!isAuthenticated ? (
          /* Owner Login PIN Screen */
          <div className="py-8 max-w-sm mx-auto text-center space-y-4">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30">
              <Lock className="size-8" />
            </div>
            <h3 className="font-display text-2xl font-extrabold text-slate-100">Owner Portal Access</h3>
            <p className="text-xs text-slate-400">Enter Vignesh's Owner Passcode to access shop analytics & live price control.</p>

            <form onSubmit={handleOwnerLogin} className="space-y-3">
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-amber-400" />
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-Digit PIN (e.g. 1408)"
                  className="w-full rounded-xl bg-slate-900/90 pl-10 pr-4 py-2.5 text-center text-lg font-bold text-amber-300 tracking-widest ring-1 ring-white/10 outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {pinError && (
                <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 p-2 rounded-lg ring-1 ring-rose-500/20">
                  {pinError}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 py-3 font-display text-sm font-bold text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20"
              >
                Unlock Owner Portal
              </button>
            </form>
          </div>
        ) : (
          /* Owner Dashboard Content */
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-slate-100">Owner Dashboard (Vignesh)</h3>
                  <p className="text-xs text-slate-400">TAKABATHE Harbor Sourcing & Price Control Hub</p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30">
                🟢 Live Store Online
              </span>
            </div>

            {/* Navigation Tabs */}
            <div className="my-4 flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📊 Business Analytics
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🚚 Order Dispatch ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  activeTab === 'inventory'
                    ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚓ Price-Per-KG Control ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'add'
                    ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plus className="size-3.5" /> Add Catch Item
              </button>
            </div>

            {/* Tab 1: Business Analytics */}
            {activeTab === 'analytics' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-white/10">
                    <span className="text-[11px] text-slate-400 font-bold uppercase block">Today's Revenue</span>
                    <span className="font-display text-2xl font-extrabold text-cyan-300">₹{totalRevenue}</span>
                  </div>
                  <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-white/10">
                    <span className="text-[11px] text-slate-400 font-bold uppercase block">Total Dispatches</span>
                    <span className="font-display text-2xl font-extrabold text-emerald-400">{totalOrdersCount}</span>
                  </div>
                  <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-white/10">
                    <span className="text-[11px] text-slate-400 font-bold uppercase block">Total Fish Sold</span>
                    <span className="font-display text-2xl font-extrabold text-amber-400">28.5 KG</span>
                  </div>
                  <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-white/10">
                    <span className="text-[11px] text-slate-400 font-bold uppercase block">Avg Order Value</span>
                    <span className="font-display text-2xl font-extrabold text-teal-300">₹1,537</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-white/10">
                  <h4 className="font-display text-sm font-bold text-slate-200 mb-2">🔥 Top Selling Fish Cuts Today</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>1. Surmai / Kingfish Steaks</span>
                      <span className="font-bold text-cyan-300">12.0 KG (₹13,800)</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>2. Silver Pomfret (Tawa Cut)</span>
                      <span className="font-bold text-cyan-300">8.5 KG (₹8,075)</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>3. Jumbo Tiger Prawns (De-veined)</span>
                      <span className="font-bold text-cyan-300">6.0 KG (₹4,920)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Order Dispatch Controller */}
            {activeTab === 'orders' && (
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-400">No active dispatches right now.</p>
                ) : (
                  orders.map((o) => (
                    <div key={o.id} className="rounded-2xl bg-slate-900/90 p-4 ring-1 ring-white/10 space-y-3">
                      <div className="flex justify-between text-xs font-bold text-slate-200">
                        <span>Order #{o.id} • {o.customerName} ({o.phone})</span>
                        <span className="text-amber-400 font-extrabold">₹{o.total}</span>
                      </div>
                      <p className="text-xs text-slate-400">📍 {o.address} • Slot: {o.deliverySlot}</p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                        <span className="text-slate-400">Dispatch Status:</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => onUpdateOrderStatus(o.id, 'hand_cut')}
                            className="rounded-lg bg-cyan-500/20 px-2.5 py-1 font-bold text-cyan-300 hover:bg-cyan-500/30"
                          >
                            🔪 Cut & Scaled
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(o.id, 'ice_packed')}
                            className="rounded-lg bg-teal-500/20 px-2.5 py-1 font-bold text-teal-300 hover:bg-teal-500/30"
                          >
                            🧊 Ice Packed
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(o.id, 'out_for_delivery')}
                            className="rounded-lg bg-amber-500/20 px-2.5 py-1 font-bold text-amber-300 hover:bg-amber-500/30"
                          >
                            🛵 Out for Delivery
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Price-Per-KG Inventory Control */}
            {activeTab === 'inventory' && (
              <div className="space-y-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-900/80 p-3.5 ring-1 ring-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="size-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-display text-sm font-bold text-slate-100">{p.name}</h4>
                        <span className="text-xs text-slate-400">{p.harborOrigin || 'Malpe Catch'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Price Edit */}
                      <div className="flex items-center gap-1">
                        {editingPriceId === p.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(Number(e.target.value))}
                              className="w-20 rounded-lg bg-slate-800 px-2 py-1 text-xs text-slate-100 ring-1 ring-amber-400 outline-none"
                            />
                            <button
                              onClick={() => handleSavePrice(p.id)}
                              className="grid size-7 place-items-center rounded-lg bg-amber-500 text-slate-950 font-bold"
                            >
                              <Save className="size-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingPriceId(p.id);
                              setTempPrice(p.price);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-cyan-300 hover:underline"
                          >
                            ₹{p.price} / {p.unit} <Edit3 className="size-3 text-slate-400" />
                          </button>
                        )}
                      </div>

                      {/* Stock Toggle */}
                      <button
                        onClick={() => onUpdateProduct(p.id, { isAvailable: !p.isAvailable })}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                          p.isAvailable
                            ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40'
                        }`}
                      >
                        {p.isAvailable ? <ToggleRight className="size-4" /> : <ToggleLeft className="size-4" />}
                        {p.isAvailable ? 'In Stock' : 'Sold Out'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Add Catch Item */}
            {activeTab === 'add' && (
              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Item Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Fresh Red Snapper Fillet"
                    className="w-full rounded-xl bg-slate-900/90 px-3.5 py-2.5 text-slate-200 ring-1 ring-white/10 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full rounded-xl bg-slate-900/90 px-3.5 py-2.5 text-slate-200 ring-1 ring-white/10 outline-none"
                    >
                      <option value="fish">Fish Cut (per KG)</option>
                      <option value="masala">Fish Masala (per Pack)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Price per {category === 'fish' ? 'KG' : 'Pack'} (₹)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full rounded-xl bg-slate-900/90 px-3.5 py-2.5 text-slate-200 ring-1 ring-white/10 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Harbor Origin</label>
                  <input
                    type="text"
                    value={harborOrigin}
                    onChange={(e) => setHarborOrigin(e.target.value)}
                    placeholder="e.g. Malpe Deep Sea Harbor • Landed 4:30 AM"
                    className="w-full rounded-xl bg-slate-900/90 px-3.5 py-2.5 text-slate-200 ring-1 ring-white/10 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-500 py-3 font-display font-bold text-slate-950 shadow-lg hover:bg-amber-400"
                >
                  + Publish Catch to Daily Board
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
