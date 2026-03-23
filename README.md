# Cafe SaaS Platform

A comprehensive, modern Point of Sale (POS) and Cafe Management Software-as-a-Service (SaaS) built using the latest modern web technologies.

## 🚀 Tech Stack

This project is built using an aggressive, cutting-edge technology stack designed for performance, type safety, and maintainability:

### Core Frameworks
* **[Next.js 16](https://nextjs.org/)**: The React Framework for the Web (using the App Router).
* **[React 19](https://react.dev/)**: Featuring concurrent rendering and the new React Compiler (`babel-plugin-react-compiler`).
* **[TypeScript](https://www.typescriptlang.org/)**: For robust, end-to-end type safety throughout the entire application.

### UI & Styling
* **[Tailwind CSS v4](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
* **[radix-ui] & [shadcn/ui]**: For accessible, highly customizable, and unstyled UI primitive components.
* **[tw-animate-css]**: For seamless micro-animations.
* **[Lucide React](https://lucide.dev/)**: A clean, modern icon library.

### Forms & Validation
* **[React Hook Form](https://react-hook-form.com/)**: Performant, flexible, and extensible forms with easy-to-use validation.
* **[Zod](https://zod.dev/)**: TypeScript-first schema validation natively integrated with React Hook Form.

### State Management & Data Fetching
* **[React Query](https://tanstack.com/query/latest)**: Powerful asynchronous state management, caching, and server-state synchronization.
* **[Zustand](https://github.com/pmndrs/zustand)**: A small, fast, and scalable bearbones state-management solution for global client state.

### Database & Backend
* **[Prisma](https://www.prisma.io/)**: Next-generation Node.js and TypeScript ORM for interacting with the database securely.
* **[PostgreSQL](https://www.postgresql.org/)**: Open-source relational database.

### Integrations
* **[NextAuth.js v5 Beta](https://authjs.dev/)**: Secure, robust authentication layer.
* **[Stripe](https://stripe.com/)**: Integrated processing for payments and subscriptions.
* **[Socket.io](https://socket.io/)**: Real-time bidrectional event-based communication.

---

## 📂 Project Structure & Functionality

The application is structured using Next.js App Router conventions. The `src/app` directory contains the core routes and screens for the SaaS application.

## 👥 User Roles & Endpoints

The system implements a robust Role-Based Access Control (RBAC) model to ensure that staff, managers, and administrators have the appropriate tools for their specific responsibilities.

### Role Overview
| Role | Responsibility | Primary Interface |
| :--- | :--- | :--- |
| **Admin** | Full system control & financial oversight | `(dashboard)/admin` |
| **Manager** | Operational oversight & inventory control | `manager` / `inventory-management` |
| **Cashier** | Payment processing & shift management | `cashier/pos` |
| **Waiter** | Table-side ordering & floorplan monitoring | `waiter` / `table-management` |
| **Barista** | Order fulfillment & preparation | `barista` |

### Key Endpoints by Role

#### 🛡️ Administrator (`admin`)
*   **Analytics**: `/admin/dashboard` — Live sales metrics & business trends.
*   **Floorplan**: `/admin/tables` — Interactive table status & Waiter POS.
*   **Operations**: `/admin/orders` — Order history & payment processing.
*   **Catalog**: `/admin/menu` — Category and menu item management.
*   **Staff**: `/admin/staff` — Profile management & role assignment.
*   **Inventory**: `/admin/inventory` — Stock tracking & supplier management.
*   **Reports**: `/admin/reports` — Detailed financial and sales analytics.

#### 📋 Manager (`manager`)
*   **Inventory**: `/inventory-management` — Direct stock level adjustments.
*   **Tables**: `/table-management` — Layout control and table status.
*   **Shifts**: `/cash-register-and-shift-control` — Managing employee shifts and registers.

#### 💰 Cashier (`cashier`)
*   **Checkout**: `/cashier/pos` — High-speed Retail POS for walk-ins.
*   **Cash Flow**: `/cashier/cash-report` — Recording opening/closing balances.
*   **Shifts**: `/cash-register-and-shift-control` — Closing the day's register.

#### ☕ Barista & Service Staff
*   **KDS**: `/barista` — Kitchen Display System for preparing orders.
*   **Reference**: `/barista/menu` — Item availability and recipe browsing.
*   **Ordering**: `/waiter/new-order` — Mobile-optimized ordering for waiters.

### Common Routes
*   **Public**: `/landing-page` — Marketing and onboarding.
*   **Auth**: `/login` — Secure portal for all roles.
*   **Switching**: `/select-role` — Workspace selection after login.

---

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js (v20+) and standard package managers installed. 
You will also need a running PostgreSQL database instance.

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and ensure the following variables are configured appropriately:
```env
# Database connection string
DATABASE_URL="postgres://user:password@localhost:5432/cafe_db"

# NextAuth secrets and providers
AUTH_SECRET="your-secret-key"

# Stripe 
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

### 3. Database Migration
Push the Prisma schema to your database to sync tables:
```bash
npx prisma db push
# or
npx prisma migrate dev
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📈 Roadmap & Enhancements

To take this application to production, consider the following:
* **Connection Pooling:** In serverless deployments, ensure Prisma is configured uses PgBouncer or Prisma Accelerate to prevent DB connection exhaustion.
* **WebSockets Architecture:** Since `socket.io-client` requires a stateful server, consider migrating to Supabase Realtime or Pusher if deploying to edge/serverless like Vercel.
* **Automated Testing:** Integrate Vitest (Unit) and Playwright (E2E) strictly testing Stripe checkout and POS logic.
* **Bundle Optimization:** Use `next/dynamic` to selectively load heavy table (`@tanstack/react-table`) and chart (`recharts`) libraries only when requested.
