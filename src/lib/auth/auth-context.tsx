'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction, logoutAction, getCurrentUserAction } from './auth-actions'
import { ROLE_DEFAULT_ROUTES } from './constants'
import type { AuthContextValue, LoginCredentials, Role, User } from './types'

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null)

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Hydrate user from session cookie on mount
  useEffect(() => {
    getCurrentUserAction()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await loginAction(credentials)
    setUser(result.user)
    router.push(result.redirectTo)
    router.refresh()
  }, [router])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await logoutAction()
      setUser(null)
      router.push('/login')
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const switchRole = useCallback((role: Role) => {
    if (!user) return
    const updated = { ...user, role }
    setUser(updated)
    const redirectTo = ROLE_DEFAULT_ROUTES[role] ?? '/select-role'
    router.push(redirectTo)
  }, [user, router])

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false
    if (user.role === 'admin') return true
    // Extend this map as permissions grow
    const permissionMap: Record<string, Role[]> = {
      'inventory:write':  ['manager'],
      'orders:manage':    ['cashier', 'barista', 'waiter'],
      'reports:view':     ['manager'],
      'shift:manage':     ['cashier', 'manager'],
    }
    return permissionMap[permission]?.includes(user.role) ?? false
  }, [user])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      switchRole,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
