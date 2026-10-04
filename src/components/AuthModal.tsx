import React, { useState } from 'react';
import { X, Phone, ShieldCheck, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; phone: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    setIsSendingOtp(true);

    setTimeout(() => {
      setIsSendingOtp(false);
      setStep('otp');
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleFillDemoOtp = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setErrorMsg('Please enter 6-digit OTP code');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setStep('success');
      setTimeout(() => {
        onLoginSuccess({
          name: name.trim() || 'Coastal Foodie',
          phone: `+91 ${phone}`
        });
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-3xl glass-panel p-6 shadow-2xl ring-1 ring-white/10">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-slate-900/80 text-slate-400 hover:text-white"
        >
          <X className="size-5" />
        </button>

        {/* Step 1: Enter Phone Number */}
        {step === 'phone' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="grid size-11 place-items-center rounded-2xl bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/30">
                <Phone className="size-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-extrabold text-slate-100">Login / Register</h3>
                <p className="text-xs text-slate-400">Enter mobile number for instant SMS OTP verification</p>
              </div>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vignesh Mestha"
                  className="w-full rounded-xl bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 ring-1 ring-white/10 outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Number (+91)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full rounded-xl bg-slate-900/90 pl-12 pr-4 py-2.5 text-sm font-semibold tracking-wider text-slate-100 placeholder:text-slate-500 ring-1 ring-white/10 outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 p-2 rounded-lg ring-1 ring-rose-500/20">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 py-3.5 font-display text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-500/25 active:scale-98 transition-all hover:brightness-110 disabled:opacity-60"
              >
                {isSendingOtp ? 'Sending OTP SMS...' : 'Get OTP Code'}
                <ArrowRight className="size-4" />
              </button>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center pt-2">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>100% Free OTP SMS Verification</span>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: OTP Verification Pin Screen */}
        {step === 'otp' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="grid size-11 place-items-center rounded-2xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">
                <KeyRound className="size-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-extrabold text-slate-100">Verify Mobile OTP</h3>
                <p className="text-xs text-slate-400">Enter 6-digit code sent to +91 {phone}</p>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex justify-between gap-2 my-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="size-12 rounded-xl bg-slate-900/90 text-center text-lg font-bold text-cyan-300 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleFillDemoOtp}
                  className="font-bold text-cyan-400 hover:underline"
                >
                  ⚡ Auto-fill Demo OTP (123456)
                </button>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-slate-400 hover:text-white"
                >
                  Change Number
                </button>
              </div>

              {errorMsg && (
                <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 p-2 rounded-lg ring-1 ring-rose-500/20">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 py-3.5 font-display text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-500/25 active:scale-98 transition-all hover:brightness-110 disabled:opacity-60"
              >
                {isVerifying ? 'Verifying OTP...' : 'Verify & Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Verified Success */}
        {step === 'success' && (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30 animate-bounce">
              <CheckCircle2 className="size-10 stroke-[2.5]" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-100">Mobile Number Verified!</h3>
            <p className="text-xs text-slate-400">Welcome to TAKABATHE Fresh Fish Delivery.</p>
          </div>
        )}

      </div>
    </div>
  );
};
