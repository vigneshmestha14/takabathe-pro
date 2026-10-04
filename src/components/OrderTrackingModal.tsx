import React from 'react';
import type { Order } from '../data/mockData';
import { X, Anchor, Scissors, Snowflake, Truck, Home, Share2, Download } from 'lucide-react';

interface OrderTrackingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order, isOpen, onClose }) => {
  if (!order || !isOpen) return null;

  const steps = [
    { id: 'harbor_landed', label: 'Catch Landed at Malpe Harbor', time: '4:30 AM', icon: <Anchor className="size-4" /> },
    { id: 'hand_cut', label: 'Hand-Cut & Scaled', time: '5:15 AM', icon: <Scissors className="size-4" /> },
    { id: 'ice_packed', label: 'Sealed in Insulated Ice Box', time: '5:45 AM', icon: <Snowflake className="size-4" /> },
    { id: 'out_for_delivery', label: 'Out for Express Delivery', time: '6:15 AM', icon: <Truck className="size-4" /> },
    { id: 'delivered', label: 'Delivered to Doorstep', time: 'Expected ~30 mins', icon: <Home className="size-4" /> }
  ];

  const currentStepIndex = 3; // Out for Delivery state

  const handleShareWhatsApp = () => {
    const text = `🌊 *TAKABATHE Order #${order.id}*\nTotal: ₹${order.total}\nDelivery Slot: ${order.deliverySlot}\nStatus: Out for Express Delivery!`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDownloadInvoice = () => {
    const content = `==================================
TAKABATHE FRESH FISH DELIVERED BY THE KG
RECEIPT / INVOICE - ORDER #${order.id}
==================================
Customer: ${order.customerName}
Phone: ${order.phone}
Delivery Address: ${order.address}
Slot: ${order.deliverySlot}
Date: ${new Date(order.createdAt).toLocaleString()}

ITEMS ORDERED:
${order.items.map(i => `- ${i.name} (${i.selectedCut || 'Standard Cut'}): ${i.qty} ${i.unit} @ ₹${i.price}/${i.unit} = ₹${Math.round(i.price * i.qty)}`).join('\n')}

Subtotal: ₹${order.subtotal}
Delivery Fee: ₹${order.deliveryFee}
TOTAL AMOUNT PAID: ₹${order.total}

Thank you for choosing TAKABATHE Fresh Fish!
==================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `TAKABATHE_Invoice_${order.id}.txt`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg rounded-3xl glass-panel p-6 shadow-2xl ring-1 ring-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="font-display text-xl font-bold text-slate-100">Live Order Tracking</h3>
            </div>
            <p className="text-xs text-slate-400">Order ID: #{order.id}</p>
          </div>

          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full bg-slate-900/80 text-slate-400 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Live Timeline */}
        <div className="py-6 space-y-4">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.id} className="flex items-start gap-3">
                <div
                  className={`grid size-9 shrink-0 place-items-center rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-300 animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40'
                      : 'bg-slate-900 text-slate-600 ring-1 ring-white/10'
                  }`}
                >
                  {step.icon}
                </div>

                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm font-bold ${
                        isCurrent ? 'text-cyan-300' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-400">{step.time}</span>
                  </div>
                  {isCurrent && (
                    <p className="mt-0.5 text-xs text-cyan-400/80">
                      🛵 Express delivery partner is en route to {order.address.slice(0, 30)}...
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Info & Delivery Agent Contact */}
        <div className="rounded-2xl bg-slate-900/90 p-4 ring-1 ring-white/10 space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Delivery Address:</span>
            <span className="font-semibold text-right max-w-[200px] truncate">{order.address}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Delivery Slot:</span>
            <span className="font-semibold text-amber-400">{order.deliverySlot}</span>
          </div>
          <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
            <span className="text-slate-400">Total Paid:</span>
            <span className="font-bold text-cyan-300">₹{order.total}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-display text-xs font-bold text-white hover:bg-emerald-500 transition-all"
          >
            <Share2 className="size-4" /> Share on WhatsApp
          </button>

          <button
            onClick={handleDownloadInvoice}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 font-display text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all ring-1 ring-white/10"
          >
            <Download className="size-4" /> Download Receipt
          </button>
        </div>

      </div>
    </div>
  );
};
