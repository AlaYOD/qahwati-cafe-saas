import React, { useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { usePOSStore } from '../../store/pos';

export function MenuGrid() {
  const { menuItems, activeCategory, searchQuery, fetchInitialData, isLoading, addToCart } = usePOSStore();
  
  useEffect(() => {
    fetchInitialData();
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category_id === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4 custom-scrollbar">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((product) => (
          <div 
            key={product.id} 
            onClick={() => addToCart(product)}
            className={`bg-white border rounded-2xl p-3 cursor-pointer group transition-all duration-200 border-slate-200 hover:border-primary/50 hover:shadow-sm`}
          >
            <div className="aspect-square rounded-xl bg-slate-100 mb-4 overflow-hidden relative">
              <img 
                src={product.image_url || "https://placehold.co/400x400/png"} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <h3 className="font-bold text-[15px] mb-2 text-slate-900 truncate">
              {product.name}
            </h3>
            
            <div className="flex justify-between items-center">
              <span className="text-primary font-bold text-base">
                ${Number(product.price).toFixed(2)}
              </span>
              
              {!product.is_available ? (
                <span className="text-[10px] bg-red-100 px-2.5 py-1 rounded-full text-red-600 font-semibold uppercase tracking-wider">
                  Out
                </span>
              ) : (
                <span className="text-[10px] bg-primary/10 px-2.5 py-1 rounded-full text-primary font-semibold uppercase tracking-wider">
                  Select
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
