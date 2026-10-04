import React from 'react';
import { Anchor, ShieldCheck, Heart, MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 w-full border-t border-slate-800/80 bg-slate-950/80 pt-12 pb-8 px-4 text-xs text-slate-400">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Col 1: Brand info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40">
              <Anchor className="size-5" />
            </div>
            <span className="font-display text-xl font-extrabold text-slate-100">TAKABATHE</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Fresh coastal fish delivered directly from daily morning harbor landings. Scaled, cleaned, hand-cut, and weighed to exact 500g steps.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="size-4" />
            <span>FSSAI Certified Coastal Quality</span>
          </div>
        </div>

        {/* Col 2: Harbor Ports */}
        <div>
          <h4 className="font-display text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">
            Daily Harbor Sourcing
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><MapPin className="size-3.5 text-cyan-400" /> Malpe Deep Sea Harbor</li>
            <li className="flex items-center gap-2"><MapPin className="size-3.5 text-cyan-400" /> Mangalore Old Port</li>
            <li className="flex items-center gap-2"><MapPin className="size-3.5 text-cyan-400" /> Kundapur Estuary</li>
            <li className="flex items-center gap-2"><MapPin className="size-3.5 text-cyan-400" /> Honnavar Coastal Dock</li>
            <li className="flex items-center gap-2"><MapPin className="size-3.5 text-cyan-400" /> Karwar Coral Reef</li>
          </ul>
        </div>

        {/* Col 3: Customer Care & Slots */}
        <div>
          <h4 className="font-display text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">
            Delivery Slots & Support
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><Clock className="size-3.5 text-amber-400" /> Morning: 7:00 AM - 9:00 AM</li>
            <li className="flex items-center gap-2"><Clock className="size-3.5 text-amber-400" /> Afternoon: 12:00 PM - 2:00 PM</li>
            <li className="flex items-center gap-2"><Phone className="size-3.5 text-teal-400" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail className="size-3.5 text-teal-400" /> fresh@takabathe.com</li>
          </ul>
        </div>

        {/* Col 4: Freshness Promise */}
        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-white/10 space-y-2">
          <h4 className="font-display text-sm font-bold text-cyan-300">100% Ice-Packed Guarantee</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Every order is cleaned, prepped, and sealed inside an insulated ice box maintained at 1.5°C to preserve harbor-fresh texture & flavor.
          </p>
        </div>

      </div>

      <div className="mx-auto max-w-6xl pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>© 2026 TAKABATHE Fresh Fish Delivery. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart className="size-3 text-rose-500 fill-rose-500" /> for Coastal Seafood Lovers
        </p>
      </div>
    </footer>
  );
};
