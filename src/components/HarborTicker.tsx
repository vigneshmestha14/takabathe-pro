import React from 'react';
import { ShieldCheck, Snowflake, MapPin, Clock, Scale } from 'lucide-react';

export const HarborTicker: React.FC = () => {
  return (
    <div className="w-full px-4 my-4">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-teal-950/80 p-4 ring-1 ring-cyan-500/20 backdrop-blur-xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Main Tagline */}
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30">
              <Snowflake className="size-5 animate-spin" style={{ animationDuration: '12s' }} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-100 flex items-center gap-2">
                Morning Catch, On Crushed Ice
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                  100% Fresh • Never Frozen
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct from Malpe & Mangalore deep sea trawlers. Hand-cut & weighed to exact 500g increments.
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 ring-1 ring-white/10">
              <MapPin className="size-3.5 text-cyan-400" />
              <span>Malpe Deep Sea Harbor</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 ring-1 ring-white/10">
              <Clock className="size-3.5 text-amber-400" />
              <span>Catch of 4:30 AM Today</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 ring-1 ring-white/10">
              <Scale className="size-3.5 text-teal-400" />
              <span>Weighed to 500g Precision</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 ring-1 ring-white/10">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              <span>FSSAI Certified Fresh</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
