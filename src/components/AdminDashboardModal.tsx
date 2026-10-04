import React, { useState } from 'react';
import type { Product, Order } from '../data/mockData';
import { X, Plus, ToggleLeft, ToggleRight, Edit3, Save, ShieldCheck } from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onUpdateProduct: (productId: string, updates: Partial<Product>) => void;
  onAddProduct: (newProd: Product) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onUpdateProduct,
  onAddProduct
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'add'>('inventory');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // New product form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'fish' | 'masala'>('fish');
  const [price, setPrice] = useState(650);
  const [harborOrigin, setHarborOrigin] = useState('Malpe Harbor • Landed 4:30 AM');
  const [description, setDescription] = useState('');

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
      description: description || 'Fresh harbor catch prepped today.',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl glass-panel p-6 shadow-2xl ring-1 ring-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="grid size-10 place-items-center rounded-xl bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-100">Shop Owner / Harbor Admin Portal</h3>
              <p className="text-xs text-slate-400">Manage daily catch, update live price per KG & view orders</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full bg-slate-900/80 text-slate-400 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="my-4 flex items-center gap-2 border-b border-slate-800/80 pb-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'inventory'
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Daily Board Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'add'
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="size-3.5" /> Add New Item
          </button>
        </div>

        {/* Tab 1: Inventory Table */}
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
                    <span className="text-xs text-slate-400">{p.harborOrigin || 'Local Catch'}</span>
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

        {/* Tab 2: Live Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">No active customer orders placed yet.</p>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="rounded-2xl bg-slate-900/90 p-4 ring-1 ring-white/10 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-200">
                    <span>Order #{o.id} • {o.customerName} ({o.phone})</span>
                    <span className="text-amber-400">₹{o.total}</span>
                  </div>
                  <p className="text-xs text-slate-400">📍 {o.address} • Slot: {o.deliverySlot}</p>
                  <div className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <span className="font-bold">Items: </span>
                    {o.items.map(i => `${i.name} (${i.qty}${i.unit})`).join(', ')}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Add Product Form */}
        {activeTab === 'add' && (
          <form onSubmit={handleCreateProduct} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Item Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fresh White Pomfret Steaks"
                className="w-full rounded-xl bg-slate-900/90 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10 outline-none focus:ring-1 focus:ring-amber-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-900/90 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10 outline-none"
                >
                  <option value="fish">Fish Cut (per KG)</option>
                  <option value="masala">Fish Masala (per Pack)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Price per {category === 'fish' ? 'KG' : 'Pack'} (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-900/90 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Harbor / Port Source</label>
              <input
                type="text"
                value={harborOrigin}
                onChange={(e) => setHarborOrigin(e.target.value)}
                className="w-full rounded-xl bg-slate-900/90 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl bg-slate-900/90 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-amber-500 py-3 font-display text-sm font-bold text-slate-950 shadow-lg hover:bg-amber-400"
            >
              + Publish Item to Daily Board
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
