"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useState } from "react";
import { getPosData } from "@/actions/pos";
import { usePosCart } from "@/lib/store/use-pos-cart";

export default function POSOrderScreen() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<{ categories: any[], menuItems: any[], tables: any[] } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { state, dispatch, derived } = usePosCart();

  useEffect(() => {
    setMounted(true);
    getPosData().then(setData).catch(console.error);
  }, []);

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
        <section className="w-[60%] flex flex-col border-r border-primary/10 bg-slate-50 dark:bg-background-dark">
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
        </section>

        <section className="w-[40%] flex flex-col bg-white dark:bg-background-dark/30 border-l border-primary/10">
          <div className="px-6 py-5 border-b border-primary/10 flex justify-between items-center bg-background-light dark:bg-background-dark">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-primary material-symbols-outlined text-lg">table_restaurant</span>
                <select 
                  className="font-bold text-lg bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                  value={state.tableId || ""}
                  onChange={(e) => dispatch({ type: 'SET_TABLE', payload: e.target.value || null })}
                >
                  <option value="" className="text-slate-900">Select Table</option>
                  {data?.tables.map(t => (
                    <option key={t.id} value={t.id} className="text-slate-900">{t.name}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500 font-medium">Auto Cart System</p>
            </div>
            <button onClick={() => dispatch({type: 'CLEAR_CART'})} className="text-primary font-bold text-xs uppercase tracking-wider hover:underline flex items-center gap-1">
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
            <button disabled={state.items.length === 0} className="w-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
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
