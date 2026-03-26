"use client";

import { useEffect, useState } from "react";
import { getInventoryData } from "@/actions/inventory";
import { getCashOutAlerts } from "@/actions/shifts";

export default function ManagerAlertsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [cashOuts, setCashOuts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getInventoryData(), getCashOutAlerts()])
      .then(([invData, cashData]) => {
        setItems(invData as any[]);
        setCashOuts(cashData as any[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const critical = items.filter((i) => Number(i.quantity) === 0);
  const low = items.filter((i) => Number(i.quantity) > 0 && Number(i.quantity) <= Number(i.min_level));

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 italic">System Alerts</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest font-bold">Monitor critical events and low stock</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cash-Out Alerts Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500">payments</span>
              Cash-Out Events
            </h2>
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold uppercase">Recent 20</span>
          </div>

          {loading ? (
             <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
               <span className="material-symbols-outlined animate-spin text-slate-400">refresh</span>
             </div>
          ) : cashOuts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-center px-6">
              <span className="material-symbols-outlined text-3xl text-slate-300 mb-2">check_circle</span>
              <p className="text-sm text-slate-500 font-medium">No recent cash-out activities found from any registers.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {cashOuts.map((co) => (
                <div key={co.id} className="bg-white dark:bg-background border border-slate-200 dark:border-primary/20 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
                        <span className="material-symbols-outlined text-rose-500 group-hover:text-white text-sm">logout</span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">SAR {Number(co.amount).toFixed(2)}</p>
                        <p className="text-[10px] text-slate-500 dark:text-primary/60 font-bold uppercase tracking-wider">
                          By {co.shift?.profile?.full_name}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] font-medium text-slate-400">
                      {new Date(co.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="pl-[52px]">
                    <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-lg">
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium italic underline decoration-slate-200 underline-offset-4 line-clamp-2">
                        {co.description || "No reason provided"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory Alerts Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">inventory_2</span>
              Stock Alerts
            </h2>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase">{critical.length} Critical</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold uppercase">{low.length} Low</span>
            </div>
          </div>

          {loading ? (
             <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
               <span className="material-symbols-outlined animate-spin text-slate-400">refresh</span>
             </div>
          ) : critical.length === 0 && low.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-center px-6">
              <span className="material-symbols-outlined text-3xl text-emerald-400 mb-2">check_circle</span>
              <p className="text-sm text-slate-500 font-medium">All stock levels are within safe operating margins.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {[...critical, ...low].map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border bg-white dark:bg-background shadow-sm hover:shadow-md transition-all ${
                    critical.includes(item)
                      ? "border-red-200 dark:border-red-900/40"
                      : "border-amber-200 dark:border-amber-900/40"
                  }`}
                >
                  <div className={`size-10 rounded-xl flex items-center justify-center flex-none ${
                    critical.includes(item)
                      ? "bg-red-50 dark:bg-red-500/10"
                      : "bg-amber-50 dark:bg-amber-500/10"
                  }`}>
                    <span className={`material-symbols-outlined text-sm ${
                      critical.includes(item) ? "text-red-600" : "text-amber-600"
                    }`}>
                      {critical.includes(item) ? "cancel" : "warning"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-slate-900 dark:text-slate-100 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-sm ${critical.includes(item) ? "text-red-600 font-black italic" : "text-amber-600"}`}>
                      {Number(item.quantity).toFixed(0)} {item.unit}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">MIN: {Number(item.min_level).toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
