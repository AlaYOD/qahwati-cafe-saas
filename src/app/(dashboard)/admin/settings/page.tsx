"use client";

export default function AdminSettingsPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">System Configuration</h1>
          <p className="text-sm text-slate-500">Manage tax rates, POS profiles, store details, and styling.</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm">
          <span className="material-symbols-outlined text-sm mr-2">save</span>
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark p-4 rounded-xl shadow-sm">
          <h3 className="font-bold text-sm mb-4 px-2">Settings Menu</h3>
          <nav className="space-y-1">
            <button className="w-fulltext-left px-3 py-2 bg-primary/10 text-primary font-medium rounded-lg text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">storefront</span> Store Profile
            </button>
            <button className="w-full text-left px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-primary/5 font-medium rounded-lg text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">receipt</span> Taxes & Receipts
            </button>
            <button className="w-full text-left px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-primary/5 font-medium rounded-lg text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">payments</span> Payment Methods
            </button>
          </nav>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-background-dark p-8 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm flex flex-col items-center justify-center text-center">
             <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
               <span className="material-symbols-outlined text-3xl text-primary">build</span>
             </div>
             <h2 className="text-lg font-bold mb-1">Configuration Modules Soon</h2>
        </div>
      </div>
    </div>
  );
}
