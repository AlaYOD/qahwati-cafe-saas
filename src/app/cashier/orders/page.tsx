"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminOrdersData, updateOrderStatus } from "@/actions/orders";
import {
  OrderStatsBar,
  OrderSearchBar,
  OrderCard,
  OrderDetailPanel,
  PaymentModal,
  OrdersEmptyState,
} from "@/components/orders";
import type { StatusFilter, SortOption, DateRange } from "@/components/orders";
import Link from "next/link";

const ORDERS_PER_PAGE = 12;

export default function CashierOrdersPage() {
  // Data
  const [orders, setOrders] = useState<any[] | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [dateRange, setDateRange] = useState<DateRange>("all");

  // UI State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [checkoutOrder, setCheckoutOrder] = useState<any | null>(null);
  const [page, setPage] = useState(1);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const res = await getAdminOrdersData();
      setOrders(res);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle status update
  const handleUpdateStatus = async (orderId: string, newStatus: string, method?: string) => {
    setIsUpdating(orderId);
    const res = await updateOrderStatus(orderId, newStatus, method);
    if (res.success) {
      await fetchOrders();
      setCheckoutOrder(null);
      setDetailOpen(false);
      setSelectedOrder(null);
    } else {
      alert("Failed to update status: " + res.error);
    }
    setIsUpdating(null);
  };

  // Date range helper
  const isInDateRange = useCallback(
    (dateStr: string) => {
      if (dateRange === "all") return true;
      const date = new Date(dateStr);
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (dateRange) {
        case "today":
          return date >= startOfDay;
        case "week": {
          const startOfWeek = new Date(startOfDay);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
          return date >= startOfWeek;
        }
        case "month": {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          return date >= startOfMonth;
        }
        default:
          return true;
      }
    },
    [dateRange]
  );

  // Filtered + sorted orders
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    let result = orders.filter((o) => {
      // Status filter
      if (statusFilter !== "all" && o.status !== statusFilter) return false;

      // Date range filter
      if (!isInDateRange(o.created_at)) return false;

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const orderId = o.id.split("-")[0].toLowerCase();
        const customerName = (o.customer_name || o.profile?.full_name || "").toLowerCase();
        const tableName = (o.table?.name || "").toLowerCase();
        if (!orderId.includes(q) && !customerName.includes(q) && !tableName.includes(q)) {
          return false;
        }
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "highest":
          return Number(b.total_amount) - Number(a.total_amount);
        case "lowest":
          return Number(a.total_amount) - Number(b.total_amount);
        default:
          return 0;
      }
    });

    return result;
  }, [orders, statusFilter, search, sortOption, dateRange, isInDateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(0, page * ORDERS_PER_PAGE);
  const hasMore = page < totalPages;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sortOption, dateRange]);

  // Stats (computed from today's orders)
  const stats = useMemo(() => {
    if (!orders) return { totalToday: 0, pendingOrders: 0, completedOrders: 0, revenueToday: 0 };
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayOrders = orders.filter((o) => new Date(o.created_at) >= startOfDay);

    return {
      totalToday: todayOrders.length,
      pendingOrders: todayOrders.filter((o) => o.status === "pending").length,
      completedOrders: todayOrders.filter((o) => o.status === "completed").length,
      revenueToday: todayOrders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + Number(o.total_amount), 0),
    };
  }, [orders]);

  // Status counts for filter chips
  const statusCounts = useMemo(() => {
    if (!orders) return { all: 0, pending: 0, completed: 0, cancelled: 0 };
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  // Handlers
  const handleSelectOrder = (order: any) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const handleProcessPayment = (order: any) => {
    setDetailOpen(false);
    setCheckoutOrder(order);
  };

  const handleVoidOrder = (orderId: string) => {
    handleUpdateStatus(orderId, "cancelled");
  };

  const handleConfirmPayment = (orderId: string, paymentMethod: string) => {
    handleUpdateStatus(orderId, "completed", paymentMethod);
  };

  const clearAllFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDateRange("all");
    setSortOption("newest");
  };

  const hasActiveFilters = search !== "" || statusFilter !== "all" || dateRange !== "all";

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            Orders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all text-sm font-semibold"
            aria-label="Refresh orders"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            href="/cashier/tables"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all text-sm font-bold shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Order
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <OrderStatsBar stats={stats} isLoading={!orders} />

      {/* Search & Filters */}
      <OrderSearchBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        statusCounts={statusCounts}
      />

      {/* Results Count */}
      {orders && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-700 dark:text-white">{paginatedOrders.length}</span> of{" "}
            <span className="font-bold text-slate-700 dark:text-white">{filteredOrders.length}</span> orders
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Orders Grid */}
      {!orders ? (
        // Loading Skeleton
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background overflow-hidden">
              <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="p-5 space-y-4">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-36 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-28 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-100">
                  <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedOrders.map((order) => (
              <OrderCard key={order.id} order={order} onSelect={handleSelectOrder} />
            ))}
          </div>

          {/* Load More / Pagination */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all text-sm font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
                Load More ({filteredOrders.length - paginatedOrders.length} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <OrdersEmptyState hasFilters={hasActiveFilters} onClearFilters={clearAllFilters} />
      )}

      {/* Order Detail Slide Panel */}
      <OrderDetailPanel
        order={selectedOrder}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onProcessPayment={handleProcessPayment}
        onVoidOrder={handleVoidOrder}
        isUpdating={isUpdating}
      />

      {/* Payment Processing Modal */}
      <PaymentModal
        order={checkoutOrder}
        onClose={() => setCheckoutOrder(null)}
        onConfirm={handleConfirmPayment}
        isUpdating={isUpdating}
      />

      {/* Floating New Order Button (mobile) */}
      <Link
        href="/cashier/tables"
        className="fixed bottom-6 right-6 sm:hidden size-14 rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-all z-40"
        aria-label="New Order"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </Link>
    </div>
  );
}
