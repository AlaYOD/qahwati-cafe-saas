"use client";

import { Bell, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 sm:px-8">
      {/* Search Input */}
      <div className="flex w-full items-center gap-2 md:w-[400px]">
        <div className="relative flex w-full flex-grow items-center">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="search"
            placeholder="Search orders, items, or tables..."
            className="block w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:bg-slate-900"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border bg-white text-slate-500 hover:bg-slate-50 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l pl-4">
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-slate-900">Amani Manager</span>
            <span className="text-xs font-medium text-slate-500">Admin</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white shadow-md shadow-primary/20">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}
