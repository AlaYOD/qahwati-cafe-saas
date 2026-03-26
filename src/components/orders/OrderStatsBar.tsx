"use client";

import { cn } from "@/lib/utils";

interface OrderStats {
  totalToday: number;
  pendingOrders: number;
  completedOrders: number;
  revenueToday: number;
}

interface OrderStatsBarProps {
  stats: OrderStats;
  isLoading?: boolean;
}

const statCards = [
  {
    key: "totalToday" as const,
    label: "Total Orders Today",
    icon: "receipt_long",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    borderColor: "border-blue-100 dark:border-blue-500/20",
  },
  {
    key: "pendingOrders" as const,
    label: "Pending Orders",
    icon: "pending_actions",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    borderColor: "border-amber-100 dark:border-amber-500/20",
  },
  {
    key: "completedOrders" as const,
    label: "Completed",
    icon: "check_circle",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    borderColor: "border-emerald-100 dark:border-emerald-500/20",
  },
  {
    key: "revenueToday" as const,
    label: "Revenue Today",
    icon: "attach_money",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    borderColor: "border-violet-100 dark:border-violet-500/20",
    isCurrency: true,
  },
];

export function OrderStatsBar({ stats, isLoading }: OrderStatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => (
        <div
          key={card.key}
          className={cn(
            "relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-md",
            card.borderColor,
            card.bg
          )}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.label}
              </p>
              {isLoading ? (
                <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
              ) : (
                <p className={cn("text-2xl font-black", card.color)}>
                  {card.isCurrency
                    ? `$${stats[card.key].toFixed(2)}`
                    : stats[card.key]}
                </p>
              )}
            </div>
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-xl",
                card.bg
              )}
            >
              <span className={cn("material-symbols-outlined text-xl", card.color)}>
                {card.icon}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
