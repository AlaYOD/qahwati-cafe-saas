import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
  shift: {
    id: string;
    profile: { id: string; full_name: string } | null;
  } | null;
}

interface TransactionLogProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const typeConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  sale_cash: { icon: "payments",       color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", label: "Cash Sale"   },
  sale_card: { icon: "credit_card",    color: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-50 dark:bg-blue-500/10",    label: "Card Sale"   },
  expense:   { icon: "arrow_downward", color: "text-red-500 dark:text-red-400",         bg: "bg-red-50 dark:bg-red-500/10",      label: "Expense"     },
  income:    { icon: "arrow_upward",   color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", label: "Income"      },
  opening:   { icon: "lock_open",      color: "text-violet-600 dark:text-violet-400",   bg: "bg-violet-50 dark:bg-violet-500/10", label: "Opening"     },
  cash_out:  { icon: "logout",         color: "text-rose-600 dark:text-rose-400",       bg: "bg-rose-50 dark:bg-rose-500/10",     label: "Cash Out"    },
};

export function TransactionLog({ transactions, isLoading }: TransactionLogProps) {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-primary/10">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="p-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-background overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">history</span>
            <h3 className="font-bold text-slate-800 dark:text-white">Transaction Log</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">{transactions.length} today</span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No transactions recorded today.
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-primary/5 max-h-[400px] overflow-y-auto custom-scrollbar">
            {transactions.map((tx) => {
              const config = typeConfig[tx.type] || typeConfig.income;
              const isExpense = tx.type === "expense" || tx.type === "cash_out";

              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "size-8 rounded-lg flex items-center justify-center flex-none group-hover:scale-110 transition-transform",
                          config.bg
                        )}
                      >
                        <span className={cn("material-symbols-outlined text-[16px]", config.color)}>
                          {config.icon}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-white truncate">
                          {config.label}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400">
                            {new Date(tx.created_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {tx.shift?.profile?.full_name && (
                            <>
                              <span className="text-[10px] text-slate-300">|</span>
                              <span className="text-[10px] text-slate-400">{tx.shift.profile.full_name}</span>
                            </>
                          )}
                          {tx.description && (
                            <>
                              <span className="text-[10px] text-slate-300">|</span>
                              <span className="text-[10px] text-slate-400 truncate max-w-[200px]">{tx.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <p
                      className={cn(
                        "text-sm font-black flex-none ml-3",
                        isExpense ? "text-rose-500" : "text-emerald-500"
                      )}
                    >
                      {isExpense ? "-" : "+"}${Number(tx.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-black">
              <div className={cn(
                "size-10 rounded-xl flex items-center justify-center",
                selectedTx && (typeConfig[selectedTx.type]?.bg || "bg-slate-100")
              )}>
                <span className={cn("material-symbols-outlined", selectedTx && typeConfig[selectedTx.type]?.color)}>
                  {selectedTx && typeConfig[selectedTx.type]?.icon}
                </span>
              </div>
              Transaction Details
            </DialogTitle>
          </DialogHeader>

          {selectedTx && (
            <div className="space-y-6">
              <div className="text-center p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-primary/10">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                <h2 className={cn(
                  "text-4xl font-black italic",
                  (selectedTx.type === "expense" || selectedTx.type === "cash_out") ? "text-rose-500" : "text-emerald-500"
                )}>
                  {(selectedTx.type === "expense" || selectedTx.type === "cash_out") ? "-" : "+"}
                  ${Number(selectedTx.amount).toFixed(2)}
                </h2>
                <div className="mt-4 flex items-center justify-center gap-2">
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                     typeConfig[selectedTx.type]?.bg,
                     typeConfig[selectedTx.type]?.color
                   )}>
                     {typeConfig[selectedTx.type]?.label}
                   </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-primary/10">
                  <span className="text-xs font-bold text-slate-400 uppercase">Cashier</span>
                  <span className="text-sm font-black text-slate-700 dark:text-white">
                    {selectedTx.shift?.profile?.full_name || "System"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-primary/10">
                  <span className="text-xs font-bold text-slate-400 uppercase">Timestamp</span>
                  <span className="text-sm font-black text-slate-700 dark:text-white">
                    {new Date(selectedTx.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-primary/10">
                  <span className="text-xs font-bold text-slate-400 uppercase">Shift ID</span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {selectedTx.shift?.id || "N/A"}
                  </span>
                </div>
              </div>

              {selectedTx.description && (
                <div className="space-y-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Description / Reason</p>
                  <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border-l-4 border-primary">
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium italic underline decoration-slate-200 underline-offset-4">
                      {selectedTx.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
