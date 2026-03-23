"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useState } from "react";
import { getAdminMenuData, createCategory, createMenuItem } from "@/actions/menu";

export default function AdminMenuPage() {
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
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full relative">
      <div className="flex justify-between items-center bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-sm text-slate-500">Manage categories, products, prices, and availability.</p>
        </div>
        <button 
          onClick={() => setIsProductModalOpen(true)}
          className="flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-sm mr-2">add</span>Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar for Categories */}
        <div className="lg:col-span-1 border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark p-4 rounded-xl shadow-sm h-fit">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Categories</h3>
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-primary hover:bg-primary/10 rounded-full p-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveCategory("all")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition-colors ${activeCategory === "all" ? "bg-primary text-white font-bold" : "text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-primary/5 bg-transparent"}`}
            >
              <span>All Products</span>
              <span className={`${activeCategory === "all" ? "bg-white/20" : "bg-slate-100 dark:bg-primary/10"} text-xs px-2 py-0.5 rounded-full`}>{data?.menuItems.length || 0}</span>
            </button>
            {data?.categories.map(c => {
               const count = data.menuItems.filter(m => m.category_id === c.id).length;
               const isActive = activeCategory === c.id;
               return (
                 <button 
                   key={c.id} 
                   onClick={() => setActiveCategory(c.id)}
                   className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition-colors ${isActive ? "bg-primary text-white font-bold" : "text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-primary/5 bg-transparent"}`}
                 >
                   <span>{c.name}</span>
                   <span className={`${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-primary/10"} text-xs px-2 py-0.5 rounded-full`}>{count}</span>
                 </button>
               )
            })}
          </nav>
        </div>

        {/* Main Products Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm overflow-hidden min-h-[500px]">
            <div className="p-4 border-b border-slate-200 dark:border-primary/20 flex justify-between items-center">
               <h2 className="font-bold">Products List</h2>
               <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                  <input type="text" placeholder="Search products..." className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"/>
               </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-primary/5 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-primary/10">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
                {data ? filteredItems.map(item => (
                   <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-primary/5 transition-colors">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="size-10 rounded-lg bg-slate-100 dark:bg-primary/10 overflow-hidden flex-none flex items-center justify-center">
                           {item.image_url ? (
                             <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                           ) : (
                             <span className="material-symbols-outlined text-primary/30">local_cafe</span>
                           )}
                         </div>
                         <span className="font-medium text-sm">{item.name}</span>
                       </div>
                     </td>
                     <td className="px-6 py-4 text-sm text-slate-500">{item.category?.name || 'Uncategorized'}</td>
                     <td className="px-6 py-4 text-sm font-bold text-primary text-right">${Number(item.price).toFixed(2)}</td>
                     <td className="px-6 py-4 text-center">
                       {item.is_available ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 uppercase">Active</span>
                       ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 uppercase">Inactive</span>
                       )}
                     </td>
                     <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/10">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                     </td>
                   </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      <span className="material-symbols-outlined animate-spin mb-2">refresh</span>
                      <p>Loading catalog...</p>
                    </td>
                  </tr>
                )}
                {data && filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      <p>No products found in the selected category.</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-primary/10">
              <h3 className="font-bold text-lg">New Category</h3>
              <button disabled={isSubmitting} onClick={() => setIsCategoryModalOpen(false)} className="text-slate-500 hover:bg-primary/10 rounded-full p-1 transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category Name</label>
                <input 
                  type="text" 
                  required 
                  disabled={isSubmitting}
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="e.g. Desserts"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" disabled={isSubmitting} onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors text-sm font-medium">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold flex items-center shadow-sm disabled:opacity-50">
                  {isSubmitting ? <span className="material-symbols-outlined animate-spin text-[16px] mr-2">refresh</span> : null} Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-primary/10">
              <h3 className="font-bold text-lg">New Product</h3>
              <button disabled={isSubmitting} onClick={() => setIsProductModalOpen(false)} className="text-slate-500 hover:bg-primary/10 rounded-full p-1 transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                <input 
                  type="text" 
                  required 
                  disabled={isSubmitting}
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="e.g. Iced Matcha Latte"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select 
                    required 
                    disabled={isSubmitting}
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({...productForm, category_id: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  >
                    <option value="" disabled>Select...</option>
                    {data?.categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    required 
                    disabled={isSubmitting}
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                    placeholder="4.50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL (Optional)</label>
                <input 
                  type="url" 
                  disabled={isSubmitting}
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="https://..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" disabled={isSubmitting} onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors text-sm font-medium">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold flex items-center shadow-sm disabled:opacity-50">
                  {isSubmitting ? <span className="material-symbols-outlined animate-spin text-[16px] mr-2">refresh</span> : null} Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
