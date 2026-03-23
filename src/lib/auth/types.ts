// ─────────────────────────────────────────────
// Auth Types
// ─────────────────────────────────────────────

export type Role = 'admin' | 'manager' | 'cashier' | 'barista' | 'waiter' | 'staff'

export interface User {
  id: string
  email: string
  full_name: string | null
  role: Role
  avatar_url?: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  switchRole: (role: Role) => void
  hasPermission: (permission: string) => boolean
}

export interface LoginResult {
  success: boolean
  redirectTo: string
  user: User
}
