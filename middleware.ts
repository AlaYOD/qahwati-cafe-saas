import { type NextRequest, NextResponse } from 'next/server'

// ─────────────────────────────────────────────
// Route configuration
// ─────────────────────────────────────────────
const PUBLIC_ROUTES = ['/login', '/unauthorized', '/login-screen', '/login-page', '/']

const ROLE_PERMISSIONS: Array<{ prefix: string; roles: string[] }> = [
  { prefix: '/admin',   roles: ['admin'] },
  { prefix: '/manager', roles: ['admin', 'manager'] },
  { prefix: '/cashier', roles: ['admin', 'cashier'] },
  { prefix: '/barista', roles: ['admin', 'barista'] },
  { prefix: '/waiter',  roles: ['admin', 'waiter'] },
]

const ROLE_DEFAULT_ROUTES: Record<string, string> = {
  admin:   '/admin/dashboard',
  manager: '/manager/inventory',
  cashier: '/cashier/pos',
  barista: '/barista/orders',
  waiter:  '/waiter/tables',
  staff:   '/select-role',
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getSessionFromCookie(req: NextRequest): { id: string; role: string } | null {
  const raw = req.cookies.get('qahwati-session')?.value
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))
}

function matchRoleRoute(pathname: string): { prefix: string; roles: string[] } | null {
  return ROLE_PERMISSIONS.find((r) => pathname.startsWith(r.prefix)) ?? null
}

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = getSessionFromCookie(request)

  // 1. Skip static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // 2. Authenticated user trying to visit /login → redirect to their dashboard
  if (session && (pathname === '/login' || pathname === '/login-screen')) {
    const redirectTo = ROLE_DEFAULT_ROUTES[session.role] ?? '/select-role'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  // 3. Public routes — allow without auth
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // 4. /select-role — requires auth only, no role restriction
  if (pathname.startsWith('/select-role')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // 5. Protected role routes
  const roleRoute = matchRoleRoute(pathname)
  if (roleRoute) {
    // Not authenticated → login
    if (!session) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }

    // Wrong role → their own dashboard
    if (!roleRoute.roles.includes(session.role)) {
      const ownRoute = ROLE_DEFAULT_ROUTES[session.role] ?? '/select-role'
      return NextResponse.redirect(new URL(ownRoute, request.url))
    }

    return NextResponse.next()
  }

  // 6. Any other non-public route — require auth
  if (!session) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
