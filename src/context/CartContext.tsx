"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
}

interface FlyingItem {
  id: number;
  image: string;
  startX: number;
  startY: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItemsCount: number;
  triggerFlyToCart: (image: string, startX: number, startY: number) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  subtotal: 0,
  totalItemsCount: 0,
  triggerFlyToCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [cartPos, setCartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem("febniks_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart session");
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("febniks_cart", JSON.stringify(items));
    }
  }, [items, isClient]);

  // Track the cart icon coordinates
  useEffect(() => {
    if (!isClient) return;

    const updateCartPos = () => {
      const cartEl = document.getElementById("cart-icon-header") || document.getElementById("cart-icon-mobile");
      if (cartEl) {
        const rect = cartEl.getBoundingClientRect();
        setCartPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };

    updateCartPos();
    window.addEventListener("resize", updateCartPos);
    window.addEventListener("scroll", updateCartPos);

    // Also update periodically to handle dynamic shifts
    const interval = setInterval(updateCartPos, 1000);

    return () => {
      window.removeEventListener("resize", updateCartPos);
      window.removeEventListener("scroll", updateCartPos);
      clearInterval(interval);
    };
  }, [isClient, flyingItems]);

  const addToCart = (newItem: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...newItem, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const triggerFlyToCart = (image: string, startX: number, startY: number) => {
    setFlyingItems((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), image, startX, startY },
    ]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItemsCount,
        triggerFlyToCart,
      }}
    >
      {isClient ? (
        <>
          {children}
          
          {/* Flying clones container */}
          <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <AnimatePresence>
              {flyingItems.map((item) => {
                const peakY = Math.min(item.startY, cartPos.y) - 120;
                return (
                  <motion.div
                    key={item.id}
                    initial={{
                      x: item.startX - 24,
                      y: item.startY - 24,
                      scale: 0.8,
                      opacity: 1,
                    }}
                    animate={{
                      x: cartPos.x - 16,
                      y: [item.startY - 24, peakY, cartPos.y - 16],
                      scale: [0.8, 1.1, 0.15],
                      opacity: [1, 1, 0.8],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.75,
                      ease: [0.25, 1, 0.5, 1], // Custom curve
                    }}
                    onAnimationComplete={() => {
                      setFlyingItems((prev) => prev.filter((f) => f.id !== item.id));
                    }}
                    className="fixed w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--color-primary)] bg-white shadow-xl flex items-center justify-center"
                  >
                    <img
                      src={item.image}
                      alt="flying food"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      ) : null}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

