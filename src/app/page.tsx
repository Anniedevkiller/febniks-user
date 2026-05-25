"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { FoodCard } from "@/components/menu/FoodCard";
import { FoodModal } from "@/components/menu/FoodModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ShoppingCart, Star, MapPin, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { DeconstructedMangala } from "@/components/home/DeconstructedMangala";

// Categories mapping
const CATEGORIES = [
  { name: "All", icon: "🍽️" },
  { name: "Grilled", icon: "🔥" },
  { name: "Pepper Soup", icon: "🥣" },
  { name: "Fried", icon: "🍤" },
  { name: "Specials", icon: "⭐" },
];

// Food items using uploaded premium assets
const FOOD_ITEMS = [
  { id: "1", name: "Premium Grilled Croaker", category: "Grilled", price: 15000, description: "Freshly roasted croaker fish with signature Febniks spices, served with plantains and special pepper sauce.", image: "/croaker-dish.jpg" },
  { id: "2", name: "Spicy Catfish Pepper Soup", category: "Pepper Soup", price: 8500, description: "Hot, deeply aromatic catfish pepper soup infused with traditional herbs.", image: "/catfish-dish.jpg" },
  { id: "3", name: "Gourmet Peppered Mangala Bowl", category: "Specials", price: 18000, description: "Dried Mangala fish smothered in signature hot peppers, garnished with fresh cucumbers.", image: "/spicy-dish-watermark.jpg" },
  { id: "4", name: "Premium Dried Mangala Pack", category: "Specials", price: 12000, description: "Hygienically packaged premium dried Mangala fish sourced directly from Abuja smokehouses.", image: "/mangala-pack.jpg" },
  { id: "5", name: "Whole Smoked Catfish Glaze", category: "Grilled", price: 19500, description: "Whole roasted catfish glazed with our secret spice recipe, ideal for couples.", image: "/catfish-dish.jpg" },
  { id: "6", name: "Spicy Plated Tilapia Combo", category: "Fried", price: 14500, description: "Crispy fried tilapia fish fingers with spicy potatoes and chef's signature dips.", image: "/croaker-dish.jpg" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isIntroLoading, setIsIntroLoading] = useState(true);
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { addToCart, totalItemsCount, triggerFlyToCart } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryChange = (catName: string) => {
    if (activeCategory === catName) return;
    setActiveCategory(catName);
    setIsMenuLoading(true);
    const timer = setTimeout(() => {
      setIsMenuLoading(false);
    }, 600);
  };

  const filteredItems = activeCategory === "All" 
    ? FOOD_ITEMS 
    : FOOD_ITEMS.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FCFAF6] flex flex-col relative font-sans text-gray-900">
      {/* 5. Custom Flipping Pan Loader */}
      <AnimatePresence>
        {isIntroLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#FCFAF6] z-[99999] flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                  {/* Pancake/fish being flipped */}
                  <motion.ellipse
                    cx="50"
                    cy="32"
                    rx="15"
                    ry="6"
                    fill="#FFB703"
                    animate={{
                      y: [0, -35, 0],
                      rotateX: [0, 180, 360],
                      scaleY: [1, 0.7, 1]
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {/* Pan */}
                  <motion.g
                    animate={{
                      y: [0, 4, 0],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Pan Body */}
                    <path d="M25 50 C25 62, 35 70, 50 70 C65 70, 75 62, 75 50 Z" fill="#2C3E50" />
                    {/* Pan Handle */}
                    <path d="M73 50 L95 42 L93 38 L72 47 Z" fill="#1A252F" />
                  </motion.g>
                </svg>
              </div>
              <motion.h3 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="text-sm font-black text-gray-800 tracking-widest uppercase mt-4"
              >
                Flipping Abuja Delicacies...
              </motion.h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header onOpenCart={() => setIsCartOpen(true)} />
      
      {/* Mobile Sticky Location Banner */}
      <div className="md:hidden pt-4 pb-2 px-4 sticky top-16 bg-white z-40 border-b border-gray-100 flex items-center justify-between shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
        <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-100/80 rounded-full max-w-[170px]">
          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="text-xs font-bold text-gray-900 truncate">Wuse II, Abuja</span>
        </button>
        <div className="flex-grow ml-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search menu..." 
            className="w-full bg-gray-100 hover:bg-gray-200 focus:bg-gray-50 border border-transparent transition-all rounded-full py-2.5 pl-9 pr-4 text-xs font-semibold outline-none"
          />
        </div>
      </div>

      <main className="flex-grow">
        
        {/* Responsive Premium Hero with Entrance Timelines & Floating Ingredients */}
        <div className="bg-[#FAF8F5] w-full overflow-hidden border-b border-gray-100 relative">
          
          {/* Subtle Floating Ingredients Background */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Chili Pepper 🌶️ */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 0.18, 
                scale: 1,
                y: [0, -15, 0],
                rotate: [0, 8, -8, 0]
              }}
              transition={{
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                default: { duration: 1, delay: 0.8 }
              }}
              className="absolute left-[8%] top-[15%] hidden md:block"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-red-500 stroke-2 stroke-current">
                <path d="M12 2C11.5 3 10.5 4.5 9 5C7.5 5.5 6.5 5 6 5C6.5 6.5 8 8 9 9C10 10 10.5 12 10.5 13.5C10.5 16 8.5 18 6 18C7.5 19.5 9.5 20.5 12 20.5C16.5 20.5 20 17 20 12.5C20 8.5 17 5 12 2Z" fill="currentColor" fillOpacity="0.2"/>
              </svg>
            </motion.div>

            {/* Basil Leaf 🌿 */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 0.15, 
                scale: 1,
                y: [0, 12, 0],
                rotate: [0, -10, 10, 0]
              }}
              transition={{
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                default: { duration: 1, delay: 1 }
              }}
              className="absolute left-[40%] bottom-[12%] hidden md:block"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-green-500 stroke-2 stroke-current">
                <path d="M2 22C2 22 8 20 12 16C16 12 22 2 22 2C22 2 12 8 8 12C4 16 2 22 2 22Z" fill="currentColor" fillOpacity="0.2"/>
                <path d="M2 22C6 18 12 16 16 12" />
              </svg>
            </motion.div>

            {/* Lemon Slice 🍋 */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 0.16, 
                scale: 1,
                y: [0, -10, 0],
                rotate: [0, 12, -12, 0]
              }}
              transition={{
                y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                default: { duration: 1, delay: 0.9 }
              }}
              className="absolute right-[45%] top-[8%] hidden md:block"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-11 h-11 text-yellow-500 stroke-2 stroke-current">
                <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.15" />
                <circle cx="12" cy="12" r="8" strokeDasharray="3 2" />
                <path d="M12 4V20M4 12H20M6.34 6.34L17.66 17.66M6.34 17.66L17.66 6.34" />
              </svg>
            </motion.div>
          </div>

          <div className="container mx-auto px-4 max-w-[1400px] flex flex-col md:flex-row items-stretch justify-between relative z-10">
            {/* Left side: Text Content Staggered Entrance */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start py-12 md:py-20 lg:py-24 z-20 md:pr-8">
              {isAuthenticated && (
                <motion.span 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="inline-block bg-white px-4 py-1.5 rounded-full text-xs font-bold text-gray-900 mb-6 shadow-sm border border-gray-100"
                >
                  Welcome back, {user?.name.split(" ")[0]} 👋
                </motion.span>
              )}
              
              <motion.span 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-1.5 bg-[#E63946] text-white px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-5 shadow-xs"
              >
                <Star className="w-3.5 h-3.5 fill-white text-white" /> Premium Abuja Smokehouse
              </motion.span>
              
              {/* Kinetic Typography Mask-Up */}
              <h1 className="text-4xl sm:text-5xl lg:text-[4.2rem] font-black mb-6 leading-[1.08] tracking-tight text-[#1E1E1E]">
                <span className="block overflow-hidden pb-1">
                  <motion.span 
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                    className="block"
                  >
                    Traditional Taste.
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <motion.span 
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                    className="block text-[var(--color-primary)]"
                  >
                    Gourmet Standards.
                  </motion.span>
                </span>
              </h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.55 }}
                className="text-base sm:text-lg font-semibold text-gray-600 mb-8 max-w-md leading-relaxed"
              >
                Experience Abuja’s finest farm-sourced, hygienically smoked Dried Mangala and premium grilled delicacies delivered fresh.
              </motion.p>
              
              {/* Premium Delivery Selector Search Area Staggered */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
                className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-lg p-2.5 flex flex-col sm:flex-row items-stretch gap-2"
              >
                <div className="flex-grow flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                  <div className="text-left">
                    <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Delivering to</span>
                    <span className="text-xs font-bold text-gray-800">Wuse II, Maitama, Asokoro, Jabi</span>
                  </div>
                </div>
                <Link href="#storefront" className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-black transition-all active:scale-95 text-center flex items-center justify-center shrink-0">
                  Order Now
                </Link>
              </motion.div>
            </div>
            
            {/* Right side: Premium Image Display with 3% Scale-up Entrance */}
            <div className="relative w-full md:w-1/2 min-h-[300px] sm:min-h-[360px] md:min-h-full aspect-[4/3] sm:aspect-video md:aspect-auto z-0 opacity-90 md:opacity-100 shrink-0">
               {/* Mask gradients to seamlessly fade the image background into the hero color */}
               <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/90 to-transparent z-10 hidden md:block" />
               <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5]/30 to-transparent z-10 md:hidden" />
               <motion.div
                 initial={{ opacity: 0, scale: 0.97 }}
                 animate={{ opacity: 1, scale: 1.0 }}
                 transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                 className="absolute inset-0 overflow-hidden md:rounded-l-[2rem]"
               >
                 <Image 
                   src="/croaker-dish.jpg" 
                   alt="Premium Smoked Delicacy"
                   fill
                   className="object-cover object-center transition-all duration-[6000ms] hover:scale-103"
                   priority
                 />
               </motion.div>
            </div>
          </div>
        </div>

        {/* Categories Carousel */}
        <section className="container mx-auto max-w-[1400px] mt-12 mb-8">
          <div className="flex gap-3 overflow-x-auto pb-6 pt-1 px-4 snap-x hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => handleCategoryChange(cat.name)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full font-bold whitespace-nowrap transition-all duration-300 snap-center shrink-0 ${
                  activeCategory === cat.name 
                    ? "bg-[var(--color-primary)] text-white shadow-[0_4px_15px_rgba(230,57,70,0.3)] scale-100" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-none scale-100 active:scale-95"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-xs ${activeCategory === cat.name ? 'bg-white/20' : 'bg-white'}`}>
                  {cat.icon}
                </div>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Dynamic Category List */}
        <section className="container mx-auto px-4 max-w-[1400px] mb-16" id="storefront">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {activeCategory === "All" ? "Popular Right Now in Abuja" : `${activeCategory} Specialties`}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-x-8 sm:gap-y-10">
            {isMenuLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[1.5rem] p-3 border border-gray-100 flex flex-col h-full">
                  <div className="relative h-48 sm:h-56 lg:h-48 xl:h-56 w-full rounded-[1.5rem] overflow-hidden mb-4 animate-shimmer" />
                  <div className="px-1 space-y-3 flex-grow pb-2">
                    <div className="h-5 w-2/3 rounded-md animate-shimmer" />
                    <div className="h-4 w-5/6 rounded-md animate-shimmer" />
                    <div className="h-5 w-1/3 rounded-md animate-shimmer mt-2" />
                  </div>
                </div>
              ))
            ) : (
              filteredItems.map((item) => (
                <FoodCard 
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  onClick={() => setSelectedItem(item)}
                  onAdd={(e) => {
                    if (e) {
                      triggerFlyToCart(item.image, e.clientX, e.clientY);
                    }
                    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, description: item.description });
                    toast.success(`Added ${item.name} to order.`);
                  }}
                />
              ))
            )}
          </div>
        </section>

        {/* 2. Scroll-Driven "Deconstructed" Gourmet Mangala Platter Assembly */}
        <DeconstructedMangala />

        {/* Dynamic Story Narrative - Abuja Roots, International Standards */}
        <section className="bg-white border-y border-gray-100 py-20 px-4 mb-20">
          <div className="container mx-auto max-w-[1200px]">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[11px] font-black uppercase tracking-widest text-[var(--color-primary)] bg-red-50 px-4 py-1.5 rounded-full">Our Heritage Journey</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-5 tracking-tight leading-tight">Abuja Roots, World-Class Standards</h2>
              <p className="text-sm font-semibold text-gray-500 mt-3">Discover the meticulous steps behind every single gourmet dish we deliver.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="group flex flex-col items-center text-center">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-md border border-gray-100 mb-6 group-hover:shadow-xl transition-all duration-300">
                  <Image src="/founder-market.jpg" alt="Traditional Sourcing" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-gray-900 text-white w-8 h-8 rounded-full font-black text-sm flex items-center justify-center shadow-md">1</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Authentic Abuja Sourcing</h3>
                <p className="text-xs text-gray-500 font-medium max-w-xs leading-relaxed">
                  We source our fresh raw fish directly from local, trusted Abuja markets, supporting local vendors and ensuring high-quality authentic inputs.
                </p>
              </div>

              {/* Step 2 */}
              <div className="group flex flex-col items-center text-center">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-md border border-gray-100 mb-6 group-hover:shadow-xl transition-all duration-300">
                  <Image src="/mangala-pack.jpg" alt="Premium Smokehouse Processing" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-gray-900 text-white w-8 h-8 rounded-full font-black text-sm flex items-center justify-center shadow-md">2</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Modern Hygienic Packaging</h3>
                <p className="text-xs text-gray-500 font-medium max-w-xs leading-relaxed">
                  Smoked in modern, certified smokehouses and vacuum-sealed for absolute freshness, Febniks Dried Mangala is packaged with full quality assurance.
                </p>
              </div>

              {/* Step 3 */}
              <div className="group flex flex-col items-center text-center">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-md border border-gray-100 mb-6 group-hover:shadow-xl transition-all duration-300">
                  <Image src="/spicy-dish-watermark.jpg" alt="Premium Plated Masterpiece" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-gray-900 text-white w-8 h-8 rounded-full font-black text-sm flex items-center justify-center shadow-md">3</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gourmet Culinary Artistry</h3>
                <p className="text-xs text-gray-500 font-medium max-w-xs leading-relaxed">
                  Our professional chefs transform raw smoked fish into stunning, spicy gourmet platters delivered hot to your location.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 3. Shared Element Transitions Modal wrapped in AnimatePresence */}
      <AnimatePresence>
        {selectedItem && (
          <FoodModal 
            isOpen={true}
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onAdd={(item, quantity, event) => {
              if (event) {
                triggerFlyToCart(item.image, event.clientX, event.clientY);
              }
              addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, description: item.description }, quantity);
              toast.success(`Added ${quantity} ${item.name}(s) to order.`);
              setSelectedItem(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[45]">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="bg-gray-900 text-white px-6 py-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex items-center justify-center gap-3 active:scale-95 transition-all text-sm font-bold tracking-wide"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>View Order {totalItemsCount > 0 ? `• ${totalItemsCount} Item${totalItemsCount > 1 ? 's' : ''}` : ''}</span>
        </button>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <footer className="bg-gray-50 border-t border-gray-100 text-gray-500 py-16 text-center mt-12 px-6">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tighter">FEBNIKS <span className="text-[var(--color-primary)]">KITCHEN</span></h3>
          <ul className="flex flex-wrap justify-center gap-6 font-bold text-sm text-gray-600 mb-8">
            <li><a href="#" className="hover:text-black">Get Help</a></li>
            <li><a href="#" className="hover:text-black">Add your restaurant</a></li>
            <li><a href="#" className="hover:text-black">Sign up to deliver</a></li>
            <li><a href="#" className="hover:text-black">Terms</a></li>
          </ul>
          <div className="text-xs font-semibold pt-8 border-t border-gray-200">
            &copy; {new Date().getFullYear()} Febniks Kitchen Technologies Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}
