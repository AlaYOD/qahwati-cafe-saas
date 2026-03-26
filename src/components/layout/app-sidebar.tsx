"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { hasOpenShift } from "@/actions/shifts";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Define all menus for different roles
const MENUS = {
  admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { name: "Tables", href: "/admin/tables", icon: "table_restaurant" },
    { name: "Staff", href: "/admin/staff", icon: "badge" },
    { name: "Users", href: "/admin/users", icon: "shield_person" },
    { name: "Menu", href: "/admin/menu", icon: "restaurant_menu" },
    { name: "Inventory", href: "/admin/inventory", icon: "inventory_2" },
    { name: "Orders", href: "/admin/orders", icon: "shopping_bag" },
    { name: "Reports", href: "/admin/reports", icon: "bar_chart" },
    { name: "Settings", href: "/admin/settings", icon: "settings" },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: "history" },
  ],
  manager: [
    { name: "Dashboard", href: "/manager/dashboard", icon: "dashboard" },
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
    { name: "Orders", href: "/cashier/orders", icon: "receipt_long" },
    { name: "Payments", href: "/cashier/payments", icon: "payments" },
    { name: "Cash Register", href: "/cashier/cash-register", icon: "point_of_sale" },
    { name: "Menu", href: "/cashier/menu", icon: "restaurant_menu" },
    { name: "Staff", href: "/cashier/staff", icon: "badge" },
    { name: "Inventory", href: "/cashier/inventory", icon: "inventory_2" },
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

// Roles that require an active shift to be closed before logout
const SHIFT_REQUIRED_ROLES = ["cashier"];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [showShiftWarning, setShowShiftWarning] = useState(false);
  const [isCheckingShift, setIsCheckingShift] = useState(false);

  if (!user) return null;
  const menuItems = MENUS[user.role as keyof typeof MENUS] || [];

  const handleLogout = async () => {
    // For cashier: check if there's an open shift before allowing logout
    if (SHIFT_REQUIRED_ROLES.includes(user.role)) {
      setIsCheckingShift(true);
      try {
        const shiftOpen = await hasOpenShift();
        if (shiftOpen) {
          setShowShiftWarning(true);
          setIsCheckingShift(false);
          return;
        }
      } catch {
        // If check fails, still allow logout
      }
      setIsCheckingShift(false);
    }
    logout();
  };

  return (
    <>
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
        <div className="p-4 border-t border-slate-200 dark:border-primary/20 space-y-2">
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
          <button
            onClick={handleLogout}
            disabled={isCheckingShift}
            className="w-full flex items-center gap-3 px-4 py-2 mt-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-pill transition-all duration-300 group font-bold text-sm disabled:opacity-50"
          >
            {isCheckingShift ? (
              <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
            ) : (
              <span className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110">logout</span>
            )}
            Logout
          </button>
        </div>
      </aside>

      {/* Shift Warning Modal */}
      {showShiftWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/20 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="size-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-amber-500">warning</span>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-black text-slate-800 dark:text-white text-center mb-2">
              Active Shift Detected
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              You cannot logout while your cash register shift is still open. Please close your shift first to ensure proper cash reconciliation.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowShiftWarning(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-primary/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all text-sm font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowShiftWarning(false);
                  router.push(
                    user.role === "cashier"
                      ? "/cashier/cash-register"
                      : `/${user.role}/cash-register`
                  );
                }}
                className="flex-[2] py-3 px-4 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
                Go to Cash Register
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
