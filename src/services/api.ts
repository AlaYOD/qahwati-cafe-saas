/**
 * API service layer.
 * All functions call Next.js API routes (/api/*).
 * Implement the corresponding route handlers in src/app/api/ to connect a database.
 */

const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Categories
  getCategories(type?: 'menu' | 'inventory') {
    const params = type ? `?type=${type}` : '';
    return request<{ id: string; name: string; type: string }[]>(`/categories${params}`);
  },

  // Menu Items
  getMenuItems(categoryId?: string) {
    const params = categoryId && categoryId !== 'all' ? `?category_id=${categoryId}` : '';
    return request<{
      id: string;
      name: string;
      price: number;
      description: string | null;
      image_url: string | null;
      is_available: boolean | null;
      category_id: string | null;
    }[]>(`/menu-items${params}`);
  },

  // Inventory Items
  getInventoryItems() {
    return request<{
      id: string;
      name: string;
      category: string;
      unit: string;
      quantity: number;
      min_level: number;
      cost_per_unit: number;
    }[]>('/inventory-items');
  },

  addInventoryItem(item: {
    name: string;
    category: string;
    unit: string;
    quantity?: number;
    min_level?: number;
    cost_per_unit?: number;
  }) {
    return request('/inventory-items', { method: 'POST', body: JSON.stringify(item) });
  },

  updateInventoryItem(id: string, updates: Partial<{
    name: string;
    category: string;
    unit: string;
    quantity: number;
    min_level: number;
    cost_per_unit: number;
  }>) {
    return request(`/inventory-items/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
  },

  // Tables
  getTables() {
    return request<{
      id: string;
      name: string;
      capacity: number;
      status: string;
      zone: string;
    }[]>('/tables');
  },

  updateTableStatus(id: string, status: string) {
    return request(`/tables/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  },

  // Orders
  createOrder(
    orderData: {
      total_amount: number;
      status: string;
      payment_method: string;
      table_id?: string;
    },
    items: { menu_item_id: string; quantity: number; price: number }[]
  ) {
    return request('/orders', { method: 'POST', body: JSON.stringify({ order: orderData, items }) });
  },

  // Shifts
  getActiveShift() {
    return request<{
      id: string;
      opening_balance: number;
      expected_balance: number;
      actual_balance: number | null;
      status: string;
      start_time: string | null;
    } | null>('/shifts/active');
  },

  getTransactions(shiftId: string) {
    return request<{
      id: string;
      amount: number;
      type: string;
      description: string | null;
      created_at: string | null;
    }[]>(`/shifts/${shiftId}/transactions`);
  },
};
