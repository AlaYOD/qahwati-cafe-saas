"use client";

import { useCallback, useEffect, useState } from "react";
import { getManagerDashboardData } from "@/actions/manager-dashboard";
import {
  StatsOverview,
  CashierPerformanceTable,
  CashDrawerMonitor,
  PaymentBreakdown,
  ShortageTracker,
  RecentOrdersFeed,
  HourlySalesChart,
  TransactionLog,
} from "@/components/manager-dashboard";

export default function ManagerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      const result = await getManagerDashboardData();
      setData(result);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Failed to fetch manager dashboard data:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const isLoading = !data;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            Manager Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor cashier activity, cash flow, and daily performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400 font-medium">
            Last updated: {lastRefresh.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all text-sm font-semibold"
            aria-label="Refresh dashboard"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview
        todayRevenue={data?.todayRevenue ?? 0}
        weekRevenue={data?.weekRevenue ?? 0}
        monthRevenue={data?.monthRevenue ?? 0}
        todayOrderCount={data?.todayOrderCount ?? 0}
        todayCompletedCount={data?.todayCompletedCount ?? 0}
        todayPending={data?.todayPending ?? 0}
        todayCancelled={data?.todayCancelled ?? 0}
        activeShiftCount={data?.activeShiftCount ?? 0}
        isLoading={isLoading}
      />

      {/* Main Grid: Two columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cashier Performance */}
          <CashierPerformanceTable
            cashiers={data?.cashierPerformance ?? []}
            isLoading={isLoading}
          />

          {/* Hourly Sales Chart */}
          <HourlySalesChart
            data={data?.hourlySales ?? []}
            isLoading={isLoading}
          />

          {/* Recent Orders Feed */}
          <RecentOrdersFeed
            orders={data?.recentOrders ?? []}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Active Cash Drawers */}
          <CashDrawerMonitor
            drawers={data?.cashDrawers ?? []}
            isLoading={isLoading}
          />

          {/* Payment Breakdown */}
          <PaymentBreakdown
            breakdown={data?.paymentBreakdown ?? { cash: 0, card: 0, wallet: 0 }}
            isLoading={isLoading}
          />

          {/* Cash Reconciliation / Shortage Tracker */}
          <ShortageTracker
            records={data?.shortageHistory ?? []}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Full Width: Transaction Log */}
      <TransactionLog
        transactions={data?.recentTransactions ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}
