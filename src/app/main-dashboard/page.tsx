"use client";
import React from 'react';
import { CircleHelp, CreditCard, Receipt, Plus, Coffee, Utensils } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function MainDashboard() {
  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hello Ahmed, here is today summary</h2>
          <p className="text-sm text-slate-500">Real-time performance overview for your coffee shop.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus className="text-sm" />
            <span className="text-sm font-medium">New Order</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Row 1: Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-slate-500">Total Sales</p>
              <CreditCard className="p-2 bg-primary/10 text-primary rounded-lg size-8" />
            </div>
            <div>
              <p className="text-2xl font-bold">$1,240.00</p>
              <p className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-1">
                +12.5% vs yesterday
              </p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-slate-500">Orders</p>
              <Receipt className="p-2 bg-primary/10 text-primary rounded-lg size-8" />
            </div>
            <div>
              <p className="text-2xl font-bold">48</p>
              <p className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-1">
                +5.2% vs yesterday
              </p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-slate-500">Occupied Tables</p>
              <Utensils className="p-2 bg-primary/10 text-primary rounded-lg size-8" />
            </div>
            <div className="space-y-2 mt-2">
              <div className="flex justify-between items-center text-sm font-bold">
                <span>15/20</span>
                <span className="text-primary">75%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-slate-500">Cash Balance</p>
              <CreditCard className="p-2 bg-primary/10 text-primary rounded-lg size-8" />
            </div>
            <div>
              <p className="text-2xl font-bold">$850.50</p>
              <p className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-1">
                Cash drawer balanced
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Charts (Simplified for UI matching) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-bold text-lg">7-Day Sales</h3>
                <p className="text-xs text-slate-500">Revenue performance over the last week</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">$8,420</p>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-4 items-end h-48 px-2 border-b border-slate-100 pb-2">
              <div className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-md transition-colors h-1/2"></div>
                <span className="text-xs text-slate-400 font-medium">Mon</span>
              </div>
              <div className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-md transition-colors h-2/3"></div>
                <span className="text-xs text-slate-400 font-medium">Tue</span>
              </div>
              <div className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full bg-primary rounded-t-md h-full shadow-lg shadow-primary/20"></div>
                <span className="text-xs text-primary font-bold">Wed</span>
              </div>
              <div className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-md transition-colors h-1/3"></div>
                <span className="text-xs text-slate-400 font-medium">Thu</span>
              </div>
              <div className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-md transition-colors h-2/5"></div>
                <span className="text-xs text-slate-400 font-medium">Fri</span>
              </div>
              <div className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-md transition-colors h-4/5"></div>
                <span className="text-xs text-slate-400 font-medium">Sat</span>
              </div>
              <div className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-md transition-colors h-3/5"></div>
                <span className="text-xs text-slate-400 font-medium">Sun</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col">
            <h3 className="font-bold text-lg mb-1">Top Selling Items</h3>
            <p className="text-xs text-slate-500 mb-6">Trending this week</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Coffee className="text-primary size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Spanish Latte</p>
                  <p className="text-xs text-slate-500">124 sold</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Utensils className="text-primary size-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Pistachio Croissant</p>
                  <p className="text-xs text-slate-500">98 sold</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
