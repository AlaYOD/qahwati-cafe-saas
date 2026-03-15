/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import { CircleHelp, LayoutDashboard, Utensils, Receipt, Package, CreditCard, Settings, Search, Bell, ShoppingCart, MonitorSpeaker } from 'lucide-react';



export default function Dashboard() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="flex h-screen overflow-hidden">
{/*  Sidebar  */}
<aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
<div className="p-6 flex items-center gap-3">
<div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-accent">
<CircleHelp className="text-3xl" />
</div>
<div>
<h1 className="text-primary dark:text-accent text-xl font-bold leading-none">Qahwati</h1>
<p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Café POS System</p>
</div>
</div>
<nav className="flex-1 px-4 py-4 space-y-1">
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white" href="#">
<LayoutDashboard  />
<span className="font-medium">Dashboard</span>
</a>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<Utensils  />
<span className="font-medium">Tables</span>
</a>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<Receipt  />
<span className="font-medium">Orders</span>
</a>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<CircleHelp  />
<span className="font-medium">Menu</span>
</a>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<Package  />
<span className="font-medium">Inventory</span>
</a>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<CreditCard  />
<span className="font-medium">Cashier</span>
</a>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<CircleHelp  />
<span className="font-medium">Reports</span>
</a>
<a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
<Settings  />
<span className="font-medium">Settings</span>
</a>
</nav>
<div className="p-4 border-t border-slate-200 dark:border-slate-800">
<div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
<img className="w-10 h-10 rounded-full object-cover" data-alt="Profile picture of cafe manager" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUDkxbsT8xO8NZO0AblfSUp-6hE-Yzyq9HIak4uDTgdrxuHSUfH1-AD0-LvasOgmmN2LUoiqpZKjMMIaFEYZrTrmwCfd-E8ohpHCTeD-iFajNfXiEYa8a72d50kUA6ixDuWbdRaJYn706TfPDCUxXS8Pt9AdrcTuDyM7nE-RRCCWr4WXEsZAkkwnjTP1nRdasOPkhEVQ82pzrjxaENdvN0b0gE_gzru-i6-qT4gf0U0I9qbbJEyezTv9MSzLjGtgJsoPgGsHrwwrE" />
<div className="flex-1 truncate">
<p className="text-sm font-semibold truncate">Ahmed Ali</p>
<p className="text-xs text-slate-500 truncate">Store Manager</p>
</div>
</div>
</div>
</aside>
{/*  Main Content  */}
<main className="flex-1 flex flex-col overflow-y-auto">
{/*  Header  */}
<header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
<div className="flex items-center gap-4 flex-1 max-w-xl">
<div className="relative w-full">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
<input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Search orders, menu, or tables..." type="text" />
</div>
</div>
<div className="flex items-center gap-4">
<button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 relative">
<Bell className="text-2xl" />
<span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white dark:border-slate-900"></span>
</button>
<div className="h-8 w-px bg-slate-200 dark:border-slate-700 mx-2"></div>
<div className="text-right hidden sm:block">
<p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</p>
<p className="text-sm font-semibold">Oct 24, 2023</p>
</div>
</div>
</header>
<div className="p-8 space-y-8">
{/*  Stat Cards  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/30 transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-primary/10 rounded-lg text-primary">
<CreditCard  />
</div>
<span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full group-hover:bg-green-100 transition-colors">+12%</span>
</div>
<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Sales</p>
<h3 className="text-2xl font-bold mt-1">1,250.500 <span className="text-sm font-normal text-slate-400">LYD</span></h3>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/30 transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-accent/10 rounded-lg text-accent">
<ShoppingCart  />
</div>
<span className="text-slate-400 text-xs font-bold bg-slate-100 px-2 py-1 rounded-full">Today</span>
</div>
<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Orders</p>
<h3 className="text-2xl font-bold mt-1">47 <span className="text-sm font-normal text-slate-400">completed</span></h3>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/30 transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-slate-100 rounded-lg text-slate-600">
<CircleHelp  />
</div>
<div className="flex h-2 w-16 bg-slate-100 rounded-full self-center">
<div className="h-full bg-accent rounded-full"></div>
</div>
</div>
<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Occupied Tables</p>
<h3 className="text-2xl font-bold mt-1">8 / 15 <span className="text-sm font-normal text-slate-400">tables</span></h3>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/30 transition-all group">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-primary text-accent rounded-lg">
<MonitorSpeaker  />
</div>
</div>
<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Cash in Register</p>
<h3 className="text-2xl font-bold mt-1">3,450.000 <span className="text-sm font-normal text-slate-400">LYD</span></h3>
</div>
</div>
{/*  Charts Section  */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/*  Bar Chart: Sales Last 7 Days  */}
<div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-8">
<div>
<h3 className="text-lg font-bold">Sales Last 7 Days</h3>
<p className="text-sm text-slate-500">Revenue performance by day</p>
</div>
<button className="text-sm font-semibold text-primary flex items-center gap-1">
                                View Detail <CircleHelp className="text-sm" />
