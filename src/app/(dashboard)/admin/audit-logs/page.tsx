"use client";

export default function AdminAuditLogsPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">System Audit Logs</h1>
          <p className="text-sm text-slate-500">Security tracker for sensitive POS actions like discounts, voiding, and refunds.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-background-dark p-12 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-4xl text-primary">security</span>
        </div>
        <h2 className="text-xl font-bold mb-2">Security Audit Table Pending</h2>
      </div>
    </div>
  );
}
