"use client";

import { useEffect, useState } from "react";
import { getAdminMenuData } from "@/actions/menu";

export default function BaristaMenuPage() {
  const [data, setData] = useState<{ categories: any[]; menuItems: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminMenuData().then(setData as any).finally(() => setLoading(false));
  }, []);

  const filtered = (data?.menuItems || []).filter((item) => {
    const matchCat = activeCategory === "all" || item.category_id === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Menu Reference</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Browse all available menu items and their details</p>
      </div>

      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search menu items..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-primary/5 border border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex-none px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            activeCategory === "all"
              ? "bg-primary text-white"
              : "bg-white dark:bg-primary/10 border border-primary/20 text-slate-600 dark:text-slate-400"
          }`}
        >
          All Items
        </button>
        {data?.categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`flex-none px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeCategory === c.id
                ? "bg-primary text-white"
                : "bg-white dark:bg-primary/10 border border-primary/20 text-slate-600 dark:text-slate-400"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <span className="material-symbols-outlined text-5xl block mb-3">menu_book</span>
          <p>No items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-primary/5 border border-primary/20 rounded-xl overflow-hidden flex flex-col ${
                !item.is_available ? "opacity-50" : ""
              }`}
            >
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-32 bg-slate-100 dark:bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-primary/30">local_cafe</span>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
                  <span className="text-primary font-black text-sm flex-none">${Number(item.price).toFixed(2)}</span>
                </div>
                {item.description && (
                  <p className="text-xs text-slate-500 leading-relaxed mb-2">{item.description}</p>
                )}
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {item.category?.name || "Uncategorized"}
                  </span>
                  {!item.is_available && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full dark:bg-red-900/30 dark:text-red-400">
                      Unavailable
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
