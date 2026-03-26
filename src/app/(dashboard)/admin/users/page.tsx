"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllUsersWithEmail,
  createFullUser,
  updateUserProfile,
  updateUserPassword,
  updateUserEmail,
  deleteFullUser,
} from "@/actions/admin-users";

// ─── Constants ────────────────────────────────────────────────
const ROLES = [
  {
    value: "admin",
    label: "Admin",
    icon: "shield_person",
    pill: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
    glow: "shadow-violet-500/20",
    accent: "#8b5cf6",
    dot: "bg-violet-400",
  },
  {
    value: "manager",
    label: "Manager",
    icon: "manage_accounts",
    pill: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    glow: "shadow-indigo-500/20",
    accent: "#6366f1",
    dot: "bg-indigo-400",
  },
  {
    value: "cashier",
    label: "Cashier",
    icon: "point_of_sale",
    pill: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
    glow: "shadow-sky-500/20",
    accent: "#0ea5e9",
    dot: "bg-sky-400",
  },
  {
    value: "barista",
    label: "Barista",
    icon: "local_cafe",
    pill: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    glow: "shadow-amber-500/20",
    accent: "#f59e0b",
    dot: "bg-amber-400",
  },
  {
    value: "waiter",
    label: "Waiter",
    icon: "room_service",
    pill: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    glow: "shadow-emerald-500/20",
    accent: "#10b981",
    dot: "bg-emerald-400",
  },
  {
    value: "staff",
    label: "Staff",
    icon: "badge",
    pill: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
    glow: "shadow-slate-500/20",
    accent: "#94a3b8",
    dot: "bg-slate-400",
  },
];

const getRoleMeta = (role: string) =>
  ROLES.find((r) => r.value === role) || ROLES[ROLES.length - 1];

const avatarGradients = [
  "from-violet-600 to-indigo-600",
  "from-indigo-600 to-sky-600",
  "from-sky-600 to-cyan-600",
  "from-amber-500 to-orange-500",
  "from-emerald-600 to-teal-600",
  "from-pink-600 to-rose-600",
];

function getGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

function timeAgo(date: string | null) {
  if (!date) return "Never";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

// ─── Types ─────────────────────────────────────────────────────
type User = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url: string | null;
  created_at: string | null;
  last_sign_in: string | null;
  email_confirmed: boolean;
  has_profile: boolean;
};

type DetailTab = "profile" | "security" | "danger";

