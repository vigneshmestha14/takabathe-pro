import React, { useState } from 'react';
import { X, QrCode, CreditCard, Banknote, ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPaymentSuccess: (paymentInfo: { method: string; transactionId: string }) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  onPaymentSuccess
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const txnId = `TXN${Math.floor(10000000 + Math.random() * 90000000)}`;

      setTimeout(() => {
        onPaymentSuccess({
          method: paymentMethod.toUpperCase(),
          transactionId: txnId
        });
        setIsSuccess(false);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg rounded-3xl glass-panel p-6 shadow-2xl ring-1 ring-white/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-slate-900/80 text-slate-400 hover:text-white"
        >
          <X className="size-5" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-emerald-400" />
                  <h3 className="font-display text-xl font-bold text-slate-100">TAKABATHE Secure Payment</h3>
                </div>
                <p className="text-xs text-slate-400">100% Encrypted Payment Gateway</p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 font-semibold block">Total Payable</span>
                <span className="font-display text-2xl font-extrabold text-cyan-300">₹{totalAmount}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="my-4 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center justify-center gap-1.5 rounded-xl p-3 text-xs font-bold transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400'
                    : 'bg-slate-900/60 text-slate-400 ring-1 ring-white/10 hover:bg-slate-800'
                }`}
              >
                <QrCode className="size-4 text-emerald-400" /> UPI / QR
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-center gap-1.5 rounded-xl p-3 text-xs font-bold transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400'
                    : 'bg-slate-900/60 text-slate-400 ring-1 ring-white/10 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="size-4 text-cyan-400" /> Card
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-center justify-center gap-1.5 rounded-xl p-3 text-xs font-bold transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400'
                    : 'bg-slate-900/60 text-slate-400 ring-1 ring-white/10 hover:bg-slate-800'
                }`}
              >
                <Banknote className="size-4 text-amber-400" /> Pay on Delivery
              </button>
            </div>

            <form onSubmit={handlePayNow} className="space-y-4">
              
              {/* Option 1: UPI Options */}
              {paymentMethod === 'upi' && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-300">Choose Instant UPI App:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUpiApp('gpay')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        upiApp === 'gpay'
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                          : 'border-white/10 bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      🔵 Google Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiApp('phonepe')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        upiApp === 'phonepe'
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                          : 'border-white/10 bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      🟣 PhonePe
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiApp('paytm')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        upiApp === 'paytm'
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                          : 'border-white/10 bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      🔷 Paytm UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiApp('qr')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        upiApp === 'qr'
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                          : 'border-white/10 bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      📱 Scan QR Code
                    </button>
                  </div>

                  {upiApp === 'qr' && (
                    <div className="py-4 text-center rounded-2xl bg-white p-4 max-w-[200px] mx-auto shadow-xl">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=takabathe@upi&pn=TAKABATHE%20FRESH%20FISH"
                        alt="UPI QR Code"
                        className="mx-auto size-40"
                      />
                      <span className="block mt-2 text-[10px] font-bold text-slate-900">
                        Scan with GPay / PhonePe / Paytm
                      </span>
                    </div>
                  )}

                  <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-white/10 text-xs text-slate-300 flex justify-between items-center">
                    <span>UPI VPA ID:</span>
                    <span className="font-mono font-bold text-cyan-300">takabathe@upi</span>
                  </div>
                </div>
              )}

              {/* Option 2: Card */}
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={16}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8910"
                      className="w-full rounded-xl bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-100 ring-1 ring-white/10 outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="08/28"
                        className="w-full rounded-xl bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-100 ring-1 ring-white/10 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full rounded-xl bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-100 ring-1 ring-white/10 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Option 3: COD */}
              {paymentMethod === 'cod' && (
                <div className="rounded-2xl bg-amber-500/10 p-4 ring-1 ring-amber-500/30 space-y-2 text-xs text-amber-300">
                  <h4 className="font-bold text-sm">Pay Cash on Delivery</h4>
                  <p>Hand cash to our express delivery partner when your insulated ice box arrives at your doorstep.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 py-3.5 font-display text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-98 transition-all hover:brightness-110 disabled:opacity-60"
              >
                {isProcessing ? 'Processing Secure Payment...' : `Complete Payment of ₹${totalAmount}`}
                <ArrowRight className="size-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>256-Bit SSL Encrypted Payment Safety</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30 animate-bounce">
              <CheckCircle2 className="size-10 stroke-[2.5]" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-100">Payment Successful!</h3>
            <p className="text-xs text-slate-400">Order confirmed. Dispatching from Malpe Harbor.</p>
          </div>
        )}

      </div>
    </div>
  );
};
