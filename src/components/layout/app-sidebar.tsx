"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";

// Define all menus for different roles
const MENUS = {
  admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { name: "Tables", href: "/admin/tables", icon: "table_restaurant" },
    { name: "Staff", href: "/admin/staff", icon: "badge" },
    { name: "Menu", href: "/admin/menu", icon: "restaurant_menu" },
    { name: "Inventory", href: "/admin/inventory", icon: "inventory_2" },
    { name: "Orders", href: "/admin/orders", icon: "shopping_bag" },
    { name: "Reports", href: "/admin/reports", icon: "bar_chart" },
    { name: "Settings", href: "/admin/settings", icon: "settings" },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: "history" },
  ],
  manager: [
    { name: "Inventory", href: "/manager/inventory", icon: "inventory_2" },
    { name: "Stock", href: "/manager/stock", icon: "shelves" },
    { name: "Suppliers", href: "/manager/suppliers", icon: "local_shipping" },
    { name: "Purchase Orders", href: "/manager/purchase-orders", icon: "receipt" },
    { name: "Alerts", href: "/manager/alerts", icon: "warning" },
    { name: "Reports", href: "/manager/reports", icon: "bar_chart" },
  ],
  cashier: [
    { name: "Dashboard", href: "/cashier/dashboard", icon: "dashboard" },
    { name: "Tables", href: "/cashier/tables", icon: "table_restaurant" },
    { name: "Staff", href: "/cashier/staff", icon: "badge" },
    { name: "Menu", href: "/cashier/menu", icon: "restaurant_menu" },
    { name: "Inventory", href: "/cashier/inventory", icon: "inventory_2" },
    { name: "Orders", href: "/cashier/orders", icon: "receipt_long" },
    { name: "Reports", href: "/cashier/reports", icon: "bar_chart" },
  ],
  barista: [
    { name: "Active Orders", href: "/barista/orders", icon: "local_cafe" },
    { name: "History", href: "/barista/history", icon: "history" },
    { name: "Menu Ref", href: "/barista/menu", icon: "menu_book" },
    { name: "Performance", href: "/barista/performance", icon: "trending_up" },
  ],
  waiter: [
    { name: "Table Map", href: "/waiter/tables", icon: "table_restaurant" },
    { name: "Active Orders", href: "/waiter/orders", icon: "room_service" },
    { name: "New Order", href: "/waiter/new-order", icon: "add_circle" },
    { name: "My Tips", href: "/waiter/tips", icon: "payments" },
  ],
} as const;

export function AppSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;
  const menuItems = MENUS[user.role as keyof typeof MENUS] || [];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark hidden md:flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white">
          <span className="material-symbols-outlined">coffee</span>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">Qahwati</h1>
          <p className="text-xs text-slate-500 dark:text-primary/60">Coffee Management</p>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-pill transition-all duration-300 group",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-navy-800 dark:text-slate-300 hover:bg-accent hover:text-primary"
              )}
            >
              <span className={cn(
                "material-symbols-outlined transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-white" : "text-slate-400 group-hover:text-primary"
              )}>{item.icon}</span>
              <span className="text-sm font-bold tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-primary/20">
        <div className="flex items-center gap-3 p-2">
          <div
            className="size-8 rounded-full bg-slate-200 dark:bg-primary/30 bg-cover flex items-center justify-center text-primary"
          >
            <span className="material-symbols-outlined text-sm m-auto">person</span>
          </div>
          <div className="overflow-hidden leading-tight">
            <p className="text-sm font-bold truncate capitalize">{user.full_name || "User"}</p>
            <p className="text-xs text-slate-500 dark:text-primary/60 truncate capitalize mt-0.5">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
