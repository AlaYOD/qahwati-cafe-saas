"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/actions/dashboard";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    getDashboardData().then((res) => setData(res));
  }, []);

  if (!mounted) return null;

  if (!data) return (
    <div className="p-8 w-full flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4 text-slate-400">
        <span className="material-symbols-outlined animate-spin text-4xl">refresh</span>
        <p className="font-medium animate-pulse">Loading Analytics Dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
            <span className="p-2 bg-primary/10 text-primary rounded-lg material-symbols-outlined">payments</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">${data.totalSales.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Orders</p>
            <span className="p-2 bg-primary/10 text-primary rounded-lg material-symbols-outlined">receipt_long</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">{data.totalOrdersCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Occupied Tables</p>
            <span className="p-2 bg-primary/10 text-primary rounded-lg material-symbols-outlined">chair</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span>{data.occupiedTablesCount}/{data.totalTablesCount}</span>
              {data.totalTablesCount > 0 && <span className="text-primary">{Math.round((data.occupiedTablesCount / data.totalTablesCount) * 100)}%</span>}
            </div>
            <div className="w-full bg-slate-200 dark:bg-primary/10 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: data.totalTablesCount > 0 ? `${(data.occupiedTablesCount / data.totalTablesCount) * 100}%` : '0%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Dashboard Live</p>
            <span className="p-2 bg-primary/10 text-primary rounded-lg material-symbols-outlined">analytics</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-emerald-600 flex items-center gap-2"><span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span> Updated</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-amber-500">local_fire_department</span> Top Selling Products</h3>
          <div className="space-y-6">
            {data.topProducts.map((p: any) => (
              <div key={p.id} className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-slate-100 dark:bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">{p.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.sold} overall sold</p>
                </div>
                <p className="text-sm font-bold text-primary">${p.revenue.toFixed(2)}</p>
              </div>
            ))}
            {data.topProducts.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">Not enough structured sales data yet.</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 p-6 rounded-xl shadow-sm overflow-x-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Recent Orders Floor Feed</h3>
            <span className="text-sm text-slate-400 font-medium">Real-time Stream</span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-primary/10">
                <th className="pb-4 font-semibold">Order Key</th>
                <th className="pb-4 font-semibold">Customer Name</th>
                <th className="pb-4 font-semibold">Items Preview</th>
                <th className="pb-4 font-semibold">Total Invoice</th>
                <th className="pb-4 font-semibold">Live State</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-slate-50 dark:border-primary/5 last:border-0 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                  <td className="py-4 font-medium text-slate-500 text-xs whitespace-nowrap">...{order.id.slice(-6)}</td>
                  <td className="py-4 font-medium">{order.customer_name || 'Anonymous Guest'}</td>
                  <td className="py-4 text-slate-500 text-xs max-w-[200px] truncate">
                     {order.order_items.map((oi:any) => oi.menu_item?.name || 'Item').join(', ') || 'No linked items'}
                  </td>
                  <td className="py-4 font-bold">${Number(order.total_amount).toFixed(2)}</td>
                  <td className="py-4">
                     {order.status === 'completed' && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase">Completed</span>}
                     {order.status === 'pending' && <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-[10px] font-bold uppercase">Occupied/Pending</span>}
                     {order.status === 'cancelled' && <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-[10px] font-bold uppercase">Cancelled</span>}
                  </td>
                </tr>
              ))}
              {data.recentOrders.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-8 text-center text-slate-400">No active invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
