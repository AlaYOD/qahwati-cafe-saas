'use server'

import { createClient } from '@supabase/supabase-js'
import { setAuthCookies, clearAuthCookies } from './token-manager'
import { ROLE_DEFAULT_ROUTES } from './constants'
import type { LoginCredentials, LoginResult, User, Role } from './types'

// Server-side Supabase client (uses service role to fetch profiles)
function getSupabaseAdmin() {
  const url     = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
export async function loginAction(credentials: LoginCredentials): Promise<LoginResult> {
  const supabase = getSupabaseAdmin()

  // 1. Authenticate with Supabase
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email:    credentials.email,
    password: credentials.password,
  })

  if (authError || !authData.session || !authData.user) {
    const msg = authError?.message ?? 'Authentication failed'
    if (msg.toLowerCase().includes('invalid login credentials')) {
      throw new Error('Invalid email or password. Please try again.')
    }
    if (msg.toLowerCase().includes('email not confirmed')) {
      throw new Error('Please verify your email address before logging in.')
    }
    throw new Error(msg)
  }

  // 2. Fetch profile to get the role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, role, avatar_url')
    .eq('id', authData.user.id)
    .single()

  if (profileError || !profile) {
    throw new Error('User profile not found. Please contact support.')
  }

  const user: User = {
    id:        authData.user.id,
    email:     authData.user.email!,
    full_name: profile.full_name,
    role:      profile.role as Role,
    avatar_url: profile.avatar_url,
  }

  // 3. Set httpOnly cookies
  await setAuthCookies(
    user,
    authData.session.access_token,
    authData.session.refresh_token,
    credentials.rememberMe ?? false
  )

  // 4. Determine redirect based on role
  const redirectTo = ROLE_DEFAULT_ROUTES[user.role] ?? '/select-role'

  return { success: true, redirectTo, user }
}

// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────
export async function logoutAction(): Promise<void> {
  try {
    // Best-effort server-side sign-out (invalidates refresh token on Supabase)
    const supabase = getSupabaseAdmin()
    await supabase.auth.signOut()
  } catch {
    // Continue regardless — we always clear local cookies
  }
  await clearAuthCookies()
}

// ─────────────────────────────────────────────
// GET CURRENT USER (for hydrating AuthContext)
// ─────────────────────────────────────────────
export async function getCurrentUserAction(): Promise<User | null> {
  const { getSessionFromCookie } = await import('./token-manager')
  const session = await getSessionFromCookie()
  if (!session) return null

  return {
    id:        session.id,
    email:     session.email,
    role:      session.role as Role,
    full_name: session.full_name,
  }
}
