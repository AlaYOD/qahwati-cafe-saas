import { AppSidebar } from "@/components/layout/app-sidebar";

export default function BaristaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
