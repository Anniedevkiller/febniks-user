"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { FoodCard } from "@/components/menu/FoodCard";
import { FoodModal } from "@/components/menu/FoodModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import toast from "react-hot-toast";
import { Filter, Search } from "lucide-react";

// Using the same dummy data
const CATEGORIES = ["All", "Grilled", "Pepper Soup", "Fried", "Specials", "Drinks", "Sides"];
const FOOD_ITEMS = [
  { id: "1", name: "Premium Grilled Croaker", category: "Grilled", price: 15000, description: "Freshly roasted croaker fish with signature Febniks spices.", image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
  { id: "2", name: "Spicy Catfish Pepper Soup", category: "Pepper Soup", price: 8500, description: "Hot, spicy, and deeply aromatic catfish pepper soup.", image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
  { id: "3", name: "Crispy Fried Tilapia", category: "Fried", price: 12000, description: "Golden crispy fried tilapia fish, garnished with fresh onions.", image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
  { id: "4", name: "Special Catfish Barbecue", category: "Specials", price: 18000, description: "Whole roasted catfish smothered in our secret barbecue glaze.", image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
  { id: "5", name: "Jumbo Prawn Skewers", category: "Specials", price: 21000, description: "Char-grilled jumbo prawns marinated in garlic butter.", image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
  { id: "6", name: "Fish & Chips Combo", category: "Fried", price: 11500, description: "Crispy battered fish fillet fingers served with spicy potato wedges.", image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
  { id: "7", name: "Chilled Zobo Drink", category: "Drinks", price: 2000, description: "Refreshing homemade hibiscus drink with pineapple and ginger.", image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
  { id: "8", name: "Fried Plantain (Dodo)", category: "Sides", price: 1500, description: "Extra portion of sweet, golden fried plantains.", image: "https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800" },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredItems = FOOD_ITEMS.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative font-sans text-gray-900">
      <Header onOpenCart={() => setIsCartOpen(true)} />
      
      <main className="flex-grow container mx-auto px-4 max-w-[1400px] py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">Full Menu</h1>
            <p className="text-gray-500 font-medium mt-2">Explore our complete collection of farm-fresh signature dishes.</p>
          </div>
          
          <div className="w-full md:w-auto flex items-center gap-3">
            <div className="relative flex-grow md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search menu..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-[var(--color-primary)] transition-colors rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none shadow-sm"
              />
            </div>
            <button className="bg-white border border-gray-200 p-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-gray-700">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Pill Bar */}
        <div className="flex gap-2.5 overflow-x-auto pb-6 mb-4 snap-x hide-scrollbar mask-gradient-right">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-300 snap-center shrink-0 border ${
                activeCategory === cat 
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md" 
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-x-8 sm:gap-y-10">
            {filteredItems.map((item) => (
              <FoodCard 
                key={item.id}
                {...item}
                onClick={() => setSelectedItem(item)}
                onAdd={() => toast.success(`Added ${item.name} to order.`)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500 font-medium">
            <p className="text-xl mb-2">No dishes found 🎣</p>
            <p>Try adjusting your search or category filters.</p>
          </div>
        )}
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
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