</button>
</div>
<div className="h-64 flex items-end justify-between gap-4 px-2">
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative overflow-hidden">
<div className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-all rounded-t-lg"></div>
</div>
<span className="text-xs font-bold text-slate-400 uppercase">Mon</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative overflow-hidden">
<div className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-all rounded-t-lg"></div>
</div>
<span className="text-xs font-bold text-slate-400 uppercase">Tue</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative overflow-hidden">
<div className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-all rounded-t-lg"></div>
</div>
<span className="text-xs font-bold text-slate-400 uppercase">Wed</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative overflow-hidden">
<div className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-all rounded-t-lg"></div>
</div>
<span className="text-xs font-bold text-slate-400 uppercase">Thu</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative overflow-hidden">
<div className="absolute bottom-0 w-full bg-accent transition-all rounded-t-lg"></div>
</div>
<span className="text-xs font-bold text-slate-400 uppercase">Fri</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative overflow-hidden">
<div className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-all rounded-t-lg"></div>
</div>
<span className="text-xs font-bold text-slate-400 uppercase">Sat</span>
</div>
<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative overflow-hidden">
<div className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-all rounded-t-lg"></div>
</div>
<span className="text-xs font-bold text-slate-400 uppercase">Sun</span>
</div>
</div>
</div>
{/*  Donut Chart: Sales by Category  */}
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<h3 className="text-lg font-bold mb-6">Sales by Category</h3>
<div className="relative h-48 w-48 mx-auto mb-8">
<svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
<circle className="stroke-slate-100 dark:stroke-slate-800" cx="18" cy="18" fill="none" r="16" strokeWidth="3" />
<circle className="stroke-primary" cx="18" cy="18" fill="none" r="16" strokeDasharray="45 100" strokeDashoffset="0" strokeWidth="3" />
<circle className="stroke-accent" cx="18" cy="18" fill="none" r="16" strokeDasharray="25 100" strokeDashoffset="-45" strokeWidth="3" />
<circle className="stroke-slate-400" cx="18" cy="18" fill="none" r="16" strokeDasharray="20 100" strokeDashoffset="-70" strokeWidth="3" />
<circle className="stroke-slate-200" cx="18" cy="18" fill="none" r="16" strokeDasharray="10 100" strokeDashoffset="-90" strokeWidth="3" />
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="text-2xl font-bold">100%</span>
<span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Total Units</span>
</div>
</div>
<div className="space-y-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-primary"></span>
<span className="text-sm font-medium">Hot Drinks</span>
</div>
<span className="text-sm font-bold">45%</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-accent"></span>
<span className="text-sm font-medium">Cold Drinks</span>
</div>
<span className="text-sm font-bold">25%</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-slate-400"></span>
<span className="text-sm font-medium">Bakery</span>
</div>
<span className="text-sm font-bold">20%</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-slate-200"></span>
<span className="text-sm font-medium">Food</span>
</div>
<span className="text-sm font-bold">10%</span>
</div>
</div>
</div>
</div>
{/*  Recent Orders Table  */}
<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
<div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
<h3 className="text-lg font-bold">Recent Orders</h3>
<button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors">
                            New Order
                        </button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
<th className="px-6 py-4">Order ID</th>
<th className="px-6 py-4">Customer / Table</th>
<th className="px-6 py-4">Items</th>
<th className="px-6 py-4">Time</th>
<th className="px-6 py-4">Total</th>
<th className="px-6 py-4">Status</th>
<th className="px-6 py-4"></th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 text-sm font-bold">#ORD-2482</td>
<td className="px-6 py-4 text-sm">
<div className="font-medium">Table 04</div>
<div className="text-xs text-slate-400">Walk-in Customer</div>
</td>
<td className="px-6 py-4 text-sm">
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">Latte x2, Croissant x1</span>
</td>
<td className="px-6 py-4 text-sm text-slate-500">14:20 PM</td>
<td className="px-6 py-4 text-sm font-bold">45.500 LYD</td>
<td className="px-6 py-4 text-sm">
<span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold">Paid</span>
</td>
<td className="px-6 py-4 text-right">
<button className="material-symbols-outlined text-slate-400 hover:text-primary">more_vert</button>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 text-sm font-bold">#ORD-2481</td>
<td className="px-6 py-4 text-sm">
<div className="font-medium">Table 08</div>
<div className="text-xs text-slate-400">Sarah M.</div>
</td>
<td className="px-6 py-4 text-sm">
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">Americano x1, Muffin x2</span>
</td>
<td className="px-6 py-4 text-sm text-slate-500">14:15 PM</td>
<td className="px-6 py-4 text-sm font-bold">32.000 LYD</td>
<td className="px-6 py-4 text-sm">
<span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-bold">Unpaid</span>
</td>
<td className="px-6 py-4 text-right">
<button className="material-symbols-outlined text-slate-400 hover:text-primary">more_vert</button>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 text-sm font-bold">#ORD-2480</td>
<td className="px-6 py-4 text-sm">
<div className="font-medium">Table 01</div>
<div className="text-xs text-slate-400">Takeaway</div>
</td>
<td className="px-6 py-4 text-sm">
<span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">Espresso x1</span>
</td>
<td className="px-6 py-4 text-sm text-slate-500">14:02 PM</td>
<td className="px-6 py-4 text-sm font-bold">8.500 LYD</td>
<td className="px-6 py-4 text-sm">
<span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold">Paid</span>
</td>
<td className="px-6 py-4 text-right">
<button className="material-symbols-outlined text-slate-400 hover:text-primary">more_vert</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</main>
</div>
    </div>
  );
}
