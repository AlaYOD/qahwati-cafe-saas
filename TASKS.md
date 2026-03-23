# Qahwati Cafe SaaS - Task Backlog

---

## 1. Immediate Tasks (Bugs & Critical Fixes)

### 1.1 Fix Login Redirect Target
- **Task:** Login screen redirects to `/dashboard` (hardcoded v1 page) instead of `/main-dashboard`
- **Context:** `handleLogin` in login-screen calls `router.push('/dashboard')` but the functional dashboard with AppLayout is at `/main-dashboard`
- **Files:** `src/app/login-screen/page.tsx` (line 30)
- **Expected:** Change `router.push('/dashboard')` to `router.push('/main-dashboard')`

### 1.2 Fix Homepage - Replace Next.js Boilerplate
- **Task:** Replace the default Next.js template page with a redirect to the landing page or login
- **Context:** `src/app/page.tsx` still shows the Next.js "Get Started" boilerplate
- **Files:** `src/app/page.tsx`
- **Expected:** Redirect to `/landing-page` (unauthenticated) or `/main-dashboard` (authenticated)

### 1.3 Fix Hardcoded Table ID in POS Checkout
- **Task:** Replace hardcoded UUID with actual table selection
- **Context:** Checkout uses `"59535de4-6f02-4af3-9d93-356bcba14c81"` as table_id regardless of context
- **Files:** `src/store/pos.ts` (line 117)
- **Expected:** Add table selection to POS flow, pass selected table_id to checkout

### 1.4 Define Prisma Schema Models
- **Task:** Add all 9 database models to the Prisma schema to match Supabase tables
- **Context:** `prisma/schema.prisma` has only the generator and datasource - zero models. The seed file (`prisma/seed.ts`) references models that don't exist, so `npx prisma db seed` will fail
- **Files:** `prisma/schema.prisma`
- **Expected:** Define models for: profiles, categories, menu_items, orders, order_items, tables, inventory_items, shifts, transactions with proper relations. Match the types defined in `src/types/supabase.ts`

### 1.5 Rotate Exposed Supabase Keys
- **Task:** Rotate the Supabase anon key that was committed to git
- **Context:** `.env` contains live Supabase URL and anon key in the git history. Even though `.gitignore` blocks `.env*`, the file was committed in the initial commit
- **Files:** `.env`, Supabase Dashboard
- **Expected:** Rotate keys in Supabase dashboard, update `.env`, add `.env.example` with placeholder values

---

## 2. Short-Term Tasks (Refactoring & Cleanup)

### 2.1 Remove Duplicate Pages
- **Task:** Delete `/dashboard` and `/login-page`, consolidate to `/main-dashboard` and `/login-screen`
- **Context:** Two dashboard pages and two login pages exist. `/dashboard` has its own inline sidebar (not using AppLayout). `/login-page` has no functionality (no form submission handler)
- **Files to delete:** `src/app/dashboard/page.tsx`, `src/app/login-page/page.tsx`
- **Expected:** Single dashboard at `/main-dashboard`, single login at `/login-screen`. Update any links pointing to the deleted routes

### 2.2 Replace CircleHelp Placeholder Icons
- **Task:** Replace all instances of `CircleHelp` being used as a stand-in for missing icons
- **Context:** ~30+ places use `CircleHelp` from lucide-react where a proper icon should be (e.g., mail icon for email field, lock for password, arrow icons for navigation, chart icons, etc.)
- **Files:** `src/app/dashboard/page.tsx`, `src/app/landing-page/page.tsx`, `src/app/login-page/page.tsx`, `src/app/login-screen/page.tsx`, `src/app/cash-register-and-shift-control/page.tsx`, `src/app/inventory-management/page.tsx`
- **Expected:** Each CircleHelp replaced with a semantically appropriate Lucide icon (e.g., `Mail` for email, `Lock` for password, `ArrowRight` for navigation, `BarChart` for reports)

### 2.3 Wire Up Table Management with Live Data
- **Task:** Replace hardcoded `tablesData` in TableGrid with Supabase data
- **Context:** `api.getTables()` and `api.updateTableStatus()` already exist in `services/api.ts` but TableGrid uses a hardcoded array
- **Files:** `src/components/tables/TableGrid.tsx`, `src/app/table-management/page.tsx`
- **Expected:** Fetch tables from Supabase on mount, display real data, enable status updates

