"use client";

interface OrdersEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function OrdersEmptyState({ hasFilters, onClearFilters }: OrdersEmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-8">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="size-24 rounded-3xl bg-slate-100 dark:bg-primary/5 flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">
            receipt_long
          </span>
        </div>
        <div className="absolute -bottom-1 -right-1 size-8 rounded-full bg-slate-200 dark:bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-sm text-slate-400 dark:text-slate-500">
            {hasFilters ? "filter_alt_off" : "hourglass_empty"}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-2">
        {hasFilters ? "No matching orders" : "No orders yet"}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6">
        {hasFilters
          ? "Try adjusting your search or filter criteria to find what you're looking for."
          : "Orders will appear here once customers start placing them."}
      </p>

      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
          Clear All Filters
        </button>
      )}
    </div>
  );
}
