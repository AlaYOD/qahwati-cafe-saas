import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopHeader } from "@/components/layout/top-header";

export default function CashierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark/95 flex flex-col relative w-full">
        <TopHeader />
        {children}
      </main>
    </div>
  );
}
