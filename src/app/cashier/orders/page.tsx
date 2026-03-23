"use client";

import { useEffect, useState } from "react";
import { getAdminOrdersData } from "@/actions/orders";

const STATUS_CONFIG: Record<string, { label: string; classes: string; dot: string }> = {
  pending: { label: "Pending", classes: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-500" },
  completed: { label: "Completed", classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", dot: "bg-emerald-500" },
  cancelled: { label: "Cancelled", classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", dot: "bg-red-500" },
};

export default function CashierOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getAdminOrdersData()
      .then((data) => setOrders(data as any[]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-6 space-y-6">
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

      <div className="flex gap-2 flex-wrap">
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
          <p className="text-slate-400">No orders found</p>
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
  );
}