### 2.4 Wire Up Inventory Management with Live Data
- **Task:** Replace hardcoded `inventoryData` in InventoryTable with Supabase data
- **Context:** `api.getInventoryItems()`, `api.addInventoryItem()`, `api.updateInventoryItem()` already exist but aren't used
- **Files:** `src/components/inventory/InventoryTable.tsx`, `src/app/inventory-management/page.tsx`
- **Expected:** Fetch inventory from Supabase, display real data, enable add/edit functionality

### 2.5 Wire Up Cash Register with Live Data
- **Task:** Replace all hardcoded financial data with Supabase queries
- **Context:** `api.getActiveShift()` and `api.getTransactions()` exist but the page shows static mock data
- **Files:** `src/app/cash-register-and-shift-control/page.tsx`
- **Expected:** Fetch active shift and transactions, calculate balances dynamically

### 2.6 Wire Up Dashboard with Live Data
- **Task:** Replace hardcoded stats, charts, and recent orders with real Supabase queries
- **Context:** Dashboard shows static numbers for sales, orders, tables, and cash. Needs new API functions for aggregations
- **Files:** `src/app/main-dashboard/page.tsx`, `src/services/api.ts`
- **Expected:** Add API functions for: today's sales total, order count, occupied table count, cash balance. Display real data with loading states

### 2.7 Fix `any` Types in API Layer
- **Task:** Replace all `any` types with proper TypeScript interfaces
- **Context:** `api.ts` uses `any` for `addInventoryItem(item: any)`, `updateInventoryItem(id, updates: any)`, `createOrder(orderData: any, items: any[])`. Store also uses `any[]` for categories/menuItems
- **Files:** `src/services/api.ts`, `src/store/pos.ts`
- **Expected:** Use types from `src/types/supabase.ts` (e.g., `Tables<'inventory_items'>`, `TablesInsert<'orders'>`)

### 2.8 Standardize Currency Display
- **Task:** Use consistent currency format across the app
- **Context:** Dashboard v1 uses "LYD" (Libyan Dinar), Dashboard v2 and POS use "$". The app targets Libyan/Arabic coffee shops based on the name "Qahwati"
- **Files:** All page and component files displaying prices
- **Expected:** Use a single currency utility function. Decide on LYD or configurable per-tenant

### 2.9 Clean Up Dead Code and Root Scripts
- **Task:** Remove unused files from the project root
- **Context:** `download_screens.js`, `html_converter.js`, `eslint.json`, `eslint.log`, `error.log`, `dependencies.txt`, `stitch_screens/`, `.dist/` are development artifacts not needed in the repo
- **Files:** Root directory files listed above
- **Expected:** Delete unused files, update `.gitignore` if needed

### 2.10 Remove Unused Dependencies
- **Task:** Uninstall packages that aren't used in the application
- **Context:** `next-auth`, `cheerio`, `react-to-print` are not imported anywhere in `src/`. `socket.io-client`, `recharts`, `@tanstack/react-table` are installed but not used yet
- **Files:** `package.json`
- **Expected:** Remove `next-auth`, `cheerio`, `react-to-print`. Keep `recharts`, `react-table`, `socket.io-client` only if planned for near-term use

---

## 3. Long-Term Tasks (Features & Architecture)

### 3.1 Implement Server Actions / API Routes
- **Task:** Move database operations from client-side Supabase calls to Next.js Server Actions or API routes
- **Context:** Currently all Supabase queries run in the browser, exposing query patterns and requiring the anon key client-side. Server Actions would be more secure and enable caching
- **Files:** Create `src/app/actions/` directory, refactor `src/services/api.ts`
- **Expected:** Server-side data mutations, client components call server actions, reduced client bundle

### 3.2 Implement React Query for Data Fetching
- **Task:** Replace manual useEffect data fetching with TanStack React Query
- **Context:** React Query is installed but unused. Currently, POS uses Zustand for async data, other pages have no data fetching. React Query provides caching, deduplication, revalidation, and optimistic updates
- **Files:** Create `src/hooks/` directory with custom query hooks, update all page components
- **Expected:** `useQuery` for reads, `useMutation` for writes, automatic cache invalidation

