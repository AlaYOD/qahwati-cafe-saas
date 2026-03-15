import React from 'react';
import { Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TableGrid } from '@/components/tables/TableGrid';

export default function TableManagement() {
  return (
    <AppLayout>
      <main className="flex-1 flex flex-col p-6 md:p-8 gap-8 overflow-y-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 text-4xl font-black tracking-tight">Tables</h1>
            <div className="flex items-center gap-2.5 bg-slate-100 w-fit px-3 py-1.5 rounded-full border border-slate-200">
              <span className="flex size-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"></span>
              <p className="text-slate-600 text-sm font-semibold tracking-wide">8 occupied of 15 tables</p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto">
            <Plus className="size-5" />
            New Reservation
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar border-b border-slate-200">
          <button className="flex h-10 shrink-0 items-center justify-center px-6 rounded-t-xl border-b-2 border-primary text-primary text-sm font-bold bg-primary/5 transition-all">
            All Tables
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center px-6 rounded-t-xl border-b-2 border-transparent text-slate-500 hover:text-slate-900 text-sm font-bold hover:bg-slate-50 transition-all">
            Available
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center px-6 rounded-t-xl border-b-2 border-transparent text-slate-500 hover:text-slate-900 text-sm font-bold hover:bg-slate-50 transition-all">
            Occupied
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center px-6 rounded-t-xl border-b-2 border-transparent text-slate-500 hover:text-slate-900 text-sm font-bold hover:bg-slate-50 transition-all">
            Reserved
          </button>
        </div>

        {/* Tables Grid */}
        <TableGrid />
      </main>
    </AppLayout>
  );
}
