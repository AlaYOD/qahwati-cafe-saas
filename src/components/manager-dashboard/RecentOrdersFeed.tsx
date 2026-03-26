import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RecentOrdersFeedProps {
  orders: any[];
  isLoading?: boolean;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", label: "Pending" },
  completed: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", label: "Completed" },
  cancelled: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-500 dark:text-red-400", label: "Cancelled" },
};

export function RecentOrdersFeed({ orders, isLoading }: RecentOrdersFeedProps) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-primary/10">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="p-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">receipt_long</span>
            <h3 className="font-bold text-slate-800 dark:text-white">Recent Orders</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Today</span>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No orders today yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-primary/5 max-h-[500px] overflow-y-auto custom-scrollbar">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const shortId = order.id.split("-")[0].toUpperCase();
              const itemCount = order.order_items?.reduce((s: number, i: any) => s + (i.quantity || 1), 0) || 0;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex flex-col items-center">
                        <p className="text-xs font-black text-slate-800 dark:text-white group-hover:text-primary transition-colors">#{shortId}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          {new Date(order.created_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-slate-100 dark:bg-primary/10" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-white truncate">
                          {order.customer_name || order.profile?.full_name || "Walk-in"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400">
                            {order.table?.name || "Takeaway"}
                          </span>
                          <span className="text-[10px] text-slate-300">|</span>
                          <span className="text-[10px] text-slate-400">{itemCount} items</span>
                          {order.profile?.full_name && (
                            <>
                              <span className="text-[10px] text-slate-300">|</span>
                              <span className="text-[10px] text-primary font-medium">
                                {order.profile.full_name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-none ml-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase",
                          status.bg,
                          status.text
                        )}
                      >
                        {status.label}
                      </span>
                      <p className="text-sm font-black text-slate-800 dark:text-white min-w-[60px] text-right">
                        ${Number(order.total_amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center text-xl font-black">
              Order Details
              <span className="text-primary text-sm font-bold">#{selectedOrder?.id.split("-")[0].toUpperCase()}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-xl">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Customer</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {selectedOrder.customer_name || "Walk-in"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Table</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {selectedOrder.table?.name || "Takeaway"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Date & Time</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status</p>
                  <span className={cn(
                    "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase",
                    statusConfig[selectedOrder.status]?.bg,
                    statusConfig[selectedOrder.status]?.text
                  )}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Items</h4>
                <div className="space-y-2 border-t border-slate-100 dark:border-primary/10 pt-2">
                  {selectedOrder.order_items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="size-6 rounded bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">
                          {item.quantity}x
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{item.menu_item?.name}</span>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-dashed border-slate-100 dark:border-primary/10 pt-4 mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-500 font-bold">Payment Method</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white uppercase">
                    {selectedOrder.payment_method || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black text-slate-800 dark:text-white">Total Amount</span>
                  <span className="text-2xl font-black text-primary italic">
                    ${Number(selectedOrder.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl border border-amber-100 dark:border-amber-500/20">
                  <p className="text-[10px] text-amber-600 font-black uppercase mb-1">Kitchen Notes</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 italic font-medium">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
