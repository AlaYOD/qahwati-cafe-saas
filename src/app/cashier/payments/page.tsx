"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useState } from "react";
import { getAdminOrdersData } from "@/actions/orders";
import { cn } from "@/lib/utils";

export default function CashierPaymentsPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<any[] | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "all" | "custom">("today");
  const [searchQuery, setSearchQuery] = useState("");

  // Custom date/time pickers
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");
  const [customTimeFrom, setCustomTimeFrom] = useState("");
  const [customTimeTo, setCustomTimeTo] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await getAdminOrdersData();
      setOrders(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchOrders();
  }, []);

  if (!mounted) return null;

  // --- Date filtering ---
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const dateFilteredOrders = (orders || []).filter((o) => {
    if (dateRange === "all") return true;
    const created = new Date(o.created_at);
    if (dateRange === "today") return created >= startOfToday;
    if (dateRange === "week") return created >= startOfWeek;
    if (dateRange === "month") return created >= startOfMonth;
    if (dateRange === "custom") {
      if (customDateFrom) {
        const from = customTimeFrom
          ? new Date(`${customDateFrom}T${customTimeFrom}`)
          : new Date(`${customDateFrom}T00:00:00`);
        if (created < from) return false;
      }
      if (customDateTo) {
        const to = customTimeTo
          ? new Date(`${customDateTo}T${customTimeTo}`)
          : new Date(`${customDateTo}T23:59:59`);
        if (created > to) return false;
      }
      return true;
    }
    return true;
  });

  // Only completed (paid) orders for payments view
  const paidOrders = dateFilteredOrders.filter((o) => o.status === "completed");

  // Payment method filter
  const filteredOrders = paidOrders.filter((o) => {
    const matchMethod = filter === "all" || o.payment_method === filter;
    const matchSearch = !searchQuery.trim() ||
      (o.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.table?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchMethod && matchSearch;
  });

  // --- Aggregated stats ---
  const totalRevenue = paidOrders.reduce((s, o) => s + Number(o.total_amount), 0);
  const cashRevenue = paidOrders.filter((o) => o.payment_method === "cash").reduce((s, o) => s + Number(o.total_amount), 0);
  const cardRevenue = paidOrders.filter((o) => o.payment_method === "card").reduce((s, o) => s + Number(o.total_amount), 0);
  const walletRevenue = paidOrders.filter((o) => o.payment_method === "wallet").reduce((s, o) => s + Number(o.total_amount), 0);
  const avgTransaction = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  const cashPct = totalRevenue > 0 ? (cashRevenue / totalRevenue) * 100 : 0;
  const cardPct = totalRevenue > 0 ? (cardRevenue / totalRevenue) * 100 : 0;
  const walletPct = totalRevenue > 0 ? (walletRevenue / totalRevenue) * 100 : 0;

  // Pending orders count
  const pendingOrders = dateFilteredOrders.filter((o) => o.status === "pending");
  const pendingTotal = pendingOrders.reduce((s, o) => s + Number(o.total_amount), 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 p-8 rounded-2xl shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-black text-navy-800 dark:text-white uppercase tracking-tight">Payment Center</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Complete payment history, analytics, and revenue tracking.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Quick date presets */}
            <div className="flex bg-slate-100 dark:bg-primary/10 rounded-pill p-1">
              {(["today", "week", "month", "all"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => { setDateRange(range); setShowDatePicker(false); }}
                  className={cn(
                    "px-4 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-widest transition-all",
                    dateRange === range
                      ? "bg-white dark:bg-background shadow text-navy-800 dark:text-white"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {range === "all" ? "All Time" : range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
              <button
                onClick={() => { setDateRange("custom"); setShowDatePicker(true); }}
                className={cn(
                  "px-4 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1",
                  dateRange === "custom"
                    ? "bg-white dark:bg-background shadow text-navy-800 dark:text-white"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                Custom
              </button>
            </div>
            <button onClick={fetchOrders} className="flex items-center justify-center p-3 rounded-pill border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all shadow-sm">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">refresh</span>
            </button>
          </div>
        </div>

        {/* Custom Date/Time Picker Panel */}
        {(dateRange === "custom" || showDatePicker) && (
          <div className="border border-slate-200 dark:border-primary/10 rounded-xl p-5 bg-slate-50/50 dark:bg-primary/5 animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[16px]">date_range</span>
                Custom Date & Time Filter
              </h4>
              {(customDateFrom || customDateTo || customTimeFrom || customTimeTo) && (
                <button
                  onClick={() => { setCustomDateFrom(""); setCustomDateTo(""); setCustomTimeFrom(""); setCustomTimeTo(""); }}
                  className="text-[10px] text-primary hover:underline font-black uppercase tracking-widest"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* From */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-[16px]">calendar_today</span>
                    </span>
                    <input
                      type="date"
                      value={customDateFrom}
                      onChange={(e) => { setCustomDateFrom(e.target.value); setDateRange("custom"); }}
                      className="w-full pl-9 pr-3 py-2.5 text-sm font-bold bg-white dark:bg-background border border-slate-200 dark:border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="relative w-36">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-[16px]">schedule</span>
                    </span>
                    <input
                      type="time"
                      value={customTimeFrom}
                      onChange={(e) => { setCustomTimeFrom(e.target.value); setDateRange("custom"); }}
                      className="w-full pl-9 pr-3 py-2.5 text-sm font-bold bg-white dark:bg-background border border-slate-200 dark:border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="00:00"
                    />
                  </div>
                </div>
              </div>

              {/* To */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-[16px]">calendar_today</span>
                    </span>
                    <input
                      type="date"
                      value={customDateTo}
                      onChange={(e) => { setCustomDateTo(e.target.value); setDateRange("custom"); }}
                      className="w-full pl-9 pr-3 py-2.5 text-sm font-bold bg-white dark:bg-background border border-slate-200 dark:border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="relative w-36">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-[16px]">schedule</span>
                    </span>
                    <input
                      type="time"
                      value={customTimeTo}
                      onChange={(e) => { setCustomTimeTo(e.target.value); setDateRange("custom"); }}
                      className="w-full pl-9 pr-3 py-2.5 text-sm font-bold bg-white dark:bg-background border border-slate-200 dark:border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="23:59"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick date shortcuts */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Quick:</span>
              {[
                { label: "Yesterday", action: () => { const y = new Date(); y.setDate(y.getDate() - 1); const ds = y.toISOString().split("T")[0]; setCustomDateFrom(ds); setCustomDateTo(ds); setCustomTimeFrom(""); setCustomTimeTo(""); setDateRange("custom"); }},
                { label: "Last 7 Days", action: () => { const t = new Date(); const f = new Date(); f.setDate(f.getDate() - 7); setCustomDateFrom(f.toISOString().split("T")[0]); setCustomDateTo(t.toISOString().split("T")[0]); setCustomTimeFrom(""); setCustomTimeTo(""); setDateRange("custom"); }},
                { label: "Last 30 Days", action: () => { const t = new Date(); const f = new Date(); f.setDate(f.getDate() - 30); setCustomDateFrom(f.toISOString().split("T")[0]); setCustomDateTo(t.toISOString().split("T")[0]); setCustomTimeFrom(""); setCustomTimeTo(""); setDateRange("custom"); }},
                { label: "This Month", action: () => { const t = new Date(); setCustomDateFrom(`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-01`); setCustomDateTo(t.toISOString().split("T")[0]); setCustomTimeFrom(""); setCustomTimeTo(""); setDateRange("custom"); }},
                { label: "Last Month", action: () => { const t = new Date(); const f = new Date(t.getFullYear(), t.getMonth()-1, 1); const l = new Date(t.getFullYear(), t.getMonth(), 0); setCustomDateFrom(f.toISOString().split("T")[0]); setCustomDateTo(l.toISOString().split("T")[0]); setCustomTimeFrom(""); setCustomTimeTo(""); setDateRange("custom"); }},
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={s.action}
                  className="px-3 py-1.5 bg-white dark:bg-background border border-slate-200 dark:border-primary/20 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Active filter summary */}
            {(customDateFrom || customDateTo) && (
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg">
                <span className="material-symbols-outlined text-primary text-[16px]">filter_alt</span>
                <span className="text-xs font-bold text-primary">
                  Showing payments
                  {customDateFrom && (
                    <> from <strong>{customDateFrom}{customTimeFrom ? ` ${customTimeFrom}` : ""}</strong></>
                  )}
                  {customDateTo && (
                    <> to <strong>{customDateTo}{customTimeTo ? ` ${customTimeTo}` : ""}</strong></>
                  )}
                  {!customDateFrom && !customDateTo && " (no date set)"}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-[18px]">account_balance</span>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Revenue</p>
          </div>
          <p className="text-2xl font-black text-navy-800 dark:text-white">${totalRevenue.toFixed(2)}</p>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-2">{paidOrders.length} transactions</p>
        </div>

        <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">payments</span>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Cash</p>
          </div>
          <p className="text-2xl font-black text-navy-800 dark:text-white">${cashRevenue.toFixed(2)}</p>
          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-2">{cashPct.toFixed(0)}% of total</p>
        </div>

        <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">credit_card</span>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Card</p>
          </div>
          <p className="text-2xl font-black text-navy-800 dark:text-white">${cardRevenue.toFixed(2)}</p>
          <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-2">{cardPct.toFixed(0)}% of total</p>
        </div>

        <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-purple-600 text-[18px]">account_balance_wallet</span>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">E-Wallet</p>
          </div>
          <p className="text-2xl font-black text-navy-800 dark:text-white">${walletRevenue.toFixed(2)}</p>
          <p className="text-[10px] text-purple-600 font-black uppercase tracking-widest mt-2">{walletPct.toFixed(0)}% of total</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">pending_actions</span>
            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-black uppercase tracking-widest">Pending</p>
          </div>
          <p className="text-2xl font-black text-amber-700 dark:text-amber-400">${pendingTotal.toFixed(2)}</p>
          <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mt-2">{pendingOrders.length} awaiting payment</p>
        </div>
      </div>

      {/* Payment Method Breakdown Bar */}
      {totalRevenue > 0 && (
        <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-6 shadow-sm">
          <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-4">Payment Method Distribution</h3>
          <div className="flex h-4 rounded-full overflow-hidden bg-slate-100 dark:bg-primary/10">
            {cashPct > 0 && (
              <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${cashPct}%` }} title={`Cash: ${cashPct.toFixed(1)}%`} />
            )}
            {cardPct > 0 && (
              <div className="bg-blue-500 transition-all duration-500" style={{ width: `${cardPct}%` }} title={`Card: ${cardPct.toFixed(1)}%`} />
            )}
            {walletPct > 0 && (
              <div className="bg-purple-500 transition-all duration-500" style={{ width: `${walletPct}%` }} title={`Wallet: ${walletPct.toFixed(1)}%`} />
            )}
          </div>
          <div className="flex gap-6 mt-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />Cash {cashPct.toFixed(0)}%
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <div className="w-3 h-3 rounded-full bg-blue-500" />Card {cardPct.toFixed(0)}%
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <div className="w-3 h-3 rounded-full bg-purple-500" />E-Wallet {walletPct.toFixed(0)}%
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Avg. Transaction</p>
          <p className="text-xl font-black text-navy-800 dark:text-white">${avgTransaction.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Highest Payment</p>
          <p className="text-xl font-black text-navy-800 dark:text-white">
            ${paidOrders.length > 0 ? Math.max(...paidOrders.map((o) => Number(o.total_amount))).toFixed(2) : "0.00"}
          </p>
        </div>
        <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Cash Transactions</p>
          <p className="text-xl font-black text-navy-800 dark:text-white">
            {paidOrders.filter((o) => o.payment_method === "cash").length}
          </p>
        </div>
        <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Digital Transactions</p>
          <p className="text-xl font-black text-navy-800 dark:text-white">
            {paidOrders.filter((o) => o.payment_method !== "cash").length}
          </p>
        </div>
      </div>

      {/* Filters & Payment History */}
      <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-8 py-5 border-b border-slate-100 dark:border-primary/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="font-black text-lg text-navy-800 dark:text-white uppercase tracking-tight">Payment History</h3>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order or customer..."
                className="pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-56"
              />
            </div>
            {/* Method filter */}
            <div className="flex bg-slate-100 dark:bg-primary/10 rounded-pill p-1">
              {[
                { id: "all", label: "All" },
                { id: "cash", label: "Cash" },
                { id: "card", label: "Card" },
                { id: "wallet", label: "Wallet" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFilter(opt.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-widest transition-all",
                    filter === opt.id
                      ? "bg-white dark:bg-background shadow text-navy-800 dark:text-white"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-primary/5 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100 dark:border-primary/10">
                <th className="px-8 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Table</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Date / Time</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
              {!orders ? (
                <tr>
                  <td colSpan={7} className="px-8 py-12 text-center">
                    <span className="material-symbols-outlined animate-spin text-2xl text-slate-400 mb-2 inline-block">refresh</span>
                    <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Loading payments...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-12 text-center">
                    <div className="size-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined">search_off</span>
                    </div>
                    <p className="font-bold text-slate-500 text-sm">No payments found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or date range.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const methodUi: Record<string, { bg: string; text: string; icon: string; label: string }> = {
                    cash: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", icon: "payments", label: "Cash" },
                    card: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", icon: "credit_card", label: "Card" },
                    wallet: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", icon: "account_balance_wallet", label: "Wallet" },
                  };
                  const m = methodUi[order.payment_method] || methodUi.cash;

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-primary/5 transition-colors group">
                      <td className="px-8 py-4">
                        <span className="font-black text-[11px] text-primary uppercase">#{order.id.split("-")[0]}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-navy-800 dark:text-white">{order.customer_name || order.profile?.full_name || "Guest"}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{order.table?.name || "Walk-in"}</td>
                      <td className="px-6 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", m.bg, m.text)}>
                          <span className="material-symbols-outlined text-[14px]">{m.icon}</span>
                          {m.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 max-w-[180px] truncate">
                        {order.order_items?.map((i: any) => i.menu_item?.name || "Item").join(", ") || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                        {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-black text-navy-800 dark:text-white">${Number(order.total_amount).toFixed(2)}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredOrders.length > 0 && (
          <div className="px-8 py-4 bg-slate-50 dark:bg-primary/5 border-t border-slate-100 dark:border-primary/10 flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">
              {filteredOrders.length} payment{filteredOrders.length !== 1 ? "s" : ""} · Total: ${filteredOrders.reduce((s, o) => s + Number(o.total_amount), 0).toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