### 3.3 Implement Role-Based Access Control (RBAC)
- **Task:** Add role-based permissions using the `profiles.role` field
- **Context:** The `profiles` table has a `role` column but it's never checked. Any authenticated user can access all pages
- **Files:** `src/middleware.ts`, `src/utils/supabase/middleware.ts`, create `src/lib/auth.ts`
- **Expected:** Roles: admin, manager, cashier, waiter. Route protection per role. UI elements shown/hidden based on role

### 3.4 Implement Multi-Tenancy
- **Task:** Add cafe/organization concept so multiple cafes can use the platform
- **Context:** No tenant isolation exists. All data is shared. For a SaaS product, each cafe needs its own data partition
- **Files:** Database schema changes, Supabase RLS policies, new `organizations` table
- **Expected:** Organization-scoped data, invite system, per-org settings

### 3.5 Integrate Stripe Payments
- **Task:** Implement Stripe for subscription billing and/or in-app payment processing
- **Context:** `stripe` and `@stripe/stripe-js` are installed but no integration exists. Landing page shows pricing tiers ($0, $49.99, $99.99)
- **Files:** Create `src/app/api/stripe/` webhooks, `src/lib/stripe.ts`
- **Expected:** Subscription checkout flow, webhook handling, billing portal

### 3.6 Implement Real-Time Updates with Supabase Realtime
- **Task:** Add real-time subscriptions for orders, tables, and kitchen display
- **Context:** `socket.io-client` is installed but Supabase Realtime is a better fit (no separate server needed). Tables and orders should update live across terminals
- **Files:** `src/hooks/useRealtimeSubscription.ts`, update POS and table components
- **Expected:** New orders appear instantly on kitchen display, table status updates in real-time, shift transactions update live

### 3.7 Build Kitchen Display System (KDS)
- **Task:** Create a new page/screen for kitchen staff to view and manage incoming orders
- **Context:** Orders are created from POS but there's no way for kitchen staff to see them
- **Files:** Create `src/app/kitchen-display/page.tsx`
- **Expected:** Real-time order queue, ability to mark items as "preparing" / "ready", audio notifications

### 3.8 Build Reporting & Analytics Module
- **Task:** Create a comprehensive reports page with Recharts
- **Context:** `recharts` is installed but unused. Dashboard has fake charts in CSS
- **Files:** Create `src/app/reports/page.tsx`, `src/components/charts/`
- **Expected:** Sales by day/week/month, top-selling items, peak hours analysis, inventory turnover, profit margins

### 3.9 Add Automated Testing
- **Task:** Set up Vitest for unit tests and Playwright for E2E tests
- **Context:** Zero tests exist. The README acknowledges this as a roadmap item
- **Files:** Create `vitest.config.ts`, `playwright.config.ts`, `__tests__/` directories
- **Expected:** Unit tests for store logic, API functions, and utilities. E2E tests for login flow, POS ordering, and checkout

### 3.10 Add RTL/Arabic Language Support
- **Task:** Implement full RTL layout and Arabic translations
- **Context:** `tailwindcss-rtl` is installed. The app name "Qahwati" (قهوتي) targets Arabic-speaking markets. Currency "LYD" suggests Libya
- **Files:** `src/app/layout.tsx`, create `src/i18n/` directory, all component files
- **Expected:** Language switcher, RTL layout toggle, Arabic translations for all UI strings

### 3.11 Implement Error Boundaries and Loading States
- **Task:** Add React error boundaries and Suspense/loading states to all pages
- **Context:** No error handling at the page level. If a Supabase query fails, the entire page may break silently
- **Files:** Create `src/app/error.tsx`, `src/app/loading.tsx`, per-route error/loading files
- **Expected:** Graceful error display with retry option, skeleton loading states per page

### 3.12 Implement Print Receipt Functionality
- **Task:** Enable printing order receipts from POS
- **Context:** `react-to-print` is installed (if kept). The cash register page has a "Print Report" button that does nothing
- **Files:** Create `src/components/pos/Receipt.tsx`, update Cart checkout flow
- **Expected:** Formatted thermal receipt layout, print on checkout, shift summary reports

---

## 4. AI-Ready Task Cards

