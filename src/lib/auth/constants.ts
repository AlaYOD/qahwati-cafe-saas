import type { Role } from './types'

// ─────────────────────────────────────────────
// Default redirect per role after login
// ─────────────────────────────────────────────
export const ROLE_DEFAULT_ROUTES: Record<string, string> = {
  admin:   '/admin/dashboard',
  manager: '/manager/dashboard',
  cashier: '/cashier/cash-register',
  barista: '/barista/orders',
  waiter:  '/waiter/tables',
  staff:   '/select-role',
}

// ─────────────────────────────────────────────
// Which roles can access which route prefixes
// Admin always has access to everything
// ─────────────────────────────────────────────
export const ROUTE_PERMISSIONS: Array<{ prefix: string; roles: Role[] }> = [
  { prefix: '/admin',   roles: ['admin'] },
  { prefix: '/manager', roles: ['admin', 'manager'] },
  { prefix: '/cashier', roles: ['admin', 'cashier'] },
  { prefix: '/barista', roles: ['admin', 'barista'] },
  { prefix: '/waiter',  roles: ['admin', 'waiter'] },
]

// ─────────────────────────────────────────────
// Routes that do NOT require authentication
// ─────────────────────────────────────────────
export const PUBLIC_ROUTES = [
  '/login',
  '/unauthorized',
  '/',
  // legacy routes kept for compatibility
  '/login-screen',
  '/login-page',
]

// ─────────────────────────────────────────────
// Cookie keys
// ─────────────────────────────────────────────
export const COOKIES = {
  SESSION:       'qahwati-session',    // httpOnly — { id, email, role, full_name }
  ACCESS_TOKEN:  'qahwati-at',         // httpOnly — Supabase access JWT
  REFRESH_TOKEN: 'qahwati-rt',         // httpOnly — Supabase refresh token
} as const

// Cookie max-age in seconds
export const COOKIE_MAX_AGE = {
  REMEMBER_ME: 60 * 60 * 24 * 30, // 30 days
  SESSION:     60 * 60 * 24 * 1,  // 1 day
}

// ─────────────────────────────────────────────
// Role metadata for UI (select-role screen)
// ─────────────────────────────────────────────
export const ROLE_META: Record<string, { label: string; description: string; icon: string }> = {
  admin: {
    label:       'Admin',
    description: 'Full access to all modules, settings, and reports',
    icon:        'admin_panel_settings',
  },
  manager: {
    label:       'Manager',
    description: 'Manage inventory, staff, and view analytics',
    icon:        'manage_accounts',
  },
  cashier: {
    label:       'Cashier',
    description: 'Process payments and manage the cash register',
    icon:        'point_of_sale',
  },
  barista: {
    label:       'Barista',
    description: 'View and fulfill active drink orders',
    icon:        'coffee_maker',
  },
  waiter: {
    label:       'Waiter',
    description: 'Manage table assignments and dine-in orders',
    icon:        'restaurant',
  },
  staff: {
    label:       'Staff',
    description: 'Select your role to continue',
    icon:        'badge',
  },
}
