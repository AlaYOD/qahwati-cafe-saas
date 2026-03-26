"use client";

import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface OrderCardProps {
  order: any;
  onSelect: (order: any) => void;
}

const statusConfig: Record<string, { bg: string; text: string; icon: string; label: string }> = {
  pending: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
    icon: "pending_actions",
    label: "Pending",
  },
  completed: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
    icon: "check_circle",
    label: "Completed",
  },
  cancelled: {
    bg: "bg-red-50 dark:bg-red-500/10",
    text: "text-red-500 dark:text-red-400 border-red-200 dark:border-red-500/30",
    icon: "cancel",
    label: "Cancelled",
  },
  preparing: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
    icon: "skillet",
    label: "Preparing",
  },
  ready: {
    bg: "bg-violet-50 dark:bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/30",
    icon: "done_all",
    label: "Ready",
  },
};

export function OrderCard({ order, onSelect }: OrderCardProps) {
  const status = statusConfig[order.status] || statusConfig.pending;
  const itemCount = order.order_items?.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0) || 0;
  const shortId = order.id.split("-")[0].toUpperCase();
  const createdAt = new Date(order.created_at);

  return (
    <button
      onClick={() => onSelect(order)}
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-white dark:bg-background text-left",
        "shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5",
        "border-slate-200 dark:border-primary/10 hover:border-slate-300 dark:hover:border-primary/20",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
        "overflow-hidden cursor-pointer w-full"
      )}
      aria-label={`Order ${shortId} - ${status.label} - $${Number(order.total_amount).toFixed(2)}`}
    >
      {/* Top Color Accent */}
      <div
        className={cn(
          "h-1 w-full transition-all group-hover:h-1.5",
          order.status === "pending" && "bg-amber-400",
          order.status === "completed" && "bg-emerald-500",
          order.status === "cancelled" && "bg-red-400",
          order.status === "preparing" && "bg-blue-500",
          order.status === "ready" && "bg-violet-500"
        )}
      />

      <div className="p-5 flex flex-col gap-4 flex-grow">
        {/* Header: Order ID + Status Badge */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-black text-slate-800 dark:text-white group-hover:text-primary transition-colors">
              #{shortId}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric" })}{" "}
              {createdAt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border",
              status.bg,
              status.text
            )}
          >
            <span className="material-symbols-outlined text-[13px]">{status.icon}</span>
            {status.label}
          </span>
        </div>

        {/* Customer & Table */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined text-[16px] text-slate-400">person</span>
            <span className="font-medium truncate">
              {order.customer_name || order.profile?.full_name || "Walk-in Customer"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-[16px] text-slate-400">
              {order.table ? "table_restaurant" : "directions_walk"}
            </span>
            <span className="font-medium truncate">
              {order.table?.name || "Takeaway"}
            </span>
          </div>
        </div>

        {/* Footer: Items Count + Total */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100 dark:border-primary/10">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
            <span className="text-xs font-semibold">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>
          <p className="text-lg font-black text-slate-800 dark:text-white">
            ${Number(order.total_amount).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Hover overlay hint */}
      <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
    </button>
  );
}
