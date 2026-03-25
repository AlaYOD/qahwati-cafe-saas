"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useState } from "react";
import { getAdminMenuData, createCategory, createMenuItem } from "@/actions/menu";
import { cn } from "@/lib/utils";

export default function CashierMenuPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<{ categories: any[], menuItems: any[] } | null>(null);

  // Filter state
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Form states
  const [newCatName, setNewCatName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [productForm, setProductForm] = useState({
    name: "",
    category_id: "",
    price: "",
    image_url: ""
  });

  const fetchData = async () => {
    try {
      const res = await getAdminMenuData();
      setData(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  if (!mounted) return null;

  const filteredItems = data?.menuItems.filter(
    (item) => activeCategory === "all" || item.category_id === activeCategory
  ) || [];

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsSubmitting(true);
    
    const res = await createCategory(newCatName.trim());
    if (res.success) {
      setNewCatName("");
      setIsCategoryModalOpen(false);
      await fetchData();
    } else {
      alert("Failed to create category: " + res.error);
    }
    
    setIsSubmitting(false);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.category_id || !productForm.price) return;
    setIsSubmitting(true);

    const payload = {
      name: productForm.name,
      category_id: productForm.category_id,
      price: parseFloat(productForm.price),
      image_url: productForm.image_url
    };

    const res = await createMenuItem(payload);
    if (res.success) {
      setProductForm({ name: "", category_id: "", price: "", image_url: "" });
      setIsProductModalOpen(false);
      await fetchData();
    } else {
       alert("Failed to create product: " + res.error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto w-full relative animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-end bg-white dark:bg-background border border-slate-200 dark:border-primary/10 p-8 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-navy-800 dark:text-white uppercase tracking-tight">Menu Catalog</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Product registry & price management.</p>
        </div>
        <button 
          onClick={() => setIsProductModalOpen(true)}
          className="flex items-center justify-center px-6 py-2.5 rounded-pill bg-primary text-white hover:bg-primary/90 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-[18px] mr-2">add_box</span>Deploy Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar for Categories */}
        <div className="lg:col-span-1 border border-slate-200 dark:border-primary/10 bg-white dark:bg-background p-6 rounded-2xl shadow-sm h-fit">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-widest font-display">Categories</h3>
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-primary hover:bg-primary/10 rounded-full p-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveCategory("all")}
              className={`w-full text-left px-4 py-2.5 rounded-pill text-[11px] font-black uppercase tracking-widest flex justify-between items-center transition-all ${activeCategory === "all" ? "bg-navy-800 text-white shadow-lg" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-primary/5"}`}
            >
              <span>Global List</span>
              <span className={`${activeCategory === "all" ? "bg-white/20" : "bg-slate-100 dark:bg-primary/10"} text-[9px] px-2 py-0.5 rounded-full`}>{data?.menuItems.length || 0}</span>
            </button>
            {data?.categories.map(c => {
               const count = data.menuItems.filter(m => m.category_id === c.id).length;
               const isActive = activeCategory === c.id;
               return (
                 <button 
                   key={c.id} 
                   onClick={() => setActiveCategory(c.id)}
                   className={`w-full text-left px-4 py-2.5 rounded-pill text-[11px] font-black uppercase tracking-widest flex justify-between items-center transition-all ${isActive ? "bg-navy-800 text-white shadow-lg" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-primary/5"}`}
                 >
                   <span>{c.name}</span>
                   <span className={`${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-primary/10"} text-[9px] px-2 py-0.5 rounded-full`}>{count}</span>
                 </button>
               )
            })}
          </nav>
        </div>

        {/* Main Products Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-background rounded-2xl border border-slate-200 dark:border-primary/10 shadow-sm overflow-hidden min-h-[500px]">
            <div className="p-8 border-b border-slate-200 dark:border-primary/10 flex justify-between items-center">
               <h2 className="font-black text-navy-800 dark:text-white uppercase tracking-tight">Product Register</h2>
               <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                  <input type="text" placeholder="Search catalog..." className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/10 rounded-pill text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary w-64"/>
               </div>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-primary/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Nomenclature</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5 text-right">Unit Price</th>
                  <th className="px-8 py-5 text-center">Lifecycle</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
                {data ? filteredItems.map(item => (
                   <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-primary/5 transition-all group">
                     <td className="px-8 py-5">
                       <div className="flex items-center gap-4">
                         <div className="size-12 rounded-xl bg-slate-50 dark:bg-primary/5 overflow-hidden flex-none flex items-center justify-center border border-slate-100 dark:border-primary/10 group-hover:scale-105 transition-transform">
                           {item.image_url ? (
                             <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                           ) : (
                             <span className="material-symbols-outlined text-sm text-slate-300">local_cafe</span>
                           )}
                         </div>
                         <span className="font-bold text-sm text-navy-800 dark:text-white group-hover:text-primary transition-colors">{item.name}</span>
                       </div>
                     </td>
                     <td className="px-8 py-5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category?.name || 'GENERIC'}</span>
                     </td>
                     <td className="px-8 py-5 text-sm font-black text-navy-800 dark:text-white text-right">${Number(item.price).toFixed(2)}</td>
                     <td className="px-8 py-5 text-center">
                       {item.is_available ? (
                          <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-pill text-[9px] font-black uppercase tracking-tighter">Active</span>
                       ) : (
                          <span className="px-3 py-1 bg-slate-100 text-slate-400 border border-slate-200 rounded-pill text-[9px] font-black uppercase tracking-tighter">Disabled</span>
                       )}
                     </td>
                     <td className="px-8 py-5 text-right">
                        <button className="text-slate-400 hover:text-primary transition-colors p-2 rounded-pill hover:bg-primary/10">
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        </button>
                     </td>
                   </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center text-slate-400">
                      <span className="material-symbols-outlined animate-spin text-primary mb-4 text-3xl">refresh</span>
                      <p className="font-black text-[10px] uppercase tracking-widest animate-pulse">Syncing catalog stream...</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-800/60 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/20 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-primary/10">
              <h3 className="font-black text-navy-800 dark:text-white uppercase tracking-tight">New Component Group</h3>
              <button disabled={isSubmitting} onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-primary transition-all">
                <span className="material-symbols-outlined text-[20px]">cancel</span>
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Group Designation</label>
                <input 
                  type="text" 
                  required 
                  disabled={isSubmitting}
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/10 rounded-pill text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="e.g. SPECIALTY BREWS"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" disabled={isSubmitting} onClick={() => setIsCategoryModalOpen(false)} className="px-6 py-2.5 rounded-pill border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-pill bg-primary text-white hover:bg-primary/90 transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2">
                  {isSubmitting ? <span className="material-symbols-outlined animate-spin text-[16px]">refresh</span> : null} Deploy Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-800/60 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-background border border-slate-200 dark:border-primary/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-primary/10">
              <h3 className="font-black text-navy-800 dark:text-white uppercase tracking-tight">New Product Entry</h3>
              <button disabled={isSubmitting} onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-primary transition-all">
                <span className="material-symbols-outlined text-[20px]">cancel</span>
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Product Name</label>
                <input 
                  type="text" 
                  required 
                  disabled={isSubmitting}
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/10 rounded-pill text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="e.g. BARISTA SPECIAL BLEND"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Category Group</label>
                  <div className="relative">
                    <select 
                      required 
                      disabled={isSubmitting}
                      value={productForm.category_id}
                      onChange={(e) => setProductForm({...productForm, category_id: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/10 rounded-pill text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                    >
                      <option value="" disabled className="text-slate-400">SELECT GROUP...</option>
                      {data?.categories.map(c => (
                        <option key={c.id} value={c.id} className="text-navy-800 uppercase">{c.name}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">expand_more</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Unit Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    required 
                    disabled={isSubmitting}
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/10 rounded-pill text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary" 
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Visual Asset URL</label>
                <input 
                  type="url" 
                  disabled={isSubmitting}
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/10 rounded-pill text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="HTTP://..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" disabled={isSubmitting} onClick={() => setIsProductModalOpen(false)} className="px-6 py-2.5 rounded-pill border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-pill bg-primary text-white hover:bg-primary/90 transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2">
                  {isSubmitting ? <span className="material-symbols-outlined animate-spin text-[16px]">refresh</span> : null} Deploy Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
