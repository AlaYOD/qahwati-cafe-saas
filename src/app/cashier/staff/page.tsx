"use client";

import { useEffect, useState } from "react";
import {
  getAdminStaffData,
  createStaffProfile,
  updateStaffProfile,
  deleteStaffProfile,
} from "@/actions/staff";

const ROLES = [
  { value: "admin",   label: "Admin",   classes: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300" },
  { value: "manager", label: "Manager", classes: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300" },
  { value: "cashier", label: "Cashier", classes: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300" },
  { value: "barista", label: "Barista", classes: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
  { value: "waiter",  label: "Waiter",  classes: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
  { value: "staff",   label: "Staff",   classes: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300" },
];

const roleClasses = (role: string) =>
  ROLES.find((r) => r.value === role)?.classes ?? ROLES[ROLES.length - 1].classes;

const EMPTY_FORM = { full_name: "", role: "staff" };

export default function CashierStaffPage() {
  const [mounted, setMounted] = useState(false);
  const [staff, setStaff] = useState<any[] | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modal
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await getAdminStaffData();
      setStaff(res as any[]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchStaff();
  }, []);

  if (!mounted) return null;

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    setEditTarget(null);
    setModalMode("add");
  };

  const openEdit = (person: any) => {
    setForm({ full_name: person.full_name || "", role: person.role || "staff" });
    setFormError("");
    setEditTarget(person);
    setModalMode("edit");
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setModalMode(null);
    setEditTarget(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) { setFormError("Full name is required."); return; }
    setFormError("");
    setIsSubmitting(true);

    const res = modalMode === "edit" && editTarget
      ? await updateStaffProfile(editTarget.id, form)
      : await createStaffProfile(form);

    if (res.success) {
      closeModal();
      await fetchStaff();
    } else {
      setFormError(res.error || "Something went wrong.");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteStaffProfile(deleteTarget.id);
    if (res.success) {
      setDeleteTarget(null);
      await fetchStaff();
    } else {
      alert("Failed to delete: " + res.error);
    }
    setIsDeleting(false);
  };

  const filtered = (staff || []).filter((p) => {
    const matchSearch = !search.trim() || (p.full_name || "").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || p.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full relative">

      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-background-dark p-6 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-sm text-slate-500">Manage your employees, roles, and access.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchStaff}
            className="p-2 rounded-lg border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">refresh</span>
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Add Employee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Sidebar stats */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white dark:bg-background-dark p-5 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm text-center">
            <div className="size-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-2xl">badge</span>
            </div>
            <h3 className="text-3xl font-black">{staff?.length ?? "—"}</h3>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Total Employees</p>
          </div>

          {/* Role breakdown */}
          <div className="bg-white dark:bg-background-dark p-4 rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm">
            <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-3 px-1">By Role</h3>
            <div className="space-y-1">
              {ROLES.map((r) => {
                const count = staff?.filter((p) => p.role === r.value).length ?? 0;
                return (
                  <button
                    key={r.value}
                    onClick={() => setRoleFilter(roleFilter === r.value ? "all" : r.value)}
                    className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                      roleFilter === r.value
                        ? "bg-primary text-white font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-primary/5 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span className="capitalize">{r.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${roleFilter === r.value ? "bg-white/20" : "bg-slate-100 dark:bg-primary/10"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main table */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-primary/20 shadow-sm overflow-hidden">

            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 dark:border-primary/20 flex flex-wrap gap-3 justify-between items-center">
              <h2 className="font-bold text-sm">
                Staff Directory
                {filtered.length !== (staff?.length ?? 0) && (
                  <span className="ml-2 text-xs text-slate-400 font-normal">
                    {filtered.length} of {staff?.length}
                  </span>
                )}
              </h2>
              <div className="flex gap-2 items-center">
                {roleFilter !== "all" && (
                  <button
                    onClick={() => setRoleFilter("all")}
                    className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                    Clear role filter
                  </button>
                )}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name…"
                    className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-56"
                  />
                </div>
              </div>
            </div>

            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-primary/5 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-primary/10">
                <tr>
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
                {!staff ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-slate-400">
                      <span className="material-symbols-outlined animate-spin block mb-2 mx-auto">refresh</span>
                      Loading…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-slate-400">
                      <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">manage_accounts</span>
                      {search || roleFilter !== "all" ? "No employees match your filters." : "No employees yet. Add one to get started."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((person) => (
                    <tr key={person.id} className="hover:bg-slate-50/50 dark:hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-sm uppercase flex-none">
                            {(person.full_name || "?").charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                              {person.full_name || "Unnamed Employee"}
                            </p>
                            <p className="text-xs text-slate-400 font-mono">{person.id.slice(0, 8)}…</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${roleClasses(person.role)}`}>
                          {person.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {person.created_at ? new Date(person.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(person)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(person)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            <div className="flex justify-between items-center px-6 py-4 border-b border-primary/10">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">
                    {modalMode === "edit" ? "manage_accounts" : "person_add"}
                  </span>
                </div>
                <h3 className="font-bold text-lg">
                  {modalMode === "edit" ? "Edit Employee" : "Add Employee"}
                </h3>
              </div>
              <button
                disabled={isSubmitting}
                onClick={closeModal}
                className="p-1.5 rounded-full hover:bg-primary/10 text-slate-500 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Avatar preview */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-primary/5 rounded-xl border border-primary/10">
                <div className="size-14 rounded-full bg-primary/10 text-primary font-black text-2xl flex items-center justify-center uppercase flex-none">
                  {form.full_name.trim().charAt(0) || "?"}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {form.full_name.trim() || "New Employee"}
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold capitalize mt-1 ${roleClasses(form.role)}`}>
                    {form.role}
                  </span>
                </div>
              </div>

              {/* Full name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Ahmed Al-Rashid"
                  autoFocus
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  System Role <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setForm({ ...form, role: r.value })}
                      className={`py-2.5 rounded-xl text-xs font-bold capitalize border-2 transition-all ${
                        form.role === r.value
                          ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                          : "border-slate-200 dark:border-primary/20 text-slate-600 dark:text-slate-400 hover:border-primary/40"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role description */}
              <div className="text-xs text-slate-500 bg-slate-50 dark:bg-primary/5 rounded-lg px-3 py-2 border border-primary/10">
                {form.role === "admin"   && "Full access to all features and settings."}
                {form.role === "manager" && "Access to inventory, stock, suppliers, and reports."}
                {form.role === "cashier" && "Access to POS, orders, cash reports, and receipts."}
                {form.role === "barista" && "Access to active orders queue and menu reference."}
                {form.role === "waiter"  && "Access to table map, new orders, and tips."}
                {form.role === "staff"   && "Basic access — limited to assigned tasks."}
              </div>

              {formError && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
                  <span className="material-symbols-outlined text-sm flex-none">error</span>
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !form.full_name.trim()}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {isSubmitting && <span className="material-symbols-outlined animate-spin text-sm">refresh</span>}
                  {modalMode === "edit" ? "Save Changes" : "Add Employee"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-2xl shadow-2xl w-full max-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="size-14 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">person_remove</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Remove Employee?</h3>
                <p className="text-sm text-slate-500 mt-1">
                  This will permanently remove{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {deleteTarget.full_name || "this employee"}
                  </span>{" "}
                  from the system.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  disabled={isDeleting}
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting && <span className="material-symbols-outlined animate-spin text-sm">refresh</span>}
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
