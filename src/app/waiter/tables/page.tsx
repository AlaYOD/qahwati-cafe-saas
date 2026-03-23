"use client";

import { useEffect, useState, useCallback } from "react";
import { getAdminTablesData } from "@/actions/tables";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; bg: string; dot: string; border: string }> = {
  available: { label: "Available", bg: "bg-emerald-50 dark:bg-emerald-900/10", dot: "bg-emerald-500", border: "border-emerald-200 dark:border-emerald-800" },
  occupied: { label: "Occupied", bg: "bg-amber-50 dark:bg-amber-900/10", dot: "bg-amber-500", border: "border-amber-200 dark:border-amber-800" },
  reserved: { label: "Reserved", bg: "bg-blue-50 dark:bg-blue-900/10", dot: "bg-blue-500", border: "border-blue-200 dark:border-blue-800" },
};

export default function WaiterTablesPage() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterZone, setFilterZone] = useState("all");

  const load = useCallback(() => {
    getAdminTablesData()
      .then((data) => setTables(data as any[]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const zones = ["all", ...Array.from(new Set(tables.map((t) => t.zone)))];
  const filtered = filterZone === "all" ? tables : tables.filter((t) => t.zone === filterZone);

  const available = tables.filter((t) => t.status === "available").length;
  const occupied = tables.filter((t) => t.status === "occupied").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Table Map</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time table status · Auto-refreshes every 30s</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/waiter/new-order"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span> New Order
          </Link>
          <button onClick={load} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Tables", value: tables.length, color: "text-primary" },
          { label: "Available", value: available, color: "text-emerald-500" },
          { label: "Occupied", value: occupied, color: "text-amber-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {zones.map((z) => (
          <button
            key={z}
            onClick={() => setFilterZone(z)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
              filterZone === z
                ? "bg-primary text-white"
                : "bg-white dark:bg-primary/10 border border-primary/20 text-slate-600 dark:text-slate-400 hover:bg-primary/5"
            }`}
          >
            {z}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading tables...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((table) => {
            const sc = STATUS_CONFIG[table.status] || STATUS_CONFIG.available;
            const activeOrder = table.orders?.[0];
            return (
              <div key={table.id} className={`border-2 ${sc.border} ${sc.bg} rounded-2xl p-4 flex flex-col gap-3`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-black text-lg text-slate-900 dark:text-slate-100">{table.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{table.zone} · {table.capacity} seats</p>
                  </div>
                  <div className={`size-3 rounded-full ${sc.dot} mt-1`}></div>
                </div>

                <div className="flex-1">
                  {activeOrder ? (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Active Order:</p>
                      <p className="font-mono text-xs text-primary font-bold">#{activeOrder.id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-slate-500">
                        {activeOrder.order_items?.length || 0} items · ${Number(activeOrder.total_amount || 0).toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No active order</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    table.status === "available" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    table.status === "occupied" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}>
                    {sc.label}
                  </span>
                  {table.status === "available" && (
                    <Link
                      href={`/waiter/new-order?table=${table.id}`}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-xs">add</span> Order
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
