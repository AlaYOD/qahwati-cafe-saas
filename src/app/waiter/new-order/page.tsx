"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getPosData } from "@/actions/pos";
import { createOrder } from "@/actions/orders";
import { Suspense } from "react";

interface CartItem {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
}

function NewOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [data, setData] = useState<{ categories: any[]; menuItems: any[]; tables: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableId, setTableId] = useState(searchParams.get("table") || "");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    getPosData().then(setData).finally(() => setLoading(false));
  }, []);

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menu_item_id === item.id);
      if (existing) {
        return prev.map((c) => c.menu_item_id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { menu_item_id: item.id, name: item.name, price: Number(item.price), quantity: 1 }];
    });
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) setCart((prev) => prev.filter((c) => c.menu_item_id !== id));
    else setCart((prev) => prev.map((c) => c.menu_item_id === id ? { ...c, quantity: qty } : c));
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const filteredItems = (data?.menuItems || []).filter(
    (item) => (activeCategory === "all" || item.category_id === activeCategory) && item.is_available
  );

  const handleSubmit = async () => {
    if (cart.length === 0) { setError("Add at least one item"); return; }
    setSubmitting(true);
    setError("");
    const res = await createOrder({
      table_id: tableId || undefined,
      user_id: user?.id,
      payment_method: paymentMethod,
      total_amount: total,
      customer_name: customerName || undefined,
      items: cart.map((c) => ({ menu_item_id: c.menu_item_id, quantity: c.quantity, unit_price: c.price })),
    });
    setSubmitting(false);
    if (res.success) router.push("/waiter/tables");
    else setError(res.error || "Failed to create order");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20 text-slate-400">
        <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading menu...
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-6 pb-4 space-y-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">New Order</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Select items from the menu</p>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex-none px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeCategory === "all" ? "bg-primary text-white" : "bg-white dark:bg-primary/10 border border-primary/20 text-slate-600 dark:text-slate-400"}`}
            >
              All
            </button>
            {data?.categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`flex-none px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeCategory === c.id ? "bg-primary text-white" : "bg-white dark:bg-primary/10 border border-primary/20 text-slate-600 dark:text-slate-400"}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredItems.map((item) => {
              const inCart = cart.find((c) => c.menu_item_id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="bg-white dark:bg-primary/5 border border-primary/10 hover:border-primary rounded-xl p-3 text-left transition-all group relative"
                >
                  {inCart && (
                    <span className="absolute top-2 right-2 size-5 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center">
                      {inCart.quantity}
                    </span>
                  )}
                  <div className="aspect-square rounded-lg bg-slate-100 dark:bg-primary/10 mb-2 overflow-hidden flex items-center justify-center">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-2xl text-primary/30">local_cafe</span>
                    )}
                  </div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">{item.name}</p>
                  <p className="text-primary font-bold text-xs mt-0.5">${Number(item.price).toFixed(2)}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-72 flex-none border-l border-primary/10 bg-white dark:bg-background-dark/30 flex flex-col">
        <div className="px-5 py-4 border-b border-primary/10">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Order Details</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Table</label>
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-primary/5 border border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Walk-in / No Table</option>
              {data?.tables.filter((t) => t.status === "available").map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Name</label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-primary/5 border border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment</label>
            <div className="grid grid-cols-2 gap-2">
              {["cash", "card"].map((pm) => (
                <button
                  key={pm}
                  onClick={() => setPaymentMethod(pm)}
                  className={`py-2 rounded-lg text-xs font-bold capitalize transition-colors ${paymentMethod === pm ? "bg-primary text-white" : "bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-slate-400"}`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {cart.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</label>
              {cart.map((item) => (
                <div key={item.menu_item_id} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{item.name}</p>
                    <p className="text-xs text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.menu_item_id, item.quantity - 1)} className="size-5 rounded bg-slate-100 dark:bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-[10px]">remove</span>
                    </button>
                    <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.menu_item_id, item.quantity + 1)} className="size-5 rounded bg-slate-100 dark:bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-[10px]">add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-primary/10 space-y-3">
          {error && (
            <p className="text-xs text-red-500 font-medium">{error}</p>
          )}
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting || cart.length === 0}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? <span className="material-symbols-outlined animate-spin text-sm">refresh</span> : <span className="material-symbols-outlined text-sm">add_circle</span>}
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WaiterNewOrderPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full py-20 text-slate-400"><span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading...</div>}>
      <NewOrderContent />
    </Suspense>
  );
}
