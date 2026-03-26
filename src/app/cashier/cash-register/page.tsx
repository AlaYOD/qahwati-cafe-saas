"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useState, useCallback } from "react";
import {
  getActiveShift,
  getShiftsHistory,
  openShift,
  closeShift,
  addTransaction,
  cashOutFromDrawer,
} from "@/actions/shifts";
import { cn } from "@/lib/utils";

type ShiftData = {
  id: string;
  user_id: string;
  opening_balance: number;
  expected_balance: number;
  actual_balance: number | null;
  status: string;
  start_time: string;
  end_time: string | null;
  profile: { full_name: string } | null;
  transactions: TransactionData[];
};

type TransactionData = {
  id: string;
  shift_id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
};

export default function CashRegisterPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeShift, setActiveShift] = useState<ShiftData | null>(null);
  const [shiftsHistory, setShiftsHistory] = useState<ShiftData[]>([]);
  const [loading, setLoading] = useState(true);

  // Open shift form
  const [openingBalance, setOpeningBalance] = useState("500");
  const [isOpening, setIsOpening] = useState(false);

  // Close shift form
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [actualBalance, setActualBalance] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  // Add transaction form
  const [showAddTx, setShowAddTx] = useState(false);
  const [txType, setTxType] = useState("expense");
  const [txAmount, setTxAmount] = useState("");
  const [txDescription, setTxDescription] = useState("");
  const [isAddingTx, setIsAddingTx] = useState(false);

  // Cash-out modal state
  const [showCashOut, setShowCashOut] = useState(false);
  const [coSubType, setCoSubType] = useState<"paid_out" | "safe_drop" | "advance" | "other">("paid_out");
  const [coAmount, setCoAmount] = useState("");
  const [coReason, setCoReason] = useState("");
  const [coReference, setCoReference] = useState("");
  const [isCashingOut, setIsCashingOut] = useState(false);

  // History tab
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");

  const fetchData = useCallback(async () => {
    try {
      const [shift, history] = await Promise.all([
        getActiveShift(),
        getShiftsHistory(),
      ]);
      setActiveShift(shift);
      setShiftsHistory(history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, [fetchData]);

  if (!mounted) return null;

  // --- Computed values ---
  const transactions = activeShift?.transactions || [];
  const cashSales = transactions
    .filter((t) => t.type === "sale_cash")
    .reduce((s, t) => s + Number(t.amount), 0);
  const cardSales = transactions
    .filter((t) => t.type === "sale_card")
    .reduce((s, t) => s + Number(t.amount), 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);
  const cashOuts = transactions
    .filter((t) => t.type === "cash_out")
    .reduce((s, t) => s + Number(t.amount), 0);
  const openBal = Number(activeShift?.opening_balance || 0);
  const expectedBalance = openBal + cashSales + income - expenses - cashOuts;
  const totalSales = cashSales + cardSales;
  const totalTransactions = transactions.filter((t) => t.type !== "opening").length;

  // Shift duration
  const shiftDuration = activeShift?.start_time
    ? (() => {
        const ms = Date.now() - new Date(activeShift.start_time).getTime();
        const hrs = Math.floor(ms / 3600000);
        const mins = Math.floor((ms % 3600000) / 60000);
        return `${hrs}h ${mins}m`;
      })()
    : "--";

  // --- Handlers ---
  const handleOpenShift = async () => {
    if (!user) return;
    setIsOpening(true);
    const res = await openShift(user.id, Number(openingBalance) || 0);
    if (res.success) {
      await fetchData();
      setOpeningBalance("500");
    } else {
      alert(res.error);
    }
    setIsOpening(false);
  };

  const handleCloseShift = async () => {
    if (!activeShift) return;
    setIsClosing(true);
    const res = await closeShift(activeShift.id, Number(actualBalance) || 0);
    if (res.success) {
      setShowCloseModal(false);
      setActualBalance("");
      await fetchData();
    } else {
      alert(res.error);
    }
    setIsClosing(false);
  };

  const handleAddTransaction = async () => {
    if (!activeShift || !txAmount) return;
    setIsAddingTx(true);
    const res = await addTransaction(
      activeShift.id,
      Number(txAmount),
      txType,
      txDescription || undefined
    );
    if (res.success) {
      setShowAddTx(false);
      setTxAmount("");
      setTxDescription("");
      setTxType("expense");
      await fetchData();
    } else {
      alert(res.error);
    }
    setIsAddingTx(false);
  };

  const handleCashOut = async () => {
    if (!activeShift || !coAmount || !coReason.trim()) return;
    setIsCashingOut(true);
    const res = await cashOutFromDrawer({
      shiftId:   activeShift.id,
      amount:    Number(coAmount),
      subType:   coSubType,
      reason:    coReason.trim(),
      reference: coReference.trim() || undefined,
    });
    if (res.success) {
      setShowCashOut(false);
      setCoAmount("");
      setCoReason("");
      setCoReference("");
      setCoSubType("paid_out");
      await fetchData();
    } else {
      alert(res.error);
    }
    setIsCashingOut(false);
  };

  // Transaction type UI helper
  const txTypeUi = (type: string) => {
    switch (type) {
      case "sale_cash":
        return { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", label: "Sale (Cash)", icon: "payments", sign: "+" };
      case "sale_card":
        return { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", label: "Sale (Card)", icon: "credit_card", sign: "+" };
      case "expense":
        return { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-400", label: "Expense", icon: "trending_down", sign: "-" };
      case "income":
        return { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", label: "Income", icon: "trending_up", sign: "+" };
      case "opening":
        return { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", label: "Opening", icon: "lock_open", sign: "" };
      case "cash_out":
        return { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", label: "Cash Out", icon: "output", sign: "-" };
      default:
        return { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", label: type, icon: "receipt", sign: "" };
    }
  };

  // --- Loading ---
  if (loading) {
    return (
      <div className="p-8 w-full flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
          <p className="font-bold uppercase tracking-widest text-xs animate-pulse">Loading Cash Register...</p>
        </div>
      </div>
    );
  }

  // --- No Active Shift: Open Shift Screen ---
  if (!activeShift) {
    return (
      <div className="p-8 space-y-10 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
        {/* Header */}
        <div className="flex justify-between items-end bg-white dark:bg-background border border-slate-200 dark:border-primary/10 p-8 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-navy-800 dark:text-white uppercase tracking-tight">Cash Register & Shift Control</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Manage shifts, track cash flow, and reconcile balances.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab(activeTab === "current" ? "history" : "current")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-pill border border-slate-200 dark:border-primary/20 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-primary/5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              {activeTab === "current" ? "Shift History" : "Current"}
            </button>
          </div>
        </div>

        {activeTab === "current" ? (
          /* Open Shift Card */
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl shadow-lg p-12 max-w-lg w-full text-center space-y-8">
              <div className="size-20 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl">point_of_sale</span>
              </div>
              <div>
                <h2 className="text-2xl font-black text-navy-800 dark:text-white mb-2">No Active Shift</h2>
                <p className="text-slate-500 text-sm">Open a new shift to start recording transactions and managing the cash register.</p>
              </div>

              <div className="text-left space-y-3">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Opening Balance ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xl select-none">$</span>
                  <input
                    type="number"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    className="w-full text-2xl font-black py-3 pl-10 pr-4 border-2 border-slate-200 dark:border-primary/20 rounded-xl bg-white dark:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[200, 500, 1000, 2000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setOpeningBalance(val.toString())}
                      className="py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg font-bold text-sm text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors"
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={isOpening}
                onClick={handleOpenShift}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isOpening ? (
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                ) : (
                  <span className="material-symbols-outlined">play_arrow</span>
                )}
                Open New Shift
              </button>
            </div>
          </div>
        ) : (
          /* Shift History */
          <ShiftHistoryList shifts={shiftsHistory} txTypeUi={txTypeUi} />
        )}
      </div>
    );
  }

  // --- Active Shift: Full Dashboard ---
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white dark:bg-background border border-slate-200 dark:border-primary/10 p-8 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-navy-800 dark:text-white uppercase tracking-tight">Cash Register & Shift Control</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">
            Shift opened by {activeShift.profile?.full_name || "Cashier"} — tracking live cash flow.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab(activeTab === "current" ? "history" : "current")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-pill border border-slate-200 dark:border-primary/20 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-primary/5 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            {activeTab === "current" ? "History" : "Current Shift"}
          </button>
          <button
            onClick={fetchData}
            className="flex items-center justify-center p-3 rounded-pill border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">refresh</span>
          </button>
          <button
            onClick={() => { setCoAmount(""); setCoReason(""); setCoReference(""); setCoSubType("paid_out"); setShowCashOut(true); }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-pill bg-orange-500 text-white hover:bg-orange-600 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-500/20"
          >
            <span className="material-symbols-outlined text-[16px]">output</span>
            Cash Out
          </button>
          <button
            onClick={() => { setActualBalance(""); setShowCloseModal(true); }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-pill bg-rose-500 text-white hover:bg-rose-600 transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-500/20"
          >
            <span className="material-symbols-outlined text-[16px]">lock</span>
            Close Shift
          </button>
        </div>
      </div>

      {activeTab === "current" ? (
        <>
          {/* Shift Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 rounded-2xl p-5 bg-white dark:bg-background border border-slate-200 dark:border-primary/10 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Cashier</p>
                <p className="text-lg font-black text-navy-800 dark:text-white">{activeShift.profile?.full_name || user?.full_name || "Cashier"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl p-5 bg-white dark:bg-background border border-slate-200 dark:border-primary/10 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Shift Started</p>
                <p className="text-lg font-black text-navy-800 dark:text-white">
                  {new Date(activeShift.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl p-5 bg-white dark:bg-background border border-slate-200 dark:border-primary/10 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">timer</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Duration</p>
                <p className="text-lg font-black text-navy-800 dark:text-white">{shiftDuration}</p>
              </div>
            </div>
          </div>

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
            <FinancialCard label="Opening Balance" value={openBal} color="slate" icon="lock_open" />
            <FinancialCard label="Cash Sales" value={cashSales} color="emerald" icon="payments" positive />
            <FinancialCard label="Card Sales" value={cardSales} color="blue" icon="credit_card" positive />
            <FinancialCard label="Other Income" value={income} color="amber" icon="trending_up" positive />
            <FinancialCard label="Expenses" value={expenses} color="rose" icon="trending_down" negative />
            <FinancialCard label="Cash Outs" value={cashOuts} color="orange" icon="output" negative />
            {/* Expected Balance - highlighted */}
            <div className="flex flex-col gap-2 rounded-2xl p-6 bg-primary text-white border border-primary/20 shadow-xl shadow-primary/20 ring-4 ring-primary/10 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="material-symbols-outlined text-[128px]">check_circle</span>
              </div>
              <p className="text-white/80 text-[10px] font-black uppercase tracking-widest relative z-10">Expected Cash</p>
              <p className="text-2xl font-black relative z-10">
                ${expectedBalance.toFixed(2)}
              </p>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded bg-white/20 text-white self-start relative z-10">
                Reconciliation Target
              </span>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Sales</p>
              <p className="text-xl font-black text-navy-800 dark:text-white">${totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Transactions</p>
              <p className="text-xl font-black text-navy-800 dark:text-white">{totalTransactions}</p>
            </div>
            <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Avg Transaction</p>
              <p className="text-xl font-black text-navy-800 dark:text-white">
                ${totalTransactions > 0 ? (totalSales / totalTransactions).toFixed(2) : "0.00"}
              </p>
            </div>
            <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Cash vs Card</p>
              <p className="text-xl font-black text-navy-800 dark:text-white">
                {totalSales > 0 ? Math.round((cashSales / totalSales) * 100) : 0}% / {totalSales > 0 ? Math.round((cardSales / totalSales) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Transaction Log */}
          <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-8 py-5 border-b border-slate-100 dark:border-primary/10 flex justify-between items-center">
              <h3 className="font-black text-lg text-navy-800 dark:text-white uppercase tracking-tight">Transaction Log</h3>
              <button
                onClick={() => setShowAddTx(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-pill bg-primary text-white hover:bg-primary/90 transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add Entry
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-primary/5 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100 dark:border-primary/10">
                    <th className="px-8 py-4">Time</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                        No transactions yet — sales will appear here automatically.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => {
                      const ui = txTypeUi(tx.type);
                      return (
                        <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-primary/5 transition-colors">
                          <td className="px-8 py-4 text-sm font-bold text-navy-800 dark:text-white">
                            {new Date(tx.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", ui.bg, ui.text)}>
                              <span className="material-symbols-outlined text-[14px]">{ui.icon}</span>
                              {ui.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                            {tx.description || "--"}
                          </td>
                          <td className={cn("px-6 py-4 text-sm font-black text-right", {
                            "text-emerald-600 dark:text-emerald-400": ui.sign === "+",
                            "text-rose-600 dark:text-rose-400": ui.sign === "-",
                            "text-slate-700 dark:text-slate-300": ui.sign === "",
                          })}>
                            {ui.sign}${Number(tx.amount).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {transactions.length > 0 && (
              <div className="px-8 py-4 bg-slate-50 dark:bg-primary/5 border-t border-slate-100 dark:border-primary/10 text-sm text-slate-500 font-medium">
                Showing {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} this shift
              </div>
            )}
          </div>

          {/* Reconciliation Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
              <div className="bg-white dark:bg-background p-5 rounded-2xl shadow-xl shadow-primary/10 w-full md:w-auto">
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Cash in Drawer</span>
                  <span className="text-4xl font-black text-primary">${expectedBalance.toFixed(2)}</span>
                  <div className="w-full bg-slate-100 dark:bg-primary/10 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(100, (expectedBalance / Math.max(openBal * 3, 1)) * 100)}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
                <h4 className="text-xl font-black text-navy-800 dark:text-white mb-2">Ready to Close?</h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-5 max-w-sm">
                  Count the physical cash in the drawer and match it against the expected balance (${expectedBalance.toFixed(2)}) before closing the shift.
                </p>
                <button
                  onClick={() => { setActualBalance(""); setShowCloseModal(true); }}
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">calculate</span>
                  Start Reconciliation
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl p-8 shadow-sm">
              <h4 className="font-black text-lg text-navy-800 dark:text-white mb-6 uppercase tracking-tight">Shift Breakdown</h4>
              <div className="space-y-5">
                <BreakdownRow label="Opening Balance" value={openBal} total={expectedBalance} color="bg-slate-400" />
                <BreakdownRow label="Cash Sales" value={cashSales} total={expectedBalance} color="bg-emerald-500" />
                <BreakdownRow label="Card Sales (Digital)" value={cardSales} total={expectedBalance} color="bg-blue-500" />
                <BreakdownRow label="Other Income" value={income} total={expectedBalance} color="bg-amber-500" />
                <BreakdownRow label="Expenses" value={expenses} total={expectedBalance} color="bg-rose-500" />
                <BreakdownRow label="Cash Outs" value={cashOuts} total={expectedBalance} color="bg-orange-500" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <ShiftHistoryList shifts={shiftsHistory} txTypeUi={txTypeUi} />
      )}

      {/* ── Cash Out Modal ── */}
      {showCashOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-2xl shadow-2xl w-full max-w-lg p-8 space-y-6 animate-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">output</span>
                </div>
                <div>
                  <h3 className="font-black text-xl text-navy-800 dark:text-white">Cash Out from Drawer</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Record cash removed from the register</p>
                </div>
              </div>
              <button
                onClick={() => setShowCashOut(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Sub-type selector */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Reason for Withdrawal</label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { id: "paid_out",  label: "Paid Out",     icon: "shopping_bag",     desc: "Pay vendor, delivery, supplies" },
                  { id: "safe_drop", label: "Safe Drop",    icon: "lock",             desc: "Transfer excess cash to safe" },
                  { id: "advance",   label: "Advance",      icon: "person_apron",     desc: "Personal advance against wages" },
                  { id: "other",     label: "Other",        icon: "more_horiz",       desc: "Other authorised withdrawal" },
                ] as const).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCoSubType(opt.id)}
                    className={cn(
                      "flex flex-col items-start p-3.5 border-2 rounded-xl transition-all text-left",
                      coSubType === opt.id
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                        : "border-slate-200 dark:border-primary/20 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("material-symbols-outlined text-[18px]", coSubType === opt.id ? "text-orange-600 dark:text-orange-400" : "text-slate-400")}>
                        {opt.icon}
                      </span>
                      <span className={cn("font-bold text-sm", coSubType === opt.id ? "text-orange-700 dark:text-orange-300" : "text-slate-600 dark:text-slate-300")}>
                        {opt.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Amount ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xl select-none">$</span>
                <input
                  type="number"
                  value={coAmount}
                  onChange={(e) => setCoAmount(e.target.value)}
                  className="w-full text-2xl font-black py-3 pl-10 pr-4 border-2 border-slate-200 dark:border-primary/20 rounded-xl bg-white dark:bg-background focus:ring-4 focus:ring-orange-400/20 focus:border-orange-400 outline-none transition-all"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  autoFocus
                />
              </div>
              {/* Quick amounts */}
              <div className="grid grid-cols-5 gap-2 mt-2">
                {[5, 10, 20, 50, 100].map((v) => (
                  <button
                    key={v}
                    onClick={() => setCoAmount(v.toString())}
                    className="py-1.5 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-orange-400 hover:text-orange-600 transition-colors"
                  >
                    ${v}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason (required) */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                Description <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={coReason}
                onChange={(e) => setCoReason(e.target.value)}
                className="w-full py-3 px-4 border-2 border-slate-200 dark:border-primary/20 rounded-xl bg-white dark:bg-background focus:ring-4 focus:ring-orange-400/20 focus:border-orange-400 outline-none transition-all text-sm font-medium"
                placeholder={
                  coSubType === "paid_out"  ? "e.g. Paid delivery driver for morning supplies" :
                  coSubType === "safe_drop" ? "e.g. Drawer over $500 float — dropping $200 to safe" :
                  coSubType === "advance"   ? "e.g. Salary advance for Ahmed — approved by manager" :
                  "Describe the reason for withdrawal..."
                }
                maxLength={150}
              />
              <p className="text-[10px] text-slate-400 mt-1 text-right">{coReason.length}/150</p>
            </div>

            {/* Optional Reference */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                Reference / Receipt No. <span className="text-slate-300 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={coReference}
                onChange={(e) => setCoReference(e.target.value)}
                className="w-full py-2.5 px-4 border-2 border-slate-200 dark:border-primary/20 rounded-xl bg-white dark:bg-background focus:ring-4 focus:ring-orange-400/20 focus:border-orange-400 outline-none transition-all text-sm font-medium"
                placeholder="e.g. INV-0042 or receipt number"
              />
            </div>

            {/* Expected cash after this withdrawal */}
            {coAmount && Number(coAmount) > 0 && (
              <div className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl border-2",
                Number(coAmount) > expectedBalance
                  ? "border-rose-300 bg-rose-50 dark:bg-rose-900/20"
                  : "border-orange-200 bg-orange-50 dark:bg-orange-900/10"
              )}>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">Cash after withdrawal</p>
                  <p className={cn("text-xl font-black mt-0.5", Number(coAmount) > expectedBalance ? "text-rose-600" : "text-orange-600 dark:text-orange-400")}>
                    ${(expectedBalance - Number(coAmount)).toFixed(2)}
                  </p>
                </div>
                {Number(coAmount) > expectedBalance && (
                  <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    Exceeds drawer balance!
                  </div>
                )}
              </div>
            )}

            {/* Confirm button */}
            <button
              disabled={isCashingOut || !coAmount || !coReason.trim() || Number(coAmount) <= 0}
              onClick={handleCashOut}
              className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 focus:ring-4 focus:ring-orange-500/30 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isCashingOut ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <span className="material-symbols-outlined">output</span>
              )}
              Confirm Cash Out
              {coAmount && Number(coAmount) > 0 ? ` — $${Number(coAmount).toFixed(2)}` : ""}
            </button>
          </div>
        </div>
      )}

      {/* Close Shift Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-xl text-navy-800 dark:text-white">Close Shift</h3>
              <button onClick={() => setShowCloseModal(false)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Expected Cash Balance</span>
                <span className="font-black text-navy-800 dark:text-white">${expectedBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Sales</span>
                <span className="font-bold text-emerald-600">${totalSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Expenses</span>
                <span className="font-bold text-rose-600">-${expenses.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-primary/10 pt-4 space-y-3">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Actual Cash Counted ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xl select-none">$</span>
                <input
                  type="number"
                  value={actualBalance}
                  onChange={(e) => setActualBalance(e.target.value)}
                  className="w-full text-2xl font-black py-3 pl-10 pr-4 border-2 border-slate-200 dark:border-primary/20 rounded-xl bg-white dark:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setActualBalance(expectedBalance.toFixed(2))}
                className="w-full py-2 border border-dashed border-primary/40 rounded-lg text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
              >
                Use expected — ${expectedBalance.toFixed(2)}
              </button>
            </div>

            {/* Discrepancy display */}
            {actualBalance && (() => {
              const diff = Number(actualBalance) - expectedBalance;
              if (Math.abs(diff) < 0.01) {
                return (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg">
                    <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Perfect match — no discrepancy</span>
                  </div>
                );
              }
              return (
                <div className={cn("flex items-center justify-between p-3 rounded-lg border", diff > 0 ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700" : "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700")}>
                  <div className="flex items-center gap-2">
                    <span className={cn("material-symbols-outlined", diff > 0 ? "text-blue-600" : "text-rose-600")}>
                      {diff > 0 ? "arrow_upward" : "arrow_downward"}
                    </span>
                    <span className={cn("text-sm font-bold", diff > 0 ? "text-blue-700 dark:text-blue-400" : "text-rose-700 dark:text-rose-400")}>
                      {diff > 0 ? "Overage" : "Shortage"}
                    </span>
                  </div>
                  <span className={cn("text-lg font-black", diff > 0 ? "text-blue-600" : "text-rose-600")}>
                    {diff > 0 ? "+" : ""}${diff.toFixed(2)}
                  </span>
                </div>
              );
            })()}

            <button
              disabled={isClosing || !actualBalance}
              onClick={handleCloseShift}
              className="w-full py-4 bg-rose-500 text-white rounded-xl font-bold text-lg hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isClosing ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <span className="material-symbols-outlined">lock</span>
              )}
              Close & Lock Shift
            </button>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-xl text-navy-800 dark:text-white">Add Transaction</h3>
              <button onClick={() => setShowAddTx(false)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "expense", label: "Expense", icon: "trending_down", color: "rose" },
                    { id: "income", label: "Income", icon: "trending_up", color: "emerald" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setTxType(opt.id)}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all",
                        txType === opt.id
                          ? `border-${opt.color}-500 bg-${opt.color}-50 dark:bg-${opt.color}-900/20 text-${opt.color}-600`
                          : "border-slate-200 dark:border-primary/20 hover:border-slate-300 text-slate-500"
                      )}
                    >
                      <span className="material-symbols-outlined text-2xl mb-1">{opt.icon}</span>
                      <span className="font-bold text-sm">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg select-none">$</span>
                  <input
                    type="number"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full text-xl font-black py-3 pl-10 pr-4 border-2 border-slate-200 dark:border-primary/20 rounded-xl bg-white dark:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                <input
                  type="text"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  className="w-full py-3 px-4 border-2 border-slate-200 dark:border-primary/20 rounded-xl bg-white dark:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                  placeholder="e.g. Cleaning supplies, Tips received..."
                />
              </div>
            </div>

            <button
              disabled={isAddingTx || !txAmount}
              onClick={handleAddTransaction}
              className={cn(
                "w-full py-4 text-white rounded-xl font-bold text-lg transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2",
                txType === "expense"
                  ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                  : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
              )}
            >
              {isAddingTx ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <span className="material-symbols-outlined">add_circle</span>
              )}
              Record {txType === "expense" ? "Expense" : "Income"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function FinancialCard({ label, value, color, icon, positive, negative }: {
  label: string;
  value: number;
  color: string;
  icon: string;
  positive?: boolean;
  negative?: boolean;
}) {
  const colorMap: Record<string, string> = {
    slate:   "bg-slate-100 dark:bg-slate-800 text-slate-500",
    emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    blue:    "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    amber:   "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    rose:    "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
    orange:  "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  };

  return (
    <div className="flex flex-col gap-2 rounded-2xl p-5 bg-white dark:bg-background border border-slate-200 dark:border-primary/10 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className={cn("material-symbols-outlined text-[18px]", colorMap[color]?.split(" ").pop())}>{icon}</span>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
      </div>
      <p className={cn("text-xl font-black", negative ? "text-rose-600 dark:text-rose-400" : "text-navy-800 dark:text-white")}>
        {negative ? "-" : ""}${value.toFixed(2)}
      </p>
    </div>
  );
}

function BreakdownRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between items-center text-sm font-bold mb-2">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="text-navy-800 dark:text-white">${value.toFixed(2)}</span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-primary/10 h-2.5 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ShiftHistoryList({ shifts, txTypeUi }: { shifts: ShiftData[]; txTypeUi: (type: string) => any }) {
  const [expandedShift, setExpandedShift] = useState<string | null>(null);
  const closedShifts = shifts.filter((s) => s.status === "closed");

  if (closedShifts.length === 0) {
    return (
      <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 p-12 rounded-2xl shadow-sm text-center">
        <div className="size-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl">history</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-navy-800 dark:text-white">No Shift History</h3>
        <p className="text-slate-500">Closed shifts will appear here for review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {closedShifts.map((shift) => {
        const txs = shift.transactions || [];
        const sCash = txs.filter((t) => t.type === "sale_cash").reduce((s, t) => s + Number(t.amount), 0);
        const sCard = txs.filter((t) => t.type === "sale_card").reduce((s, t) => s + Number(t.amount), 0);
        const sExpenses = txs.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
        const sCashOuts = txs.filter((t) => t.type === "cash_out").reduce((s, t) => s + Number(t.amount), 0);
        const sTotal = sCash + sCard;
        const diff = shift.actual_balance != null ? Number(shift.actual_balance) - Number(shift.expected_balance) : null;
        const isExpanded = expandedShift === shift.id;

        return (
          <div key={shift.id} className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedShift(isExpanded ? null : shift.id)}
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className="size-12 rounded-xl bg-slate-100 dark:bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">event</span>
                </div>
                <div className="text-left">
                  <p className="font-black text-navy-800 dark:text-white">
                    {new Date(shift.start_time).toLocaleDateString()} — {shift.profile?.full_name || "Cashier"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {new Date(shift.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {shift.end_time && ` → ${new Date(shift.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                    {" · "}Sales: ${sTotal.toFixed(2)} · Expenses: ${sExpenses.toFixed(2)}{sCashOuts > 0 && ` · Cash Out: $${sCashOuts.toFixed(2)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {diff !== null && (
                  <span className={cn("px-3 py-1 rounded-pill text-[10px] font-black uppercase tracking-wider", Math.abs(diff) < 0.01 ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700" : diff > 0 ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700" : "bg-rose-100 dark:bg-rose-900/30 text-rose-700")}>
                    {Math.abs(diff) < 0.01 ? "Balanced" : diff > 0 ? `+$${diff.toFixed(2)} Over` : `-$${Math.abs(diff).toFixed(2)} Short`}
                  </span>
                )}
                <span className={cn("material-symbols-outlined transition-transform duration-200 text-slate-400", isExpanded && "rotate-180")}>expand_more</span>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-slate-100 dark:border-primary/10 px-8 py-6 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Opening</p>
                    <p className="text-lg font-black text-navy-800 dark:text-white">${Number(shift.opening_balance).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Cash Sales</p>
                    <p className="text-lg font-black text-emerald-600">${sCash.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Card Sales</p>
                    <p className="text-lg font-black text-blue-600">${sCard.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Expected</p>
                    <p className="text-lg font-black text-primary">${Number(shift.expected_balance).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Actual</p>
                    <p className="text-lg font-black text-navy-800 dark:text-white">${shift.actual_balance != null ? Number(shift.actual_balance).toFixed(2) : "--"}</p>
                  </div>
                </div>

                {txs.length > 0 && (
                  <div className="overflow-x-auto border border-slate-100 dark:border-primary/10 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-primary/5 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                          <th className="px-4 py-3">Time</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-primary/5">
                        {txs.map((tx) => {
                          const ui = txTypeUi(tx.type);
                          return (
                            <tr key={tx.id} className="text-sm">
                              <td className="px-4 py-3 font-bold text-navy-800 dark:text-white">
                                {new Date(tx.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </td>
                              <td className="px-4 py-3">
                                <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase", ui.bg, ui.text)}>
                                  {ui.label}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-500">{tx.description || "--"}</td>
                              <td className={cn("px-4 py-3 font-black text-right", ui.sign === "+" ? "text-emerald-600" : ui.sign === "-" ? "text-rose-600" : "text-slate-600")}>
                                {ui.sign}${Number(tx.amount).toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
