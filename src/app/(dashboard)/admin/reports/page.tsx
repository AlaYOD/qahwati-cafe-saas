"use client";

export default function AdminReportsPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Financial Reports & POS Analytics</h1>
          <p className="text-sm text-slate-500">View detailed sales metrics, cashier closures, and tax sums.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center px-4 py-2 rounded-lg bg-white border border-slate-200 dark:bg-primary/10 dark:border-primary/20 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-sm mr-2">download</span>
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-background-dark p-12 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-4xl text-primary">bar_chart</span>
        </div>
        <h2 className="text-xl font-bold mb-2">Metrics Chart System Pending</h2>
      </div>
    </div>
  );
}
