"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Utensils, 
  Package, 
  Banknote, 
  Settings,
  LogOut,
  Coffee
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/main-dashboard", icon: LayoutDashboard },
  { name: "POS Order", href: "/pos-order-screen", icon: ShoppingCart },
  { name: "Tables", href: "/table-management", icon: Utensils },
  { name: "Inventory", href: "/inventory-management", icon: Package },
  { name: "Cash Register", href: "/cash-register-and-shift-control", icon: Banknote },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white">
      {/* Logo Area */}
      <div className="flex h-16 shrink-0 items-center justify-center border-b px-6">
        <Link href="/main-dashboard" className="flex items-center gap-2 text-primary">
          <Coffee className="h-6 w-6 stroke-[2.5]" />
          <span className="text-xl font-bold tracking-tight">Qahwati</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-primary-foreground" : "text-slate-400 group-hover:text-slate-600"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="border-t p-4 flex flex-col gap-2">
        <Link
          href="/settings"
          className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
        >
          <Settings className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-slate-600" />
          Settings
        </Link>
        <button
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5 shrink-0 text-red-400 group-hover:text-red-500" />
          Log out
        </button>
      </div>
    </aside>
  );
}
