"use client";

import { cn } from "@/lib/utils";

interface PaymentBreakdownProps {
  breakdown: {
    cash: number;
    card: number;
    wallet: number;
  };
  isLoading?: boolean;
}

const methods = [
  { key: "cash" as const, label: "Cash", icon: "payments", color: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500" },
  { key: "card" as const, label: "Card", icon: "credit_card", color: "text-blue-600 dark:text-blue-400", bar: "bg-blue-500" },
  { key: "wallet" as const, label: "E-Wallet", icon: "account_balance_wallet", color: "text-violet-600 dark:text-violet-400", bar: "bg-violet-500" },
];

export function PaymentBreakdown({ breakdown, isLoading }: PaymentBreakdownProps) {
  const total = breakdown.cash + breakdown.card + breakdown.wallet;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background overflow-hidden">
      <div className="p-5 border-b border-slate-100 dark:border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">pie_chart</span>
          <h3 className="font-bold text-slate-800 dark:text-white">Payment Methods</h3>
        </div>
        <span className="text-xs font-medium text-slate-400">Today</span>
      </div>

      {isLoading ? (
        <div className="p-5 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : (
        <div className="p-5 space-y-4">
          {/* Total */}
          <div className="text-center mb-2">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Revenue</p>
            <p className="text-3xl font-black text-slate-800 dark:text-white">${total.toFixed(2)}</p>
          </div>

          {/* Combined bar */}
          {total > 0 && (
            <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              {methods.map((m) => {
                const pct = (breakdown[m.key] / total) * 100;
                if (pct === 0) return null;
                return (
                  <div
                    key={m.key}
                    className={cn("transition-all duration-500", m.bar)}
                    style={{ width: `${pct}%` }}
                    title={`${m.label}: ${pct.toFixed(1)}%`}
                  />
                );
              })}
            </div>
          )}

          {/* Method rows */}
          <div className="space-y-3 mt-4">
            {methods.map((m) => {
              const pct = total > 0 ? ((breakdown[m.key] / total) * 100).toFixed(1) : "0.0";
              return (
                <div key={m.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("size-8 rounded-lg flex items-center justify-center", m.bar + "/10")}>
                      <span className={cn("material-symbols-outlined text-[16px]", m.color)}>{m.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-white">{m.label}</p>
                      <p className="text-[10px] text-slate-400">{pct}% of total</p>
                    </div>
                  </div>
                  <p className={cn("text-base font-black", m.color)}>${breakdown[m.key].toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
