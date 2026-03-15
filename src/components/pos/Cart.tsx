import React from 'react';
import { User, Tag, Ticket, Plus, Minus, Trash2, X, ChevronDown, CheckCircle } from 'lucide-react';
import { usePOSStore } from '../../store/pos';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, checkout, isCheckingOut } = usePOSStore();
  
  const subtotal = getCartTotal();
  const tax = subtotal * 0.15; // 15% standard
  const total = subtotal + tax;

  return (
    <section className="w-[40%] bg-white border-l border-slate-200 flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
      {/* Customer Info Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <User className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 leading-tight">Walk-in Customer</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Order #4092</p>
          </div>
        </div>
        <button className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
          Add Detail
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-5 py-2 custom-scrollbar flex flex-col gap-1">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-400 gap-3">
            <Tag className="size-10 text-slate-200" />
            <p className="text-sm font-medium">Cart is empty</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex gap-4 py-3 group border-b border-slate-50 last:border-0 hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors">
              <div className="size-14 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                <img src={item.image_url || "https://placehold.co/100x100"} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-slate-900 max-w-[150px] truncate">{item.name}</h4>
                  <span className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-500 font-semibold">${Number(item.price).toFixed(2)} ea</span>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-1.5 py-1 shadow-sm">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="size-5 rounded-md flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="size-5 rounded-md flex items-center justify-center bg-primary text-white hover:bg-primary/90 shadow-sm transition-colors"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => removeFromCart(item.id)}
                className="self-center p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-3 flex gap-2 border-t border-slate-100">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
          <Ticket className="size-4" />
          Discount
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 font-bold text-xs rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
          <X className="size-4" />
          Clear
        </button>
      </div>

      {/* Totals Section */}
      <div className="bg-slate-50 p-5 border-t border-slate-200">
        <div className="space-y-3 mb-5">
          <div className="flex justify-between text-sm text-slate-500 font-medium">
            <span>Subtotal</span>
            <span className="font-bold text-slate-700">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500 font-medium">
            <span>Tax (15%)</span>
            <span className="font-bold text-slate-700">${tax.toFixed(2)}</span>
          </div>
          <div className="h-px w-full bg-slate-200 my-1"></div>
          <div className="flex justify-between items-end">
            <span className="text-base text-slate-900 font-bold">Total</span>
            <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button 
            className="col-span-1 py-3 px-4 bg-white border-2 border-primary/20 hover:border-primary text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            Cash
          </button>
          <button 
            className="col-span-1 py-3 px-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
          >
            Credit Card
            <ChevronDown className="size-4 opacity-70" />
          </button>
        </div>
        
        <button 
          onClick={checkout}
          disabled={cart.length === 0 || isCheckingOut}
          className="w-full py-4 bg-slate-900 text-white font-bold text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          {isCheckingOut ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              Confirm Order
              <CheckCircle className="size-5 text-emerald-400" />
            </>
          )}
        </button>
      </div>
    </section>
  );
}
