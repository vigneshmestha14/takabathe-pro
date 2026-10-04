import React from 'react';
import { UserCheck, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  user: { name: string; phone: string } | null;
  onOpenAuth: () => void;
  onOpenOwnerPortal: () => void;
  hasActiveOrder: boolean;
  onOpenTrackingModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAuth,
  onOpenOwnerPortal,
  hasActiveOrder,
  onOpenTrackingModal
}) => {
  return (
    <header className="sticky top-0 z-30 px-4 pt-4">
      <div className="relative overflow-hidden rounded-[22px] bg-white/75 px-4 pt-4 pb-3 ring-1 ring-[#0e2a33]/10 backdrop-blur-2xl shadow-sm">
        
        <div className="relative flex items-center justify-between">
          
          {/* Brand Logo & Tagline */}
          <a href="/" className="block cursor-pointer">
            <h1 className="font-display text-[30px] leading-none font-extrabold tracking-tight text-[#e05638]">
              TAKABATHE
            </h1>
            <p className="mt-1 text-[11px] font-medium tracking-wide text-[#0e2a33]/60 uppercase">
              Fresh fish, per KG
            </p>
          </a>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Live Order Tracker */}
            {hasActiveOrder && (
              <button
                onClick={onOpenTrackingModal}
                className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-500/30 animate-pulse"
              >
                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                Track
              </button>
            )}

            {/* Auth / Login */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-3 py-2 rounded-full bg-white text-[11px] font-semibold text-[#0e2a33] ring-1 ring-[#0e2a33]/15 shadow-2xs hover:bg-slate-50 transition-all"
            >
              <UserCheck className="size-3.5 text-[#e05638]" />
              <span>{user ? user.name.split(' ')[0] : 'Log in'}</span>
            </button>

            {/* Owner Portal for Vignesh */}
            <button
              onClick={onOpenOwnerPortal}
              title="Owner Portal (Vignesh)"
              className="flex items-center gap-1 px-3 py-2 rounded-full bg-[#0e2a33] text-[11px] font-semibold text-white ring-1 ring-[#0e2a33] shadow-2xs hover:bg-[#183e4b] transition-all"
            >
              <ShieldCheck className="size-3.5 text-amber-400" />
              <span>Owner</span>
            </button>

          </div>

        </div>

      </div>
    </header>
  );
};
