'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { loginAction } from '@/lib/auth/auth-actions'

// ─────────────────────────────────────────────
// Inline SVGs / Icons matching Stitch design
// (uses Material Symbols via global font in layout.tsx)
// ─────────────────────────────────────────────
function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  )
}

function GoogleLogo() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

// ─────────────────────────────────────────────
// LoginForm Component
// ─────────────────────────────────────────────
export function LoginForm() {
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe]     = useState(false)
  const [isLoading, setIsLoading]       = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [attempts, setAttempts]         = useState(0)
  const router = useRouter()

  // ── Client-side validation ───────────────────
  function validate(): string | null {
    if (!email.trim())    return 'Email address is required.'
    if (!password.trim()) return 'Password is required.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    return null
  }

  // ── Submit ───────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    if (attempts >= 5) {
      setError('Too many failed attempts. Please wait a moment before trying again.')
      return
    }

    setIsLoading(true)

    try {
      const result = await loginAction({ email, password, rememberMe })
      toast.success(`Welcome back! Redirecting to your dashboard...`)
      router.push(result.redirectTo)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please try again.'
      setError(msg)
      setAttempts((n) => n + 1)
      if (attempts >= 4) {
        toast.error('Multiple failed attempts detected. Please check your credentials.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">

      {/* ── Logo & Heading ─────────────────────── */}
      <div className="flex flex-col items-center lg:items-start space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <div className="size-10 flex items-center justify-center bg-primary/20 rounded-lg">
            <MaterialIcon name="coffee" className="text-primary text-3xl" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Qahwati
          </h1>
        </div>
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Welcome Back
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Enter your credentials to access your account
          </p>
        </div>
      </div>

      {/* ── Form ───────────────────────────────── */}
      <form className="space-y-6" onSubmit={handleSubmit} noValidate suppressHydrationWarning>
        <div className="space-y-4">

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <MaterialIcon
                name="mail"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none"
              />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null) }}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <label
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                htmlFor="password"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs font-bold text-primary hover:underline focus:outline-none focus:underline"
                onClick={(e) => { e.preventDefault(); toast.info('Password reset coming soon.') }}
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <MaterialIcon
                name="lock"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none"
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null) }}
                disabled={isLoading}
                className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                suppressHydrationWarning
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
          >
            <MaterialIcon name="error" className="text-lg shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Rate-limit warning */}
        {attempts >= 3 && attempts < 5 && (
          <div
            role="status"
            className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm"
          >
            <MaterialIcon name="warning" className="text-lg shrink-0 mt-0.5" />
            <span>{5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining before temporary lockout.</span>
          </div>
        )}

        {/* Remember me */}
        <div className="flex items-center px-1">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="size-4 rounded border-slate-300 text-primary focus:ring-primary bg-transparent cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="ml-2 text-sm text-slate-600 dark:text-slate-400 font-medium cursor-pointer select-none"
          >
            Remember me for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <MaterialIcon name="progress_activity" className="text-lg animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <span>Login</span>
              <MaterialIcon name="arrow_forward" className="text-lg" />
            </>
          )}
        </button>
      </form>

      {/* ── Divider ────────────────────────────── */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#f7f7f7] dark:bg-[#1a1818] px-4 text-slate-500 font-bold tracking-widest">
            Or continue with
          </span>
        </div>
      </div>

      {/* ── Social buttons ─────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => toast.info('Google sign-in coming soon.')}
          className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-semibold text-sm text-slate-700 dark:text-slate-300"
        >
          <GoogleLogo />
          Google
        </button>
        <button
          type="button"
          onClick={() => toast.info('Apple sign-in coming soon.')}
          className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-semibold text-sm text-slate-700 dark:text-slate-300"
        >
          <MaterialIcon name="ios" className="text-xl" />
          Apple
        </button>
      </div>

      {/* ── Footer link ────────────────────────── */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <a
          href="#"
          className="text-primary font-bold hover:underline"
          onClick={(e) => { e.preventDefault(); toast.info('Registration coming soon.') }}
        >
          Sign up for free
        </a>
      </p>
    </div>
  )
}
