"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useState } from "react";
import { getInventoryData } from "@/actions/inventory";
import { cn } from "@/lib/utils";

export default function CashierInventoryPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    getInventoryData().then(setItems).catch(console.error);
  }, []);

  if (!mounted) return null;

  const totalValue = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.cost_per_unit)), 0);
  const lowStockCount = items.filter(i => Number(i.quantity) <= Number(i.min_level)).length;

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-end bg-white dark:bg-background border border-slate-200 dark:border-primary/10 p-8 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-navy-800 dark:text-white uppercase tracking-tight">Inventory Control</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Logistics & raw material tracking.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center justify-center px-6 py-2.5 rounded-pill bg-primary text-white hover:bg-primary/90 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[18px] mr-2">add_box</span>Add Stock Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <InventoryStat 
           label="Global Stock Units" 
           value={items.length} 
           icon="inventory" 
           color="text-navy-800 dark:text-white"
        />
        <InventoryStat 
           label="Vault Valuation" 
           value={`$${totalValue.toLocaleString()}`} 
           icon="account_balance_wallet" 
           color="text-primary"
        />
        <InventoryStat 
           label="Critical Alerts" 
           value={lowStockCount} 
           icon="warning" 
           color="text-red-500"
           isWarning={lowStockCount > 0}
        />
      </div>

      <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-200 dark:border-primary/10 flex justify-between items-center">
          <h2 className="text-lg font-black text-navy-800 dark:text-white uppercase tracking-tight">Material Registry</h2>
          <div className="flex gap-2 bg-slate-50 dark:bg-primary/5 p-1 rounded-pill">
             <button className="px-4 py-1.5 bg-white dark:bg-primary rounded-pill text-[10px] font-black uppercase text-primary dark:text-white shadow-sm">Full list</button>
             <button className="px-4 py-1.5 text-[10px] font-black uppercase text-slate-400">Low Stock</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-primary/5">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">In Stock</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Unit</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Cost Basis</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
              {items.map(item => {
                const qty = Number(item.quantity);
                const min = Number(item.min_level);
                let statusClasses = "bg-primary/10 text-primary border-primary/20";
                let statusLabel = "Available";
                if (qty === 0) { statusClasses = "bg-slate-100 text-slate-400 border-slate-200"; statusLabel = "Empty"; }
                else if (qty <= min) { statusClasses = "bg-red-500 text-white shadow-lg shadow-red-500/20"; statusLabel = "Crit-Stock"; }

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-primary/5 transition-all group">
                    <td className="px-8 py-5">
                       <span className="font-bold text-navy-800 dark:text-white text-sm group-hover:text-primary transition-colors">{item.name}</span>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
                    </td>
                    <td className={`px-8 py-5 text-center font-black text-sm ${qty <= min ? 'text-red-500' : 'text-navy-800 dark:text-white'}`}>{qty}</td>
                    <td className="px-8 py-5 text-center text-xs font-bold text-slate-500">{item.unit}</td>
                    <td className="px-8 py-5 text-right">
                       <span className="font-black text-sm text-navy-800 dark:text-white">${Number(item.cost_per_unit).toFixed(2)}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-pill text-[9px] border font-black uppercase tracking-tighter ${statusClasses}`}>{statusLabel}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InventoryStat({ label, value, icon, color, isWarning }: any) {
  return (
    <div className={`bg-white dark:bg-background border ${isWarning ? 'border-red-500/30' : 'border-slate-200 dark:border-primary/10'} p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden`}>
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <span className="material-symbols-outlined text-6xl">{icon}</span>
      </div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 font-display">{label}</p>
      <h3 className={cn("text-3xl font-black tracking-tight", color)}>{value}</h3>
      <div className="mt-4 flex items-center gap-2">
         <div className={cn("h-1 flex-grow rounded-full bg-slate-100 dark:bg-primary/5 overflow-hidden")}>
            <div className={cn("h-full transition-all duration-1000", isWarning ? 'bg-red-500 w-1/4 animate-pulse' : 'bg-primary w-2/3')}></div>
         </div>
      </div>
    </div>
  );
}
