"use client";
import React from 'react';
import { Coffee, Search, Bell, Settings, CircleHelp } from 'lucide-react';
import { CategoryFilters } from '@/components/pos/CategoryFilters';
import { MenuGrid } from '@/components/pos/MenuGrid';
import { Cart } from '@/components/pos/Cart';

export default function POSOrderScreen() {
  return (
    <div className="bg-slate-50 text-slate-900 font-sans h-screen flex flex-col overflow-hidden antialiased">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 z-20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
              <Coffee className="text-xl stroke-[2.5]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Qahwati <span className="text-primary">POS</span></h1>
          </div>
          <div className="relative w-64 md:w-80 lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-slate-400 size-4" />
            </div>
            <input 
              type="text"
              placeholder="Search menu items..." 
              className="block w-full pl-10 pr-3 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 placeholder-slate-500 font-medium transition-shadow" 
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
            <Bell className="size-5" />
          </button>
          <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
            <Settings className="size-5" />
          </button>
          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">Sarah Jenkins</p>
              <p className="text-[11px] font-semibold text-primary mt-1 uppercase tracking-wider">Manager</p>
            </div>
            <div className="size-10 rounded-full bg-primary flex items-center justify-center border-2 border-primary/20 overflow-hidden font-bold text-white shadow-sm">
              SJ
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Left Panel: Product Menu (60%) */}
        <section className="w-[60%] flex flex-col bg-slate-50">
          <CategoryFilters />
          <MenuGrid />
        </section>

        {/* Right Panel: Current Order (40%) */}
        <Cart />
      </main>

      {/* Status Bar */}
      <footer className="bg-slate-900 px-6 py-2.5 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-bold z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-emerald-400">Terminal #1 Active</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-slate-700 pl-6">
            <CircleHelp className="size-3.5" />
            Server Connected
          </div>
        </div>
        <div className="text-slate-500">
          Tuesday, 14th Oct 2026 | 14:45 PM
        </div>
      </footer>
    </div>
  );
}
