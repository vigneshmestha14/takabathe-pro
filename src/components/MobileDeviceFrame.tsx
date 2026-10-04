import React from 'react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#e6ebf0] font-body text-[#0e2a33]">
      
      {/* Background Radial Glow Blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-24 -left-16 size-72 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute top-40 -right-24 size-64 rounded-full bg-[#e05638]/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-64 rounded-full bg-emerald-200/20 blur-3xl" />
      </div>

      {/* Main Centered 440px Mobile Shell Container */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[440px] flex-col pb-28 shadow-xl bg-[#e6ebf0]/90">
        {children}
      </div>

    </div>
  );
};
