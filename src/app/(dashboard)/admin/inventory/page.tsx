"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useState } from "react";
import { getInventoryData } from "@/actions/inventory";

export default function AdminInventoryPage() {
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
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-sm text-slate-500">Track raw materials, packaging, and stock levels.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-sm mr-2">add</span>Add Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 p-6 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><span className="material-symbols-outlined text-8xl">inventory</span></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Items tracked</p>
          <h3 className="text-3xl font-bold">{items.length}</h3>
        </div>

        <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 p-6 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><span className="material-symbols-outlined text-8xl">payments</span></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Inventory Valued At</p>
          <h3 className="text-3xl font-bold">${totalValue.toFixed(2)}</h3>
        </div>

        <div className="bg-white dark:bg-background-dark border border-red-200 dark:border-red-900/30 p-6 rounded-xl shadow-sm relative overflow-hidden group border-l-4 border-l-red-500">
           <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><span className="material-symbols-outlined text-8xl">warning</span></div>
           <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Low/Critical Stock</p>
           <h3 className="text-3xl font-bold text-red-500">{lowStockCount}</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-primary/20">
          <h2 className="text-lg font-bold">Current Stock Register</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-primary/5">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Item Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Unit</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">In Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Min</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Cost</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
              {items.map(item => {
                const qty = Number(item.quantity);
                const min = Number(item.min_level);
                let statusClasses = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
                let statusLabel = "Available";
                if (qty === 0) { statusClasses = "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300"; statusLabel = "Out of Stock"; }
                else if (qty <= min) { statusClasses = "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"; statusLabel = "Critical"; }
                else if (qty <= min * 1.5) { statusClasses = "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"; statusLabel = "Low Stock"; }

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{item.unit}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-center ${qty <= min && qty > 0 ? 'text-amber-500' : ''} ${qty === 0 ? 'text-red-500' : ''}`}>{qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{min}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">${Number(item.cost_per_unit).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${statusClasses}`}>{statusLabel}</span>
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
