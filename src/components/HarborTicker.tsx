import React from 'react';

export const HarborTicker: React.FC = () => {
  return (
    <div className="px-4 mt-4 mb-2">
      <div className="relative overflow-hidden rounded-[20px] bg-[#0e2a33] px-5 py-4 text-[#e2e8f0] ring-1 ring-[#0e2a33] shadow-md">
        <p className="relative font-display text-lg leading-tight font-semibold">
          Morning catch, on ice
        </p>
        <p className="relative mt-0.5 text-[13px] text-white/75">
          Hand-cut today. Weighed to the 500g. ⚓ Landed 4:30 AM at Malpe Harbor.
        </p>
      </div>
    </div>
  );
};
