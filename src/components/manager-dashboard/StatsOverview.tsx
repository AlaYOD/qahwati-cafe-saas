"use client";

import { cn } from "@/lib/utils";

interface StatsOverviewProps {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  todayOrderCount: number;
  todayCompletedCount: number;
  todayPending: number;
  todayCancelled: number;
  activeShiftCount: number;
  isLoading?: boolean;
}

const cards = [
  {
    key: "todayRevenue",
    label: "Today's Revenue",
    icon: "attach_money",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-100 dark:border-emerald-500/20",
    isCurrency: true,
  },
  {
    key: "todayOrderCount",
    label: "Orders Today",
    icon: "receipt_long",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-100 dark:border-blue-500/20",
  },
  {
    key: "todayPending",
    label: "Pending Now",
    icon: "pending_actions",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-100 dark:border-amber-500/20",
  },
  {
    key: "activeShiftCount",
    label: "Active Shifts",
    icon: "schedule",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    border: "border-violet-100 dark:border-violet-500/20",
  },
  {
    key: "weekRevenue",
    label: "This Week",
    icon: "date_range",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-500/10",
    border: "border-teal-100 dark:border-teal-500/20",
    isCurrency: true,
  },
  {
    key: "monthRevenue",
    label: "This Month",
    icon: "calendar_month",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    border: "border-indigo-100 dark:border-indigo-500/20",
    isCurrency: true,
  },
] as const;

export function StatsOverview(props: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className={cn(
            "rounded-2xl border p-4 transition-all hover:shadow-md",
            card.border,
            card.bg
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className={cn("material-symbols-outlined text-xl", card.color)}
            >
              {card.icon}
            </span>
          </div>
          {props.isLoading ? (
            <div className="h-7 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          ) : (
            <p className={cn("text-xl font-black", card.color)}>
              {card.isCurrency
                ? `$${(props[card.key] as number).toFixed(2)}`
                : props[card.key]}
            </p>
          )}
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
}