// ─── Main Page ────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<User[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Detail modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("profile");

  // Add user modal
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoadError("");
    const res = await getAllUsersWithEmail();
    if (res.success) {
      setUsers(res.users as User[]);
    } else {
      setLoadError(res.error || "Failed to load users");
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchUsers();
  }, [fetchUsers]);

  if (!mounted) return null;

  const filtered = (users || []).filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.email.toLowerCase().includes(q) ||
      (u.full_name || "").toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleCounts = ROLES.reduce<Record<string, number>>((acc, r) => {
    acc[r.value] = (users || []).filter((u) => u.role === r.value).length;
    return acc;
  }, {});

  const recentCount = (users || []).filter((u) => {
    if (!u.created_at) return false;
    return Date.now() - new Date(u.created_at).getTime() < 7 * 86400000;
  }).length;

  const activeCount = (users || []).filter((u) => {
    if (!u.last_sign_in) return false;
    return Date.now() - new Date(u.last_sign_in).getTime() < 24 * 3600000;
  }).length;

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(ellipse at 20% 0%, #1a0e3a 0%, #07091a 50%, #030509 100%)",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400/60 mb-2 tracking-widest uppercase">
              <span className="material-symbols-outlined text-sm">shield</span>
              Admin Console
              <span className="text-white/20">›</span>
              User Management
            </div>
            <h1
              className="text-3xl lg:text-4xl font-black tracking-tight"
              style={{
                background: "linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 50%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              User Control Center
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage identities, roles, credentials, and access across the platform.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchUsers}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                color: "white",
              }}
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              New User
            </button>
          </div>
        </div>

        {/* ── Load Error ── */}
        {loadError && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            <span className="material-symbols-outlined text-[18px] flex-none">error</span>
            {loadError}
          </div>
        )}

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Users",
              value: users?.length ?? "—",
              icon: "group",
              color: "#6366f1",
              bg: "rgba(99,102,241,0.1)",
              border: "rgba(99,102,241,0.2)",
            },
            {
              label: "Active Today",
              value: users ? activeCount : "—",
              icon: "online_prediction",
              color: "#10b981",
              bg: "rgba(16,185,129,0.1)",
              border: "rgba(16,185,129,0.2)",
            },
            {
              label: "Admins",
              value: users ? (roleCounts["admin"] ?? 0) : "—",
              icon: "shield_person",
              color: "#8b5cf6",
              bg: "rgba(139,92,246,0.1)",
              border: "rgba(139,92,246,0.2)",
            },
            {
              label: "New This Week",
              value: users ? recentCount : "—",
              icon: "new_releases",
              color: "#0ea5e9",
              bg: "rgba(14,165,233,0.1)",
              border: "rgba(14,165,233,0.2)",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
            >
              <div
                className="size-11 rounded-xl flex items-center justify-center flex-none"
                style={{ background: `${stat.color}20` }}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ color: stat.color }}
                >
                  {stat.icon}
                </span>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Content ── */}
        <div className="flex gap-5">

          {/* Filter sidebar */}
          <div
            className="w-52 flex-none rounded-2xl p-4 space-y-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-3 px-1">
                Filter by Role
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setRoleFilter("all")}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    roleFilter === "all"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>All Users</span>
                  <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full font-mono">
                    {users?.length ?? 0}
                  </span>
                </button>
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRoleFilter(roleFilter === r.value ? "all" : r.value)}
                    className={`w-full flex justify-between items-center px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      roleFilter === r.value
                        ? r.pill
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`size-1.5 rounded-full ${r.dot} opacity-70`} />
                      {r.label}
                    </div>
                    <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full font-mono">
                      {roleCounts[r.value] ?? 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Users table */}
          <div
            className="flex-1 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Toolbar */}
            <div
              className="flex flex-wrap gap-3 justify-between items-center px-5 py-3.5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-sm font-bold text-white/80">
                User Directory
                {filtered.length !== (users?.length ?? 0) && (
                  <span className="ml-2 text-xs text-slate-500 font-normal">
                    {filtered.length} of {users?.length}
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                {roleFilter !== "all" && (
                  <button
                    onClick={() => setRoleFilter("all")}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                    Clear filter
                  </button>
                )}
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                    search
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users…"
                    className="pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 w-52"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-left">
              <thead>
                <tr
                  className="text-[10px] font-bold tracking-widest uppercase text-slate-600"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3 hidden lg:table-cell">Last Active</th>
                  <th className="px-5 py-3 hidden lg:table-cell">Joined</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!users ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-600">
                        <div
                          className="size-12 rounded-2xl flex items-center justify-center"
                          style={{ background: "rgba(99,102,241,0.1)" }}
                        >
                          <span className="material-symbols-outlined animate-spin text-indigo-500">
                            refresh
                          </span>
                        </div>
                        <p className="text-sm">Loading users…</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-600">
                        <span className="material-symbols-outlined text-4xl opacity-30">
                          person_search
                        </span>
                        <p className="text-sm">
                          {search || roleFilter !== "all"
                            ? "No users match your filters."
                            : "No users found."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
                    const role = getRoleMeta(user.role);
                    const gradient = getGradient(user.id);
                    return (
                      <tr
                        key={user.id}
                        className="group cursor-pointer transition-all duration-200"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background =
                            "rgba(99,102,241,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background = "";
                        }}
                        onClick={() => {
                          setSelectedUser(user);
                          setDetailTab("profile");
                        }}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`size-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-sm flex-none`}
                            >
                              {(user.full_name || user.email || "?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-white/90 leading-tight">
                                {user.full_name || (
                                  <span className="text-slate-500 italic">No name</span>
                                )}
                              </p>
                              <p className="text-xs text-slate-500 font-mono mt-0.5">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${role.pill}`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${role.dot} opacity-80`}
                            />
                            {role.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 hidden lg:table-cell">
                          <span className="text-xs text-slate-500 font-mono">
                            {timeAgo(user.last_sign_in)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 hidden lg:table-cell">
                          <span className="text-xs text-slate-500">
                            {user.created_at
                              ? new Date(user.created_at).toLocaleDateString()
                              : "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(user);
                                setDetailTab("profile");
                              }}
                              className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(user);
                                setDetailTab("security");
                              }}
                              className="p-1.5 rounded-lg text-sky-400 hover:bg-sky-500/10 transition-colors"
                              title="Security"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                lock_reset
                              </span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(user);
                                setDetailTab("danger");
                              }}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── User Detail Modal ─── */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          initialTab={detailTab}
          onClose={() => setSelectedUser(null)}
          onRefresh={async () => {
            await fetchUsers();
            setSelectedUser(null);
          }}
        />
      )}

      {/* ─── Add User Modal ─── */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onRefresh={async () => {
            await fetchUsers();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

// ─── User Detail Modal ────────────────────────────────────────
function UserDetailModal({
  user,
  initialTab,
  onClose,
  onRefresh,
}: {
  user: User;
  initialTab: DetailTab;
  onClose: () => void;
  onRefresh: () => Promise<void>;
}) {
  const [tab, setTab] = useState<DetailTab>(initialTab);

  // Profile tab state
  const [profileForm, setProfileForm] = useState({
    full_name: user.full_name || "",
    role: user.role || "staff",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Security tab state
  const [secForm, setSecForm] = useState({ password: "", confirmPassword: "", email: user.email });
  const [secSaving, setSecSaving] = useState(false);
  const [secMsg, setSecMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Danger tab state
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const role = getRoleMeta(user.role);
  const gradient = getGradient(user.id);

  const saveProfile = async () => {
    if (!profileForm.full_name.trim()) {
      setProfileMsg({ type: "err", text: "Full name is required." });
      return;
    }
    setProfileSaving(true);
    setProfileMsg(null);
    const res = await updateUserProfile(user.id, profileForm);
    if (res.success) {
      setProfileMsg({ type: "ok", text: "Profile updated successfully." });
      await onRefresh();
    } else {
      setProfileMsg({ type: "err", text: res.error || "Update failed." });
    }
    setProfileSaving(false);
  };

  const savePassword = async () => {
    if (secForm.password.length < 6) {
      setSecMsg({ type: "err", text: "Password must be at least 6 characters." });
      return;
    }
    if (secForm.password !== secForm.confirmPassword) {
      setSecMsg({ type: "err", text: "Passwords do not match." });
      return;
    }
    setSecSaving(true);
    setSecMsg(null);
    const res = await updateUserPassword(user.id, secForm.password);
    if (res.success) {
      setSecMsg({ type: "ok", text: "Password updated successfully." });
      setSecForm((f) => ({ ...f, password: "", confirmPassword: "" }));
    } else {
      setSecMsg({ type: "err", text: res.error || "Password update failed." });
    }
    setSecSaving(false);
  };

  const saveEmail = async () => {
    if (!secForm.email.includes("@")) {
      setSecMsg({ type: "err", text: "Invalid email address." });
      return;
    }
    setSecSaving(true);
    setSecMsg(null);
    const res = await updateUserEmail(user.id, secForm.email);
    if (res.success) {
      setSecMsg({ type: "ok", text: "Email updated. A confirmation may be sent." });
    } else {
      setSecMsg({ type: "err", text: res.error || "Email update failed." });
    }
    setSecSaving(false);
  };

  const handleDelete = async () => {
    if (deleteConfirm !== user.email) return;
    setIsDeleting(true);
    const res = await deleteFullUser(user.id);
    if (res.success) {
      await onRefresh();
    } else {
      alert("Delete failed: " + res.error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(160deg, #0f1130 0%, #080c1c 100%)",
          border: "1px solid rgba(99,102,241,0.2)",
          boxShadow: "0 0 60px rgba(99,102,241,0.1), 0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Modal header */}
        <div
          className="flex items-center gap-4 px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className={`size-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-xl flex-none`}
          >
            {(user.full_name || user.email || "?").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-white text-lg leading-tight truncate">
              {user.full_name || <span className="text-slate-500 italic font-normal">No name</span>}
            </p>
            <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">{user.email}</p>
            <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-lg text-xs font-bold capitalize ${role.pill}`}>
              <span className={`size-1.5 rounded-full ${role.dot}`} />
              {role.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all flex-none"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 px-6 pt-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {(
            [
              { id: "profile", icon: "person", label: "Profile" },
              { id: "security", icon: "lock", label: "Security" },
              { id: "danger", icon: "warning", label: "Danger" },
            ] as { id: DetailTab; icon: string; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all -mb-px border-b-2 ${
                tab === t.id
                  ? t.id === "danger"
                    ? "text-red-400 border-red-500"
                    : "text-indigo-300 border-indigo-500"
                  : "text-slate-500 border-transparent hover:text-slate-300"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {/* Profile Tab */}
          {tab === "profile" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm((f) => ({ ...f, full_name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  System Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setProfileForm((f) => ({ ...f, role: r.value }))}
                      className={`py-2.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                        profileForm.role === r.value
                          ? r.pill + " shadow-lg"
                          : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {profileMsg && (
                <div
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm ${
                    profileMsg.type === "ok"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                      : "bg-red-500/10 border border-red-500/30 text-red-300"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {profileMsg.type === "ok" ? "check_circle" : "error"}
                  </span>
                  {profileMsg.text}
                </div>
              )}

              <button
                onClick={saveProfile}
                disabled={profileSaving}
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 0 20px rgba(99,102,241,0.25)",
                  color: "white",
                }}
              >
                {profileSaving && (
                  <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                )}
                Save Profile
              </button>
            </div>
          )}

          {/* Security Tab */}
          {tab === "security" && (
            <div className="space-y-5">
              {/* Email */}
              <div
                className="p-4 rounded-xl space-y-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-sky-400">email</span>
                  Change Email
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={secForm.email}
                    onChange={(e) => setSecForm((f) => ({ ...f, email: e.target.value }))}
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                  <button
                    onClick={saveEmail}
                    disabled={secSaving}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-sky-300 border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 transition-all disabled:opacity-50"
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Password */}
              <div
                className="p-4 rounded-xl space-y-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-violet-400">lock_reset</span>
                  Reset Password
                </p>
                <input
                  type="password"
                  value={secForm.password}
                  onChange={(e) => setSecForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  placeholder="New password (min. 6 chars)"
                />
                <input
                  type="password"
                  value={secForm.confirmPassword}
                  onChange={(e) => setSecForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  placeholder="Confirm new password"
                />
                <button
                  onClick={savePassword}
                  disabled={secSaving || !secForm.password}
                  className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300"
                >
                  {secSaving && (
                    <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                  )}
                  Set New Password
                </button>
              </div>

              {secMsg && (
                <div
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm ${
                    secMsg.type === "ok"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                      : "bg-red-500/10 border border-red-500/30 text-red-300"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {secMsg.type === "ok" ? "check_circle" : "error"}
                  </span>
                  {secMsg.text}
                </div>
              )}
            </div>
          )}

          {/* Danger Zone Tab */}
          {tab === "danger" && (
            <div className="space-y-5">
              <div
                className="p-4 rounded-xl"
                style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="material-symbols-outlined text-red-400 text-2xl flex-none mt-0.5">
                    warning
                  </span>
                  <div>
                    <p className="font-bold text-red-300 text-sm">Delete User Account</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      This will permanently delete the user&apos;s auth account and profile. All
                      associated data may be affected. This action cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">
                      Type{" "}
                      <span className="font-mono text-red-400 select-all">{user.email}</span>{" "}
                      to confirm:
                    </label>
                    <input
                      type="text"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-red-300 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500/50 font-mono"
                      style={{
                        background: "rgba(239,68,68,0.05)",
                        border: "1px solid rgba(239,68,68,0.2)",
                      }}
                      placeholder={user.email}
                    />
                  </div>

                  <button
                    onClick={handleDelete}
                    disabled={deleteConfirm !== user.email || isDeleting}
                    className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30"
                    style={{
                      background:
                        deleteConfirm === user.email
                          ? "rgba(239,68,68,0.2)"
                          : "rgba(239,68,68,0.05)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#fca5a5",
                    }}
                  >
                    {isDeleting && (
                      <span className="material-symbols-outlined animate-spin text-sm">
                        refresh
                      </span>
                    )}
                    <span className="material-symbols-outlined text-sm">delete_forever</span>
                    Permanently Delete Account
                  </button>
                </div>
              </div>

              {/* User ID info */}
              <div
                className="p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">
                  User ID
                </p>
                <p className="text-xs font-mono text-slate-500 break-all">{user.id}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add User Modal ───────────────────────────────────────────
function AddUserModal({
  onClose,
  onRefresh,
}: {
  onClose: () => void;
  onRefresh: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "staff",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim() || !form.full_name.trim()) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setSaving(true);
    const res = await createFullUser(form);
    if (res.success) {
      await onRefresh();
    } else {
      setError(res.error || "Failed to create user.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(160deg, #0f1130 0%, #080c1c 100%)",
          border: "1px solid rgba(99,102,241,0.2)",
          boxShadow: "0 0 60px rgba(99,102,241,0.1), 0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="size-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}
            >
              <span className="material-symbols-outlined text-indigo-400 text-[20px]">
                person_add
              </span>
            </div>
            <div>
              <p className="font-black text-white text-base">Create New User</p>
              <p className="text-xs text-slate-500">Adds auth + profile record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              placeholder="e.g. Ahmed Al-Rashid"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-3 pr-10 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                placeholder="Min. 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                  className={`py-2.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                    form.role === r.value
                      ? r.pill
                      : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm bg-red-500/10 border border-red-500/30 text-red-300">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-all border border-white/10 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-[2] py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 0 20px rgba(99,102,241,0.25)",
                color: "white",
              }}
            >
              {saving && (
                <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
              )}
              <span className="material-symbols-outlined text-sm">person_add</span>
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
