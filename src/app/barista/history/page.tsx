"use client";

import { useEffect, useState } from "react";
import { getAdminOrdersData } from "@/actions/orders";

export default function BaristaHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminOrdersData()
      .then((data) => {
        const done = (data as any[]).filter((o) => o.status === "completed" || o.status === "cancelled");
        setOrders(done);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const id = o.id.slice(-6).toUpperCase();
    return id.includes(search.toUpperCase()) || (o.table?.name || "").toLowerCase().includes(search.toLowerCase());
  });

  const todayCount = orders.filter((o) => {
    const d = new Date(o.created_at);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Order History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Previously completed and cancelled orders</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: orders.length, color: "text-primary" },
          { label: "Today", value: todayCount, color: "text-blue-500" },
          { label: "Completed", value: orders.filter(o => o.status === "completed").length, color: "text-emerald-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID or table..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-primary/5 border border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">history</span>
          <p className="text-slate-400">No history found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/10 bg-slate-50 dark:bg-primary/10">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Order</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Items</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Time</th>
                <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-mono font-bold text-primary">#{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-slate-400">{order.table?.name || order.customer_name || "Walk-in"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {order.order_items?.map((i: any) => `${i.quantity}× ${i.menu_item?.name || "?"}`)
                        .join(", ") || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    <p>{new Date(order.created_at).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      order.status === "completed"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      <span className={`size-1.5 rounded-full ${order.status === "completed" ? "bg-emerald-500" : "bg-red-500"}`}></span>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
