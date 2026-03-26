"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export type StatusFilter = "all" | "pending" | "completed" | "cancelled";
export type SortOption = "newest" | "oldest" | "highest" | "lowest";
export type DateRange = "all" | "today" | "week" | "month";

interface OrderSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  dateRange: DateRange;
  onDateRangeChange: (value: DateRange) => void;
  statusCounts: Record<StatusFilter, number>;
}

const statusFilters: { id: StatusFilter; label: string; icon: string; activeClass: string }[] = [
  { id: "all", label: "All Orders", icon: "receipt_long", activeClass: "bg-slate-800 text-white dark:bg-white dark:text-slate-900" },
  { id: "pending", label: "Pending", icon: "pending_actions", activeClass: "bg-amber-500 text-white" },
  { id: "completed", label: "Completed", icon: "check_circle", activeClass: "bg-emerald-500 text-white" },
  { id: "cancelled", label: "Cancelled", icon: "cancel", activeClass: "bg-red-500 text-white" },
];

const sortOptions: { id: SortOption; label: string }[] = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "highest", label: "Highest Amount" },
  { id: "lowest", label: "Lowest Amount" },
];

const dateRanges: { id: DateRange; label: string }[] = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

export function OrderSearchBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortOption,
  onSortChange,
  dateRange,
  onDateRangeChange,
  statusCounts,
}: OrderSearchBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  // Ctrl+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
        </span>
        <input
          ref={searchRef}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by order number, customer name, or table..."
          aria-label="Search orders"
          className="w-full pl-12 pr-24 py-3.5 bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-2xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm"
        />
        <kbd className="absolute inset-y-0 right-4 my-auto flex h-7 items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-2 text-[10px] font-semibold text-slate-400 pointer-events-none">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter by status">
          {statusFilters.map((sf) => (
            <button
              key={sf.id}
              role="tab"
              aria-selected={statusFilter === sf.id}
              onClick={() => onStatusFilterChange(sf.id)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all",
                statusFilter === sf.id
                  ? cn(sf.activeClass, "shadow-md")
                  : "bg-white dark:bg-background border border-slate-200 dark:border-primary/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-primary/20 hover:shadow-sm"
              )}
            >
              <span className="material-symbols-outlined text-[16px]">{sf.icon}</span>
              <span className="hidden sm:inline">{sf.label}</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center",
                  statusFilter === sf.id
                    ? "bg-white/20"
                    : "bg-slate-100 dark:bg-primary/10"
                )}
              >
                {statusCounts[sf.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Date Range & Sort Controls */}
        <div className="flex items-center gap-2">
          {/* Date Range */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value as DateRange)}
              aria-label="Filter by date range"
              className="appearance-none pl-8 pr-8 py-2 bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            >
              {dateRanges.map((dr) => (
                <option key={dr.id} value={dr.id}>
                  {dr.label}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[16px]">calendar_today</span>
            </span>
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[14px]">expand_more</span>
            </span>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sort orders"
              className="appearance-none pl-8 pr-8 py-2 bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            >
              {sortOptions.map((so) => (
                <option key={so.id} value={so.id}>
                  {so.label}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[16px]">sort</span>
            </span>
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[14px]">expand_more</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
