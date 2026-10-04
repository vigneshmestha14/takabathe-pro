import React from 'react';

export type CategoryType = 'fish' | 'masala' | 'combo' | 'recipes';

interface CategoryFilterProps {
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory
}) => {
  return (
    <div className="mt-3 flex gap-2 px-4">
      
      <button
        onClick={() => onSelectCategory('fish')}
        className={`flex-1 rounded-full py-2.5 font-display text-sm font-semibold transition-all ${
          activeCategory === 'fish'
            ? 'bg-[#e05638] text-white ring-1 ring-[#e05638] shadow-sm'
            : 'bg-white/75 text-[#0e2a33] ring-1 ring-[#0e2a33]/10 backdrop-blur-xl hover:bg-white'
        }`}
      >
        Fish cuts
      </button>

      <button
        onClick={() => onSelectCategory('masala')}
        className={`flex-1 rounded-full py-2.5 font-display text-sm font-semibold transition-all ${
          activeCategory === 'masala'
            ? 'bg-[#e05638] text-white ring-1 ring-[#e05638] shadow-sm'
            : 'bg-white/75 text-[#0e2a33] ring-1 ring-[#0e2a33]/10 backdrop-blur-xl hover:bg-white'
        }`}
      >
        Fish masala
      </button>

      <button
        onClick={() => onSelectCategory('combo')}
        className={`flex-1 rounded-full py-2.5 font-display text-sm font-semibold transition-all ${
          activeCategory === 'combo'
            ? 'bg-[#e05638] text-white ring-1 ring-[#e05638] shadow-sm'
            : 'bg-white/75 text-[#0e2a33] ring-1 ring-[#0e2a33]/10 backdrop-blur-xl hover:bg-white'
        }`}
      >
        Combos
      </button>

    </div>
  );
};
