"use client";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  onAdd: (item: FoodItem, quantity: number, event?: React.MouseEvent) => void;
}

const MotionImage = motion(Image);

const CUSTOMIZATIONS_BY_CATEGORY: Record<string, { name: string; price: number; icon: string }[]> = {
  Grilled: [
    { name: "Extra Plantain", price: 1500, icon: "🍌" },
    { name: "Signature Pepper Sauce", price: 500, icon: "🌶️" },
    { name: "Extra Bacon Strip", price: 2000, icon: "🥓" },
    { name: "Melted Cheddar", price: 800, icon: "🧀" },
  ],
  "Pepper Soup": [
    { name: "Extra Catfish Fillet", price: 3000, icon: "🐟" },
    { name: "Chili Oil Drizzle", price: 400, icon: "🌶️" },
    { name: "Boiled Yam Pieces", price: 1200, icon: "🥔" },
  ],
  Specials: [
    { name: "Extra Smoked Mangala", price: 4000, icon: "🐟" },
    { name: "Sweet Coleslaw", price: 800, icon: "🥗" },
    { name: "Boiled Egg", price: 500, icon: "🥚" },
  ],
  Fried: [
    { name: "Spicy Potato Fingers", price: 1500, icon: "🥔" },
    { name: "Chef's Garlic Dip", price: 600, icon: "🧄" },
    { name: "Melted Cheddar", price: 800, icon: "🧀" },
  ],
};

export function FoodModal({ isOpen, onClose, item, onAdd }: FoodModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<{ name: string; price: number; icon: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setIsAdding(false);
      setSelectedAddons([]);
    }
  }, [isOpen, item]);

  if (!item) return null;

  const addons = CUSTOMIZATIONS_BY_CATEGORY[item.category] || [];
  const addonPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const basePrice = item.price + addonPrice;
  const totalPrice = basePrice * quantity;

  const handleAdd = (e: React.MouseEvent) => {
    setIsAdding(true);
    setTimeout(() => {
      const customizedItem: FoodItem = {
        ...item,
        price: basePrice,
        description: selectedAddons.length > 0 
          ? `${item.description} (Add-ons: ${selectedAddons.map(a => a.name).join(", ")})` 
          : item.description
      };
      onAdd(customizedItem, quantity, e);
      onClose();
    }, 600);
  };

  const handleToggleAddon = (addon: typeof addons[0]) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.name === addon.name);
      if (exists) {
        return prev.filter((a) => a.name !== addon.name);
      }
      return [...prev, addon];
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" aria-modal="true" role="dialog">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-[4px]"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.93, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] lg:max-h-none overflow-y-auto md:overflow-y-visible z-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/50 backdrop-blur-[2px] p-2 rounded-full hover:bg-white transition-colors shadow-sm"
        >
          <X className="w-5 h-5 text-gray-800" />
        </button>

        {/* Image transition using layoutId */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-gray-100 min-h-[220px] overflow-hidden">
          <MotionImage 
            src={item.image} 
            alt={item.name}
            fill
            className="object-cover"
            layoutId={`food-image-${item.id}`}
            priority
          />
        </div>

        <div className="p-6 md:p-8 flex flex-col w-full md:w-1/2">
          <div className="mb-2">
            <span className="text-xs font-bold tracking-wider text-[var(--color-primary)] uppercase bg-red-50 px-2.5 py-1 rounded-full">{item.category}</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mt-2 mb-2 leading-tight">{item.name}</h2>
          <p className="text-3xl font-black text-[var(--color-primary)] mb-4">₦{totalPrice.toLocaleString()}</p>
          
          <div className="w-12 h-1 bg-gray-100 rounded-full mb-4"></div>
          
          <p className="text-gray-600 mb-6 leading-relaxed text-sm font-medium">
            {item.description}
          </p>

          {/* Customization Area */}
          {addons.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3">Customize Dish</h4>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {addons.map((addon) => {
                  const isChecked = !!selectedAddons.find((a) => a.name === addon.name);
                  return (
                    <label 
                      key={addon.name}
                      className={`flex items-center justify-between p-2.5 border rounded-xl cursor-pointer select-none transition-all duration-200 active:scale-95 ${
                        isChecked 
                          ? "border-[var(--color-primary)] bg-red-50/40 text-[var(--color-primary)] font-bold shadow-xs" 
                          : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium"
                      }`}
                    >
                      <span className="text-xs flex items-center gap-1.5">
                        <span>{addon.icon}</span>
                        <span>{addon.name}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400">+₦{addon.price}</span>
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleAddon(addon)}
                          className="w-3.5 h-3.5 accent-[var(--color-primary)] ml-1"
                        />
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* 4. Selected Custom Add-ons Visualizer (Bouncy Tray) */}
              <div className="flex flex-wrap gap-1.5 min-h-[42px] items-center p-2 bg-gray-50 rounded-2xl border border-gray-100/80 overflow-hidden">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Added:</span>
                <AnimatePresence>
                  {selectedAddons.length === 0 && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] text-gray-400 font-bold italic ml-1"
                    >
                      None
                    </motion.span>
                  )}
                  {selectedAddons.map((addon) => (
                    <motion.span
                      key={addon.name}
                      initial={{ scale: 0, rotate: -20, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        rotate: 0, 
                        opacity: 1,
                        transition: { type: "spring", stiffness: 350, damping: 15 } 
                      }}
                      exit={{ 
                        scale: 0, 
                        rotate: 20, 
                        opacity: 0,
                        transition: { duration: 0.18 }
                      }}
                      className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs text-gray-800"
                    >
                      <span>{addon.icon}</span>
                      <span>{addon.name}</span>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

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
      </motion.div>
    </div>
  );
}