Below are tasks formatted for direct handoff to an AI coder:

---

### Task: Wire Up Table Management with Supabase
**Context:** The table management page currently displays hardcoded data from a static array. The API functions `api.getTables()` and `api.updateTableStatus()` already exist in `src/services/api.ts` and work with the Supabase `tables` table.
**Files to modify:**
- `src/components/tables/TableGrid.tsx` - Replace `tablesData` constant with Supabase fetch
- `src/components/tables/TableCard.tsx` - Update `TableInfo` interface to match Supabase `tables` schema
- `src/app/table-management/page.tsx` - Add loading/error states
**Expected output:** On page load, tables are fetched from Supabase. Each TableCard shows real data. The "Assign Table" / "View Order" buttons trigger `api.updateTableStatus()`. Add loading spinner while fetching.

---

### Task: Replace All Hardcoded Dashboard Data with Supabase Queries
**Context:** `src/app/main-dashboard/page.tsx` shows hardcoded values ($1,240, 48 orders, 15/20 tables, $850.50 cash). These should come from Supabase aggregation queries.
**Files to modify:**
- `src/services/api.ts` - Add new functions: `getTodaySales()`, `getTodayOrderCount()`, `getOccupiedTableCount()`, `getCurrentCashBalance()`
- `src/app/main-dashboard/page.tsx` - Fetch and display real data with loading states
**Expected output:** Dashboard shows live data from Supabase. Stat cards update on refresh. Add skeleton loading states while data loads. Use `useEffect` + state or React Query if available.

---

### Task: Implement Server Actions for Order Creation
**Context:** The POS checkout currently calls `api.createOrder()` which runs a Supabase insert from the browser. This should be a Next.js Server Action for security.
**Files to modify:**
- Create `src/app/actions/orders.ts` - Server Action with `"use server"` directive
- `src/store/pos.ts` - Call server action instead of client-side API
- `src/services/api.ts` - Remove `createOrder` (moved to server)
**Expected output:** Order creation happens server-side. Cart data is passed to the server action. Proper error handling with toast notifications. The server action validates the data before inserting.

---

### Task: Add Prisma Models Matching Supabase Schema
**Context:** `prisma/schema.prisma` is empty (no models). The actual schema is defined in Supabase and reflected in `src/types/supabase.ts`. The seed file `prisma/seed.ts` references models that don't exist.
**Files to modify:**
- `prisma/schema.prisma` - Add all 9 models with proper types, relations, and defaults
**Reference:** Use `src/types/supabase.ts` as the source of truth for table structures and relationships.
**Expected output:** Running `npx prisma generate` succeeds. Running `npx prisma db seed` populates the database. Models: Profile, Category, MenuItem, Order, OrderItem, Table, InventoryItem, Shift, Transaction. All foreign keys and relations defined.

---

### Task: Implement React Query Data Layer
**Context:** TanStack React Query v5 is installed (`@tanstack/react-query`) but not used anywhere. All data fetching uses manual `useEffect` + Zustand. React Query would provide caching, automatic refetching, and better loading/error states.
**Files to modify:**
- Create `src/providers/QueryProvider.tsx` - React Query provider wrapper
- `src/app/layout.tsx` - Wrap app in QueryProvider
- Create `src/hooks/useMenuItems.ts`, `src/hooks/useTables.ts`, `src/hooks/useInventory.ts`, `src/hooks/useShifts.ts`
- Update page components to use the new hooks
**Expected output:** All data fetching goes through React Query. Automatic caching (staleTime: 30s). Loading and error states exposed via hooks. Mutations with cache invalidation for writes.

---

### Task: Build Role-Based Middleware Guard
**Context:** The middleware at `src/middleware.ts` only checks if a user is authenticated. The `profiles` table has a `role` column (string) but it's never used. Need to restrict routes by role (admin, manager, cashier).
**Files to modify:**
- `src/utils/supabase/middleware.ts` - After `getUser()`, fetch user profile and check role
- Create `src/lib/roles.ts` - Define role hierarchy and route permissions
**Expected output:** Admin can access all routes. Cashier can only access `/pos-order-screen` and `/cash-register-and-shift-control`. Manager can access everything except settings. Unauthorized access redirects to appropriate page with toast message.
