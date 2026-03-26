"use client";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface OrderDetailPanelProps {
  order: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProcessPayment: (order: any) => void;
  onVoidOrder: (orderId: string) => void;
  isUpdating: string | null;
}

const statusConfig: Record<string, { bg: string; text: string; icon: string; label: string }> = {
  pending: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", icon: "pending_actions", label: "Pending" },
  completed: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", icon: "check_circle", label: "Completed" },
  cancelled: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-500 dark:text-red-400", icon: "cancel", label: "Cancelled" },
  preparing: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", icon: "skillet", label: "Preparing" },
  ready: { bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", icon: "done_all", label: "Ready" },
};

export function OrderDetailPanel({
  order,
  open,
  onOpenChange,
  onProcessPayment,
  onVoidOrder,
  isUpdating,
}: OrderDetailPanelProps) {
  if (!order) return null;

  const status = statusConfig[order.status] || statusConfig.pending;
  const shortId = order.id.split("-")[0].toUpperCase();
  const createdAt = new Date(order.created_at);
  const subtotal = Number(order.total_amount);
  const itemCount = order.order_items?.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0) || 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col"
        showCloseButton={false}
      >
        {/* Header */}
        <SheetHeader className="p-6 pb-4 border-b border-slate-100 dark:border-primary/10">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl font-black text-slate-800 dark:text-white">
                Order #{shortId}
              </SheetTitle>
              <SheetDescription className="text-sm text-slate-500 mt-1">
                {createdAt.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                at{" "}
                {createdAt.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </SheetDescription>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors"
              aria-label="Close panel"
            >
              <span className="material-symbols-outlined text-slate-400">close</span>
            </button>
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide",
                status.bg,
                status.text
              )}
            >
              <span className="material-symbols-outlined text-[16px]">{status.icon}</span>
              {status.label}
            </span>
          </div>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Customer Info */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Customer Information
            </h4>
            <div className="rounded-xl border border-slate-100 dark:border-primary/10 divide-y divide-slate-100 dark:divide-primary/10">
              <div className="flex items-center gap-3 p-3.5">
                <span className="material-symbols-outlined text-[18px] text-slate-400">person</span>
                <div>
                  <p className="text-xs text-slate-400">Customer</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-white">
                    {order.customer_name || order.profile?.full_name || "Walk-in Customer"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5">
                <span className="material-symbols-outlined text-[18px] text-slate-400">
                  {order.table ? "table_restaurant" : "directions_walk"}
                </span>
                <div>
                  <p className="text-xs text-slate-400">Table / Type</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-white">
                    {order.table?.name || "Takeaway"}
                  </p>
                </div>
              </div>
              {order.payment_method && (
                <div className="flex items-center gap-3 p-3.5">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">
                    {order.payment_method === "cash" ? "payments" : order.payment_method === "card" ? "credit_card" : "account_balance_wallet"}
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">Payment Method</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-white capitalize">
                      {order.payment_method}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Order Items
              </h4>
              <span className="text-xs text-slate-400 font-medium">{itemCount} items</span>
            </div>
            <div className="space-y-2">
              {order.order_items?.map((item: any) => {
                const lineTotal = Number(item.quantity) * Number(item.unit_price);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-primary/5 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors"
                  >
                    {/* Item Image */}
                    <div className="size-12 rounded-xl bg-white dark:bg-background overflow-hidden border border-slate-100 dark:border-primary/10 flex-none">
                      {item.menu_item?.image_url ? (
                        <img
                          src={item.menu_item.image_url}
                          alt={item.menu_item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <span className="material-symbols-outlined text-xl">local_cafe</span>
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-bold text-slate-700 dark:text-white truncate">
                        {item.menu_item?.name || "Unknown Item"}
                      </p>
                      <p className="text-xs text-slate-400">
                        ${Number(item.unit_price).toFixed(2)} x {item.quantity}
                      </p>
                    </div>

                    {/* Line Total */}
                    <p className="text-sm font-bold text-slate-700 dark:text-white flex-none">
                      ${lineTotal.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-slate-100 dark:border-primary/10 p-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Tax (0%)</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-primary/10">
              <span className="text-base font-bold text-slate-700 dark:text-white">Total</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-slate-100 dark:border-primary/10 space-y-3 bg-slate-50/50 dark:bg-primary/5">
          {order.status === "pending" && (
            <div className="flex gap-3">
              <button
                disabled={isUpdating === order.id}
                onClick={() => onVoidOrder(order.id)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-primary/10 text-slate-500 hover:text-red-500 hover:border-red-300 transition-all text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                Void Order
              </button>
              <button
                disabled={isUpdating === order.id}
                onClick={() => onProcessPayment(order)}
                className="flex-[2] py-3 px-4 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
                Process Payment
              </button>
            </div>
          )}
          {order.status === "completed" && (
            <button
              onClick={() => window.print()}
              className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-primary/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-primary/10 transition-all text-sm font-bold flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              Print Receipt
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
