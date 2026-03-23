'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { RoleCard } from '@/components/auth/role-card'
import { ProtectedRoute } from '@/components/auth/protected-route'
import type { Role } from '@/lib/auth/types'
import { ROLE_META } from '@/lib/auth/constants'

const SELECTABLE_ROLES: Role[] = ['admin', 'manager', 'cashier', 'barista', 'waiter']

function SelectRoleContent() {
  const { user, switchRole, logout } = useAuth()
  const [selected, setSelected] = useState<Role | null>(null)

  function handleContinue() {
    if (!selected) return
    switchRole(selected)
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] dark:bg-[#1a1818] flex flex-col items-center justify-center px-4 py-12">

      {/* Header */}
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="size-12 flex items-center justify-center bg-primary/20 rounded-xl">
            <span className="material-symbols-outlined text-primary text-3xl" aria-hidden="true">
              coffee
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Qahwati
          </h1>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Select Your Role
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
          {user?.full_name
            ? `Welcome, ${user.full_name}! Choose how you'd like to continue.`
            : "Choose how you'd like to continue."}
        </p>
      </div>

      {/* Role grid */}
      <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {SELECTABLE_ROLES.map((role) => (
          <RoleCard
            key={role}
            role={role}
            isActive={selected === role}
            onClick={setSelected}
          />
        ))}
      </div>

      {/* Continue button */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={!selected}
        className="w-full max-w-xs py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {selected ? (
          <>
            <span>Continue as {ROLE_META[selected]?.label}</span>
            <span className="material-symbols-outlined text-lg" aria-hidden="true">arrow_forward</span>
          </>
        ) : (
          <span>Select a role to continue</span>
        )}
      </button>

      {/* Logout link */}
      <button
        type="button"
        onClick={logout}
        className="mt-6 text-sm text-slate-400 hover:text-primary transition-colors"
      >
        Sign out
      </button>
    </div>
  )
}

export default function SelectRolePage() {
  return (
    <ProtectedRoute>
      <SelectRoleContent />
    </ProtectedRoute>
  )
}
