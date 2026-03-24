"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useState } from "react";
import { getAdminOrdersData, updateOrderStatus } from "@/actions/orders";

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<any[] | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Status Filter state
  const [filter, setFilter] = useState<string>("all");

  // Table Filter state
  const [tableFilter, setTableFilter] = useState<string>("all");
  const [tableSearch, setTableSearch] = useState<string>("");

  // Checkout Modal State
  const [checkoutOrder, setCheckoutOrder] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [amountTendered, setAmountTendered] = useState<string>("");

  const fetchOrders = async () => {
    try {
      const res = await getAdminOrdersData();
      setOrders(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchOrders();
  }, []);

  if (!mounted) return null;

  const handleUpdateStatus = async (orderId: string, newStatus: string, method?: string) => {
    setIsUpdating(orderId);
    const res = await updateOrderStatus(orderId, newStatus, method);
    if (res.success) {
      await fetchOrders();
      setCheckoutOrder(null);
    } else {
      alert("Failed to update status: " + res.error);
    }
    setIsUpdating(null);
  };

  // Unique sorted tables from loaded orders
  const allTables = Array.from(
    new Map(
      (orders || [])
        .filter(o => o.table)
        .map(o => [o.table.id, o.table])
    ).values()
  ).sort((a: any, b: any) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  const filteredOrders = (orders || []).filter(o => {
    const matchStatus = filter === "all" || o.status === filter;

    const matchTable = (() => {
      if (tableFilter === "all") {
        // text search: bare number or partial name
        if (!tableSearch.trim()) return true;
        const q = tableSearch.toLowerCase();
        const name = (o.table?.name || o.customer_name || "walk-in").toLowerCase();
        const numOnly = tableSearch.replace(/\D/g, "");
        return name.includes(q) || (numOnly ? name.includes(numOnly) : false);
      }
      if (tableFilter === "walkin") return !o.table;
      return o.table?.id === tableFilter;
    })();

    return matchStatus && matchTable;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full relative">
      <div className="flex justify-between items-center bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Orders History</h1>
          <p className="text-sm text-slate-500">Track all active and past transactions across the entire venue.</p>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={fetchOrders} className="flex items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">refresh</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {/* Sidebar Navigation */}
         <div className="md:col-span-1 space-y-4 h-fit">

            {/* Status filter */}
            <div className="border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark p-4 rounded-xl shadow-sm">
               <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-3 px-2">Order Status</h3>
               <nav className="space-y-1">
                  {[
                    { id: "all", label: "All Orders", icon: "receipt_long" },
                    { id: "pending", label: "Pending", icon: "pending_actions" },
                    { id: "completed", label: "Completed", icon: "check_circle" },
                    { id: "cancelled", label: "Cancelled", icon: "cancel" }
                  ].map(opt => {
                    const count = orders?.filter(o => opt.id === "all" ? true : o.status === opt.id).length || 0;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setFilter(opt.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition-colors ${filter === opt.id ? "bg-primary text-white font-bold" : "text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-primary/5 bg-transparent"}`}
                      >
                        <div className="flex items-center gap-2">
                           <span className="material-symbols-outlined text-[18px]">{opt.icon}</span>
                           <span>{opt.label}</span>
                        </div>
                        <span className={`${filter === opt.id ? "bg-white/20" : "bg-slate-100 dark:bg-primary/10"} text-xs px-2 py-0.5 rounded-full`}>{count}</span>
                      </button>
                    )
                  })}
               </nav>
            </div>

            {/* Table filter */}
            <div className="border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark p-4 rounded-xl shadow-sm">
               <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Filter by Table</h3>
                  {(tableFilter !== "all" || tableSearch) && (
                     <button
                        onClick={() => { setTableFilter("all"); setTableSearch(""); }}
                        className="text-xs text-primary hover:underline font-semibold"
                     >
                        Clear
                     </button>
                  )}
               </div>

               {/* Search input */}
               <div className="relative mb-3">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                     <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                  </span>
                  <input
                     value={tableSearch}
                     onChange={e => { setTableSearch(e.target.value); setTableFilter("all"); }}
                     placeholder="Table name or number…"
                     className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
               </div>

               {/* Table list */}
               <nav className="space-y-1 max-h-64 overflow-y-auto">
                  <button
                     onClick={() => { setTableFilter("all"); setTableSearch(""); }}
                     className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition-colors ${tableFilter === "all" && !tableSearch ? "bg-primary text-white font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-primary/5"}`}
                  >
                     <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">table_restaurant</span>
                        All Tables
                     </div>
                     <span className={`text-xs px-2 py-0.5 rounded-full ${tableFilter === "all" && !tableSearch ? "bg-white/20" : "bg-slate-100 dark:bg-primary/10"}`}>
                        {orders?.length || 0}
                     </span>
                  </button>

                  <button
                     onClick={() => { setTableFilter("walkin"); setTableSearch(""); }}
                     className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition-colors ${tableFilter === "walkin" ? "bg-primary text-white font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-primary/5"}`}
                  >
                     <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">directions_walk</span>
                        Takeaway
                     </div>
                     <span className={`text-xs px-2 py-0.5 rounded-full ${tableFilter === "walkin" ? "bg-white/20" : "bg-slate-100 dark:bg-primary/10"}`}>
                        {orders?.filter(o => !o.table).length || 0}
                     </span>
                  </button>

                  {allTables.map((table: any) => {
                     const count = orders?.filter(o => o.table?.id === table.id).length || 0;
                     const isActive = tableFilter === table.id;
                     return (
                        <button
                           key={table.id}
                           onClick={() => { setTableFilter(table.id); setTableSearch(""); }}
                           className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition-colors ${isActive ? "bg-primary text-white font-bold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-primary/5"}`}
                        >
                           <div className="flex items-center gap-2 min-w-0">
                              <span className="material-symbols-outlined text-[18px] flex-none">chair</span>
                              <span className="truncate">{table.name}</span>
                           </div>
                           <span className={`text-xs px-2 py-0.5 rounded-full flex-none ml-1 ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-primary/10"}`}>
                              {count}
                           </span>
                        </button>
                     );
                  })}
               </nav>
            </div>

         </div>

         {/* Main Grid */}
         <div className="md:col-span-3 space-y-4">
            {orders ? (
              filteredOrders.length > 0 ? (
                filteredOrders.map(order => {
                  let statusUi = { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-800 dark:text-amber-300", icon: "pending_actions", label: "Pending" };
                  if (order.status === 'completed') statusUi = { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-800 dark:text-emerald-300", icon: "check_circle", label: "Completed" };
                  if (order.status === 'cancelled') statusUi = { bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-800 dark:text-red-300", icon: "cancel", label: "Cancelled" };
                  
                  return (
                    <div key={order.id} className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm overflow-hidden flex flex-col md:flex-row">
                       {/* Left: Summary */}
                       <div className="p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-primary/10 flex-none w-full md:w-64 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-xs font-bold text-slate-500 uppercase">Order ID</span>
                               <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusUi.bg} ${statusUi.text}`}>
                                 <span className="material-symbols-outlined text-[12px] mr-1">{statusUi.icon}</span>
                                 {statusUi.label}
                               </span>
                            </div>
                            <h3 className="text-lg font-bold font-mono text-primary mb-1">#{order.id.split('-')[0].toUpperCase()}</h3>
                            <p className="text-sm text-slate-500 mb-4">{new Date(order.created_at).toLocaleString()}</p>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-sm">
                                 <span className="material-symbols-outlined text-[18px] text-slate-400 mr-2">table_restaurant</span>
                                 <span className="font-medium">{order.table?.name || 'Takeaway'}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                 <span className="material-symbols-outlined text-[18px] text-slate-400 mr-2">vpn_key</span>
                                 <span className="font-medium text-slate-600 dark:text-slate-400">{order.customer_name || order.profile?.full_name || 'Takeaway Customer'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-slate-100 dark:border-primary/10">
                            <div className="flex items-center justify-between">
                               <span className="text-slate-500 text-sm font-medium">Total Amount</span>
                               <span className="text-xl font-bold">${Number(order.total_amount).toFixed(2)}</span>
                            </div>
                            <div className="text-right mt-1">
                               <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">{order.payment_method} Payment</span>
                            </div>
                          </div>
                       </div>
                       
                       {/* Right: Items & Actions */}
                       <div className="p-6 flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Order Items</h4>
                             <div className="space-y-3">
                                {order.order_items?.map((item: any) => (
                                  <div key={item.id} className="flex justify-between items-center text-sm group">
                                     <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-lg bg-slate-100 dark:bg-primary/10 overflow-hidden flex-none border border-slate-200 dark:border-primary/10 transition-transform group-hover:scale-105">
                                          {item.menu_item?.image_url ? (
                                            <img src={item.menu_item.image_url} alt={item.menu_item.name} className="w-full h-full object-cover" />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                              <span className="material-symbols-outlined text-[18px]">local_cafe</span>
                                            </div>
                                          )}
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <span className="bg-slate-100 dark:bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded text-[10px]">{item.quantity}x</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-200">{item.menu_item?.name || 'Unknown Item'}</span>
                                          </div>
                                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mt-0.5">{item.menu_item?.category?.name || 'Item'}</p>
                                        </div>
                                     </div>
                                     <span className="text-slate-500 font-mono font-medium">${(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                          
                          {/* Admin Actions */}
                          {order.status === 'pending' && (
                            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-primary/10">
                               <button 
                                 disabled={isUpdating === order.id}
                                 onClick={() => handleUpdateStatus(order.id, 'cancelled')} 
                                 className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20 transition-colors text-sm font-medium disabled:opacity-50"
                               >
                                 Cancel Order
                               </button>
                               <button 
                                 disabled={isUpdating === order.id}
                                 onClick={() => { setCheckoutOrder(order); setPaymentMethod("card"); setAmountTendered(""); }} 
                                 className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors text-sm font-bold shadow-sm disabled:opacity-50 flex items-center gap-2"
                               >
                                 <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
                                 Checkout / Pay
                               </button>
                            </div>
                          )}
                       </div>
                    </div>
                  )
                })
              ) : (
                <div className="bg-white dark:bg-background-dark p-12 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm text-center">
                   <div className="size-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                     <span className="material-symbols-outlined text-3xl">receipt_long</span>
                   </div>
                   <h3 className="text-xl font-bold mb-2">No Orders Found</h3>
                   <p className="text-slate-500">
                     {tableFilter !== "all" || tableSearch
                       ? `No orders match the selected table${filter !== "all" ? ` and "${filter}" status` : ""}.`
                       : "There are no orders matching this status currently."
                     }
                   </p>
                   {(tableFilter !== "all" || tableSearch) && (
                     <button
                       onClick={() => { setTableFilter("all"); setTableSearch(""); }}
                       className="mt-4 text-sm text-primary font-semibold hover:underline"
                     >
                       Clear table filter
                     </button>
                   )}
                </div>
              )
            ) : (
              <div className="bg-white dark:bg-background-dark p-12 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm text-center">
                 <span className="material-symbols-outlined text-4xl animate-spin text-slate-400 mb-4 inline-block">refresh</span>
                 <p className="font-medium text-slate-500">Syncing transaction history...</p>
              </div>
            )}
         </div>
      </div>

      {/* Payment Processing / Checkout Modal */}
      {checkoutOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
              
              {/* Receipt Breakdowns */}
              <div className="w-full md:w-2/5 border-r border-slate-200 dark:border-primary/10 bg-slate-50 dark:bg-black/20 p-8 flex flex-col text-slate-800 dark:text-slate-200 overflow-y-auto">
                 <div className="text-center mb-8">
                    <span className="material-symbols-outlined text-4xl text-primary mb-2">receipt_long</span>
                    <h2 className="font-bold text-xl uppercase tracking-widest">Order Receipt</h2>
                    <p className="text-xs text-slate-500 mt-1">#{checkoutOrder.id.split('-')[0].toUpperCase()}</p>
                 </div>
                 
                 <div className="space-y-1 mb-8 text-sm">
                    <div className="flex justify-between">
                       <span className="text-slate-500">Date</span>
                       <span className="font-medium">{new Date(checkoutOrder.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-500">Customer</span>
                       <span className="font-medium">{checkoutOrder.customer_name || checkoutOrder.profile?.full_name || 'Takeaway'}</span>
                    </div>
                    {checkoutOrder.table && (
                       <div className="flex justify-between">
                          <span className="text-slate-500">Table</span>
                          <span className="font-medium">{checkoutOrder.table.name}</span>
                       </div>
                    )}
                 </div>

                 <div className="border-t border-b border-dashed border-slate-300 dark:border-slate-700 py-4 mb-4 flex-grow">
                    <div className="space-y-3">
                       {checkoutOrder.order_items?.map((item: any) => (
                         <div key={item.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                               <div className="size-8 rounded bg-white dark:bg-black/20 overflow-hidden border border-slate-200 dark:border-slate-700 flex-none">
                                  {item.menu_item?.image_url ? (
                                    <img src={item.menu_item.image_url} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                      <span className="material-symbols-outlined text-[14px]">local_cafe</span>
                                    </div>
                                  )}
                               </div>
                               <span className="font-medium">{item.quantity}x {item.menu_item?.name || 'Item'}</span>
                            </div>
                            <span className="font-bold">${(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2 mt-auto">
                    <div className="flex justify-between text-slate-500 text-sm">
                       <span>Subtotal</span>
                       <span>${Number(checkoutOrder.total_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-sm">
                       <span>Tax (0%)</span>
                       <span>$0.00</span>
                    </div>
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                       <span className="font-bold text-lg">Total</span>
                       <span className="text-3xl font-black">${Number(checkoutOrder.total_amount).toFixed(2)}</span>
                    </div>
                 </div>
              </div>

              {/* Payment Methods & Cash Register */}
              <div className="w-full md:w-3/5 bg-white dark:bg-background-dark p-8 flex flex-col h-full">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-2xl">Payment Processing</h3>
                    <button onClick={() => setCheckoutOrder(null)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors leading-none">
                       <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                 </div>

                 <div className="grid grid-cols-3 gap-4 mb-8">
                    <button 
                       onClick={() => setPaymentMethod('card')}
                       className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-primary/20 hover:border-primary/50 text-slate-500'}`}
                    >
                       <span className="material-symbols-outlined text-3xl mb-2">credit_card</span>
                       <span className="font-bold text-sm">Credit/Debit</span>
                    </button>
                    <button 
                       onClick={() => setPaymentMethod('cash')}
                       className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${paymentMethod === 'cash' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-primary/20 hover:border-primary/50 text-slate-500'}`}
                    >
                       <span className="material-symbols-outlined text-3xl mb-2">payments</span>
                       <span className="font-bold text-sm">Cash</span>
                    </button>
                    <button 
                       onClick={() => setPaymentMethod('wallet')}
                       className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${paymentMethod === 'wallet' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-primary/20 hover:border-primary/50 text-slate-500'}`}
                    >
                       <span className="material-symbols-outlined text-3xl mb-2">account_balance_wallet</span>
                       <span className="font-bold text-sm">E-Wallet</span>
                    </button>
                 </div>

                 {/* Cash Calculator — visible only for cash payments */}
                 {paymentMethod === 'cash' && (() => {
                    const total = Number(checkoutOrder.total_amount);
                    const tendered = Number(amountTendered) || 0;
                    const diff = tendered - total;
                    const hasAmount = tendered > 0;
                    const isExact = diff === 0;
                    const isOver = diff > 0;
                    const isUnder = hasAmount && diff < 0;

                    return (
                       <div className="mb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          {/* Amount received input */}
                          <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                               Amount Received from Customer
                             </label>
                             <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xl select-none">$</span>
                                <input
                                   type="number"
                                   value={amountTendered}
                                   onChange={(e) => setAmountTendered(e.target.value)}
                                   className="w-full text-3xl font-black py-3 pl-10 pr-4 border-2 border-slate-200 dark:border-primary/20 rounded-xl bg-white dark:bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                   placeholder="0.00"
                                   min="0"
                                   step="0.01"
                                   autoFocus
                                />
                             </div>
                          </div>

                          {/* Quick-amount presets */}
                          <div className="grid grid-cols-5 gap-2">
                             {[5, 10, 20, 50, 100].map(val => (
                                <button
                                   key={val}
                                   onClick={() => setAmountTendered(val.toString())}
                                   className="py-2 bg-white dark:bg-background border border-slate-200 dark:border-primary/20 rounded-lg font-bold text-sm text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors"
                                >
                                   ${val}
                                </button>
                             ))}
                          </div>

                          {/* Exact amount shortcut */}
                          <button
                             onClick={() => setAmountTendered(total.toFixed(2))}
                             className="w-full py-2 border border-dashed border-primary/40 rounded-lg text-sm font-semibold text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                          >
                             <span className="material-symbols-outlined text-sm">attach_money</span>
                             Exact amount — ${total.toFixed(2)}
                          </button>

                          {/* Result panel */}
                          {hasAmount && (
                             <div className={`rounded-xl overflow-hidden border-2 ${
                                isOver  ? 'border-emerald-400 dark:border-emerald-600' :
                                isExact ? 'border-primary' :
                                          'border-amber-400 dark:border-amber-600'
                             }`}>
                                {/* Received row */}
                                <div className="flex justify-between items-center px-4 py-2.5 bg-slate-50 dark:bg-primary/5 border-b border-inherit">
                                   <span className="text-sm text-slate-500 font-medium">Received</span>
                                   <span className="font-bold">${tendered.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center px-4 py-2.5 bg-slate-50 dark:bg-primary/5 border-b border-inherit">
                                   <span className="text-sm text-slate-500 font-medium">Order Total</span>
                                   <span className="font-bold">${total.toFixed(2)}</span>
                                </div>

                                {/* Change / Owed */}
                                {isOver && (
                                   <div className="flex justify-between items-center px-4 py-4 bg-emerald-50 dark:bg-emerald-900/20">
                                      <div className="flex items-center gap-2">
                                         <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">arrow_back</span>
                                         <span className="font-bold text-emerald-700 dark:text-emerald-300">Change to Return</span>
                                      </div>
                                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${diff.toFixed(2)}</span>
                                   </div>
                                )}
                                {isExact && (
                                   <div className="flex justify-between items-center px-4 py-4 bg-primary/5">
                                      <div className="flex items-center gap-2">
                                         <span className="material-symbols-outlined text-primary">check_circle</span>
                                         <span className="font-bold text-primary">Exact Payment</span>
                                      </div>
                                      <span className="text-2xl font-black text-primary">$0.00</span>
                                   </div>
                                )}
                                {isUnder && (
                                   <div className="flex justify-between items-center px-4 py-4 bg-amber-50 dark:bg-amber-900/20">
                                      <div>
                                         <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">warning</span>
                                            <span className="font-bold text-amber-700 dark:text-amber-300">Amount Still Owed</span>
                                         </div>
                                         <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 ml-6">
                                           Will be saved as partial payment
                                         </p>
                                      </div>
                                      <span className="text-2xl font-black text-amber-600 dark:text-amber-400">${Math.abs(diff).toFixed(2)}</span>
                                   </div>
                                )}
                             </div>
                          )}
                       </div>
                    );
                 })()}

                 <div className="mt-auto space-y-3">
                    {/* Confirm button — always enabled once method chosen; cash shows partial-pay warning */}
                    {paymentMethod === 'cash' && Number(amountTendered) > 0 && Number(amountTendered) < Number(checkoutOrder.total_amount) && (
                       <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg text-xs text-amber-700 dark:text-amber-300 font-medium">
                          <span className="material-symbols-outlined text-sm flex-none mt-0.5">info</span>
                          Partial payment of ${Number(amountTendered).toFixed(2)}. Customer still owes ${(Number(checkoutOrder.total_amount) - Number(amountTendered)).toFixed(2)}.
                       </div>
                    )}
                    <button
                       disabled={isUpdating === checkoutOrder.id || (paymentMethod === 'cash' && !amountTendered)}
                       onClick={() => handleUpdateStatus(checkoutOrder.id, 'completed', paymentMethod)}
                       className="w-full py-4 text-lg bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-500/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:grayscale"
                    >
                       {isUpdating === checkoutOrder.id ? (
                          <span className="material-symbols-outlined animate-spin text-[24px]">refresh</span>
                       ) : (
                          <span className="material-symbols-outlined text-[24px]">check_circle</span>
                       )}
                       {paymentMethod === 'cash' && Number(amountTendered) > 0 && Number(amountTendered) < Number(checkoutOrder.total_amount)
                          ? `Confirm Partial — $${Number(amountTendered).toFixed(2)} received`
                          : `Process $${Number(checkoutOrder.total_amount).toFixed(2)} Payment`
                       }
                    </button>
                 </div>
              </div>

           </div>
        </div>
      )}
    </div>
  );
}
