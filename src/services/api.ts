import { createClient } from '@/utils/supabase/client';

export const api = {
  // Categories
  async getCategories(type?: 'menu' | 'inventory') {
    const supabase = createClient();
    let query = supabase.from('categories').select('*');
    if (type) {
      query = query.eq('type', type);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Menu Items
  async getMenuItems(categoryId?: string) {
    const supabase = createClient();
    let query = supabase.from('menu_items').select('*, categories(*)');
    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Inventory Items
  async getInventoryItems() {
    const supabase = createClient();
    const { data, error } = await supabase.from('inventory_items').select('*');
    if (error) throw error;
    return data;
  },

  async addInventoryItem(item: any) {
    const supabase = createClient();
    const { data, error } = await supabase.from('inventory_items').insert([item]).select();
    if (error) throw error;
    return data[0];
  },

  async updateInventoryItem(id: string, updates: any) {
    const supabase = createClient();
    const { data, error } = await supabase.from('inventory_items').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  // Tables
  async getTables() {
    const supabase = createClient();
    const { data, error } = await supabase.from('tables').select('*');
    if (error) throw error;
    return data;
  },

  async updateTableStatus(id: string, status: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from('tables').update({ status }).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  // Orders
  async createOrder(orderData: any, items: any[]) {
    const supabase = createClient();
    // Insert order
    const { data: order, error: orderError } = await supabase.from('orders').insert([orderData]).select().single();
    if (orderError) throw orderError;

    // Insert items
    const orderItems = items.map(item => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      unit_price: item.price
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    return order;
  },

  // Shifts and Transactions
  async getActiveShift() {
    const supabase = createClient();
    const { data, error } = await supabase.from('shifts').select('*').eq('status', 'open').order('created_at', { ascending: false }).limit(1).single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows
    return data;
  },

  async getTransactions(shiftId: string) {
    const supabase = createClient();
    const { data, error } = await supabase.from('transactions').select('*').eq('shift_id', shiftId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};
