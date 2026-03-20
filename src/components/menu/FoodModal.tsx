"use client";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FoodItem | null;
  onAdd: (item: FoodItem, quantity: number) => void;
}

export function FoodModal({ isOpen, onClose, item, onAdd }: FoodModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setIsAdding(false);
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      onAdd(item, quantity);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" aria-modal="true" role="dialog">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/50 backdrop-blur-[2px] p-2 rounded-full hover:bg-white transition-colors shadow-sm"
        >
          <X className="w-5 h-5 text-gray-800" />
        </button>

        <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-gray-100">
          <Image 
            src={item.image} 
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-6 md:p-8 flex flex-col w-full md:w-1/2">
          <div className="mb-2">
            <span className="text-xs font-bold tracking-wider text-[var(--color-primary)] uppercase bg-red-50 px-2.5 py-1 rounded-full">{item.category}</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mt-2 mb-2 leading-tight">{item.name}</h2>
          <p className="text-3xl font-black text-[var(--color-primary)] mb-4">₦{(item.price * quantity).toLocaleString()}</p>
          
          <div className="w-12 h-1 bg-gray-100 rounded-full mb-4"></div>
          
          <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
            {item.description}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-gray-700">Quantity</span>
              <div className="flex items-center bg-gray-100 rounded-full p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-gray-600 hover:text-gray-900 shadow-sm transition-transform active:scale-90"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-gray-600 hover:text-gray-900 shadow-sm transition-transform active:scale-90"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button 
              onClick={handleAdd}
              disabled={isAdding}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all duration-300 ${
                isAdding 
                  ? "bg-green-500 text-white scale-[1.02]" 
                  : "bg-[var(--color-primary)] text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/30 active:scale-95"
              }`}
            >
              <ShoppingBag className={`w-5 h-5 ${isAdding ? "animate-bounce" : ""}`} />
              {isAdding ? "Added to Cart!" : "Add to Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
