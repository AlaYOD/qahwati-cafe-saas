"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { getAdminOrdersData } from "@/actions/orders";

export default function BaristaPerformancePage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminOrdersData()
      .then((data) => setOrders(data as any[]))
      .finally(() => setLoading(false));
  }, []);

  const completed = orders.filter((o) => o.status === "completed");
  const today = new Date();
  const todayOrders = completed.filter((o) => {
    const d = new Date(o.created_at);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekOrders = completed.filter((o) => new Date(o.created_at) >= weekStart);

  const avgItemsPerOrder = completed.length > 0
    ? completed.reduce((sum, o) => sum + (o.order_items?.length || 0), 0) / completed.length
    : 0;

  const productCount: Record<string, { name: string; count: number }> = {};
  completed.forEach((o) => {
    o.order_items?.forEach((item: any) => {
      const key = item.menu_item_id || "unknown";
      if (!productCount[key]) productCount[key] = { name: item.menu_item?.name || "Unknown", count: 0 };
      productCount[key].count += item.quantity;
    });
  });
  const topItems = Object.values(productCount).sort((a, b) => b.count - a.count).slice(0, 5);

  const dailyData: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { weekday: "short" });
    dailyData[key] = 0;
  }
  completed.forEach((o) => {
    const d = new Date(o.created_at);
    const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
    if (diff <= 6) {
      const key = d.toLocaleDateString("en-US", { weekday: "short" });
      if (key in dailyData) dailyData[key]++;
    }
  });
  const maxDaily = Math.max(...Object.values(dailyData), 1);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Performance</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Welcome back, <span className="text-primary font-semibold">{user?.full_name || "Barista"}</span> · Here's your overview
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Today's Orders", value: todayOrders.length, icon: "today", color: "text-primary" },
              { label: "This Week", value: weekOrders.length, icon: "calendar_view_week", color: "text-blue-500" },
              { label: "Total Completed", value: completed.length, icon: "check_circle", color: "text-emerald-500" },
              { label: "Avg Items/Order", value: avgItemsPerOrder.toFixed(1), icon: "format_list_numbered", color: "text-amber-500" },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-4">
                <span className={`material-symbols-outlined ${s.color} mb-2 block`}>{s.icon}</span>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-5">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">bar_chart</span>
                Orders — Last 7 Days
              </h2>
              <div className="flex items-end gap-2 h-32">
                {Object.entries(dailyData).map(([day, count]) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-primary">{count > 0 ? count : ""}</span>
                    <div className="w-full rounded-t-md bg-primary/20 relative" style={{ height: "80px" }}>
                      <div
                        className="w-full rounded-t-md bg-primary transition-all absolute bottom-0"
                        style={{ height: `${(count / maxDaily) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-5">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">star</span>
                Most Prepared Items
              </h2>
              {topItems.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {topItems.map((item, i) => {
                    const pct = topItems[0].count > 0 ? (item.count / topItems[0].count) * 100 : 0;
                    return (
                      <div key={item.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <span className={`size-5 rounded-full flex items-center justify-center text-xs font-black ${i === 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 dark:bg-primary/10 text-slate-500"}`}>
                              {i + 1}
                            </span>
                            {item.name}
                          </span>
                          <span className="text-slate-500">{item.count}×</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-primary/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
