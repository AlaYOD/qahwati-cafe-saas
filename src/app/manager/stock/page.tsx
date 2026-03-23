"use client";

import { useEffect, useState } from "react";
import { getInventoryData, updateStockQuantity } from "@/actions/inventory";

export default function ManagerStockPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = () => {
    setLoading(true);
    getInventoryData()
      .then((data) => setItems(data as any[]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const startEdit = (item: any) => {
    setEditId(item.id);
    setEditQty(String(Number(item.quantity)));
  };

  const saveEdit = async (item: any) => {
    setSaving(true);
    const res = await updateStockQuantity(item.id, Number(editQty));
    setSaving(false);
    if (res.success) {
      setMessage({ type: "success", text: `Updated ${item.name} to ${editQty} ${item.unit}` });
      setEditId(null);
      load();
    } else {
      setMessage({ type: "error", text: res.error || "Failed to update stock." });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const grouped = items.reduce((acc: Record<string, any[]>, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Stock Adjustment</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update stock quantities by category</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-semibold transition-colors">
          <span className="material-symbols-outlined text-sm">refresh</span> Refresh
        </button>
      </div>

      {message && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === "success"
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          <span className="material-symbols-outlined text-sm">{message.type === "success" ? "check_circle" : "error"}</span>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading...
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, catItems]) => (
            <div key={category} className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-primary/10 bg-slate-50 dark:bg-primary/10 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">category</span>
                <h2 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300 capitalize">{category}</h2>
                <span className="ml-auto text-xs text-slate-400">{catItems.length} items</span>
              </div>
              <div className="divide-y divide-primary/5">
                {catItems.map((item) => {
                  const isLow = Number(item.quantity) <= Number(item.min_level);
                  const isEditing = editId === item.id;
                  return (
                    <div key={item.id} className="px-4 py-3 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Min: {Number(item.min_level).toFixed(1)} {item.unit} · ${Number(item.cost_per_unit).toFixed(3)}/unit</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editQty}
                              onChange={(e) => setEditQty(e.target.value)}
                              className="w-24 px-2 py-1.5 text-sm border border-primary rounded-lg bg-white dark:bg-primary/10 text-center focus:outline-none focus:ring-2 focus:ring-primary"
                              min="0"
                              step="0.1"
                            />
                            <span className="text-xs text-slate-400">{item.unit}</span>
                            <button
                              onClick={() => saveEdit(item)}
                              disabled={saving}
                              className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="px-3 py-1.5 bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="text-right">
                              <span className={`text-lg font-black ${isLow ? "text-red-500" : "text-slate-900 dark:text-slate-100"}`}>
                                {Number(item.quantity).toFixed(1)}
                              </span>
                              <span className="text-xs text-slate-400 ml-1">{item.unit}</span>
                            </div>
                            {isLow && (
                              <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold">Low</span>
                            )}
                            <button
                              onClick={() => startEdit(item)}
                              className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
