# Qahwati Cafe SaaS - Project Analysis

## 1. Project Overview

**Qahwati** is a Point-of-Sale (POS) and Cafe Management SaaS platform targeting traditional coffee shops. It provides modules for order processing, table management, inventory tracking, cash register/shift control, and a marketing landing page.

**Current State:** Early-stage prototype. Most screens render hardcoded/mock data. Only the POS module (menu browsing + cart) and login screen have real data flow via Supabase.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS v4 + tailwindcss-animate + tailwindcss-rtl | ^4 |
| UI Components | Radix UI + shadcn/ui | ^1.4.3 / ^4.0.5 |
| State (Client) | Zustand | ^5.0.11 |
| State (Server) | TanStack React Query | ^5.90.21 |
| Forms | React Hook Form + Zod | ^7.71.2 / ^4.3.6 |
| Database | PostgreSQL (via Supabase) | - |
| ORM | Prisma (schema generation only) | ^7.5.0 |
| Auth | Supabase Auth (SSR) | ^0.9.0 |
| Payments | Stripe (installed, not integrated) | ^20.4.1 |
| Real-time | Socket.io Client (installed, not used) | ^4.8.3 |
| Charts | Recharts (installed, not used) | ^3.8.0 |
| Tables | TanStack React Table (installed, not used) | ^8.21.3 |
| Notifications | Sonner | ^2.0.7 |
| Compiler | React Compiler (babel-plugin) | 1.0.0 |

### Unused/Dormant Dependencies
- **next-auth v5 beta**: Installed but not configured. Supabase Auth is used instead.
- **stripe / @stripe/stripe-js**: Installed but no integration exists.
- **socket.io-client**: Installed but never imported in app code.
- **recharts**: Installed but charts are hardcoded SVG/CSS.
- **@tanstack/react-table**: Installed but tables use raw `<table>` HTML.
- **react-hook-form + zod**: Installed but no forms use them (login form is manual state).
- **cheerio**: Utility library, not used in app code (only in root-level scripts).

---

## 3. Architecture

**Style:** Monolithic Next.js App Router application with client-side rendering.

**Pattern:** Almost all pages are `"use client"` components. No React Server Components or Server Actions are used despite the README claiming otherwise. Data fetching happens client-side via Supabase JS SDK.

### Data Flow
```
Browser → Supabase Client SDK → Supabase PostgreSQL
                ↑
          Zustand Store (POS only)
```

### Authentication Flow
```
Login Screen → Supabase signInWithPassword / signInWithOAuth
     → /auth/callback (OAuth code exchange)
     → Middleware (updateSession) checks auth on every request
     → Unauthenticated users redirected to /login-screen
```

---

## 4. Folder Structure

```
cafe-saas/
├── prisma/
│   ├── schema.prisma          # DB schema (EMPTY - no models defined)
│   └── seed.ts                # Seed script (references models not in schema)
├── src/
│   ├── app/
│   │   ├── auth/callback/     # OAuth callback route
│   │   ├── cash-register-and-shift-control/  # Cash register page
│   │   ├── dashboard/         # Dashboard v1 (standalone, hardcoded)
│   │   ├── generated-screen/  # Unknown/empty
│   │   ├── inventory-management/  # Inventory page
│   │   ├── landing-page/      # Public marketing page
│   │   ├── login-page/        # Login v1 (no functionality)
│   │   ├── login-screen/      # Login v2 (functional, Supabase auth)
│   │   ├── main-dashboard/    # Dashboard v2 (uses AppLayout)
│   │   ├── pos-order-screen/  # POS order page (functional)
│   │   ├── qahwati-design-brief/  # Design brief page
│   │   ├── table-management/  # Table management page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home (Next.js boilerplate)
│   │   └── globals.css        # Theme variables + Tailwind config
│   ├── components/
│   │   ├── inventory/         # StatCard, InventoryTable (hardcoded data)
│   │   ├── layout/            # AppLayout, Sidebar, Topbar (shared shell)
│   │   ├── pos/               # Cart, MenuGrid, CategoryFilters (live data)
│   │   ├── tables/            # TableGrid, TableCard (hardcoded data)
│   │   └── ui/                # shadcn/ui primitives (mostly unused)
│   ├── generated/prisma/      # Prisma generated client
│   ├── lib/utils.ts           # cn() utility
│   ├── middleware.ts           # Supabase session refresh + auth guard
│   ├── services/api.ts        # Supabase query functions
│   ├── store/pos.ts           # Zustand POS store (cart, menu, categories)
│   ├── types/supabase.ts      # Auto-generated Supabase DB types
│   └── utils/supabase/        # Supabase client (browser, server, middleware)
├── .env                       # Environment variables (contains live keys!)
├── package.json
├── tsconfig.json
└── next.config.ts             # React Compiler enabled
```

---

## 5. Database Schema (from Supabase types)

### Tables & Relationships

