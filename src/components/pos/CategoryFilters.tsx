import React from 'react';
import { Sparkles, Coffee, Box, ChevronRight } from 'lucide-react';
import { usePOSStore } from '../../store/pos';

export function CategoryFilters() {
  const { categories, activeCategory, setActiveCategory } = usePOSStore();
  
  return (
    <div className="bg-white border-b border-slate-200 p-4">
      <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
        <button 
          onClick={() => setActiveCategory('all')}
          className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
            activeCategory === 'all' 
              ? 'bg-primary text-white shadow-md shadow-primary/20 ring-2 ring-primary ring-offset-2' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Sparkles className={`size-4 ${activeCategory === 'all' ? 'text-primary-foreground/90' : 'text-slate-400'}`} />
          All Items
        </button>
        
        {categories.map((category) => (
          <button 
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
              activeCategory === category.id 
                ? 'bg-primary text-white shadow-md shadow-primary/20 ring-2 ring-primary ring-offset-2' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Coffee className={`size-4 ${activeCategory === category.id ? 'text-primary-foreground/90' : 'text-slate-400'}`} />
            {category.name}
          </button>
        ))}

        <div className="ml-auto pl-2 flex items-center">
          <button className="flex items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
