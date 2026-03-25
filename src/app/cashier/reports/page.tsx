import { cn } from "@/lib/utils";

export default function CashierReportsPage() {
  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto w-full relative animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-end bg-white dark:bg-background border border-slate-200 dark:border-primary/10 p-8 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-navy-800 dark:text-white uppercase tracking-tight">Financial Intelligence</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Sales metrics, closures, and tax sums.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center justify-center px-6 py-2.5 rounded-pill bg-white border border-slate-200 dark:bg-primary/5 dark:border-primary/20 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest text-navy-800 dark:text-white shadow-sm">
            <span className="material-symbols-outlined text-[18px] mr-2 text-primary">cloud_download</span>
            Export Dataset
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-background p-20 rounded-2xl border border-dashed border-slate-200 dark:border-primary/20 shadow-sm flex flex-col items-center justify-center text-center group transition-all hover:border-primary/50">
        <div className="size-24 rounded-pill bg-slate-50 dark:bg-primary/5 flex items-center justify-center mb-8 border border-slate-100 dark:border-primary/10 group-hover:scale-110 transition-transform shadow-inner">
          <span className="material-symbols-outlined text-5xl text-primary animate-pulse">analytics</span>
        </div>
        <h2 className="text-xl font-black text-navy-800 dark:text-white uppercase tracking-tight mb-3">Metrics Processing Delayed</h2>
        <p className="max-w-md text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">The analytical engine is currently awaiting data stream synchronization for the selected period.</p>
        
        <div className="mt-12 grid grid-cols-3 gap-8 w-full max-w-2xl opacity-40">
           {[
             { label: 'Revenue', icon: 'payments' },
             { label: 'Footfall', icon: 'person_celebrate' },
             { label: 'Velocity', icon: 'speed' }
           ].map(stat => (
             <div key={stat.label} className="p-6 rounded-2xl border border-slate-200 dark:border-primary/10 bg-slate-50/50">
               <span className="material-symbols-outlined text-slate-300 text-3xl mb-4">{stat.icon}</span>
               <div className="h-2 w-16 bg-slate-200 rounded-pill mx-auto mb-2"></div>
               <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