| Table | Key Columns | Relationships |
|---|---|---|
| **profiles** | id, full_name, role, avatar_url | Auth users |
| **categories** | id, name, type (menu/inventory) | - |
| **menu_items** | id, name, price, description, image_url, is_available, category_id | → categories |
| **orders** | id, total_amount, status, payment_method, table_id, user_id | → tables, → profiles |
| **order_items** | id, order_id, menu_item_id, quantity, unit_price | → orders, → menu_items |
| **tables** | id, name, capacity, status, zone | - |
| **inventory_items** | id, name, category, unit, quantity, min_level, cost_per_unit | - |
| **shifts** | id, opening_balance, expected_balance, actual_balance, status, user_id | → profiles |
| **transactions** | id, amount, type, description, shift_id | → shifts |

### Critical Issue
The **Prisma schema file is empty** (no models). The seed file references Prisma models that don't exist. The actual database schema lives only in Supabase and the `types/supabase.ts` type file.

---

## 6. Key Modules Analysis

### 6.1 Authentication (FUNCTIONAL)
- **Files:** `src/app/login-screen/page.tsx`, `src/utils/supabase/*`, `src/middleware.ts`, `src/app/auth/callback/route.ts`
- Email/password + Google/Apple OAuth via Supabase
- Middleware protects all routes except `/`, `/login-screen`, `/auth/*`
- Login redirects to `/dashboard` (should be `/main-dashboard`)

### 6.2 POS Order Screen (PARTIALLY FUNCTIONAL)
- **Files:** `src/app/pos-order-screen/page.tsx`, `src/components/pos/*`, `src/store/pos.ts`, `src/services/api.ts`
- Fetches live menu items and categories from Supabase
- Cart with add/remove/quantity management via Zustand
- Checkout creates order in Supabase BUT uses a hardcoded table_id
- Has own standalone layout (not wrapped in AppLayout)

### 6.3 Dashboard (HARDCODED)
- Two versions exist: `/dashboard` (standalone) and `/main-dashboard` (uses AppLayout)
- All data is hardcoded (sales, orders, tables, charts)
- Charts are pure CSS/SVG, not using Recharts

### 6.4 Table Management (HARDCODED)
- **Files:** `src/app/table-management/page.tsx`, `src/components/tables/*`
- Uses hardcoded `tablesData` array in `TableGrid.tsx`
- Has `api.getTables()` available but not wired up

### 6.5 Inventory Management (HARDCODED)
- **Files:** `src/app/inventory-management/page.tsx`, `src/components/inventory/*`
- Uses hardcoded `inventoryData` in `InventoryTable.tsx`
- Has `api.getInventoryItems()` available but not wired up

### 6.6 Cash Register & Shift Control (HARDCODED)
- All financial data, transactions, and shift info are hardcoded
- Has `api.getActiveShift()` and `api.getTransactions()` available but not wired up

### 6.7 Landing Page (STATIC)
- Marketing page with features, pricing, and CTA sections
- No navigation to actual app (buttons are non-functional)

---

## 7. Code Quality Issues

### Security Risks
1. **`.env` file contains live Supabase keys** and is tracked in git history (even though `.gitignore` has `.env*`, the file exists in the commit)
2. **No Row-Level Security (RLS) enforcement visible** - any authenticated user can likely read/write all data
3. **No CSRF protection** on form submissions
4. **No input sanitization** on search inputs
5. **`any` types used extensively** in `api.ts` and `store/pos.ts` - bypasses TypeScript safety

### Code Smells
1. **Duplicate pages:** Two login pages (`login-page`, `login-screen`), two dashboards (`dashboard`, `main-dashboard`)
2. **CircleHelp icon used as placeholder** everywhere (~30+ instances where it replaces missing icons)
3. **Homepage is Next.js boilerplate** - not replaced with app content or redirect
4. **Hardcoded user data** in Topbar ("Amani Manager"), Dashboard ("Ahmed Ali"), Login ("Sarah Jenkins")
5. **Inconsistent currency:** Some pages use `$`, others use `LYD` (Libyan Dinar)
6. **Dead code:** `generated-screen`, `qahwati-design-brief` pages, root-level scripts (`download_screens.js`, `html_converter.js`)

### Performance Concerns
1. **All pages are client components** - no SSR/SSC benefits
2. **No code splitting** - heavy libraries loaded upfront
3. **No image optimization** - external URLs used directly without `next/image` in most components
4. **Zustand `fetchInitialData` called in useEffect** without dependency tracking - could refetch on every render

### Architecture Gaps
1. **No API routes** - all database calls happen client-side (exposes query patterns)
2. **No error boundaries** - unhandled errors crash the entire page
3. **No loading states** on most pages
4. **No React Query usage** despite being installed - would improve caching/revalidation
5. **No multi-tenancy** - no concept of "which cafe" the data belongs to

---

## 8. Setup Instructions

### Prerequisites
- Node.js v20+
- A Supabase project (or local PostgreSQL for Prisma)

### Steps
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
# Copy .env.example (doesn't exist - create from .env)
# Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Generate Prisma client (if needed)
npx prisma generate

# 4. Seed database (requires Prisma models to be defined first)
npx prisma db seed

# 5. Run development server
npm run dev
# Opens at http://localhost:3000
```

### Key Workflows
1. **Login:** Visit `/login-screen` → Enter credentials → Redirected to `/dashboard`
2. **POS Ordering:** Visit `/pos-order-screen` → Browse menu → Add to cart → Confirm order
3. **Navigation:** Use sidebar from any page wrapped in `AppLayout` (Dashboard, Tables, Inventory, Cash Register)
