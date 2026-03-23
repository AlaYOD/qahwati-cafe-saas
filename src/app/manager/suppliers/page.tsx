"use client";

export default function ManagerSuppliersPage() {
  const mockSuppliers = [
    { id: "1", name: "Al-Rashid Coffee Imports", contact: "Ahmed Al-Rashid", phone: "+966 55 123 4567", email: "orders@alrashid.sa", category: "Coffee & Beans", status: "active" },
    { id: "2", name: "Dairy Fresh Co.", contact: "Sara Mohammed", phone: "+966 55 987 6543", email: "supply@dairyfresh.sa", category: "Dairy & Milk", status: "active" },
    { id: "3", name: "Sweet Supplies LLC", contact: "Khalid Omar", phone: "+966 55 456 7890", email: "info@sweetsupplies.sa", category: "Syrups & Flavors", status: "active" },
    { id: "4", name: "PackRight Materials", contact: "Fatima Hassan", phone: "+966 55 321 0987", email: "sales@packright.sa", category: "Packaging", status: "inactive" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Suppliers</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your supplier contacts and relationships</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-sm">add</span> Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Suppliers</p>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{mockSuppliers.length}</p>
        </div>
        <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Active</p>
          <p className="text-3xl font-black text-emerald-500">{mockSuppliers.filter(s => s.status === "active").length}</p>
        </div>
        <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Inactive</p>
          <p className="text-3xl font-black text-slate-400">{mockSuppliers.filter(s => s.status === "inactive").length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-primary/5 border border-primary/20 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/10 bg-slate-50 dark:bg-primary/10">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Supplier</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Contact</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Category</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Phone</th>
              <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Status</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {mockSuppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{supplier.name}</p>
                  <p className="text-xs text-slate-400">{supplier.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{supplier.contact}</td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">{supplier.category}</span>
                </td>
                <td className="px-4 py-3 text-slate-500">{supplier.phone}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    supplier.status === "active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    <span className={`size-1.5 rounded-full ${supplier.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                    {supplier.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
