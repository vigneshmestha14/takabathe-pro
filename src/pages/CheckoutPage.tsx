import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { addressService } from '../services/addressService';
import type { SavedAddress } from '../services/addressService';
import { paymentService } from '../services/paymentService';
import {
  MapPin,
  Clock,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Plus
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, user, createOrder, showToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Address state
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [addresses, setAddresses] = useState<SavedAddress[]>([
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

  const [isAddingAddress, setIsAddingAddress] = useState(false);
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
  const [addrError, setAddrError] = useState('');

  // Delivery slot state
  const [selectedSlot, setSelectedSlot] = useState('Morning (8:00 AM - 11:00 AM)');
  const slots = [
    { id: 'morning', name: 'Morning (8:00 AM - 11:00 AM)', text: 'Harbor landed 4:30 AM catch' },
    { id: 'afternoon', name: 'Afternoon (12:00 PM - 3:00 PM)', text: 'Mid-day fresh harvest' },
    { id: 'evening', name: 'Evening (5:00 PM - 8:00 PM)', text: 'Sunset coastal delivery' }
  ];

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Fees calculation
  const deliveryFee = cartSubtotal >= 500 ? 0 : 49;
  const cleaningFee = 20;
  const totalAmount = cartSubtotal + deliveryFee + cleaningFee;

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressService.validateIndianPinCode(newAddr.pincode)) {
      setAddrError('Please enter a valid 6-digit Indian PIN code (e.g. 576101)');
      return;
    }
    setAddrError('');
    const created: SavedAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      userId: user?.id || 'usr-1'
    };
    setAddresses((prev) => [...prev, created]);
    setSelectedAddressIndex(addresses.length);
    setIsAddingAddress(false);
    showToast('New address saved!');
  };

  const currentAddress = addresses[selectedAddressIndex] || addresses[0];

  const handleFinalPlaceOrder = async () => {
    setIsProcessingPayment(true);

    if (paymentMethod !== 'cod') {
      await paymentService.createPaymentOrder({
        orderId: `TKB-PENDING`,
        amount: totalAmount,
        gateway: paymentMethod === 'card' ? 'razorpay' : paymentMethod,
        customerName: currentAddress.fullName,
        customerPhone: currentAddress.phone
      });
    }

    setTimeout(async () => {
      const order = await createOrder({
        customerName: currentAddress.fullName,
        phone: currentAddress.phone,
        address: `${currentAddress.houseFlat}, ${currentAddress.streetBuilding}, ${currentAddress.city} - ${currentAddress.pincode}`,
        deliverySlot: selectedSlot,
        paymentMethod
      });

      setIsProcessingPayment(false);
      if (order) {
        setCreatedOrderId(order.id);
        setStep(5);
      }
    }, 1200);
  };

  if (cart.length === 0 && step !== 5) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-display text-2xl font-extrabold text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-400">Add some fresh fish to proceed to checkout.</p>
        <Link
          to="/shop"
          className="inline-block rounded-xl bg-cyan-500 px-6 py-3 text-xs font-bold text-slate-950"
        >
          Browse Fresh Fish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 5-Step Progress Header */}
      <div className="bg-slate-900/90 p-4 rounded-3xl border border-white/10">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          {[
            { num: 1, label: 'Address' },
            { num: 2, label: 'Delivery Slot' },
            { num: 3, label: 'Summary' },
            { num: 4, label: 'Payment' },
            { num: 5, label: 'Confirmation' }
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 ${
                step >= s.num ? 'text-cyan-400 font-extrabold' : 'text-slate-600'
              }`}
            >
              <span
                className={`grid size-6 place-items-center rounded-full text-[11px] ${
                  step >= s.num ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Address */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-black text-white flex items-center gap-2">
              <MapPin className="size-5 text-cyan-400" />
              <span>Step 1: Select Delivery Address</span>
            </h2>

            <button
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:underline"
            >
              <Plus className="size-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Form to add address */}
          {isAddingAddress && (
            <form onSubmit={handleSaveNewAddress} className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-3">
              <h3 className="text-xs font-bold text-cyan-300">Add New Coastal Address</h3>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  className="bg-slate-950 rounded-xl p-2.5 text-slate-200 border border-white/10"
                  required
                />
                <input
                  type="tel"
                  placeholder="Mobile Phone"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="bg-slate-950 rounded-xl p-2.5 text-slate-200 border border-white/10"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="House / Flat No. & Building"
                value={newAddr.houseFlat}
                onChange={(e) => setNewAddr({ ...newAddr, houseFlat: e.target.value })}
                className="w-full text-xs bg-slate-950 rounded-xl p-2.5 text-slate-200 border border-white/10"
                required
              />

              <div className="grid grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Street / Area"
                  value={newAddr.streetBuilding}
                  onChange={(e) => setNewAddr({ ...newAddr, streetBuilding: e.target.value })}
                  className="bg-slate-950 rounded-xl p-2.5 text-slate-200 border border-white/10"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="bg-slate-950 rounded-xl p-2.5 text-slate-200 border border-white/10"
                  required
                />
                <input
                  type="text"
                  placeholder="PIN Code (6 digits)"
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  className="bg-slate-950 rounded-xl p-2.5 text-slate-200 border border-white/10"
                  required
                />
              </div>

              {addrError && <p className="text-xs font-semibold text-rose-400">{addrError}</p>}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Save & Use Address
              </button>
            </form>
          )}

          {/* List of addresses */}
          <div className="space-y-3">
            {addresses.map((addr, idx) => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddressIndex(idx)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                  selectedAddressIndex === idx
                    ? 'bg-slate-900 border-cyan-400 ring-1 ring-cyan-400'
                    : 'bg-slate-900/50 border-white/10 hover:bg-slate-900'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{addr.fullName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {addr.addressType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{addr.houseFlat}, {addr.streetBuilding}</p>
                  <p className="text-xs text-slate-400">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-xs text-cyan-400 font-bold">📞 {addr.phone}</p>
                </div>

                {selectedAddressIndex === idx && <CheckCircle2 className="size-5 text-cyan-400" />}
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-cyan-500 text-slate-950 font-extrabold font-display text-sm hover:brightness-110"
          >
            <span>Proceed to Delivery Slot</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}

      {/* Step 2: Delivery Slot */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="font-display text-xl font-black text-white flex items-center gap-2">
            <Clock className="size-5 text-cyan-400" />
            <span>Step 2: Choose Delivery Time Slot</span>
          </h2>

          <div className="space-y-3">
            {slots.map((slot) => (
              <div
                key={slot.id}
                onClick={() => setSelectedSlot(slot.name)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedSlot === slot.name
                    ? 'bg-slate-900 border-teal-400 ring-1 ring-teal-400'
                    : 'bg-slate-900/50 border-white/10 hover:bg-slate-900'
                }`}
              >
                <div>
                  <h3 className="font-bold text-white text-sm">{slot.name}</h3>
                  <p className="text-xs text-slate-400">{slot.text}</p>
                </div>

                {selectedSlot === slot.name && <CheckCircle2 className="size-5 text-teal-400" />}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="w-1/3 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="w-2/3 flex items-center justify-center gap-2 py-4 rounded-2xl bg-cyan-500 text-slate-950 font-extrabold font-display text-sm hover:brightness-110"
            >
              <span>Review Order Summary</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Order Summary */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="font-display text-xl font-black text-white">Step 3: Order Summary</h2>

          {/* Items breakdown */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-white/10 space-y-3">
            {cart.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs pb-3 border-b border-white/5 last:border-none last:pb-0">
                <div>
                  <h4 className="font-bold text-white">{item.name}</h4>
                  <p className="text-slate-400">{item.selectedCut || 'Standard Cut'} • {item.qty} {item.unit}</p>
                </div>
                <span className="font-bold text-cyan-300">₹{Math.round(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          {/* Bill summary */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Items Subtotal</span>
              <span>₹{cartSubtotal}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Cleaning & Prep Fee</span>
              <span>₹{cleaningFee}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Express Delivery Fee</span>
              <span>{deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-white font-extrabold text-base pt-2 border-t border-white/10">
              <span>Total Payable Amount</span>
              <span className="text-cyan-300">₹{totalAmount}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="w-1/3 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="w-2/3 flex items-center justify-center gap-2 py-4 rounded-2xl bg-cyan-500 text-slate-950 font-extrabold font-display text-sm hover:brightness-110"
            >
              <span>Proceed to Payment</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Payment */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="font-display text-xl font-black text-white flex items-center gap-2">
            <CreditCard className="size-5 text-cyan-400" />
            <span>Step 4: Select Payment Method</span>
          </h2>

          <div className="space-y-3">
            <div
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                paymentMethod === 'upi'
                  ? 'bg-slate-900 border-cyan-400 ring-1 ring-cyan-400'
                  : 'bg-slate-900/50 border-white/10'
              }`}
            >
              <div>
                <h3 className="font-bold text-white text-sm">GPay / PhonePe / Paytm / UPI Instant</h3>
                <p className="text-xs text-slate-400">Direct UPI payment via Razorpay Payment Gateway</p>
              </div>
              {paymentMethod === 'upi' && <CheckCircle2 className="size-5 text-cyan-400" />}
            </div>

            <div
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                paymentMethod === 'card'
                  ? 'bg-slate-900 border-cyan-400 ring-1 ring-cyan-400'
                  : 'bg-slate-900/50 border-white/10'
              }`}
            >
              <div>
                <h3 className="font-bold text-white text-sm">Credit / Debit Card / Netbanking</h3>
                <p className="text-xs text-slate-400">Visa, Mastercard, RuPay & Netbanking</p>
              </div>
              {paymentMethod === 'card' && <CheckCircle2 className="size-5 text-cyan-400" />}
            </div>

            <div
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                paymentMethod === 'cod'
                  ? 'bg-slate-900 border-amber-400 ring-1 ring-amber-400'
                  : 'bg-slate-900/50 border-white/10'
              }`}
            >
              <div>
                <h3 className="font-bold text-amber-300 text-sm">Cash on Delivery (COD)</h3>
                <p className="text-xs text-slate-400">Pay cash or UPI upon ice-packed delivery</p>
              </div>
              {paymentMethod === 'cod' && <CheckCircle2 className="size-5 text-amber-400" />}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="w-1/3 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={handleFinalPlaceOrder}
              disabled={isProcessingPayment}
              className="w-2/3 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black font-display text-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {isProcessingPayment ? 'Creating Order & Verification...' : `Confirm & Pay ₹${totalAmount}`}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Confirmation */}
      {step === 5 && (
        <div className="py-12 text-center space-y-6 bg-slate-900 p-8 rounded-3xl border border-white/10">
          <div className="mx-auto size-20 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center ring-1 ring-emerald-500/40 animate-bounce">
            <CheckCircle2 className="size-12 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Order Placed Successfully</span>
            <h2 className="font-display text-3xl font-black text-white">TAKABATHE Order #{createdOrderId}</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your fish order has been routed to our Harbor Dispatch team. It will be hand-cut, ice-packed, and dispatched for your chosen slot.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={`/orders/${createdOrderId}`}
              className="px-6 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs hover:brightness-110"
            >
              Track Live Order Dispatch
            </Link>
            <Link
              to="/"
              className="px-6 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
