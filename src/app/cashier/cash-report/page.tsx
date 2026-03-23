"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { getActiveShift, openShift, closeShift, addTransaction } from "@/actions/shifts";

export default function CashierCashReportPage() {
  const { user } = useAuth();
  const [shift, setShift] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openingBalance, setOpeningBalance] = useState("");
  const [closingBalance, setClosingBalance] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = () => {
    setLoading(true);
    getActiveShift()
      .then(setShift)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleOpenShift = async () => {
    if (!user?.id || !openingBalance) return;
    setSaving(true);
    const res = await openShift(user.id, Number(openingBalance));
    setSaving(false);
    if (res.success) { showMsg("success", "Shift opened successfully"); load(); setOpeningBalance(""); }
    else showMsg("error", res.error || "Failed to open shift");
  };

  const handleCloseShift = async () => {
    if (!shift || !closingBalance) return;
    setSaving(true);
    const res = await closeShift(shift.id, Number(closingBalance));
    setSaving(false);
    if (res.success) { showMsg("success", "Shift closed successfully"); load(); setClosingBalance(""); }
    else showMsg("error", res.error || "Failed to close shift");
  };

  const handleAddExpense = async () => {
    if (!shift || !expenseAmount) return;
    setSaving(true);
    const res = await addTransaction(shift.id, Number(expenseAmount), "expense", expenseDesc || "Expense");
    setSaving(false);
    if (res.success) { showMsg("success", "Expense recorded"); load(); setExpenseAmount(""); setExpenseDesc(""); }
    else showMsg("error", res.error || "Failed to add expense");
  };

  const cashSales = shift?.transactions?.filter((t: any) => t.type === "sale_cash").reduce((s: number, t: any) => s + Number(t.amount), 0) || 0;
  const cardSales = shift?.transactions?.filter((t: any) => t.type === "sale_card").reduce((s: number, t: any) => s + Number(t.amount), 0) || 0;
  const expenses = shift?.transactions?.filter((t: any) => t.type === "expense").reduce((s: number, t: any) => s + Number(t.amount), 0) || 0;
  const expectedCash = shift ? Number(shift.opening_balance) + cashSales - expenses : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Daily Cash Report</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage shift opening, closing, and transactions</p>
      </div>

      {message && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === "success"
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          <span className="material-symbols-outlined text-sm">{message.type === "success" ? "check_circle" : "error"}</span>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading...
        </div>
      ) : !shift ? (
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-6">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">No Active Shift</h2>
              <p className="text-sm text-slate-500 mt-1">Open a shift to start recording transactions</p>
            </div>
            <div className="text-left space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Opening Balance (SAR)</label>
              <input
                type="number"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-primary/5 border border-primary/20 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary text-center"
                min="0"
                step="0.01"
              />
            </div>
            <button
              onClick={handleOpenShift}
              disabled={saving || !openingBalance}
              className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {saving ? "Opening..." : "Open Shift"}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Opening Balance", value: `$${Number(shift.opening_balance).toFixed(2)}`, icon: "play_circle", color: "text-blue-500" },
                { label: "Cash Sales", value: `$${cashSales.toFixed(2)}`, icon: "payments", color: "text-emerald-500" },
                { label: "Card Sales", value: `$${cardSales.toFixed(2)}`, icon: "credit_card", color: "text-primary" },
                { label: "Expenses", value: `$${expenses.toFixed(2)}`, icon: "trending_down", color: "text-red-500" },
              ].map((s) => (
                <div key={s.label} className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-3">
                  <span className={`material-symbols-outlined ${s.color} text-sm mb-1 block`}>{s.icon}</span>
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-semibold">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-slate-900 dark:text-slate-100">Expected Cash in Drawer</h2>
                <span className="text-2xl font-black text-primary">${expectedCash.toFixed(2)}</span>
              </div>
              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex justify-between">
                  <span>Opening balance</span>
                  <span>${Number(shift.opening_balance).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>+ Cash sales</span>
                  <span>+${cashSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>- Expenses</span>
                  <span>-${expenses.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-primary/10 bg-slate-50 dark:bg-primary/10">
                <h2 className="font-bold text-sm text-slate-700 dark:text-slate-300">Transaction Log</h2>
              </div>
              <div className="divide-y divide-primary/5 max-h-64 overflow-y-auto">
                {shift.transactions?.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 text-sm">No transactions yet</p>
                ) : (
                  shift.transactions?.map((tx: any) => (
                    <div key={tx.id} className="flex items-center justify-between px-4 py-2.5">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{tx.description || tx.type}</p>
                        <p className="text-xs text-slate-400">{new Date(tx.created_at).toLocaleTimeString()}</p>
                      </div>
                      <span className={`font-bold text-sm ${
                        tx.type === "expense" ? "text-red-500" : "text-emerald-500"
                      }`}>
                        {tx.type === "expense" ? "-" : "+"}${Number(tx.amount).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-4">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">add_circle</span>
                Record Expense
              </h2>
              <input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="Amount"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-primary/5 border border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
                step="0.01"
              />
              <input
                type="text"
                value={expenseDesc}
                onChange={(e) => setExpenseDesc(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-primary/5 border border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleAddExpense}
                disabled={saving || !expenseAmount}
                className="w-full py-2.5 bg-primary/10 text-primary border border-primary/30 rounded-lg font-semibold text-sm hover:bg-primary/20 disabled:opacity-50 transition-colors"
              >
                Add Expense
              </button>
            </div>

            <div className="bg-white dark:bg-primary/5 border border-red-200 dark:border-red-800 rounded-xl p-5 space-y-4">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-sm">lock</span>
                Close Shift
              </h2>
              <p className="text-xs text-slate-500">Count the cash in drawer and enter the actual amount</p>
              <input
                type="number"
                value={closingBalance}
                onChange={(e) => setClosingBalance(e.target.value)}
                placeholder="Actual cash amount"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-primary/5 border border-red-200 dark:border-red-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                min="0"
                step="0.01"
              />
              <button
                onClick={handleCloseShift}
                disabled={saving || !closingBalance}
                className="w-full py-2.5 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                Close Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
