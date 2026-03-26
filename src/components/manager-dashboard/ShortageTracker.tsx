"use client";

import { cn } from "@/lib/utils";

interface ShortageRecord {
  shiftId: string;
  cashierName: string;
  cashierId: string | null;
  startTime: string | null;
  endTime: string | null;
  openingBalance: number;
  expectedBalance: number;
  actualBalance: number;
  variance: number;
  status: "balanced" | "overage" | "shortage";
}

interface ShortageTrackerProps {
  records: ShortageRecord[];
  isLoading?: boolean;
}

export function ShortageTracker({ records, isLoading }: ShortageTrackerProps) {
  const shortages = records.filter((r) => r.status === "shortage");
  const overages = records.filter((r) => r.status === "overage");
  const balanced = records.filter((r) => r.status === "balanced");

  const totalVariance = records.reduce((s, r) => s + r.variance, 0);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-primary/10">
          <div className="h-5 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="p-5 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background overflow-hidden">
      <div className="p-5 border-b border-slate-100 dark:border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">account_balance</span>
          <h3 className="font-bold text-slate-800 dark:text-white">Cash Reconciliation</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Recent Shifts</span>
      </div>

      {/* Summary chips */}
      <div className="p-5 pb-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <span className="material-symbols-outlined text-[12px]">check_circle</span>
          {balanced.length} Balanced
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
          <span className="material-symbols-outlined text-[12px]">trending_down</span>
          {shortages.length} Shortages
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <span className="material-symbols-outlined text-[12px]">trending_up</span>
          {overages.length} Overages
        </span>
        {records.length > 0 && (
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase",
              totalVariance >= 0
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400"
            )}
          >
            Net: {totalVariance >= 0 ? "+" : ""}${totalVariance.toFixed(2)}
          </span>
        )}
      </div>

      {/* Records list */}
      {records.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-400">
          No closed shifts to reconcile yet.
        </div>
      ) : (
        <div className="px-5 pb-5 space-y-2 max-h-80 overflow-y-auto">
          {records.map((r) => (
            <div
              key={r.shiftId}
              className={cn(
                "flex items-center justify-between p-3.5 rounded-xl border transition-colors",
                r.status === "balanced" && "border-emerald-100 bg-emerald-50/50 dark:border-emerald-500/10 dark:bg-emerald-500/5",
                r.status === "shortage" && "border-red-100 bg-red-50/50 dark:border-red-500/10 dark:bg-red-500/5",
                r.status === "overage" && "border-blue-100 bg-blue-50/50 dark:border-blue-500/10 dark:bg-blue-500/5"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center flex-none",
                    r.status === "balanced" && "bg-emerald-100 dark:bg-emerald-500/20",
                    r.status === "shortage" && "bg-red-100 dark:bg-red-500/20",
                    r.status === "overage" && "bg-blue-100 dark:bg-blue-500/20"
                  )}
                >
                  <span
                    className={cn(
                      "material-symbols-outlined text-sm",
                      r.status === "balanced" && "text-emerald-600 dark:text-emerald-400",
                      r.status === "shortage" && "text-red-500 dark:text-red-400",
                      r.status === "overage" && "text-blue-600 dark:text-blue-400"
                    )}
                  >
                    {r.status === "balanced" ? "check_circle" : r.status === "shortage" ? "arrow_downward" : "arrow_upward"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-700 dark:text-white truncate">{r.cashierName}</p>
                  <p className="text-[10px] text-slate-400">
                    {r.endTime
                      ? new Date(r.endTime).toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
                        " " +
                        new Date(r.endTime).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
                      : "Unknown"}
                  </p>
                </div>
              </div>

              <div className="text-right flex-none ml-2">
                <p
                  className={cn(
                    "text-sm font-black",
                    r.status === "balanced" && "text-emerald-600 dark:text-emerald-400",
                    r.status === "shortage" && "text-red-500 dark:text-red-400",
                    r.status === "overage" && "text-blue-600 dark:text-blue-400"
                  )}
                >
                  {r.variance >= 0 ? "+" : ""}${r.variance.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-400">
                  Expected ${r.expectedBalance.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
