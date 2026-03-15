"use client";
import React from 'react';
import { CircleHelp, Plus, Archive, CreditCard, Filter, ArrowUpRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/inventory/StatCard';
import { InventoryTable } from '@/components/inventory/InventoryTable';

export default function InventoryManagement() {
  return (
    <AppLayout>
      <main className="flex-1 flex flex-col p-6 md:p-8 gap-8 overflow-y-auto w-full bg-slate-50">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 text-4xl font-black tracking-tight">Inventory</h1>
            <p className="text-slate-500 font-medium">Manage stock levels, costs, and historical records.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center gap-2 bg-slate-200 text-slate-700 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-slate-300 transition-colors">
              Export History
            </button>
            <button className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Plus className="size-5" />
              Add New Item
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Items" 
            value="145" 
            subtitle="+12 added this month"
            icon={Archive}
            subtitleIcon={ArrowUpRight}
            trend="up"
          />
          <StatCard 
            title="Inventory Value" 
            value="$4,250.00" 
            subtitle="Based on current unit cost"
            icon={CreditCard}
            subtitleIcon={CircleHelp}
            trend="neutral"
          />
          <StatCard 
            title="Low Stock Alerts" 
            value="5" 
            subtitle="Requires immediate reorder"
            icon={CircleHelp}
            subtitleIcon={CircleHelp}
            alert={true}
          />
        </div>

        {/* Main Table Section */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Table Toolbar */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Current Stock Lists</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Last synced 5 mins ago</p>
            </div>
            
            <div className="flex gap-3">
              <button className="px-5 py-2.5 text-sm font-bold text-slate-700 border-2 border-slate-100 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center gap-2">
                <Filter className="size-4" />
                Filter View
              </button>
            </div>
          </div>

          <InventoryTable />

          {/* Table Footer / Pagination */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-500">Showing 1 to 5 of 45 entries</p>
            
            <div className="flex gap-1.5 items-center">
              <button className="p-2 border-2 border-slate-200 rounded-lg bg-white disabled:opacity-50 text-slate-400">
                <CircleHelp className="size-4" />
              </button>
              <button className="px-3.5 py-1.5 border-2 border-primary text-primary font-black rounded-lg bg-primary/10 shadow-sm">1</button>
              <button className="px-3.5 py-1.5 border-2 border-slate-100 text-slate-500 font-bold rounded-lg bg-white hover:bg-slate-50 transition-colors">2</button>
              <button className="px-3.5 py-1.5 border-2 border-slate-100 text-slate-500 font-bold rounded-lg bg-white hover:bg-slate-50 transition-colors">3</button>
              <button className="p-2 border-2 border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 transition-colors">
                <CircleHelp className="size-4" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
