"use client";

import { cn } from "@/lib/utils";

interface CashDrawer {
  shiftId: string;
  cashierName: string;
  cashierId: string | null;
  openingBalance: number;
  cashSales: number;
  cardSales: number;
  expenses: number;
  cashOuts: number;
  expectedCash: number;
  startTime: string | null;
  transactionCount: number;
}

interface CashDrawerMonitorProps {
  drawers: CashDrawer[];
  isLoading?: boolean;
}

export function CashDrawerMonitor({ drawers, isLoading }: CashDrawerMonitorProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-primary/10">
          <div className="h-5 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="p-5 space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background overflow-hidden">
      <div className="p-5 border-b border-slate-100 dark:border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">point_of_sale</span>
          <h3 className="font-bold text-slate-800 dark:text-white">Active Cash Drawers</h3>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase",
            drawers.length > 0
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-slate-100 text-slate-400 dark:bg-slate-800"
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              drawers.length > 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
            )}
          />
          {drawers.length} Open
        </span>
      </div>

      {drawers.length === 0 ? (
        <div className="p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2 block">
            point_of_sale
          </span>
          <p className="text-sm text-slate-400">No active cash drawers</p>
          <p className="text-xs text-slate-400 mt-1">Cashiers need to open a shift to start</p>
        </div>
      ) : (
        <div className="p-5 space-y-4">
          {drawers.map((d) => (
            <div
              key={d.shiftId}
              className="rounded-xl border border-slate-100 dark:border-primary/10 bg-slate-50 dark:bg-primary/5 p-4"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm text-primary">person</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-700 dark:text-white">{d.cashierName}</p>
                    {d.startTime && (
                      <p className="text-[10px] text-slate-400">
                        Opened {new Date(d.startTime).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Expected Cash</p>
                  <p className="text-lg font-black text-slate-800 dark:text-white">${d.expectedCash.toFixed(2)}</p>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="rounded-lg bg-white dark:bg-background p-3 border border-slate-100 dark:border-primary/10">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Opening</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-white mt-1">${d.openingBalance.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-white dark:bg-background p-3 border border-slate-100 dark:border-primary/10">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">Cash Sales</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">${d.cashSales.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-white dark:bg-background p-3 border border-slate-100 dark:border-primary/10">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">Card Sales</p>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">${d.cardSales.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-white dark:bg-background p-3 border border-slate-100 dark:border-primary/10">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-500">Cash Outs</p>
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400 mt-1">
                    {d.cashOuts > 0 ? `-$${d.cashOuts.toFixed(2)}` : "$0.00"}
                  </p>
                </div>
                <div className="rounded-lg bg-white dark:bg-background p-3 border border-slate-100 dark:border-primary/10">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Transactions</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-white mt-1">{d.transactionCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
