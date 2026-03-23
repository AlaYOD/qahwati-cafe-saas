"use client";

import { useEffect, useState } from "react";
import { getInventoryData } from "@/actions/inventory";
import { getAdminOrdersData } from "@/actions/orders";

export default function ManagerReportsPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getInventoryData(), getAdminOrdersData()])
      .then(([inv, ord]) => {
        setInventory(inv as any[]);
        setOrders(ord as any[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalInventoryValue = inventory.reduce(
    (sum, i) => sum + Number(i.quantity) * Number(i.cost_per_unit),
    0
  );
  const lowStockCount = inventory.filter(
    (i) => Number(i.quantity) <= Number(i.min_level)
  ).length;

  const completedOrders = orders.filter((o) => o.status === "completed");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  const categoryBreakdown = inventory.reduce((acc: Record<string, { count: number; value: number }>, item) => {
    if (!acc[item.category]) acc[item.category] = { count: 0, value: 0 };
    acc[item.category].count++;
    acc[item.category].value += Number(item.quantity) * Number(item.cost_per_unit);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Reports</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Inventory and operations summary</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Inventory Value", value: `$${totalInventoryValue.toFixed(2)}`, icon: "inventory_2", color: "text-primary" },
              { label: "Total Items Tracked", value: inventory.length, icon: "shelves", color: "text-blue-500" },
              { label: "Low Stock Items", value: lowStockCount, icon: "warning", color: "text-amber-500" },
              { label: "Completed Orders", value: completedOrders.length, icon: "check_circle", color: "text-emerald-500" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                </div>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-5">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">pie_chart</span>
                Inventory by Category
              </h2>
              {Object.keys(categoryBreakdown).length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">No data</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(categoryBreakdown)
                    .sort((a, b) => b[1].value - a[1].value)
                    .map(([cat, data]) => {
                      const pct = totalInventoryValue > 0 ? (data.value / totalInventoryValue) * 100 : 0;
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium capitalize text-slate-700 dark:text-slate-300">{cat}</span>
                            <span className="text-slate-500">${data.value.toFixed(2)} ({pct.toFixed(0)}%)</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-primary/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-5">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">trending_down</span>
                Critical Stock Items
              </h2>
              {inventory.filter((i) => Number(i.quantity) <= Number(i.min_level)).length === 0 ? (
                <div className="text-center py-6">
                  <span className="material-symbols-outlined text-3xl text-emerald-400 block mb-2">check_circle</span>
                  <p className="text-slate-400 text-sm">All items above minimum levels</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {inventory
                    .filter((i) => Number(i.quantity) <= Number(i.min_level))
                    .slice(0, 8)
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-primary/5 last:border-0">
                        <div>
                          <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{item.name}</p>
                          <p className="text-xs text-slate-400 capitalize">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-red-500">{Number(item.quantity).toFixed(1)} {item.unit}</p>
                          <p className="text-xs text-slate-400">Need: {Number(item.min_level).toFixed(1)}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
