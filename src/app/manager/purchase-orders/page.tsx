"use client";

import { useState } from "react";

const MOCK_ORDERS = [
  { id: "PO-2024-001", supplier: "Al-Rashid Coffee Imports", items: 3, total: 1250.00, status: "delivered", date: "2024-01-15" },
  { id: "PO-2024-002", supplier: "Dairy Fresh Co.", items: 2, total: 340.00, status: "pending", date: "2024-01-18" },
  { id: "PO-2024-003", supplier: "Sweet Supplies LLC", items: 5, total: 680.50, status: "in_transit", date: "2024-01-20" },
  { id: "PO-2024-004", supplier: "PackRight Materials", items: 4, total: 210.00, status: "delivered", date: "2024-01-10" },
  { id: "PO-2024-005", supplier: "Al-Rashid Coffee Imports", items: 2, total: 900.00, status: "pending", date: "2024-01-22" },
];

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  pending: { label: "Pending", classes: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  in_transit: { label: "In Transit", classes: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  delivered: { label: "Delivered", classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  cancelled: { label: "Cancelled", classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export default function ManagerPurchaseOrdersPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? MOCK_ORDERS : MOCK_ORDERS.filter((o) => o.status === filter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Purchase Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage procurement from suppliers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-sm">add</span> New PO
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total POs", value: MOCK_ORDERS.length, icon: "receipt_long", color: "text-primary" },
          { label: "Pending", value: MOCK_ORDERS.filter(o => o.status === "pending").length, icon: "schedule", color: "text-amber-500" },
          { label: "In Transit", value: MOCK_ORDERS.filter(o => o.status === "in_transit").length, icon: "local_shipping", color: "text-blue-500" },
          { label: "Delivered", value: MOCK_ORDERS.filter(o => o.status === "delivered").length, icon: "check_circle", color: "text-emerald-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-4">
            <span className={`material-symbols-outlined ${s.color} mb-2 block`}>{s.icon}</span>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "in_transit", "delivered", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
              filter === s
                ? "bg-primary text-white"
                : "bg-white dark:bg-primary/10 border border-primary/20 text-slate-600 dark:text-slate-400 hover:bg-primary/5"
            }`}
          >
            {s === "in_transit" ? "In Transit" : s}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 bg-slate-50 dark:bg-primary/10">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">PO Number</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Supplier</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Items</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Total</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Date</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Status</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">No purchase orders found</td>
              </tr>
            ) : (
              filtered.map((order) => {
                const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                return (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-primary">{order.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{order.supplier}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{order.items}</td>
                    <td className="px-4 py-3 text-right font-bold">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-500">{order.date}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.classes}`}>{sc.label}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
