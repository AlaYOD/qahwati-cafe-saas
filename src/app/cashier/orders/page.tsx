"use client";

import { useEffect, useState } from "react";
import { getAdminOrdersData } from "@/actions/orders";
import { getPosData } from "@/actions/pos";

const STATUS_CONFIG: Record<string, { label: string; classes: string; dot: string }> = {
  pending: { label: "Pending", classes: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-500" },
  completed: { label: "Completed", classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", dot: "bg-emerald-500" },
  cancelled: { label: "Cancelled", classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", dot: "bg-red-500" },
};

export default function CashierOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Table filtering states
  const [selectedTable, setSelectedTable] = useState<string>("all");
  const [tableSearch, setTableSearch] = useState("");

  useEffect(() => {
    Promise.all([
      getAdminOrdersData(),
      getPosData()
    ])
      .then(([ordersData, posData]) => {
        setOrders(ordersData as any[]);
        setTables((posData as any).tables);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    
    if (selectedTable !== "all") {
      if (selectedTable === "takeaway" && o.table_id !== null) return false;
      if (selectedTable !== "takeaway" && o.table_id !== selectedTable) return false;
    }
    
    return true;
  });

  const searchedTables = tables.filter(t => 
    t.name.toLowerCase().includes(tableSearch.toLowerCase()) || 
    (t.zone && t.zone.toLowerCase().includes(tableSearch.toLowerCase()))
  );

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Left Pane: Orders List */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View and manage all orders</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: orders.length, color: "text-primary" },
            { label: "Completed", value: orders.filter(o => o.status === "completed").length, color: "text-emerald-500" },
            { label: "Pending", value: orders.filter(o => o.status === "pending").length, color: "text-amber-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap mb-2">
          {["all", "pending", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                filter === s
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-primary/10 border border-primary/20 text-slate-600 dark:text-slate-400 hover:bg-primary/5"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading orders...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 block mb-3">receipt_long</span>
            <p className="text-slate-400">No orders found for the active filters</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((order) => {
              const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const isOpen = expanded === order.id;
              const createdAt = new Date(order.created_at);
              return (
                <div key={order.id} className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
                      <div>
                        <p className="font-mono text-xs font-bold text-primary">#{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {order.table?.name || order.customer_name || "Walk-in"}
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs text-slate-500">{createdAt.toLocaleDateString()}</p>
                        <p className="text-xs text-slate-400">{createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.classes}`}>
                          <span className={`size-1.5 rounded-full ${sc.dot}`}></span>
                          {sc.label}
                        </span>
                      </div>
                      <div className="text-right sm:text-left">
                        <p className="font-bold text-slate-900 dark:text-slate-100">${Number(order.total_amount).toFixed(2)}</p>
                        <p className="text-xs text-slate-400 capitalize">{order.payment_method || "—"}</p>
                      </div>
                    </div>
                    <span className={`material-symbols-outlined text-slate-400 text-sm transition-transform ${isOpen ? "rotate-180" : ""}`}>
                      expand_more
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-primary/10">
                      <div className="mt-3 space-y-2">
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">
                              {item.quantity}× {item.menu_item?.name || "Unknown Item"}
                            </span>
                            <span className="font-medium">${(Number(item.unit_price) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-primary/10">
                          <span>Total</span>
                          <span className="text-primary">${Number(order.total_amount).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Pane: Table Selection Filter */}
      <div className="w-full lg:w-80 bg-slate-50 dark:bg-background-dark/30 border-t lg:border-t-0 lg:border-l border-primary/10 flex flex-col h-[50vh] lg:h-auto shrink-0">
        <div className="p-4 border-b border-primary/10 bg-white dark:bg-background-dark/50">
          <h2 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">filter_list</span>
            Order Location
          </h2>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input 
              type="text" 
              placeholder="Search tables..." 
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-primary/5 border border-transparent focus:border-primary/50 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full">
          {/* Default Options */}
          {tableSearch === "" && (
            <>
              <button
                onClick={() => setSelectedTable("all")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  selectedTable === "all"
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                    : "bg-white dark:bg-primary/5 border-slate-200 dark:border-primary/10 hover:border-primary/40 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className={`size-8 rounded-lg flex items-center justify-center ${selectedTable === "all" ? "bg-white/20" : "bg-primary/10 text-primary"}`}>
                  <span className="material-symbols-outlined text-[18px]">apps</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">All Orders</p>
                  <p className={`text-[10px] ${selectedTable === "all" ? "text-white/70" : "text-slate-400"}`}>Any table & takeaway</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedTable("takeaway")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  selectedTable === "takeaway"
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                    : "bg-white dark:bg-primary/5 border-slate-200 dark:border-primary/10 hover:border-primary/40 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className={`size-8 rounded-lg flex items-center justify-center ${selectedTable === "takeaway" ? "bg-white/20" : "bg-primary/10 text-primary"}`}>
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Takeaway</p>
                  <p className={`text-[10px] ${selectedTable === "takeaway" ? "text-white/70" : "text-slate-400"}`}>Walk-in orders</p>
                </div>
              </button>
              
              <div className="px-2 pt-3 pb-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Physical Tables</p>
              </div>
            </>
          )}

          {/* Searched Tables */}
          {searchedTables.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-6">No tables found.</p>
          ) : (
            searchedTables.map(t => {
              const isSelected = selectedTable === t.id;
              const isOccupied = t.status === 'occupied';
              const isReserved = t.status === 'reserved';
              const statusColor = isOccupied ? 'bg-amber-400' : isReserved ? 'bg-red-400' : 'bg-emerald-400';
              
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTable(t.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                      : "bg-white dark:bg-primary/5 border-slate-200 dark:border-primary/10 hover:border-primary/40 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`size-8 rounded-lg flex items-center justify-center ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-primary/10 text-slate-400"}`}>
                        <span className="material-symbols-outlined text-[18px]">chair</span>
                      </div>
                      <span className={`absolute -top-1 -right-1 size-2.5 rounded-full ${statusColor} border-2 ${isSelected ? "border-primary" : "border-white dark:border-background-dark"}`}></span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className={`text-[10px] ${isSelected ? "text-white/70" : "text-slate-400"}`}>{t.capacity} seats · {t.zone || "main"}</p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
