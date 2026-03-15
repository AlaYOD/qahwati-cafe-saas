import React from "react";
import { Edit } from "lucide-react";

const inventoryData = [
  { id: 1, name: "Harari Premium Beans", category: "Coffee", unit: "kg", quantity: 50, minLevel: 10, cost: "45.00", status: "In Stock" },
  { id: 2, name: "Paper Cups 8oz", category: "Packaging", unit: "pcs", quantity: 1200, minLevel: 500, cost: "0.35", status: "In Stock" },
  { id: 3, name: "Full Fat Milk", category: "Dairy", unit: "L", quantity: 15, minLevel: 20, cost: "3.50", status: "Low Stock" },
  { id: 4, name: "White Sugar", category: "Additives", unit: "kg", quantity: 2, minLevel: 10, cost: "2.00", status: "Critical" },
  { id: 5, name: "Wooden Stirrers", category: "Consumables", unit: "box", quantity: 0, minLevel: 5, cost: "12.50", status: "Out of Stock" }
];

export function InventoryTable() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock": return "bg-emerald-100 text-emerald-800";
      case "Low Stock": return "bg-amber-100 text-amber-800";
      case "Critical": return "bg-rose-100 text-rose-800";
      case "Out of Stock": return "bg-slate-200 text-slate-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-y border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Item Name</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Unit</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Current Qty</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Min Level</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cost/Unit</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {inventoryData.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-slate-900">{item.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{item.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-500">{item.unit}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-black text-center ${
                item.quantity <= 0 ? "text-rose-500" : item.quantity <= item.minLevel ? "text-amber-500" : "text-slate-900"
              }`}>
                {item.quantity.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-500">{item.minLevel}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">${item.cost}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button className="text-slate-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10">
                  <Edit className="size-4.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
