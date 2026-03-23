"use client";

import { useEffect, useState } from "react";
import { getInventoryData } from "@/actions/inventory";

export default function ManagerInventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    getInventoryData()
      .then((data) => setItems(data as any[]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...Array.from(new Set(items.map((i) => i.category)))];

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || item.category === filterCategory;
    return matchSearch && matchCat;
  });

  const lowStock = items.filter((i) => Number(i.quantity) <= Number(i.min_level));
  const totalValue = items.reduce((sum, i) => sum + Number(i.quantity) * Number(i.cost_per_unit), 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Inventory</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor stock levels and item details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Items</p>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{items.length}</p>
        </div>
        <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Low Stock Alerts</p>
          <p className="text-3xl font-black text-red-500">{lowStock.length}</p>
        </div>
        <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Value</p>
          <p className="text-3xl font-black text-primary">${totalValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-primary/5 border border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-primary/5 border border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {categories.map((c) => (
            <option key={c} value={c} className="text-slate-900">
              {c === "all" ? "All Categories" : c}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 bg-slate-50 dark:bg-primary/10">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Item</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Category</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Qty</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Min Level</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Unit Cost</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Total</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  <span className="material-symbols-outlined animate-spin block mx-auto mb-2">refresh</span>
                  Loading inventory...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">No items found</td>
              </tr>
            )}
            {filtered.map((item) => {
              const isLow = Number(item.quantity) <= Number(item.min_level);
              const total = Number(item.quantity) * Number(item.cost_per_unit);
              return (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
                  <td className="px-4 py-3 text-slate-500 capitalize">{item.category}</td>
                  <td className="px-4 py-3 text-right font-semibold">{Number(item.quantity).toFixed(1)} {item.unit}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{Number(item.min_level).toFixed(1)} {item.unit}</td>
                  <td className="px-4 py-3 text-right text-slate-500">${Number(item.cost_per_unit).toFixed(3)}</td>
                  <td className="px-4 py-3 text-right font-semibold">${total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isLow
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    }`}>
                      <span className={`size-1.5 rounded-full ${isLow ? "bg-red-500" : "bg-emerald-500"}`}></span>
                      {isLow ? "Low Stock" : "OK"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
