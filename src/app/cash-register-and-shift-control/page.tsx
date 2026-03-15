"use client";
import React from 'react';
import { CircleHelp, User, Clock, Filter, MoreVertical, ArrowDown, ArrowUp, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function CashRegisterandShiftControl() {
  return (
    <AppLayout>
      <main className="flex-1 px-6 py-8 lg:px-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Cash Register & Shift Control</h1>
            <p className="text-slate-500 font-medium mt-1">Track daily cash flows and reconcile balances at shift end.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-rose-600/20 transition-all">
            <CircleHelp className="size-5" />
            Close Current Shift
          </button>
        </div>

        {/* Shift Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-4 rounded-2xl p-5 bg-white border border-slate-200 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <User className="size-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Cashier Name</p>
              <p className="text-lg font-black text-slate-900">Ahmed</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl p-5 bg-white border border-slate-200 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Clock className="size-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Start Time</p>
              <p className="text-lg font-black text-slate-900">08:00 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl p-5 bg-white border border-slate-200 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <CircleHelp className="size-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Shift Duration</p>
              <p className="text-lg font-black text-slate-900">06:30 hrs</p>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Opening Balance</p>
            <p className="text-2xl font-black text-slate-900">$500<span className="text-sm font-medium text-slate-400">.00</span></p>
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-slate-100 text-slate-500 self-start">Fixed</span>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Cash Sales</p>
            <p className="text-2xl font-black text-slate-900">$850<span className="text-sm font-medium text-slate-400">.00</span></p>
            <span className="text-[10px] font-black px-2 py-1 rounded bg-emerald-100 text-emerald-700 self-start flex items-center gap-1">
              <ArrowUp className="size-3" /> 70%
            </span>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Card Sales</p>
            <p className="text-2xl font-black text-slate-900">$450<span className="text-sm font-medium text-slate-400">.00</span></p>
            <span className="text-[10px] font-black px-2 py-1 rounded bg-emerald-100 text-emerald-700 self-start flex items-center gap-1">
              <ArrowUp className="size-3" /> 90%
            </span>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Expenses</p>
            <p className="text-2xl font-black text-rose-600">-$120<span className="text-sm font-medium text-slate-400">.00</span></p>
            <span className="text-[10px] font-black px-2 py-1 rounded bg-rose-100 text-rose-700 self-start flex items-center gap-1">
              <ArrowDown className="size-3" /> 24%
            </span>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl p-6 bg-primary text-white border border-primary/20 shadow-xl shadow-primary/20 ring-4 ring-primary/10 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <CheckCircle2 className="size-32" />
            </div>
            <p className="text-white/80 text-xs font-bold uppercase tracking-wide relative z-10">Expected Balance</p>
            <p className="text-3xl font-black relative z-10">$1,230<span className="text-sm font-medium text-white/70">.00</span></p>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded bg-white/20 text-white self-start relative z-10">Reconciliation Target</span>
          </div>
        </div>

        {/* Transactions Table Section */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm mb-8">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-black text-lg text-slate-900">Daily Transaction Log</h3>
            <div className="flex gap-2">
              <button className="text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm">
                <Filter className="size-4" /> Filter
              </button>
              <button className="text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm">
                <CircleHelp className="size-4" /> Export CSV
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Running Balance</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">02:15 PM</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Sale (Cash)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">Invoice #TRX-9821</td>
                  <td className="px-6 py-4 text-sm font-black text-emerald-600 text-right">+$45.00</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900 text-right">$1,230.00</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">01:40 PM</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Expense
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">Cleaning Supplies Purchase</td>
                  <td className="px-6 py-4 text-sm font-black text-rose-600 text-right">-$25.00</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900 text-right">$1,185.00</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">12:30 PM</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Sale (Card)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">Invoice #TRX-9820</td>
                  <td className="px-6 py-4 text-sm font-black text-emerald-600 text-right">+$120.00</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900 text-right">$1,210.00</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">11:15 AM</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Other Income
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">Supplier Refund</td>
                  <td className="px-6 py-4 text-sm font-black text-blue-600 text-right">+$50.00</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900 text-right">$1,090.00</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">08:00 AM</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Opening
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">Shift Starting Balance</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-700 text-right">$500.00</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900 text-right">$500.00</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Showing 5 of 42 transactions today</span>
            <div className="flex gap-1.5">
              <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-all">
                <ChevronLeft className="size-4" />
              </button>
              <button className="w-8 h-8 rounded-lg border border-primary text-primary font-black bg-primary/10 flex items-center justify-center transition-all">1</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 font-bold flex items-center justify-center hover:bg-slate-50 transition-all">2</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 font-bold flex items-center justify-center hover:bg-slate-50 transition-all">3</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-all">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
          {/* Reconciliation Readiness */}
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="bg-white p-5 rounded-2xl shadow-xl shadow-primary/10 w-full md:w-auto">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Accuracy Rate</span>
                <span className="text-4xl font-black text-primary">99.2%</span>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-primary h-full w-[99.2%] rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
              <h4 className="text-xl font-black text-slate-900 mb-2">Ready for Reconciliation?</h4>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-5 max-w-sm">
                Ensure you count the physical cash in the drawer and match it against the expected balance ($1,230.00) before closing the shift.
              </p>
              <div className="flex gap-3">
                <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                  Start Manual Count
                </button>
                <button className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2">
                  Print Report
                </button>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h4 className="font-black text-lg text-slate-900 mb-6">Performance Summary (Last 6 Hours)</h4>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center text-sm font-bold mb-2">
                  <span className="text-slate-500">Average Transaction Value</span>
                  <span className="text-slate-900">$32.50</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[65%] rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center text-sm font-bold mb-2">
                  <span className="text-slate-500">Transactions / Hour</span>
                  <span className="text-slate-900">12 Invoices</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[80%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-sm font-bold mb-2">
                  <span className="text-slate-500">Customer Satisfaction (Est.)</span>
                  <span className="text-slate-900">4.8 / 5</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[96%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
