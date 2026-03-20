"use client";
import { X, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const DUMMY_CART = [
  { id: "1", name: "Premium Grilled Croaker", price: 15000, quantity: 1, image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
  { id: "2", name: "Spicy Catfish Pepper Soup", price: 8500, quantity: 2, image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
];

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState(DUMMY_CART);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end" aria-modal="true">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-900">Your Cart</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6 bg-gray-50/50">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
              <span className="text-6xl mb-4">🛒</span>
              <p className="font-bold text-lg text-gray-900">Your cart is empty</p>
              <p className="text-gray-500 text-sm mt-2">Looks like you haven't added anything yet.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-grow py-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight">{item.name}</h3>
                    <button className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1 -mt-1 active:scale-90">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-black text-[var(--color-primary)] text-sm mt-1">₦{item.price.toLocaleString()}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full">
                      <button className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-semibold">Subtotal</span>
              <span className="text-2xl font-black text-gray-900">₦{subtotal.toLocaleString()}</span>
            </div>
            <Link 
              href="/checkout"
              onClick={onClose}
              className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-900/20"
            >
              Checkout
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
