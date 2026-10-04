import React from 'react';

interface MobileBottomNavProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  cartTotal,
  onOpenCart
}) => {
  if (cartCount === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div className="mx-auto flex max-w-[440px] items-center justify-between rounded-[18px] bg-[#0e2a33] px-4 py-3 text-[#e2e8f0] ring-1 ring-[#0e2a33] shadow-[0_8px_24px_rgba(14,42,51,.35)]">
        
        {/* Left Cart Counter & Price */}
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-[#e05638] font-display text-sm font-bold text-white">
            {cartCount}
          </span>
          <div>
            <p className="text-[11px] tracking-wide text-white/65 uppercase font-medium">
              Cart total
            </p>
            <p className="font-display text-lg leading-none font-bold text-white">
              ₹{cartTotal}
            </p>
          </div>
        </div>

        {/* View Cart Button */}
        <button
          onClick={onOpenCart}
          className="rounded-full bg-[#e05638] px-5 py-2.5 font-display text-sm font-semibold text-white ring-1 ring-[#e05638] active:scale-95 hover:bg-[#c9472b] transition-all"
        >
          View cart
        </button>

      </div>
    </div>
  );
};
