"use client";

import { useEffect, useState } from "react";
import { getAdminTablesData, createTable } from "@/actions/tables";
import { getAdminMenuData } from "@/actions/menu";
import { createOrder, updateOrder, deleteOrder } from "@/actions/orders";
import { useAuth } from "@/lib/auth/auth-context";

export default function CashierTablesPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [tables, setTables] = useState<any[] | null>(null);
  
  // Menu Data for POS
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Add Table Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", capacity: 2, zone: "indoor" });

  // Manage Order POS Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [isPosSubmitting, setIsPosSubmitting] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");

  const fetchData = async () => {
    try {
      const [tablesRes, menuRes] = await Promise.all([
         getAdminTablesData(),
         getAdminMenuData()
      ]);
      setTables(tablesRes);
      setCategories(menuRes.categories);
      setMenuItems(menuRes.menuItems);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  if (!mounted) return null;

  // Floorplan Operations
  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setIsSubmitting(true);

    const res = await createTable(form);
    if (res.success) {
      setForm({ name: "", capacity: 2, zone: "indoor" });
      setIsModalOpen(false);
      await fetchData();
    } else {
      alert("Failed to add table: " + res.error);
    }
    setIsSubmitting(false);
  };

  // Order/POS Operations
  const openOrderModal = (table: any, order: any | null) => {
    setSelectedTable(table);
    setActiveOrder(order);
    if (order) {
       setCustomerName(order.customer_name || "");
       setCart(order.order_items.map((oi: any) => ({
          menu_item_id: oi.menu_item_id,
          name: oi.menu_item?.name || 'Unknown',
          quantity: oi.quantity,
          unit_price: Number(oi.unit_price),
          image_url: oi.menu_item?.image_url
       })));
    } else {
       setCustomerName("");
       setCart([]);
    }
    setIsOrderModalOpen(true);
  };

  const addToCart = (item: any) => {
    const existing = cart.find(c => c.menu_item_id === item.id);
    if (existing) {
       setCart(cart.map(c => c.menu_item_id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
        setCart([...cart, { 
          menu_item_id: item.id, 
          name: item.name, 
          quantity: 1, 
          unit_price: Number(item.price),
          image_url: item.image_url
        }]);
    }
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(cart.map(c => {
       if (c.menu_item_id === id) {
          const newQ = c.quantity + delta;
          return newQ > 0 ? { ...c, quantity: newQ } : null;
       }
       return c;
    }).filter(Boolean));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

  const handleSaveOrder = async () => {
    if (cart.length === 0) return alert("Cart is empty");
    setIsPosSubmitting(true);
    
    // Save or Update depending on activeOrder
    if (activeOrder) {
       const res = await updateOrder(activeOrder.id, {
          customer_name: customerName,
          total_amount: cartTotal,
          items: cart
       });
       if (!res.success) alert("Failed to update: " + res.error);
    } else {
       const res = await createOrder({
          table_id: selectedTable.id,
          user_id: user?.id,
          payment_method: "cash", // defaults to cash since it's pending, handled upon completion
          total_amount: cartTotal,
          customer_name: customerName,
          items: cart
       });
       if (!res.success) alert("Failed to create: " + res.error);
    }

    await fetchData();
    setIsOrderModalOpen(false);
    setIsPosSubmitting(false);
  };

  const handleDeleteOrder = async () => {
    if (!activeOrder) return;
    if (!confirm("Are you sure you want to permanently delete/cancel this active order and free the table?")) return;
    
    setIsPosSubmitting(true);
    const res = await deleteOrder(activeOrder.id);
    if (!res.success) alert("Failed to delete order: " + res.error);
    
    await fetchData();
    setIsOrderModalOpen(false);
    setIsPosSubmitting(false);
  };

  // derived variables
  const filteredMenuProducts = activeCategoryFilter === "all" 
      ? menuItems 
      : menuItems.filter(p => p.category_id === activeCategoryFilter);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full relative">
      <div className="flex justify-between items-center bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Floorplan & Tables</h1>
          <p className="text-sm text-slate-500">Monitor live table activity, active tabs, and customer seatings.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={fetchData} className="flex items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors shadow-sm text-slate-500 bg-white dark:bg-background-dark">
              <span className="material-symbols-outlined">refresh</span>
           </button>
           <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center px-4 py-2 rounded-lg border border-transparent bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm font-medium text-sm">
              <span className="material-symbols-outlined text-sm mr-2">add</span> Add Table
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables ? tables.map(table => {
           const isOccupied = table.status === 'occupied';
           const activeOrderForTable = table.orders && table.orders.length > 0 ? table.orders[0] : null;
           
           return (
             <div key={table.id} className={`rounded-xl border ${isOccupied ? 'border-primary/30 ring-1 ring-primary/20 bg-primary/5' : 'border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark'} shadow-sm overflow-hidden flex flex-col transition-all cursor-default`}>
               <div className={`p-4 border-b flex justify-between items-start ${isOccupied ? 'border-primary/10' : 'border-slate-100 dark:border-primary/5'}`}>
                 <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                       <span className="material-symbols-outlined text-slate-400">table_restaurant</span>
                       {table.name}
                    </h3>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{table.zone} Zone</p>
                 </div>
                 <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${isOccupied ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>
                    {isOccupied ? 'Occupied' : 'Open'}
                 </div>
               </div>

               <div className="p-4 flex-grow flex flex-col justify-center">
                  {isOccupied && activeOrderForTable ? (
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center text-slate-500">
                             <span className="material-symbols-outlined text-[16px] mr-1">person</span>
                             <span className="font-medium text-slate-700 dark:text-slate-300">{activeOrderForTable.customer_name || 'Walk-in'}</span>
                          </div>
                       </div>
                       
                       <div className="border border-slate-100 dark:border-primary/10 rounded-lg p-3 bg-white dark:bg-black/10">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-200 dark:border-primary/10 pb-1">Tab Items</p>
                          <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                             {activeOrderForTable.order_items?.map((dt: any) => (
                               <div key={dt.id} className="flex justify-between items-center text-xs group">
                                  <div className="flex items-center gap-2 min-w-0">
                                     <div className="size-6 rounded bg-slate-100 dark:bg-primary/10 overflow-hidden flex-none border border-slate-200 dark:border-primary/10">
                                        {dt.menu_item?.image_url ? (
                                          <img src={dt.menu_item.image_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <span className="material-symbols-outlined text-[12px]">local_cafe</span>
                                          </div>
                                        )}
                                     </div>
                                     <span className="font-medium truncate">{dt.quantity}x {dt.menu_item?.name || 'Item'}</span>
                                  </div>
                                  <span className="text-slate-500 flex-none ml-2">${(Number(dt.quantity) * Number(dt.unit_price)).toFixed(2)}</span>
                               </div>
                             ))}
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-primary/10 flex justify-between items-center">
                             <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Total</span>
                             <span className="text-sm font-bold text-primary">${Number(activeOrderForTable.total_amount).toFixed(2)}</span>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 py-6">
                       <span className="material-symbols-outlined text-4xl mb-2 opacity-30">chair</span>
                       <p className="text-sm font-medium">Ready for seating</p>
                       <p className="text-xs text-slate-500 mt-1">Capacity: {table.capacity} guests</p>
                    </div>
                  )}
               </div>
               
               <div className="p-3 bg-slate-50 dark:bg-primary/5 border-t border-slate-100 dark:border-primary/10">
                  {isOccupied && activeOrderForTable ? (
                    <button 
                       onClick={() => openOrderModal(table, activeOrderForTable)} 
                       className="w-full py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                       <span className="material-symbols-outlined text-[18px]">edit_note</span> Manage Tab
                    </button>
                  ) : (
                    <button 
                       onClick={() => openOrderModal(table, null)} 
                       className="w-full py-2 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 text-primary rounded-lg text-sm font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                    >
                       <span className="material-symbols-outlined text-[18px]">add_circle</span> Add Order
                    </button>
                  )}
               </div>
             </div>
           )
        }) : (
           <div className="col-span-full py-20 text-center">
              <span className="material-symbols-outlined animate-spin text-4xl text-slate-300 mb-2">refresh</span>
              <p className="text-slate-500 font-medium">Loading Floorplan...</p>
           </div>
        )}
      </div>

      {/* Embedded POS Order Management Modal */}
      {isOrderModalOpen && selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
            
            {/* Left Side: Menu Selection */}
            <div className="w-full md:w-2/3 border-r border-slate-200 dark:border-primary/10 flex flex-col bg-slate-50 dark:bg-transparent">
               <div className="px-6 py-4 border-b border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                       <span className="material-symbols-outlined text-primary">restaurant_menu</span> Waiter POS
                    </h2>
                    <p className="text-sm text-slate-500">Add items to {selectedTable.name} tab</p>
                  </div>
                  <div className="flex gap-2 bg-slate-100 dark:bg-primary/10 p-1 rounded-lg">
                     <button onClick={() => setActiveCategoryFilter('all')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeCategoryFilter === 'all' ? 'bg-white shadow-sm text-primary dark:bg-primary dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>All</button>
                     {categories.map(cat => (
                        <button key={cat.id} onClick={() => setActiveCategoryFilter(cat.id)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeCategoryFilter === cat.id ? 'bg-white shadow-sm text-primary dark:bg-primary dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>{cat.name}</button>
                     ))}
                  </div>
               </div>
               
               <div className="p-6 flex-grow overflow-y-auto">
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                     {filteredMenuProducts.map((item) => (
                        <button 
                           key={item.id} 
                           onClick={() => addToCart(item)}
                           className="bg-white dark:bg-background border border-slate-200 dark:border-primary/10 rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all text-left flex flex-col active:scale-95 group"
                        >
                           <div className="aspect-video bg-slate-100 dark:bg-primary/5 relative overflow-hidden">
                              {item.image_url ? (
                                 <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                 <div className="w-full h-full flex items-center justify-center text-slate-300"><span className="material-symbols-outlined text-4xl">local_cafe</span></div>
                              )}
                              <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold border border-white/20 shadow-sm">${Number(item.price).toFixed(2)}</div>
                           </div>
                           <div className="p-3">
                              <h4 className="font-bold text-sm truncate">{item.name}</h4>
                              <p className="text-xs text-slate-500 truncate">{item.category?.name || 'Uncategorized'}</p>
                           </div>
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Right Side: Cart Details */}
            <div className="w-full md:w-1/3 flex flex-col bg-white dark:bg-background-dark">
               <div className="px-6 py-4 border-b border-slate-200 dark:border-primary/10 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-slate-400">table_bar</span>
                     <h3 className="font-bold">{selectedTable.name}</h3>
                  </div>
                  <button onClick={() => setIsOrderModalOpen(false)} className="text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 rounded-full p-1 transition-colors">
                     <span className="material-symbols-outlined">close</span>
                  </button>
               </div>

               <div className="p-6 border-b border-slate-200 dark:border-primary/10 bg-slate-50 dark:bg-primary/5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Customer Name (Optional)</label>
                  <div className="relative">
                     <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">person</span>
                     <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-primary/20 rounded-lg text-sm bg-white dark:bg-background-dark focus:ring-2 focus:ring-primary focus:outline-none"
                     />
                  </div>
               </div>

               <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-5xl mb-3 opacity-20">shopping_cart</span>
                        <p className="font-medium text-sm">Cart is empty</p>
                        <p className="text-xs mt-1">Select items from the menu to add to tab.</p>
                     </div>
                  ) : (
                     cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-center group bg-slate-50/50 dark:bg-primary/5 p-2 rounded-lg border border-transparent hover:border-primary/10 transition-colors">
                           <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                              <div className="size-10 rounded-md bg-white dark:bg-background overflow-hidden flex-none border border-slate-200 dark:border-primary/10">
                                 {item.image_url ? (
                                   <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                 ) : (
                                   <div className="w-full h-full flex items-center justify-center text-slate-300">
                                      <span className="material-symbols-outlined text-[18px]">local_cafe</span>
                                   </div>
                                 )}
                              </div>
                              <div className="min-w-0">
                                 <h4 className="font-bold text-sm truncate">{item.name}</h4>
                                 <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">${item.unit_price.toFixed(2)} each</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="flex items-center bg-white dark:bg-background rounded-lg border border-slate-200 dark:border-primary/20 shadow-sm overflow-hidden text-slate-900 dark:text-slate-100">
                                 <button onClick={() => updateCartQuantity(item.menu_item_id, -1)} className="p-1 px-1.5 text-slate-500 hover:bg-primary/5 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[16px]">remove</span></button>
                                 <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                                 <button onClick={() => updateCartQuantity(item.menu_item_id, 1)} className="p-1 px-1.5 text-slate-500 hover:bg-primary/5 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[16px]">add</span></button>
                              </div>
                              <div className="w-14 text-right">
                                 <span className="font-black text-sm text-primary">${(item.quantity * item.unit_price).toFixed(2)}</span>
                              </div>
                           </div>
                        </div>
                     ))
                  )}
               </div>

               {/* Cart Summary & Actions */}
               <div className="p-6 border-t border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                  <div className="flex justify-between items-end mb-6">
                     <span className="text-slate-500 font-bold uppercase tracking-wider text-sm">Total Due</span>
                     <span className="text-3xl font-black text-primary">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     {activeOrder ? (
                        <>
                           <button 
                              disabled={isPosSubmitting}
                              onClick={handleDeleteOrder}
                              className="w-full py-3 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                           >
                              <span className="material-symbols-outlined text-[18px]">delete</span> Delete Order
                           </button>
                           <button 
                              disabled={isPosSubmitting || cart.length === 0}
                              onClick={handleSaveOrder}
                              className="w-full py-3 rounded-xl bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:outline-none transition-colors font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                           >
                              {isPosSubmitting ? <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span> : <span className="material-symbols-outlined text-[20px]">save</span>}
                              Save Changes
                           </button>
                        </>
                     ) : (
                        <button 
                           disabled={isPosSubmitting || cart.length === 0}
                           onClick={handleSaveOrder}
                           className="col-span-2 w-full py-4 rounded-xl bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:outline-none transition-colors font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                        >
                           {isPosSubmitting ? <span className="material-symbols-outlined animate-spin">refresh</span> : <span className="material-symbols-outlined">send</span>}
                           Send to Kitchen & Lock Table
                        </button>
                     )}
                  </div>
               </div>
            </div>

          </div>
        </div>
      )}

      {/* Add Table Empty Skeleton Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-primary/10">
              <h3 className="font-bold text-lg">Add New Table</h3>
              <button disabled={isSubmitting} onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:bg-primary/10 rounded-full p-1 transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateTable} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Table Name/Identifier</label>
                <input 
                  type="text" 
                  required 
                  disabled={isSubmitting}
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="e.g. Table 5"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Capacity</label>
                   <input 
                     type="number" 
                     min="1"
                     required 
                     disabled={isSubmitting}
                     value={form.capacity}
                     onChange={(e) => setForm({...form, capacity: parseInt(e.target.value) || 1})}
                     className="w-full px-3 py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Zone</label>
                   <select 
                     required 
                     disabled={isSubmitting}
                     value={form.zone}
                     onChange={(e) => setForm({...form, zone: e.target.value})}
                     className="w-full px-3 py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                   >
                     <option value="indoor">Indoor</option>
                     <option value="patio">Patio</option>
                     <option value="bar">Bar Seating</option>
                   </select>
                 </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" disabled={isSubmitting} onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors text-sm font-medium">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold flex items-center shadow-sm disabled:opacity-50">
                  {isSubmitting ? <span className="material-symbols-outlined animate-spin text-[16px] mr-2">refresh</span> : null} Add Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
