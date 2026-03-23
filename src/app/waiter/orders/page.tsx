"use client";

import { useEffect, useState, useCallback } from "react";
import { getAdminOrdersData, updateOrderStatus } from "@/actions/orders";

export default function WaiterOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(() => {
    getAdminOrdersData()
      .then((data) => {
        const active = (data as any[]).filter((o) => o.status === "pending");
        setOrders(active);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const handleCancel = async (orderId: string) => {
    if (!confirm("Cancel this order?")) return;
    setUpdating(orderId);
    await updateOrderStatus(orderId, "cancelled");
    setUpdating(null);
    load();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Active Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All pending table orders · Auto-refreshes every 30s</p>
        </div>
        <button onClick={load} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors">
          <span className="material-symbols-outlined text-sm">refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-2xl p-16 text-center">
          <span className="material-symbols-outlined text-6xl text-emerald-400 block mb-4">room_service</span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">No Active Orders</h3>
          <p className="text-slate-500">All tables are clear right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl overflow-hidden">
              <div className="flex items-center gap-4 px-4 py-3 border-b border-primary/10">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-mono font-black text-primary">#{order.id.slice(-6).toUpperCase()}</p>
                    <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">Pending</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {order.table?.name || order.customer_name || "Walk-in"} · {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <p className="font-black text-lg text-slate-900 dark:text-slate-100">
                  ${Number(order.total_amount).toFixed(2)}
                </p>
                <button
                  onClick={() => handleCancel(order.id)}
                  disabled={updating === order.id}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors disabled:opacity-50"
                  title="Cancel order"
                >
                  <span className="material-symbols-outlined text-sm">cancel</span>
                </button>
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-2">
                {order.order_items?.map((item: any) => (
                  <span key={item.id} className="text-xs bg-slate-100 dark:bg-primary/10 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg font-medium">
                    {item.quantity}× {item.menu_item?.name || "?"}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
