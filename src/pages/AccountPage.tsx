import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { addressService } from '../services/addressService';
import type { CustomerAddress } from '../services/addressService';
import {
  User,
  MapPin,
  Package,
  LogOut,
  Plus,
  Trash2,
  HelpCircle
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, logoutUser, orders, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'support'>('profile');

  // Address manager state
  const [addresses, setAddresses] = useState<CustomerAddress[]>([
    {
      id: 'addr-1',
      userId: user?.id || 'usr-1',
      fullName: user?.full_name || 'Vignesh Mestha',
      phone: user?.phone || '+91 98765 43210',
      houseFlat: 'Flat 402, SeaBreeze Apartments',
      streetBuilding: 'Beach Road, Malpe',
      city: 'Udupi',
      state: 'Karnataka',
      pincode: '576108',
      addressType: 'home',
      isDefault: true
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.full_name || '',
    phone: user?.phone || '',
    houseFlat: '',
    streetBuilding: '',
    city: 'Udupi',
    state: 'Karnataka',
    pincode: '576101',
    addressType: 'home' as const,
    isDefault: false
  });
  const [pinError, setPinError] = useState('');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressService.validateIndianPinCode(newAddr.pincode)) {
      setPinError('Invalid 6-digit Indian PIN code');
      return;
    }
    setPinError('');
    const created: CustomerAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      userId: user?.id || 'usr-1'
    };
    setAddresses((prev) => [...prev, created]);
    setIsAdding(false);
    showToast('New address saved to your profile!');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address deleted');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Account Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-cyan-500/20 text-cyan-400 grid place-items-center ring-2 ring-cyan-400 font-display font-black text-2xl">
            {user?.full_name?.[0] || 'V'}
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-white">
              {user?.full_name || 'Vignesh Mestha'}
            </h1>
            <p className="text-xs text-slate-400">{user?.phone || '+91 98765 43210'} • {user?.email || 'vignesh@takabathe.com'}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Verified {user?.role || 'Customer'}
            </span>
          </div>
        </div>

        <button
          onClick={logoutUser}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-bold transition-all"
        >
          <LogOut className="size-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
        {[
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
          { id: 'orders', label: 'My Orders', icon: Package },
          { id: 'support', label: 'Help & Support', icon: HelpCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4 max-w-xl">
          <h3 className="font-display text-lg font-bold text-white">Customer Details</h3>
          
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Full Name</label>
              <input
                type="text"
                value={user?.full_name || 'Vignesh Mestha'}
                readOnly
                className="w-full bg-slate-950 rounded-xl p-3 text-slate-200 border border-white/10"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Mobile Phone (OTP Verified)</label>
              <input
                type="text"
                value={user?.phone || '+91 98765 43210'}
                readOnly
                className="w-full bg-slate-950 rounded-xl p-3 text-cyan-300 border border-white/10 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email || 'vignesh@takabathe.com'}
                readOnly
                className="w-full bg-slate-950 rounded-xl p-3 text-slate-200 border border-white/10"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white">Delivery Addresses</h3>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:brightness-110"
            >
              <Plus className="size-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleAddAddress} className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-3">
              <h4 className="text-xs font-bold text-cyan-300">New Address Form</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Receiver Name"
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  className="bg-slate-950 p-2.5 rounded-xl text-slate-200 border border-white/10"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone (+91)"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="bg-slate-950 p-2.5 rounded-xl text-slate-200 border border-white/10"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="House/Flat No & Landmark"
                value={newAddr.houseFlat}
                onChange={(e) => setNewAddr({ ...newAddr, houseFlat: e.target.value })}
                className="w-full text-xs bg-slate-950 p-2.5 rounded-xl text-slate-200 border border-white/10"
                required
              />

              <div className="grid grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Street / Area"
                  value={newAddr.streetBuilding}
                  onChange={(e) => setNewAddr({ ...newAddr, streetBuilding: e.target.value })}
                  className="bg-slate-950 p-2.5 rounded-xl text-slate-200 border border-white/10"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="bg-slate-950 p-2.5 rounded-xl text-slate-200 border border-white/10"
                  required
                />
                <input
                  type="text"
                  placeholder="PIN Code (6 Digits)"
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  className="bg-slate-950 p-2.5 rounded-xl text-slate-200 border border-white/10"
                  required
                />
              </div>

              {pinError && <p className="text-xs text-rose-400">{pinError}</p>}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Save Address
              </button>
            </form>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{addr.fullName}</span>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-1 rounded bg-slate-800 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-300">{addr.houseFlat}, {addr.streetBuilding}</p>
                <p className="text-xs text-slate-400">{addr.city}, {addr.state} - {addr.pincode}</p>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  {addr.addressType}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold text-white">Order History</h3>
          {orders.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400 bg-slate-900 rounded-2xl">No orders placed yet.</p>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                  <span>Order #{o.id}</span>
                  <span className="text-cyan-300 font-black">₹{o.total}</span>
                </div>
                <p className="text-xs text-slate-400">📍 {o.address}</p>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Status: {o.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Support */}
      {activeTab === 'support' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <h3 className="font-display text-lg font-bold text-white">TAKABATHE Customer Care</h3>
          <p className="text-xs text-slate-300">Have questions about your harbor catch or delivery slot?</p>
          
          <div className="space-y-2 text-xs">
            <p className="text-cyan-300 font-bold">📞 Support Hotline: +91 98765 43210</p>
            <p className="text-cyan-300 font-bold">💬 WhatsApp: +91 98765 43210</p>
            <p className="text-cyan-300 font-bold">✉️ Email: support@takabathe.com</p>
            <p className="text-slate-400">Hours: 6:00 AM – 9:00 PM (Mon–Sun)</p>
          </div>
        </div>
      )}

    </div>
  );
};
