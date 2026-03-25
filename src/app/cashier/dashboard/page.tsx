"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/actions/dashboard";
import { cn } from "@/lib/utils";

export default function CashierDashboardPage() {
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
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        <p className="font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Analytics...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${data.totalSales.toFixed(2)}`} 
          icon="payments" 
          color="bg-primary/10 text-primary border-primary/20"
          trend="+8% vs avg"
        />
        <StatCard 
          title="Daily Orders" 
          value={data.totalOrdersCount} 
          icon="receipt_long" 
          color="bg-navy-800/10 text-navy-800 dark:bg-navy-800/20 dark:text-navy-800 border-navy-800/10"
          trend="Steady flow"
        />
        <StatCard 
          title="Occupied Tables" 
          value={`${data.occupiedTablesCount}/${data.totalTablesCount}`} 
          icon="chair" 
          color="bg-emerald-500/10 text-emerald-600 border-emerald-500/10"
          trend={`${data.totalTablesCount > 0 ? Math.round((data.occupiedTablesCount / data.totalTablesCount) * 100) : 0}% capacity`}
        />
        <StatCard 
          title="System Status" 
          value="Online" 
          icon="analytics" 
          color="bg-amber-500/10 text-amber-600 border-amber-500/10"
          trend="Live Sync Active"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Products */}
        <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 p-8 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
             <h3 className="font-black text-lg text-navy-800 dark:text-white uppercase tracking-tight">Best Sellers</h3>
             <span className="material-symbols-outlined text-primary">trending_up</span>
          </div>
          <div className="space-y-6">
            {data.topProducts.map((p: any) => (
              <div key={p.id} className="flex items-center gap-4 group cursor-default">
                <div className="size-12 rounded-xl bg-slate-50 dark:bg-primary/5 flex items-center justify-center border border-slate-100 dark:border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-sm">{p.icon || 'local_cafe'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{p.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.sold} orders</p>
                </div>
                <p className="text-sm font-black text-navy-800 dark:text-white">${p.revenue.toFixed(2)}</p>
              </div>
            ))}
            {data.topProducts.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6 font-bold uppercase tracking-widest italic opacity-50">Discovery phase active...</p>
            )}
          </div>
          <button className="w-full mt-8 py-3 rounded-pill border border-slate-200 dark:border-primary/20 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-primary/5 transition-all">Full Inventory</button>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-navy-800 dark:bg-navy-900 rounded-2xl p-8 shadow-xl border border-navy-800/10 text-white flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
               <h3 className="font-black text-lg uppercase tracking-tight">Live Order Stream</h3>
               <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1 italic">Real-time performance metrics</p>
            </div>
            <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-pill text-[10px] font-black uppercase tracking-widest transition-all">Filter</button>
          </div>
          
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left">
              <thead>
                <tr className="text-white/30 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                  <th className="pb-4">Reference</th>
                  <th className="pb-4">Client</th>
                  <th className="pb-4">Items</th>
                  <th className="pb-4 text-right">Total</th>
                  <th className="pb-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                    <td className="py-4 font-bold text-[10px] text-primary">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 font-bold truncate max-w-[120px]">{order.customer_name || 'Guest'}</td>
                    <td className="py-4 text-white/50 text-xs max-w-[180px] truncate">
                       {order.order_items.map((oi:any) => oi.menu_item?.name || 'Item').join(', ') || 'Processing...'}
                    </td>
                    <td className="py-4 font-black text-right">${Number(order.total_amount).toFixed(2)}</td>
                    <td className="py-4 text-center">
                       {order.status === 'completed' && <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-pill text-[9px] font-black uppercase tracking-tighter">Paid</span>}
                       {order.status === 'pending' && <span className="px-3 py-1 bg-primary/20 text-primary rounded-pill text-[9px] font-black uppercase tracking-tighter">Active</span>}
                       {order.status === 'cancelled' && <span className="px-3 py-1 bg-white/10 text-white/40 rounded-pill text-[9px] font-black uppercase tracking-tighter">Void</span>}
                    </td>
                  </tr>
                ))}
                {data.recentOrders.length === 0 && (
                  <tr>
                     <td colSpan={5} className="py-12 text-center text-white/20 font-bold uppercase tracking-widest text-xs italic">Awaiting floor activity...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  return (
    <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group active:scale-[0.98]">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-xl transition-transform duration-300 group-hover:scale-110", color)}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Constructify Sync</span>
      </div>
      <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</h3>
      <div className="text-2xl font-black text-navy-800 dark:text-white tracking-tight">{value}</div>
      <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-4 flex items-center gap-1">
         <span className="material-symbols-outlined text-[14px]">bolt</span>
         {trend}
      </p>
    </div>
  );
}
