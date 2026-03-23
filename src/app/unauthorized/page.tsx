'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { ROLE_DEFAULT_ROUTES } from '@/lib/auth/constants'

export default function UnauthorizedPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  function handleGoBack() {
    if (isAuthenticated && user) {
      router.push(ROLE_DEFAULT_ROUTES[user.role] ?? '/select-role')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f7] dark:bg-[#1a1818] px-4 text-center">
      <div className="size-20 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-red-500 text-5xl" aria-hidden="true">
          lock
        </span>
      </div>
      <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-3">
        Access Denied
      </h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 text-sm leading-relaxed">
        You don&apos;t have permission to access this page.
        {user && (
          <> Your current role is <strong className="text-primary">{user.role}</strong>.</>
        )}
      </p>
      <button
        type="button"
        onClick={handleGoBack}
        className="py-3 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-lg" aria-hidden="true">
          arrow_back
        </span>
        Go to My Dashboard
      </button>
    </div>
  )
}
