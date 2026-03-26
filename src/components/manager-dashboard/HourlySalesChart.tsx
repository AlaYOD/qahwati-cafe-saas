"use client";

import { cn } from "@/lib/utils";

interface HourlySale {
  hour: number;
  revenue: number;
  orders: number;
}

interface HourlySalesChartProps {
  data: HourlySale[];
  isLoading?: boolean;
}

function formatHour(h: number): string {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

export function HourlySalesChart({ data, isLoading }: HourlySalesChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);
  const peakHour = data.reduce((peak, d) => (d.revenue > peak.revenue ? d : peak), data[0] || { hour: 0, revenue: 0, orders: 0 });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-primary/10">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="p-5 h-48 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background overflow-hidden">
      <div className="p-5 border-b border-slate-100 dark:border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">bar_chart</span>
          <h3 className="font-bold text-slate-800 dark:text-white">Hourly Sales</h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          {peakHour && peakHour.revenue > 0 && (
            <span>
              Peak: <strong className="text-primary">{formatHour(peakHour.hour)}</strong>
            </span>
          )}
          <span>{totalOrders} orders</span>
        </div>
      </div>

      <div className="p-5">
        {data.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-sm text-slate-400">
            No sales data yet today.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bar chart */}
            <div className="flex items-end gap-1 h-40">
              {data.map((d) => {
                const heightPct = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
                const isPeak = d.hour === peakHour?.hour && d.revenue > 0;
                return (
                  <div
                    key={d.hour}
                    className="flex-1 flex flex-col items-center justify-end group relative"
                    title={`${formatHour(d.hour)}: $${d.revenue.toFixed(2)} (${d.orders} orders)`}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                      <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap">
                        ${d.revenue.toFixed(2)} | {d.orders} orders
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-full rounded-t-md transition-all duration-300 min-h-[4px]",
                        isPeak
                          ? "bg-primary"
                          : d.revenue > 0
                          ? "bg-primary/40 group-hover:bg-primary/70"
                          : "bg-slate-100 dark:bg-slate-800"
                      )}
                      style={{ height: `${Math.max(heightPct, 3)}%` }}
                    />
                    <p className="text-[8px] text-slate-400 mt-1.5 font-medium">
                      {d.hour % 3 === 0 ? formatHour(d.hour) : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
