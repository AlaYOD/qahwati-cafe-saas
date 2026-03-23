"use client";

import { useReducer } from "react";

export type ModifiersChoice = {
  id: string;
  name: string;
  priceDelta: number;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers: ModifiersChoice[];
  note?: string;
  imageUrl?: string;
};

export type CartState = {
  items: CartItem[];
  tableId: string | null;
  discountValue: number;
  discountType: 'percentage' | 'fixed';
  taxRate: number; 
};

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "id"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "SET_TABLE"; payload: string | null }
  | { type: "SET_DISCOUNT"; payload: { value: number; type: 'percentage' | 'fixed' } }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  tableId: null,
  discountValue: 0,
  discountType: 'percentage',
  taxRate: 0.05, // 5% default
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => 
          item.productId === action.payload.productId && 
          JSON.stringify(item.modifiers) === JSON.stringify(action.payload.modifiers)
      );

      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: newItems };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, id: crypto.randomUUID() }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };
    case "SET_TABLE":
      return { ...state, tableId: action.payload };
    case "SET_DISCOUNT":
      return { ...state, discountValue: action.payload.value, discountType: action.payload.type };
    case "CLEAR_CART":
      return { ...initialState, taxRate: state.taxRate };
    default:
      return state;
  }
}

export function usePosCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const subtotal = state.items.reduce((sum, item) => {
    const itemTotal = item.price + item.modifiers.reduce((mSum, m) => mSum + m.priceDelta, 0);
    return sum + (itemTotal * item.quantity);
  }, 0);

  const discountAmount = state.discountType === 'percentage' 
    ? subtotal * (state.discountValue / 100)
    : state.discountValue;

  const preTaxTotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = preTaxTotal * state.taxRate;
  const grandTotal = preTaxTotal + taxAmount;

  return {
    state,
    dispatch,
    derived: {
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal,
      itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
    }
  };
}
