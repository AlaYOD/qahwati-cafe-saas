"use client";

import { useEffect, useState } from "react";
import { getInventoryData } from "@/actions/inventory";

export default function ManagerAlertsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInventoryData()
      .then((data) => setItems(data as any[]))
      .finally(() => setLoading(false));
  }, []);

  const critical = items.filter((i) => Number(i.quantity) === 0);
  const low = items.filter((i) => Number(i.quantity) > 0 && Number(i.quantity) <= Number(i.min_level));
  const ok = items.filter((i) => Number(i.quantity) > Number(i.min_level));

  const alertItems = [
    ...critical.map((i) => ({ ...i, level: "critical" })),
    ...low.map((i) => ({ ...i, level: "low" })),
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Stock Alerts</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Items that need immediate attention</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400">cancel</span>
          </div>
          <div>
            <p className="text-2xl font-black text-red-600 dark:text-red-400">{critical.length}</p>
            <p className="text-xs text-red-500 font-semibold uppercase tracking-wider">Out of Stock</p>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">warning</span>
          </div>
          <div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{low.length}</p>
            <p className="text-xs text-amber-500 font-semibold uppercase tracking-wider">Low Stock</p>
          </div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">check_circle</span>
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{ok.length}</p>
            <p className="text-xs text-emerald-500 font-semibold uppercase tracking-wider">Adequate</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading...
        </div>
      ) : alertItems.length === 0 ? (
        <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-emerald-400 block mb-3">inventory_2</span>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">All Stock Levels OK</h3>
          <p className="text-sm text-slate-500">No alerts at this time. All items are above minimum levels.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider">
            Active Alerts ({alertItems.length})
          </h2>
          {alertItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-4 rounded-xl border ${
                item.level === "critical"
                  ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                  : "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
              }`}
            >
              <div className={`size-10 rounded-lg flex items-center justify-center flex-none ${
                item.level === "critical"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-amber-100 dark:bg-amber-900/30"
              }`}>
                <span className={`material-symbols-outlined text-sm ${
                  item.level === "critical" ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"
                }`}>
                  {item.level === "critical" ? "cancel" : "warning"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{item.name}</p>
                <p className="text-xs text-slate-500 capitalize">{item.category}</p>
              </div>
              <div className="text-right">
                <p className={`font-black text-lg ${item.level === "critical" ? "text-red-600" : "text-amber-600"}`}>
                  {Number(item.quantity).toFixed(1)} {item.unit}
                </p>
                <p className="text-xs text-slate-400">Min: {Number(item.min_level).toFixed(1)} {item.unit}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                item.level === "critical"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
              }`}>
                {item.level === "critical" ? "Out of Stock" : "Low Stock"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
