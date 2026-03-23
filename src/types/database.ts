// ============================================================
// Qahwati Cafe SaaS — Database TypeScript Models
// Auto-derived from supabase/migrations/001_initial_schema.sql
// ============================================================

// ─────────────────────────────────────────────
// Shared Enum Types (match SQL CHECK constraints)
// ─────────────────────────────────────────────

export type Role = 'admin' | 'manager' | 'cashier' | 'waiter' | 'staff'
export type CategoryType = 'menu' | 'inventory'
export type TableStatus = 'available' | 'occupied' | 'reserved'
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'paid' | 'cancelled'
export type PaymentMethod = 'cash' | 'card' | 'digital'
export type ShiftStatus = 'open' | 'closed'
export type TransactionType = 'sale_cash' | 'sale_card' | 'expense' | 'income' | 'opening'


// ─────────────────────────────────────────────
// TABLE: profiles
// ─────────────────────────────────────────────
export interface Profile {
  id: string
  full_name: string | null
  role: Role
  avatar_url: string | null
  created_at: string | null
}

export interface ProfileInsert {
  id: string                   // required — must match auth.users.id
  full_name?: string | null
  role?: Role
  avatar_url?: string | null
  created_at?: string | null
}

export interface ProfileUpdate {
  full_name?: string | null
  role?: Role
  avatar_url?: string | null
}


// ─────────────────────────────────────────────
// TABLE: categories
// ─────────────────────────────────────────────
export interface Category {
  id: string
  name: string
  type: CategoryType
  created_at: string | null
}

export interface CategoryInsert {
  id?: string
  name: string
  type: CategoryType
  created_at?: string | null
}

export interface CategoryUpdate {
  name?: string
  type?: CategoryType
}


// ─────────────────────────────────────────────
// TABLE: menu_items
// ─────────────────────────────────────────────
export interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean | null
  category_id: string | null
  created_at: string | null
}

export interface MenuItemInsert {
  id?: string
  name: string
  description?: string | null
  price: number
  image_url?: string | null
  is_available?: boolean | null
  category_id?: string | null
  created_at?: string | null
}

export interface MenuItemUpdate {
  name?: string
  description?: string | null
  price?: number
  image_url?: string | null
  is_available?: boolean | null
  category_id?: string | null
}

/** Extended menu item with its category relation joined */
export interface MenuItemWithCategory extends MenuItem {
  categories: Category | null
}


// ─────────────────────────────────────────────
// TABLE: tables
// ─────────────────────────────────────────────
export interface CafeTable {
  id: string
  name: string
  capacity: number
  status: TableStatus
  zone: string
  created_at: string | null
}

export interface CafeTableInsert {
  id?: string
  name: string
  capacity?: number
  status?: TableStatus
  zone?: string
  created_at?: string | null
}

export interface CafeTableUpdate {
  name?: string
  capacity?: number
  status?: TableStatus
  zone?: string
}


// ─────────────────────────────────────────────
// TABLE: orders
// ─────────────────────────────────────────────
export interface Order {
  id: string
  table_id: string | null
  user_id: string | null
  status: OrderStatus
  payment_method: PaymentMethod | null
  total_amount: number
  created_at: string | null
}

export interface OrderInsert {
  id?: string
  table_id?: string | null
  user_id?: string | null
  status?: OrderStatus
  payment_method?: PaymentMethod | null
  total_amount: number
  created_at?: string | null
}

export interface OrderUpdate {
  table_id?: string | null
  user_id?: string | null
  status?: OrderStatus
  payment_method?: PaymentMethod | null
  total_amount?: number
}


// ─────────────────────────────────────────────
// TABLE: order_items
// ─────────────────────────────────────────────
export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string | null
  quantity: number
  unit_price: number
  created_at: string | null
}

export interface OrderItemInsert {
  id?: string
  order_id: string
  menu_item_id?: string | null
  quantity?: number
  unit_price: number
  created_at?: string | null
}

export interface OrderItemUpdate {
  quantity?: number
  unit_price?: number
}


// ─────────────────────────────────────────────
// TABLE: inventory_items
// ─────────────────────────────────────────────
export interface InventoryItem {
  id: string
  name: string
  category: string
  unit: string
  quantity: number
  min_level: number
  cost_per_unit: number
  created_at: string | null
  updated_at: string | null
}

export interface InventoryItemInsert {
  id?: string
  name: string
  category: string
  unit: string
  quantity?: number
  min_level?: number
  cost_per_unit?: number
  created_at?: string | null
  updated_at?: string | null
}

export interface InventoryItemUpdate {
  name?: string
  category?: string
  unit?: string
  quantity?: number
  min_level?: number
  cost_per_unit?: number
}

/** Derived stock status based on quantity vs min_level */
export type StockStatus = 'in_stock' | 'low_stock' | 'critical' | 'out_of_stock'

export function getStockStatus(item: Pick<InventoryItem, 'quantity' | 'min_level'>): StockStatus {
  if (item.quantity <= 0) return 'out_of_stock'
  if (item.quantity <= item.min_level * 0.5) return 'critical'
  if (item.quantity <= item.min_level) return 'low_stock'
  return 'in_stock'
}


// ─────────────────────────────────────────────
// TABLE: shifts
// ─────────────────────────────────────────────
export interface Shift {
  id: string
  user_id: string | null
  opening_balance: number
  expected_balance: number
  actual_balance: number | null
  status: ShiftStatus
  start_time: string | null
  end_time: string | null
  created_at: string | null
}

export interface ShiftInsert {
  id?: string
  user_id?: string | null
  opening_balance?: number
  expected_balance?: number
  actual_balance?: number | null
  status?: ShiftStatus
  start_time?: string | null
  end_time?: string | null
  created_at?: string | null
}

export interface ShiftUpdate {
  user_id?: string | null
  opening_balance?: number
  expected_balance?: number
  actual_balance?: number | null
  status?: ShiftStatus
  start_time?: string | null
  end_time?: string | null
}


// ─────────────────────────────────────────────
// TABLE: transactions
// ─────────────────────────────────────────────
export interface Transaction {
  id: string
  shift_id: string | null
  amount: number
  type: TransactionType
  description: string | null
  created_at: string | null
}

export interface TransactionInsert {
  id?: string
  shift_id?: string | null
  amount: number
  type: TransactionType
  description?: string | null
  created_at?: string | null
}

export interface TransactionUpdate {
  amount?: number
  type?: TransactionType
  description?: string | null
}


// ─────────────────────────────────────────────
// DATABASE type — used to type the Supabase client
// createClient<Database>(url, key)
// ─────────────────────────────────────────────
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      categories: {
        Row: Category
        Insert: CategoryInsert
        Update: CategoryUpdate
      }
      menu_items: {
        Row: MenuItem
        Insert: MenuItemInsert
        Update: MenuItemUpdate
      }
      tables: {
        Row: CafeTable
        Insert: CafeTableInsert
        Update: CafeTableUpdate
      }
      orders: {
        Row: Order
        Insert: OrderInsert
        Update: OrderUpdate
      }
      order_items: {
        Row: OrderItem
        Insert: OrderItemInsert
        Update: OrderItemUpdate
      }
      inventory_items: {
        Row: InventoryItem
        Insert: InventoryItemInsert
        Update: InventoryItemUpdate
      }
      shifts: {
        Row: Shift
        Insert: ShiftInsert
        Update: ShiftUpdate
      }
      transactions: {
        Row: Transaction
        Insert: TransactionInsert
        Update: TransactionUpdate
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
