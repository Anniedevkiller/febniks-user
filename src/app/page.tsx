"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { FoodCard } from "@/components/menu/FoodCard";
import { FoodModal } from "@/components/menu/FoodModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ShoppingCart, Star, MapPin, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

// Dummy Data
const CATEGORIES = [
  { name: "All", icon: "🍽️" },
  { name: "Grilled", icon: "🔥" },
  { name: "Pepper Soup", icon: "🥣" },
  { name: "Fried", icon: "🍤" },
  { name: "Specials", icon: "⭐" },
];

const FOOD_ITEMS = [
  { id: "1", name: "Premium Grilled Croaker", category: "Grilled", price: 15000, description: "Freshly roasted croaker fish with signature Febniks spices, served with plantain and special sauce.", image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
  { id: "2", name: "Spicy Catfish Pepper Soup", category: "Pepper Soup", price: 8500, description: "Hot, spicy, and deeply aromatic catfish pepper soup infused with local herbs.", image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
  { id: "3", name: "Crispy Fried Tilapia", category: "Fried", price: 12000, description: "Golden crispy fried tilapia fish, garnished with fresh onions and peppers.", image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
  { id: "4", name: "Special Catfish Barbecue", category: "Specials", price: 18000, description: "Whole roasted catfish smothered in our secret barbecue glaze, perfect for sharing.", image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
  { id: "5", name: "Jumbo Prawn Skewers", category: "Specials", price: 21000, description: "Char-grilled jumbo prawns marinated in a fiery garlic butter sauce with lemon wedges.", image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
  { id: "6", name: "Fish & Chips Combo", category: "Fried", price: 11500, description: "Crispy battered fish fillet fingers served with spicy potato wedges and a creamy dip.", image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const filteredItems = activeCategory === "All" 
    ? FOOD_ITEMS 
    : FOOD_ITEMS.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col relative font-sans text-gray-900">
      <Header onOpenCart={() => setIsCartOpen(true)} />
      
      {/* Mobile Sticky Search - Appears only on small screens */}
      <div className="md:hidden pt-4 pb-2 px-4 sticky top-16 bg-white z-40 border-b border-gray-100 flex items-center justify-between shadow-[0_4px_10px_rgba(0,0,0,0.02)]">
        <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-100/80 rounded-full max-w-[160px]">
          <MapPin className="w-3.5 h-3.5 text-gray-700 shrink-0" />
          <span className="text-xs font-bold text-gray-900 truncate">Current Location</span>
        </button>
        <div className="flex-grow ml-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-gray-100 hover:bg-gray-200 focus:bg-gray-50 border border-transparent transition-all rounded-full py-2.5 pl-9 pr-4 text-sm font-medium outline-none"
          />
        </div>
      </div>

      <main className="flex-grow">
        
        {/* Glovo-Style Full Bleed Hero */}
        <div className="bg-[#FFDB00] w-full overflow-hidden relative border-b border-yellow-500/20">
          <div className="container mx-auto px-4 max-w-[1400px] flex flex-col md:flex-row items-center justify-between py-12 md:py-24 lg:py-28 relative z-10 min-h-[500px] md:min-h-[600px]">
            {/* Left side: Text Content */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start z-20">
              {isAuthenticated && (
                <span className="inline-block bg-white/50 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-gray-900 mb-6 drop-shadow-sm border border-white/40">
                  Welcome back, {user?.name.split(" ")[0]} 👋
                </span>
              )}
              
              <span className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-full text-[11px] font-black tracking-widest uppercase mb-5 shadow-sm">
                <Star className="w-3.5 h-3.5 text-[#FFDB00]" fill="currentColor" /> Febniks Kitchen Exclusive
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-black mb-6 leading-[1.05] tracking-tighter text-gray-900">
                Farm to Table <br /> Freshness
              </h1>
              <p className="text-base md:text-lg lg:text-xl font-bold text-gray-800/90 mb-8 max-w-sm leading-relaxed">
                Order Our Signature Dried Magala Dishes and enjoy free delivery on your first purchase!
              </p>
              <Link href="/menu" className="bg-gray-900 text-white px-10 py-4 rounded-full font-black text-lg shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] active:scale-95 transition-all w-max hover:bg-black text-center tracking-wide">
                Menu
              </Link>
            </div>
            
            {/* Right side: Image Background */}
            <div className="absolute top-0 right-0 w-full md:w-3/5 h-[300px] md:h-full z-0 opacity-90 md:opacity-100 mt-auto bottom-0 md:mt-0">
               {/* Mask gradients to seamlessly fade the image background into the hero yellow */}
               <div className="absolute inset-0 bg-gradient-to-r from-[#FFDB00] via-[#FFDB00]/60 to-transparent z-10 hidden md:block" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#FFDB00] via-[#FFDB00]/20 to-transparent z-10 md:hidden" />
               <Image 
                 src="/hero-food.jpg" 
                 alt="Signature Dried Magala"
                 fill
                 className="object-cover object-left-top md:object-center"
                 priority
               />
            </div>
          </div>
        </div>

        {/* Categories Carousel */}
        <section className="container mx-auto max-w-[1400px]">
          <div className="flex gap-3 overflow-x-auto pb-6 pt-1 px-4 snap-x hide-scrollbar mask-gradient-right">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full font-bold whitespace-nowrap transition-all duration-300 snap-center shrink-0 ${
                  activeCategory === cat.name 
                    ? "bg-[var(--color-accent)] text-gray-900 shadow-[0_4px_15px_rgba(255,183,3,0.3)] scale-100" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-none scale-100 active:scale-95"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-xs ${activeCategory === cat.name ? 'bg-white/40' : 'bg-white'}`}>
                  {cat.icon}
                </div>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Dynamic Category List */}
        <section className="container mx-auto px-4 max-w-[1400px] mb-20" id="storefront">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {activeCategory === "All" ? "Popular Right Now" : `${activeCategory} Dishes`}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-x-8 sm:gap-y-10">
            {filteredItems.map((item, id) => (
              <FoodCard 
                key={item.id}
                {...item}
                onClick={() => setSelectedItem(item)}
                onAdd={() => {
                  toast.success(`Added ${item.name} to order.`);
                }}
              />
            ))}
          </div>
        </section>
      </main>

      <FoodModal 
        isOpen={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAdd={(item, quantity) => {
          toast.success(`Added ${quantity} ${item.name}(s) to order.`);
          setSelectedItem(null);
        }}
      />

      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[45]">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="bg-gray-900 text-white px-6 py-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex items-center justify-center gap-3 active:scale-95 transition-all text-sm font-bold tracking-wide"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>View Order • 3 Items</span>
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
