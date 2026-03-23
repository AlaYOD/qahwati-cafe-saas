"use client";

import { useEffect, useState, useRef } from "react";
import { getAdminOrdersData } from "@/actions/orders";

export default function CashierReceiptsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAdminOrdersData()
      .then((data) => {
        const completed = (data as any[]).filter((o) => o.status === "completed");
        setOrders(completed);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;
    win.document.write(`
      <html><head><title>Receipt</title>
      <style>body{font-family:monospace;padding:20px;font-size:12px} .divider{border-top:1px dashed #ccc;margin:8px 0}</style>
      </head><body>${content}</body></html>
    `);
    win.document.close();
    win.print();
    win.close();
  };

  return (
    <div className="p-6 flex gap-6 h-full">
      <div className="flex-1 space-y-4 overflow-auto">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Receipts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View and print receipts for completed orders</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">receipt</span>
            <p className="text-slate-400">No completed orders yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelected(order)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition-all ${
                  selected?.id === order.id
                    ? "border-primary bg-primary/5"
                    : "bg-white dark:bg-primary/5 border-primary/20 hover:border-primary/40"
                }`}
              >
                <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-none">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-sm">receipt</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-bold text-primary text-sm">#{order.id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-slate-500">
                    {order.table?.name || order.customer_name || "Walk-in"} · {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-slate-100">${Number(order.total_amount).toFixed(2)}</p>
                  <p className="text-xs text-slate-400 capitalize">{order.payment_method || "—"}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="w-80 flex-none">
          <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-2xl overflow-hidden sticky top-0">
            <div className="px-5 py-4 border-b border-primary/10 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-slate-100">Receipt Preview</h2>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">print</span> Print
              </button>
            </div>

            <div ref={printRef} className="p-5 font-mono text-xs space-y-3">
              <div className="text-center space-y-0.5">
                <p className="text-base font-bold">QAHWATI CAFE</p>
                <p className="text-slate-500">Coffee Management System</p>
                <p className="text-slate-400">─────────────────────</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Order #</span>
                  <span className="font-bold">{selected.id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span>{new Date(selected.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time</span>
                  <span>{new Date(selected.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                {selected.table && (
                  <div className="flex justify-between">
                    <span>Table</span>
                    <span>{selected.table.name}</span>
                  </div>
                )}
                {selected.customer_name && (
                  <div className="flex justify-between">
                    <span>Customer</span>
                    <span>{selected.customer_name}</span>
                  </div>
                )}
              </div>

              <p className="text-center text-slate-400">─────────────────────</p>

              <div className="space-y-1.5">
                {selected.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.quantity}× {item.menu_item?.name || "Item"}</span>
                    <span>${(Number(item.unit_price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <p className="text-center text-slate-400">─────────────────────</p>

              <div className="flex justify-between font-bold text-sm">
                <span>TOTAL</span>
                <span>${Number(selected.total_amount).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Payment</span>
                <span className="capitalize">{selected.payment_method || "—"}</span>
              </div>

              <p className="text-center text-slate-400">─────────────────────</p>
              <p className="text-center text-slate-500">Thank you for visiting!</p>
              <p className="text-center text-slate-400">www.qahwati.sa</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
