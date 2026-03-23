"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useEffect, useState } from "react";
import { getAdminStaffData, createStaffProfile } from "@/actions/staff";

export default function AdminStaffPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [staff, setStaff] = useState<any[] | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    full_name: "",
    role: "staff"
  });

  const fetchStaff = async () => {
    try {
      const res = await getAdminStaffData();
      setStaff(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchStaff();
  }, []);

  if (!mounted) return null;

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name) return;
    setIsSubmitting(true);

    const res = await createStaffProfile(form);
    if (res.success) {
      setForm({ full_name: "", role: "staff" });
      setIsModalOpen(false);
      await fetchStaff();
    } else {
      alert("Failed to create staff member: " + res.error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full relative">
      <div className="flex justify-between items-center bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-sm text-slate-500">Manage your employees, roles, and shifts.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-sm mr-2">person_add</span>
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {/* Stats */}
         <div className="md:col-span-1 space-y-4">
            <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm text-center">
               <div className="size-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
                 <span className="material-symbols-outlined text-2xl">badge</span>
               </div>
               <h3 className="text-2xl font-bold">{staff?.length || 0}</h3>
               <p className="text-sm text-slate-500 font-medium">Total Employees</p>
            </div>
            <div className="bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm text-center">
               <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center mb-3">
                 <span className="material-symbols-outlined text-2xl">verified</span>
               </div>
               <h3 className="text-2xl font-bold">{staff?.filter(s => s.role === 'admin' || s.role === 'manager').length || 0}</h3>
               <p className="text-sm text-slate-500 font-medium">Managers & Admins</p>
            </div>
         </div>

         {/* Main Grid */}
         <div className="md:col-span-3">
          <div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm overflow-hidden min-h-[500px]">
            <div className="p-4 border-b border-slate-200 dark:border-primary/20 flex justify-between items-center">
               <h2 className="font-bold">Staff Directory</h2>
               <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                  <input type="text" placeholder="Search by name..." className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"/>
               </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-primary/5 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-primary/10">
                <tr>
                  <th className="px-6 py-4">Employee Name</th>
                  <th className="px-6 py-4">System Role</th>
                  <th className="px-6 py-4">Onboarding Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
                {staff ? staff.map(person => {
                   let roleClasses = "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
                   if (person.role === 'admin' || person.role === 'manager') roleClasses = "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300";
                   if (person.role === 'cashier') roleClasses = "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300";
                   
                   return (
                     <tr key={person.id} className="hover:bg-slate-50/50 dark:hover:bg-primary/5 transition-colors">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className="size-10 rounded-full bg-slate-200 dark:bg-primary/20 text-primary font-bold flex items-center justify-center uppercase">
                             {person.full_name?.charAt(0) || '?'}
                           </div>
                           <span className="font-medium text-sm">{person.full_name || 'Unnamed Employee'}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${roleClasses}`}>
                           {person.role}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-500">
                         {person.created_at ? new Date(person.created_at).toLocaleDateString() : 'N/A'}
                       </td>
                       <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 uppercase">Active</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/10">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                       </td>
                     </tr>
                   )
                }) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      <span className="material-symbols-outlined animate-spin mb-2">refresh</span>
                      <p>Loading database...</p>
                    </td>
                  </tr>
                )}
                {staff && staff.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      <p>No employees found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
         </div>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-primary/10">
              <h3 className="font-bold text-lg">Onboard Employee</h3>
              <button disabled={isSubmitting} onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:bg-primary/10 rounded-full p-1 transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateStaff} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  disabled={isSubmitting}
                  value={form.full_name}
                  onChange={(e) => setForm({...form, full_name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">System Role</label>
                <select 
                  required 
                  disabled={isSubmitting}
                  value={form.role}
                  onChange={(e) => setForm({...form, role: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  <option value="staff">Staff (Basic POS)</option>
                  <option value="cashier">Cashier</option>
                  <option value="barista">Barista (Order Viewer)</option>
                  <option value="manager">Manager (Reports Access)</option>
                </select>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-lg flex items-start gap-2 text-xs">
                <span className="material-symbols-outlined text-sm">info</span>
                <p>Creating a profile here adds them directly to the active system registry.</p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" disabled={isSubmitting} onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors text-sm font-medium">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold flex items-center shadow-sm disabled:opacity-50">
                  {isSubmitting ? <span className="material-symbols-outlined animate-spin text-[16px] mr-2">refresh</span> : null} Onboard Emploee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
