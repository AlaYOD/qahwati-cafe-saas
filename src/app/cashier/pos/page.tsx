"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useState, useRef } from "react";
import { getPosData } from "@/actions/pos";
import { usePosCart } from "@/lib/store/use-pos-cart";

export default function POSOrderScreen() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<{ categories: any[], menuItems: any[], tables: any[] } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { state, dispatch, derived } = usePosCart();
  const [orderInitialized, setOrderInitialized] = useState(false);

  // Table picker
  const [tablePickerOpen, setTablePickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    getPosData().then(setData).catch(console.error);
  }, []);

  // Close picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setTablePickerOpen(false);
      }
    };
    if (tablePickerOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [tablePickerOpen]);

  const selectedTableName = data?.tables.find(t => t.id === state.tableId)?.name;

  const handleClearOrder = () => {
    dispatch({ type: 'CLEAR_CART' });
    setOrderInitialized(false);
  };

  const handleSelectTableInit = (tableId: string | null) => {
    dispatch({ type: 'SET_TABLE', payload: tableId });
    setOrderInitialized(true);
  };

  if (!mounted) return null;

  const filteredItems = data?.menuItems.filter(
    (item) => activeCategory === "all" || item.category_id === activeCategory
  ) || [];

  const addToCart = (item: any) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: 1,
        modifiers: [],
        imageUrl: item.image_url,
      }
    });
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <header className="flex items-center justify-between px-6 py-3 border-b border-primary/20 bg-background-light dark:bg-background-dark/50 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">local_cafe</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Qahwati <span className="text-primary">POS</span></h1>
          </div>
          <div className="relative w-64 hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
            </div>
            <input className="block w-full pl-10 pr-3 py-2 bg-slate-200/50 dark:bg-primary/10 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary placeholder-slate-500" placeholder="Search menu items..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg bg-slate-200 dark:bg-primary/10 hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <button className="p-2 rounded-lg bg-slate-200 dark:bg-primary/10 hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
          <div className="h-8 w-[1px] bg-primary/20 mx-2"></div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold capitalize">{user?.full_name || "Staff"}</p>
              <p className="text-[10px] text-primary capitalize">{user?.role || "Cashier"}</p>
            </div>
            <div
              className="size-9 rounded-full bg-primary/30 flex items-center justify-center border border-primary/50 overflow-hidden bg-cover"
              style={{ backgroundImage: user?.avatar_url ? `url('${user.avatar_url}')` : undefined }}
            >
              {!user?.avatar_url && <span className="material-symbols-outlined text-sm m-auto text-primary">person</span>}
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <section className="w-[60%] flex flex-col border-r border-primary/10 bg-slate-50 dark:bg-background-dark relative">
          {!orderInitialized ? (
            <div className="absolute inset-0 z-10 bg-slate-50 dark:bg-background-dark overflow-y-auto p-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-[#393332] [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="mb-8">
                <h2 className="text-3xl font-black mb-2 tracking-tight">Select Table</h2>
                <p className="text-slate-500 font-medium">Please assign a table or select takeaway to start a new order.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <button
                  onClick={() => handleSelectTableInit(null)}
                  className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-primary bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform group"
                >
                  <span className="material-symbols-outlined text-5xl mb-4 group-hover:animate-bounce">shopping_bag</span>
                  <p className="font-bold text-xl mb-1">Takeaway</p>
                  <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Walk-in</p>
                </button>

                {data?.tables.map(t => {
                   const isOccupied = t.status === 'occupied';
                   const isReserved = t.status === 'reserved';
                   const statusColor = isOccupied ? 'bg-amber-400' : isReserved ? 'bg-red-400' : 'bg-emerald-400';

                   return (
                     <button
                       key={t.id}
                       onClick={() => handleSelectTableInit(t.id)}
                       className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all active:scale-95"
                     >
                       <div className="relative mb-4">
                         <span className="material-symbols-outlined text-[56px] text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors">chair</span>
                         <span className={`absolute top-0 -right-2 size-4 rounded-full ${statusColor} border-[3px] border-white dark:border-background-dark`}></span>
                       </div>
                       <p className="font-black text-xl text-slate-800 dark:text-slate-200 leading-tight">{t.name}</p>
                       <p className="text-slate-500 text-xs mt-1.5 font-bold uppercase tracking-wider">{t.capacity} seats</p>
                     </button>
                   );
                })}
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 pt-6 border-t border-slate-200 dark:border-primary/10">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-bold"><span className="size-3 rounded-full bg-emerald-400"></span> Available</div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-bold"><span className="size-3 rounded-full bg-amber-400"></span> Occupied</div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-bold"><span className="size-3 rounded-full bg-red-400"></span> Reserved</div>
              </div>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar">
                <button 
                  onClick={() => setActiveCategory("all")}
                  className={`flex-none px-6 py-2 rounded-full font-medium text-sm transition-shadow ${activeCategory === "all" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white dark:bg-primary/10 border border-primary/20 text-slate-600 dark:text-slate-300 hover:bg-primary/5 transition-colors"}`}
                >
                  All Items
                </button>
                {data?.categories.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={`flex-none px-6 py-2 rounded-full font-medium text-sm transition-shadow ${activeCategory === c.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white dark:bg-primary/10 border border-primary/20 text-slate-600 dark:text-slate-300 hover:bg-primary/5 transition-colors"}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-[#393332] [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredItems.map(item => (
                    <div key={item.id} onClick={() => addToCart(item)} className="bg-white dark:bg-primary/5 border border-primary/10 rounded-xl p-3 hover:border-primary transition-all cursor-pointer group">
                      <div className="aspect-square rounded-lg bg-slate-200 dark:bg-primary/10 mb-3 overflow-hidden">
                        {item.image_url ? (
                          <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={item.name} src={item.image_url}/>
                        ) : ( 
                          <span className="material-symbols-outlined text-4xl text-primary/30 w-full h-full flex items-center justify-center">local_cafe</span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm mb-1 truncate">{item.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-primary font-bold">${Number(item.price).toFixed(2)}</span>
                        <span className="text-[10px] bg-primary/20 px-2 py-0.5 rounded-full text-primary">Add</span>
                      </div>
                    </div>
                  ))}
                  {!data && (
                    <div className="col-span-fulltext-center py-10 opacity-50 flex flex-col items-center">
                      <span className="material-symbols-outlined animate-spin mb-2">refresh</span> Loading database items...
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>

        <section className="w-[40%] flex flex-col bg-white dark:bg-background-dark/30 border-l border-primary/10">
          <div className="px-6 py-5 border-b border-primary/10 flex justify-between items-center bg-background-light dark:bg-background-dark">
            <div className="relative" ref={pickerRef}>
              {/* Trigger Button */}
              <button
                onClick={() => setTablePickerOpen(!tablePickerOpen)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all ${
                  state.tableId
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark hover:border-primary/40'
                }`}
              >
                <div className={`size-8 rounded-lg flex items-center justify-center ${state.tableId ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-primary/10 text-primary'}`}>
                  <span className="material-symbols-outlined text-lg">
                    {state.tableId ? 'chair' : 'table_restaurant'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm leading-tight">
                    {state.tableId ? selectedTableName : 'Select Table'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {state.tableId ? 'Dine-in Order' : 'Tap to assign table'}
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-lg ml-1">
                  {tablePickerOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Popover Dropdown */}
              {tablePickerOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-primary/10 bg-slate-50 dark:bg-primary/5">
                    <p className="font-bold text-sm text-slate-700 dark:text-slate-300">Assign to Table</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Select a table or choose takeaway</p>
                  </div>

                  {/* Takeaway Option */}
                  <div className="px-3 pt-3 pb-1">
                    <button
                      onClick={() => { dispatch({ type: 'SET_TABLE', payload: null }); setTablePickerOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                        !state.tableId
                          ? 'bg-primary text-white shadow-md shadow-primary/20'
                          : 'hover:bg-slate-50 dark:hover:bg-primary/5 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className={`size-9 rounded-lg flex items-center justify-center ${!state.tableId ? 'bg-white/20' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'}`}>
                        <span className="material-symbols-outlined text-lg">shopping_bag</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm">Takeaway</p>
                        <p className={`text-[10px] ${!state.tableId ? 'text-white/70' : 'text-slate-400'}`}>No table — walk-in order</p>
                      </div>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="px-4 py-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tables</p>
                  </div>

                  {/* Table Grid */}
                  <div className="px-3 pb-3 grid grid-cols-3 gap-2 max-h-52 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {data?.tables.map(t => {
                      const isSelected = state.tableId === t.id;
                      const isOccupied = t.status === 'occupied';
                      const isReserved = t.status === 'reserved';
                      const statusColor = isOccupied ? 'bg-amber-400' : isReserved ? 'bg-red-400' : 'bg-emerald-400';

                      return (
                        <button
                          key={t.id}
                          onClick={() => { dispatch({ type: 'SET_TABLE', payload: t.id }); setTablePickerOpen(false); }}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all text-center ${
                            isSelected
                              ? 'border-primary bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                              : 'border-slate-100 dark:border-primary/10 hover:border-primary/40 hover:bg-primary/5'
                          }`}
                        >
                          <div className="relative mb-1.5">
                            <span className={`material-symbols-outlined text-2xl ${isSelected ? '' : 'text-slate-400 dark:text-slate-500'}`}>
                              chair
                            </span>
                            <span className={`absolute -top-0.5 -right-0.5 size-2.5 rounded-full ${statusColor} border-2 ${isSelected ? 'border-primary' : 'border-white dark:border-background-dark'}`}></span>
                          </div>
                          <p className="font-black text-xs leading-tight">{t.name}</p>
                          <p className={`text-[9px] mt-0.5 ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                            {t.capacity} seats · {t.zone || 'main'}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="px-4 py-2 border-t border-slate-100 dark:border-primary/10 flex gap-4 justify-center">
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                      <span className="size-2 rounded-full bg-emerald-400"></span> Available
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                      <span className="size-2 rounded-full bg-amber-400"></span> Occupied
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                      <span className="size-2 rounded-full bg-red-400"></span> Reserved
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button onClick={handleClearOrder} className="text-primary font-bold text-xs uppercase tracking-wider hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">delete</span> Clear Order
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-[#393332] [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="space-y-4">
              {state.items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="size-16 rounded-lg overflow-hidden flex-none bg-slate-100 flex items-center justify-center">
                    {item.imageUrl ? <img className="w-full h-full object-cover" src={item.imageUrl} /> : <span className="material-symbols-outlined text-primary/50">local_cafe</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                      <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 bg-slate-100 dark:bg-primary/10 rounded-lg px-2 py-1">
                        <button onClick={() => {
                          if (item.quantity > 1) { dispatch({type: 'UPDATE_QUANTITY', payload: {id: item.id, quantity: item.quantity - 1}}) }
                          else { dispatch({type: 'REMOVE_ITEM', payload: item.id})}
                        }} className="size-6 flex items-center justify-center bg-white dark:bg-primary/20 rounded shadow-sm hover:bg-primary/30 text-primary transition-colors">
                          <span className="material-symbols-outlined text-[10px]">remove</span>
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => dispatch({type: 'UPDATE_QUANTITY', payload: {id: item.id, quantity: item.quantity + 1}})} className="size-6 flex items-center justify-center bg-white dark:bg-primary/20 rounded shadow-sm hover:bg-primary/30 text-primary transition-colors">
                          <span className="material-symbols-outlined text-[10px]">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {state.items.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20 px-4 text-center">
                  <span className="material-symbols-outlined text-6xl mb-4 opacity-20">shopping_cart</span>
                  <p>Cart is empty. Tap on an item to add it.</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-background-dark border-t border-primary/20">
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>${derived.subtotal.toFixed(2)}</span>
              </div>
              {derived.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Discount</span>
                  <span className="text-emerald-500">-${derived.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-slate-500">
                <span>Tax ({(state.taxRate * 100).toFixed(0)}%)</span>
                <span>${derived.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-primary/10">
                <span className="font-bold text-lg">Grand Total</span>
                <span className="font-bold text-2xl text-primary">${derived.grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handleClearOrder} disabled={state.items.length === 0} className="w-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
              <span className="material-symbols-outlined">payments</span>
              Pay & Close Order
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-background-light dark:bg-background-dark/80 px-6 py-2 border-t border-primary/10 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500"></span> Terminal Active
          </div>
        </div>
        <div suppressHydrationWarning>
           {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </footer>
    </div>
  );
}
