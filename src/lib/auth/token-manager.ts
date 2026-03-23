// Server-only — never import in client components
import { cookies } from 'next/headers'
import type { User } from './types'
import { COOKIES, COOKIE_MAX_AGE } from './constants'

export interface SessionPayload {
  id: string
  email: string
  role: string
  full_name: string | null
}

// ─────────────────────────────────────────────
// Write all auth cookies (call after login)
// ─────────────────────────────────────────────
export async function setAuthCookies(
  user: User,
  accessToken: string,
  refreshToken: string,
  rememberMe = false
) {
  const cookieStore = await cookies()
  const maxAge = rememberMe ? COOKIE_MAX_AGE.REMEMBER_ME : COOKIE_MAX_AGE.SESSION

  const shared = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }

  const session: SessionPayload = {
    id:        user.id,
    email:     user.email,
    role:      user.role,
    full_name: user.full_name,
  }

  cookieStore.set(COOKIES.SESSION,       JSON.stringify(session), shared)
  cookieStore.set(COOKIES.ACCESS_TOKEN,  accessToken,             shared)
  cookieStore.set(COOKIES.REFRESH_TOKEN, refreshToken,            shared)
}

// ─────────────────────────────────────────────
// Clear all auth cookies (call on logout)
// ─────────────────────────────────────────────
export async function clearAuthCookies() {
  const cookieStore = await cookies()
  const opts = { path: '/', maxAge: 0 }
  cookieStore.set(COOKIES.SESSION,       '', opts)
  cookieStore.set(COOKIES.ACCESS_TOKEN,  '', opts)
  cookieStore.set(COOKIES.REFRESH_TOKEN, '', opts)
}

// ─────────────────────────────────────────────
// Read the session cookie (server-side only)
// ─────────────────────────────────────────────
export async function getSessionFromCookie(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(COOKIES.SESSION)?.value
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionPayload
  } catch {
    return null
  }
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIES.ACCESS_TOKEN)?.value ?? null
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIES.REFRESH_TOKEN)?.value ?? null
}
