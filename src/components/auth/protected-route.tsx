'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import type { Role } from '@/lib/auth/types'
import { ROLE_DEFAULT_ROUTES } from '@/lib/auth/constants'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Role[]
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, allowedRoles, fallback }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.replace('/login')
      return
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect to their own dashboard rather than /unauthorized for better UX
      const ownRoute = ROLE_DEFAULT_ROUTES[user.role] ?? '/select-role'
      router.replace(ownRoute)
    }
  }, [isAuthenticated, isLoading, allowedRoles, user, router])

  // Loading skeleton
  if (isLoading) {
    return fallback ?? (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] dark:bg-[#1a1818]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl animate-pulse">
              coffee
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated → redirect handled above, show nothing
  if (!isAuthenticated) return null

  // Role mismatch → redirect handled above
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return null

  return <>{children}</>
}
