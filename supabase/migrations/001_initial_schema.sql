-- ============================================================
-- Qahwati Cafe SaaS — Initial Schema Migration
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- Tables are created in dependency order (no FK violations)
-- ============================================================


-- ─────────────────────────────────────────────
-- 1. PROFILES
--    Linked to Supabase auth.users.
--    Auto-populated via trigger on user signup.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  role       TEXT        NOT NULL DEFAULT 'staff'
               CHECK (role IN ('admin', 'manager', 'cashier', 'waiter', 'staff')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: auto-insert a profile row when a new auth user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();


-- ─────────────────────────────────────────────
-- 2. CATEGORIES
--    Shared between menu items and inventory.
--    type = 'menu' | 'inventory'
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  type       TEXT        NOT NULL CHECK (type IN ('menu', 'inventory')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────────
-- 3. MENU ITEMS
--    Cafe products shown on the POS screen.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  description  TEXT,
  price        NUMERIC(10,3) NOT NULL DEFAULT 0,
  image_url    TEXT,
  is_available BOOLEAN     DEFAULT TRUE,
  category_id  UUID        REFERENCES categories(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category  ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);


-- ─────────────────────────────────────────────
-- 4. TABLES
--    Physical cafe tables tracked in real-time.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tables (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL UNIQUE,
  capacity   INTEGER     NOT NULL DEFAULT 2,
  status     TEXT        NOT NULL DEFAULT 'available'
               CHECK (status IN ('available', 'occupied', 'reserved')),
  zone       TEXT        NOT NULL DEFAULT 'indoor',
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────────
-- 5. ORDERS
--    Customer orders linked to a table + cashier.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id       UUID          REFERENCES tables(id) ON DELETE SET NULL,
  user_id        UUID          REFERENCES profiles(id) ON DELETE SET NULL,
  status         TEXT          NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'preparing', 'ready', 'paid', 'cancelled')),
  payment_method TEXT          CHECK (payment_method IN ('cash', 'card', 'digital')),
  total_amount   NUMERIC(10,3) NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_table   ON orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_user    ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status  ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);


-- ─────────────────────────────────────────────
-- 6. ORDER ITEMS
--    Line items belonging to an order.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID          REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity     INTEGER       NOT NULL DEFAULT 1,
  unit_price   NUMERIC(10,3) NOT NULL,
  created_at   TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);


-- ─────────────────────────────────────────────
-- 7. INVENTORY ITEMS
--    Stock / ingredients with low-stock alerts.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory_items (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT          NOT NULL,
  category      TEXT          NOT NULL,
  unit          TEXT          NOT NULL,
  quantity      NUMERIC(10,3) NOT NULL DEFAULT 0,
  min_level     NUMERIC(10,3) NOT NULL DEFAULT 0,
  cost_per_unit NUMERIC(10,3) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ   DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   DEFAULT NOW()
);

-- Trigger: auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS inventory_items_updated_at ON inventory_items;
CREATE TRIGGER inventory_items_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();


-- ─────────────────────────────────────────────
-- 8. SHIFTS
--    Cashier work sessions with cash balances.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shifts (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID          REFERENCES profiles(id) ON DELETE SET NULL,
  opening_balance  NUMERIC(10,3) NOT NULL DEFAULT 0,
  expected_balance NUMERIC(10,3) NOT NULL DEFAULT 0,
  actual_balance   NUMERIC(10,3),
  status           TEXT          NOT NULL DEFAULT 'open'
                     CHECK (status IN ('open', 'closed')),
  start_time       TIMESTAMPTZ   DEFAULT NOW(),
  end_time         TIMESTAMPTZ,
  created_at       TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shifts_status  ON shifts(status);
CREATE INDEX IF NOT EXISTS idx_shifts_user    ON shifts(user_id);


-- ─────────────────────────────────────────────
-- 9. TRANSACTIONS
--    Every cash movement recorded in a shift.
--    type: sale_cash | sale_card | expense | income | opening
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id    UUID          REFERENCES shifts(id) ON DELETE CASCADE,
  amount      NUMERIC(10,3) NOT NULL,
  type        TEXT          NOT NULL
                CHECK (type IN ('sale_cash', 'sale_card', 'expense', 'income', 'opening')),
  description TEXT,
  created_at  TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_shift   ON transactions(shift_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at DESC);


-- ============================================================
-- SEED: Initial categories and sample data
-- (safe to re-run — uses INSERT ... ON CONFLICT DO NOTHING)
-- ============================================================

-- Menu categories
INSERT INTO categories (name, type) VALUES
  ('Hot Coffee',   'menu'),
  ('Cold Coffee',  'menu'),
  ('Pastries',     'menu'),
  ('Sandwiches',   'menu'),
  ('Fresh Juices', 'menu'),
  ('Extras',       'menu')
ON CONFLICT DO NOTHING;

-- Inventory categories are stored as free-text in inventory_items.category
-- (Coffee Beans, Dairy, Packaging, Additives, Consumables, etc.)

-- Cafe tables
INSERT INTO tables (name, capacity, status, zone) VALUES
  ('T-01', 2, 'available', 'indoor'),
  ('T-02', 2, 'available', 'indoor'),
  ('T-03', 4, 'available', 'indoor'),
  ('T-04', 4, 'available', 'indoor'),
  ('T-05', 6, 'available', 'indoor'),
  ('T-06', 2, 'available', 'outdoor'),
  ('T-07', 4, 'available', 'outdoor'),
  ('T-08', 8, 'available', 'outdoor')
ON CONFLICT (name) DO NOTHING;
