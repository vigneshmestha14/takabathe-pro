import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, activeOrder } = useApp();

  const order = orders.find((o) => o.id === id) || activeOrder || {
    id: id || 'TKB-98214',
    customerName: 'Vignesh Mestha',
    phone: '+91 98765 43210',
    address: 'Flat 402, SeaBreeze Apartments, Beach Road, Malpe, Udupi - 576108',
    deliverySlot: 'Morning (8:00 AM - 11:00 AM)',
    items: [
      { productId: 'prod-1', name: 'Silver Pomfret (Manoji)', price: 950, unit: 'KG', qty: 1.0, selectedCut: 'Tawa Fry Steaks' }
    ],
    subtotal: 950,
    deliveryFee: 0,
    total: 970,
    status: 'out_for_delivery' as const,
    createdAt: new Date().toISOString(),
    estimatedDelivery: '25 Minutes'
  };

  const steps = [
    { key: 'pending', title: 'Order Confirmed', desc: 'Order received at Harbor Station', done: true },
    { key: 'hand_cut', title: 'Hand-Cut & Scaled', desc: 'Butchers prepping fish to your cut choice', done: ['hand_cut', 'ice_packed', 'out_for_delivery', 'delivered'].includes(order.status) },
    { key: 'ice_packed', title: 'Packed in Crushed Ice', desc: 'Temperature insulated cold box sealed', done: ['ice_packed', 'out_for_delivery', 'delivered'].includes(order.status) },
    { key: 'out_for_delivery', title: 'Out for Delivery', desc: 'Rider on the way to your address', done: ['out_for_delivery', 'delivered'].includes(order.status) },
    { key: 'delivered', title: 'Delivered', desc: 'Enjoy your ocean-fresh meal!', done: order.status === 'delivered' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <Link to="/orders" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white">
        <ArrowLeft className="size-4" />
        <span>Back to All Orders</span>
      </Link>

      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
        
        {/* Header info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Live Order Dispatch Tracking</span>
            <h1 className="font-display text-2xl font-black text-white">Order #{order.id}</h1>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-semibold">Estimated Delivery</span>
            <span className="font-display text-lg font-black text-emerald-400">Within {order.estimatedDelivery || '30 Mins'}</span>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Preparation & Dispatch Progress</h3>
          <div className="space-y-4">
            {steps.map((s, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className={`grid size-8 place-items-center rounded-full text-xs shrink-0 ${
                    s.done ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {s.done ? <CheckCircle2 className="size-5" /> : idx + 1}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${s.done ? 'text-white' : 'text-slate-500'}`}>{s.title}</h4>
                  <p className="text-xs text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items & Address */}
        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
            <h4 className="font-bold text-cyan-300">Items Ordered</h4>
            {order.items.map((i: any, idx: number) => (
              <div key={idx} className="flex justify-between text-slate-300">
                <span>{i.name} ({i.qty} {i.unit})</span>
                <span className="font-bold">₹{Math.round(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-white/5 flex justify-between font-bold text-white">
              <span>Total Paid</span>
              <span className="text-cyan-300">₹{order.total}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
            <h4 className="font-bold text-cyan-300">Delivery Address & Slot</h4>
            <p className="text-slate-300">📍 {order.address}</p>
            <p className="text-slate-400">🕒 Slot: {order.deliverySlot}</p>
            <p className="text-slate-400">📞 Receiver: {order.phone}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
