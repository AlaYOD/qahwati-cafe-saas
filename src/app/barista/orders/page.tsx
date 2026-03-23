"use client";

import { useEffect, useState, useCallback } from "react";
import { getAdminOrdersData, updateOrderStatus } from "@/actions/orders";

export default function BaristaOrdersPage() {
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [tab, setTab] = useState<"queue" | "history">("queue");
  const [search, setSearch] = useState("");
  const [tableFilter, setTableFilter] = useState("all");

  const load = useCallback(() => {
    getAdminOrdersData()
      .then((data) => setAllOrders(data as any[]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const markReady = async (orderId: string) => {
    setUpdating(orderId);
    await updateOrderStatus(orderId, "completed");
    setUpdating(null);
    load();
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins === 1) return "1 min ago";
    return `${mins} mins ago`;
  };

  const urgencyClass = (dateStr: string) => {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (mins >= 15) return "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/10";
    if (mins >= 8) return "border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/10";
    return "border-primary/20 bg-white dark:bg-primary/5";
  };

  const pending = allOrders.filter((o) => o.status === "pending");

  const historyBase = allOrders.filter((o) => o.status === "completed" || o.status === "cancelled");

  // Unique tables for dropdown
  const tables = Array.from(
    new Map(
      historyBase
        .filter((o) => o.table)
        .map((o) => [o.table.id, o.table])
    ).values()
  ).sort((a: any, b: any) => a.name.localeCompare(b.name));

  const historyOrders = historyBase.filter((o) => {
    const matchTable =
      tableFilter === "all"
        ? true
        : tableFilter === "walkin"
        ? !o.table
        : o.table?.id === tableFilter;

    const matchSearch = (() => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const id = o.id.slice(-6).toUpperCase();
      const tableName = (o.table?.name || o.customer_name || "").toLowerCase();
      // smart: bare number "3" matches "table 3", "t3", "3"
      const numOnly = search.replace(/\D/g, "");
      const tableNum = numOnly
        ? tableName.includes(numOnly)
        : false;
      return id.includes(search.toUpperCase()) || tableName.includes(q) || tableNum;
    })();

    return matchTable && matchSearch;
  });

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Queue & history · Auto-refreshes every 30s</p>
        </div>
        <div className="flex items-center gap-3">
          {tab === "queue" && (
            <div className={`flex items-center gap-2 text-sm font-semibold ${pending.length > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
              <span className={`size-2.5 rounded-full animate-pulse ${pending.length > 0 ? "bg-amber-500" : "bg-emerald-500"}`} />
              {pending.length} pending
            </div>
          )}
          <button onClick={load} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
            <span className="material-symbols-outlined text-sm">refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-primary/10 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab("queue")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === "queue"
              ? "bg-white dark:bg-background-dark shadow-sm text-slate-900 dark:text-slate-100"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
          }`}
        >
          <span className="material-symbols-outlined text-sm">coffee_maker</span>
          Queue
          {pending.length > 0 && (
            <span className="size-5 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center">
              {pending.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("history")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === "history"
              ? "bg-white dark:bg-background-dark shadow-sm text-slate-900 dark:text-slate-100"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
          }`}
        >
          <span className="material-symbols-outlined text-sm">history</span>
          History
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading orders...
        </div>
      ) : tab === "queue" ? (
        /* ── QUEUE TAB ── */
        pending.length === 0 ? (
          <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-2xl p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-emerald-400 block mb-4">check_circle</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">All Caught Up!</h3>
            <p className="text-slate-500">No pending orders at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {pending.map((order) => (
              <div
                key={order.id}
                className={`border-2 rounded-2xl overflow-hidden transition-all ${urgencyClass(order.created_at)}`}
              >
                <div className="px-4 py-3 border-b border-inherit flex items-center justify-between">
                  <div>
                    <p className="font-mono font-black text-lg text-primary">#{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-slate-500">{order.table?.name || order.customer_name || "Walk-in"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500">{timeAgo(order.created_at)}</p>
                    <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>

                <div className="px-4 py-3 space-y-2 min-h-[100px]">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <span className="size-6 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center flex-none">
                        {item.quantity}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {item.menu_item?.name || "Unknown Item"}
                        </p>
                        {item.menu_item?.category?.name && (
                          <p className="text-xs text-slate-400">{item.menu_item.category.name}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-inherit flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">
                    {order.order_items?.length || 0} item{order.order_items?.length !== 1 ? "s" : ""} ·{" "}
                    <span className="font-semibold">${Number(order.total_amount).toFixed(2)}</span>
                  </p>
                  <button
                    onClick={() => markReady(order.id)}
                    disabled={updating === order.id}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    {updating === order.id ? (
                      <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                    ) : (
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                    )}
                    Mark Ready
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* ── HISTORY TAB ── */
        <div className="space-y-4">
          <div className="flex gap-3">
            {/* Table filter dropdown */}
            <div className="relative flex-none">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-sm">table_restaurant</span>
              </span>
              <select
                value={tableFilter}
                onChange={(e) => setTableFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-white dark:bg-primary/5 border border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer min-w-[150px]"
              >
                <option value="all">All Tables</option>
                <option value="walkin">Walk-in</option>
                {(tables as any[]).map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-xs">expand_more</span>
              </span>
            </div>

            {/* Order ID search */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-sm">tag</span>
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Order ID or table number..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-primary/5 border border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
          </div>

          {historyOrders.length === 0 ? (
            <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 block mb-3">history</span>
              <p className="text-slate-400">
                {tableFilter !== "all" || search ? "No orders match your filters" : "No completed orders yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {historyOrders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl overflow-hidden">
                  <div className="flex items-start gap-4 px-4 py-3">
                    <div className={`size-9 rounded-lg flex items-center justify-center flex-none mt-0.5 ${
                      order.status === "completed"
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}>
                      <span className={`material-symbols-outlined text-sm ${
                        order.status === "completed" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                      }`}>
                        {order.status === "completed" ? "check_circle" : "cancel"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-mono font-black text-primary">#{order.id.slice(-6).toUpperCase()}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          order.status === "completed"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-slate-400 ml-auto">
                          {new Date(order.created_at).toLocaleDateString()} · {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {order.table?.name || order.customer_name || "Walk-in"}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {order.order_items?.map((item: any) => (
                          <span
                            key={item.id}
                            className="inline-flex items-center gap-1 text-xs bg-slate-100 dark:bg-primary/10 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg"
                          >
                            <span className="font-black text-primary">{item.quantity}×</span>
                            {item.menu_item?.name || "Unknown"}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right flex-none">
                      <p className="font-black text-slate-900 dark:text-slate-100">${Number(order.total_amount).toFixed(2)}</p>
                      <p className="text-xs text-slate-400 capitalize mt-0.5">{order.payment_method || "—"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
