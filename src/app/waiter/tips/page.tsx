"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { getAdminOrdersData } from "@/actions/orders";

export default function WaiterTipsPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipRate, setTipRate] = useState(10);

  useEffect(() => {
    getAdminOrdersData()
      .then((data) => {
        const mine = (data as any[]).filter((o) => o.status === "completed" && o.user_id === user?.id);
        setOrders(mine);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const estimatedTips = (totalRevenue * tipRate) / 100;

  const today = new Date();
  const todayOrders = orders.filter((o) => {
    const d = new Date(o.created_at);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });
  const todayRevenue = todayOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekOrders = orders.filter((o) => new Date(o.created_at) >= weekStart);
  const weekRevenue = weekOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">My Tips</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Tip estimates based on orders served by <span className="text-primary font-semibold">{user?.full_name || "you"}</span>
        </p>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Tip Rate Estimate</p>
          <div className="flex items-center gap-2">
            {[5, 10, 15, 20].map((rate) => (
              <button
                key={rate}
                onClick={() => setTipRate(rate)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  tipRate === rate ? "bg-primary text-white" : "bg-white dark:bg-primary/10 text-primary border border-primary/20"
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>
        <p className="text-4xl font-black text-primary">${estimatedTips.toFixed(2)}</p>
        <p className="text-sm text-slate-500 mt-1">Estimated total tips ({tipRate}% of ${totalRevenue.toFixed(2)})</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Today's Orders", value: todayOrders.length, sub: `$${((todayRevenue * tipRate) / 100).toFixed(2)} est. tips`, color: "text-primary" },
              { label: "This Week", value: weekOrders.length, sub: `$${((weekRevenue * tipRate) / 100).toFixed(2)} est. tips`, color: "text-blue-500" },
              { label: "All Time", value: orders.length, sub: `$${totalRevenue.toFixed(2)} revenue`, color: "text-emerald-500" },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className={`text-2xl font-black ${s.color}`}>{s.value} orders</p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{s.label}</p>
                <p className="text-xs text-primary mt-2 font-medium">{s.sub}</p>
              </div>
            ))}
          </div>

          {orders.length === 0 ? (
            <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">payments</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">No Orders Yet</h3>
              <p className="text-sm text-slate-500">Orders you serve will appear here once completed.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-primary/10 bg-slate-50 dark:bg-primary/10">
                <h2 className="font-bold text-sm text-slate-700 dark:text-slate-300">Recent Orders Served</h2>
              </div>
              <div className="divide-y divide-primary/5">
                {orders.slice(0, 20).map((order) => (
                  <div key={order.id} className="flex items-center gap-4 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs font-bold text-primary">#{order.id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-slate-500">{order.table?.name || "Walk-in"} · {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100">${Number(order.total_amount).toFixed(2)}</p>
                      <p className="text-xs text-primary">+${((Number(order.total_amount) * tipRate) / 100).toFixed(2)} tip</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
