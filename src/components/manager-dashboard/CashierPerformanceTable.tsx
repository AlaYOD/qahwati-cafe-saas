"use client";

import { cn } from "@/lib/utils";

interface CashierPerf {
  id: string;
  name: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  revenue: number;
  avgOrderValue: number;
  isActive: boolean;
  shiftStart: string | null;
}

interface CashierPerformanceTableProps {
  cashiers: CashierPerf[];
  isLoading?: boolean;
}

export function CashierPerformanceTable({ cashiers, isLoading }: CashierPerformanceTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-primary/10">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="p-5 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">badge</span>
          <h3 className="font-bold text-slate-800 dark:text-white">Cashier Performance</h3>
        </div>
        <span className="text-xs font-medium text-slate-400">Today</span>
      </div>

      {cashiers.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-400">
          No cashiers registered yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-slate-100 dark:border-primary/10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="text-left p-4">Cashier</th>
                <th className="text-center p-4">Status</th>
                <th className="text-center p-4">Orders</th>
                <th className="text-center p-4">Completed</th>
                <th className="text-center p-4">Voided</th>
                <th className="text-right p-4">Revenue</th>
                <th className="text-right p-4">Avg Order</th>
              </tr>
            </thead>
            <tbody>
              {cashiers
                .sort((a, b) => b.revenue - a.revenue)
                .map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-50 dark:border-primary/5 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-slate-100 dark:bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm text-slate-500 dark:text-slate-400">
                            person
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 dark:text-white">{c.name}</p>
                          {c.shiftStart && (
                            <p className="text-[10px] text-slate-400">
                              Since {new Date(c.shiftStart).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase",
                          c.isActive
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            c.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          )}
                        />
                        {c.isActive ? "Active" : "Offline"}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-slate-700 dark:text-white">
                      {c.totalOrders}
                    </td>
                    <td className="p-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      {c.completedOrders}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={cn(
                          "font-bold",
                          c.cancelledOrders > 0
                            ? "text-red-500"
                            : "text-slate-300 dark:text-slate-600"
                        )}
                      >
                        {c.cancelledOrders}
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-slate-800 dark:text-white">
                      ${c.revenue.toFixed(2)}
                    </td>
                    <td className="p-4 text-right font-medium text-slate-500">
                      ${c.avgOrderValue.toFixed(2)}
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
