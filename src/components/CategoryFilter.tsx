import React from 'react';
import { Fish, Sparkles, Flame, BookOpen, Layers } from 'lucide-react';

export type CategoryType = 'all' | 'fish' | 'masala' | 'combo' | 'recipes';

interface CategoryFilterProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  counts: Record<CategoryType, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  counts
}) => {
  const tabs: { id: CategoryType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Catch', icon: <Layers className="size-4" /> },
    { id: 'fish', label: 'Fish Cuts (per KG)', icon: <Fish className="size-4" /> },
    { id: 'masala', label: 'Fish Masalas', icon: <Flame className="size-4" /> },
    { id: 'combo', label: 'Combo Packs', icon: <Sparkles className="size-4" /> },
    { id: 'recipes', label: 'Chef Recipes', icon: <BookOpen className="size-4" /> }
  ];

  return (
    <div className="w-full px-4 mb-6">
      <div className="mx-auto max-w-6xl flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-display text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400'
                  : 'bg-slate-900/60 text-slate-300 ring-1 ring-white/10 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {counts[tab.id] !== undefined && (
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {counts[tab.id]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
