"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface PaymentModalProps {
  order: any | null;
  onClose: () => void;
  onConfirm: (orderId: string, paymentMethod: string) => void;
  isUpdating: string | null;
}

const paymentMethods = [
  { id: "card", label: "Credit/Debit", icon: "credit_card" },
  { id: "cash", label: "Cash", icon: "payments" },
  { id: "wallet", label: "E-Wallet", icon: "account_balance_wallet" },
];

export function PaymentModal({ order, onClose, onConfirm, isUpdating }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [amountTendered, setAmountTendered] = useState("");

  if (!order) return null;

  const total = Number(order.total_amount);
  const tendered = Number(amountTendered) || 0;
  const diff = tendered - total;
  const hasAmount = tendered > 0;
  const isExact = Math.abs(diff) < 0.001;
  const isOver = diff > 0.001;
  const isUnder = hasAmount && diff < -0.001;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Payment Processing"
    >
      <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/20 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Receipt Section */}
        <div className="w-full md:w-2/5 border-r border-slate-200 dark:border-primary/10 bg-slate-50 dark:bg-black/20 p-8 flex flex-col overflow-y-auto">
          <div className="text-center mb-8">
            <div className="size-14 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-3xl">receipt_long</span>
            </div>
            <h2 className="font-bold text-xl">Order Receipt</h2>
            <p className="text-xs text-slate-500 mt-1">#{order.id.split("-")[0].toUpperCase()}</p>
          </div>

          <div className="space-y-1 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Date</span>
              <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer</span>
              <span className="font-medium">{order.customer_name || order.profile?.full_name || "Takeaway"}</span>
            </div>
            {order.table && (
              <div className="flex justify-between">
                <span className="text-slate-500">Table</span>
                <span className="font-medium">{order.table.name}</span>
              </div>
            )}
          </div>

          <div className="border-t border-b border-dashed border-slate-300 dark:border-slate-700 py-4 mb-4 flex-grow">
            <div className="space-y-3">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-white dark:bg-black/20 overflow-hidden border border-slate-200 dark:border-slate-700 flex-none">
                      {item.menu_item?.image_url ? (
                        <img src={item.menu_item.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined text-[14px]">local_cafe</span>
                        </div>
                      )}
                    </div>
                    <span className="font-medium">
                      {item.quantity}x {item.menu_item?.name || "Item"}
                    </span>
                  </div>
                  <span className="font-bold">${(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 mt-auto">
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Tax (0%)</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <span className="font-bold text-lg">Total</span>
              <span className="text-3xl font-black">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="w-full md:w-3/5 bg-white dark:bg-background p-8 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-2xl">Payment Processing</h3>
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Payment Method Selection */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {paymentMethods.map((pm) => (
              <button
                key={pm.id}
                onClick={() => setPaymentMethod(pm.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all",
                  paymentMethod === pm.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 dark:border-primary/20 hover:border-primary/50 text-slate-500"
                )}
              >
                <span className="material-symbols-outlined text-3xl mb-2">{pm.icon}</span>
                <span className="font-bold text-sm">{pm.label}</span>
              </button>
            ))}
          </div>

          {/* Cash Calculator */}
          {paymentMethod === "cash" && (
            <div className="mb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Amount Received from Customer
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xl select-none">
                    $
                  </span>
                  <input
                    type="number"
                    value={amountTendered}
                    onChange={(e) => setAmountTendered(e.target.value)}
                    className="w-full text-3xl font-black py-3 pl-10 pr-4 border-2 border-slate-200 dark:border-primary/20 rounded-xl bg-white dark:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    autoFocus
                    aria-label="Amount received"
                  />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[5, 10, 20, 50, 100].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmountTendered(val.toString())}
                    className="py-2 bg-white dark:bg-background border border-slate-200 dark:border-primary/20 rounded-lg font-bold text-sm text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors"
                  >
                    ${val}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setAmountTendered(total.toFixed(2))}
                className="w-full py-2 border border-dashed border-primary/40 rounded-lg text-sm font-semibold text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">attach_money</span>
                Exact amount — ${total.toFixed(2)}
              </button>

              {hasAmount && (
                <div
                  className={cn(
                    "rounded-xl overflow-hidden border-2",
                    isOver && "border-emerald-400 dark:border-emerald-600",
                    isExact && "border-primary",
                    isUnder && "border-amber-400 dark:border-amber-600"
                  )}
                >
                  <div className="flex justify-between items-center px-4 py-2.5 bg-slate-50 dark:bg-primary/5 border-b border-inherit">
                    <span className="text-sm text-slate-500 font-medium">Received</span>
                    <span className="font-bold">${tendered.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2.5 bg-slate-50 dark:bg-primary/5 border-b border-inherit">
                    <span className="text-sm text-slate-500 font-medium">Order Total</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>

                  {isOver && (
                    <div className="flex justify-between items-center px-4 py-4 bg-emerald-50 dark:bg-emerald-900/20">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">arrow_back</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-300">Change to Return</span>
                      </div>
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${diff.toFixed(2)}</span>
                    </div>
                  )}
                  {isExact && (
                    <div className="flex justify-between items-center px-4 py-4 bg-primary/5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">check_circle</span>
                        <span className="font-bold text-primary">Exact Payment</span>
                      </div>
                      <span className="text-2xl font-black text-primary">$0.00</span>
                    </div>
                  )}
                  {isUnder && (
                    <div className="flex justify-between items-center px-4 py-4 bg-amber-50 dark:bg-amber-900/20">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">warning</span>
                          <span className="font-bold text-amber-700 dark:text-amber-300">Amount Still Owed</span>
                        </div>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 ml-6">
                          Will be saved as partial payment
                        </p>
                      </div>
                      <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                        ${Math.abs(diff).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-auto space-y-3">
            {paymentMethod === "cash" && isUnder && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg text-xs text-amber-700 dark:text-amber-300 font-medium">
                <span className="material-symbols-outlined text-sm flex-none mt-0.5">info</span>
                Partial payment of ${tendered.toFixed(2)}. Customer still owes ${Math.abs(diff).toFixed(2)}.
              </div>
            )}
            <button
              disabled={isUpdating === order.id || (paymentMethod === "cash" && !amountTendered)}
              onClick={() => onConfirm(order.id, paymentMethod)}
              className="w-full py-4 text-lg bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-500/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:grayscale"
            >
              {isUpdating === order.id ? (
                <span className="material-symbols-outlined animate-spin text-[24px]">refresh</span>
              ) : (
                <span className="material-symbols-outlined text-[24px]">check_circle</span>
              )}
              {paymentMethod === "cash" && isUnder
                ? `Confirm Partial — $${tendered.toFixed(2)} received`
                : `Process $${total.toFixed(2)} Payment`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
