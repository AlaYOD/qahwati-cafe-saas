"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function TopHeader() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-10 bg-white/90 dark:bg-background/90 backdrop-blur-md border-b border-slate-200 dark:border-primary/10 px-8 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-navy-800 dark:text-white uppercase tracking-tight">System Terminal: {user.full_name?.split(' ')[0] || "Operator"},</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Operational status & performance stream.</p>
        </div>
        <div className="flex gap-4">
          <button 
             onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
             className="p-2.5 rounded-pill border border-slate-200 dark:border-primary/20 text-slate-500 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all flex items-center justify-center min-w-[45px]"
          >
            {mounted && (
               <span className="material-symbols-outlined text-[20px]">
                 {theme === 'dark' ? 'light_mode' : 'dark_mode'}
               </span>
            )}
          </button>
          
          <button className="p-2.5 rounded-pill border border-slate-200 dark:border-primary/20 text-slate-500 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          
          <button className="px-6 py-2.5 bg-primary text-white rounded-pill flex items-center gap-2 hover:bg-primary/90 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/25">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Launch Operation
          </button>
        </div>
      </div>
    </header>
  );
}
