import { create } from 'zustand';
import { api } from '../services/api';

export interface CartItem {
  id: string; // unique
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

interface POSState {
  // Data
  categories: any[];
  menuItems: any[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchInitialData: () => Promise<void>;

  // Category & Search Filtering
  activeCategory: string; // 'all' or uuid
  setActiveCategory: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Checkout
  checkout: () => Promise<void>;
  isCheckingOut: boolean;
}

export const usePOSStore = create<POSState>((set, get) => ({
  categories: [],
  menuItems: [],
  isLoading: false,
  error: null,
  
  fetchInitialData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [categories, menuItems] = await Promise.all([
        api.getCategories('menu'),
        api.getMenuItems()
      ]);
      set({ categories, menuItems, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  activeCategory: 'all',
  setActiveCategory: (id) => set({ activeCategory: id }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  cart: [],
  addToCart: (item) => {
    set((state) => {
      const existing = state.cart.find(c => c.menu_item_id === item.id);
      if (existing) {
        return {
          cart: state.cart.map(c => 
            c.menu_item_id === item.id 
              ? { ...c, quantity: c.quantity + 1 }
              : c
          )
        };
      }
      return {
        cart: [...state.cart, {
          id: crypto.randomUUID(),
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image_url: item.image_url
        }]
      };
    });
  },
  removeFromCart: (itemId) => {
    set((state) => ({ cart: state.cart.filter(c => c.id !== itemId) }));
  },
  updateQuantity: (itemId, delta) => {
    set((state) => ({
      cart: state.cart.map(c => {
        if (c.id === itemId) {
          const newQ = c.quantity + delta;
          return { ...c, quantity: newQ > 0 ? newQ : 1 };
        }
        return c;
      })
    }));
  },
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    return get().cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  isCheckingOut: false,
  checkout: async () => {
    set({ isCheckingOut: true, error: null });
    try {
      const { cart, getCartTotal, clearCart } = get();
      if (cart.length === 0) throw new Error("Cart is empty");

      const tableId = "59535de4-6f02-4af3-9d93-356bcba14c81"; // Using dummy occupied table
      
      const orderData = {
        total_amount: getCartTotal(),
        status: 'paid',
        payment_method: 'card', // Mock
        table_id: tableId,
      };

      await api.createOrder(orderData, cart);
      clearCart();
      set({ isCheckingOut: false });
    } catch (err: any) {
      set({ error: err.message, isCheckingOut: false });
    }
  }
}));
