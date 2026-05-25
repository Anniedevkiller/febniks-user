"use client";
import Link from "next/link";
import { ShoppingCart, User, MapPin, ChevronDown, Search, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  onOpenCart?: () => void;
}

const ABUJA_NEIGHBORHOODS = [
  "Wuse II, Abuja",
  "Maitama, Abuja",
  "Asokoro, Abuja",
  "Gwarinpa, Abuja",
  "Jabi, Abuja"
];

export function Header({ onOpenCart }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState("Wuse II, Abuja");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { totalItemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 bg-white ${
      isScrolled ? "shadow-sm py-3" : "border-b border-gray-100 py-4"
    }`}>
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex justify-between items-center gap-4 lg:gap-8">
          
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/" className="text-2xl font-black tracking-tighter text-[var(--color-primary)]">
              FEBNIKS
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="hidden lg:flex items-center gap-2.5 hover:bg-gray-50 px-3 py-2 -ml-2 rounded-full transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                  <MapPin className="w-4 h-4 text-gray-900" />
                </div>
                <div className="text-left hidden xl:block">
                  <span className="block text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-0.5">Delivering to</span>
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                    {deliveryLocation} <ChevronDown className="w-3 h-3 text-gray-500 mt-0.5" />
                  </span>
                </div>
              </button>

              {isLocationDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsLocationDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Select Abuja Area</div>
                    {ABUJA_NEIGHBORHOODS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setDeliveryLocation(loc);
                          setIsLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors flex items-center justify-between ${
                          deliveryLocation === loc 
                            ? "bg-red-50 text-[var(--color-primary)]" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {loc}
                        {deliveryLocation === loc && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:block flex-grow max-w-2xl relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors pointer-events-none">
              <Search className="w-full h-full" />
            </div>
            <input 
              type="text" 
              placeholder="Search for grilled fish, pepper soup..." 
              className="w-full bg-gray-100 hover:bg-gray-200 focus:bg-white border-2 border-transparent focus:border-[var(--color-primary)] transition-all rounded-full py-3.5 pl-12 pr-6 text-sm font-bold text-gray-900 outline-none shadow-sm shadow-transparent focus:shadow-[0_4px_12px_rgba(230,57,70,0.1)]"
            />
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {isAuthenticated ? (
              <Link href="/profile" className="hidden sm:flex items-center gap-2.5 hover:bg-gray-50 px-2 sm:px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-gray-200">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-black shadow-inner">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-gray-900 pr-2 hidden xl:block">{user?.name}</span>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/login" className="text-sm font-bold text-gray-700 hover:bg-gray-100 px-5 py-2.5 rounded-full transition-colors">
                  Log In
                </Link>
                <Link href="/signup" className="text-sm font-bold bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-black transition-colors shadow-md hover:shadow-xl hover:-translate-y-0.5 transform active:scale-95 hidden md:block">
                  Sign Up
                </Link>
              </div>
            )}

            <motion.button 
              key={totalItemsCount}
              onClick={onOpenCart}
              initial={{ scale: 1 }}
              animate={totalItemsCount > 0 ? {
                scale: [1, 1.25, 0.85, 1.15, 0.95, 1],
                rotate: [0, -8, 8, -4, 4, 0]
              } : { scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="relative p-3 bg-gray-900 text-white rounded-full hover:bg-black transition-all shadow-md shadow-gray-900/20 hover:shadow-xl transform"
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {totalItemsCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -top-1.5 -right-1.5 bg-[var(--color-primary)] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md border-[3px] border-white"
                  >
                    {totalItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {isAuthenticated && (
              <Link href="/profile" className="sm:hidden p-2.5 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}
            
            {!isAuthenticated && (
              <Link href="/login" className="sm:hidden p-2.5 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
