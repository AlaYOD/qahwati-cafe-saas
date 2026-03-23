"use client";

import { useAuth } from "@/lib/auth/auth-context";

export function TopHeader() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-primary/10 px-8 py-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">Hello {user.full_name?.split(' ')[0] || "User"}, here is today summary</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time performance overview for your coffee shop.</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 rounded-lg border border-slate-200 dark:border-primary/30 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-sm">add</span>
            <span className="text-sm font-medium">New Order</span>
          </button>
        </div>
      </div>
    </header>
  );
}
