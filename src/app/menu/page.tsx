"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { FoodCard } from "@/components/menu/FoodCard";
import { FoodModal } from "@/components/menu/FoodModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { Filter, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Categories including local special additions
const CATEGORIES = ["All", "Grilled", "Pepper Soup", "Fried", "Specials", "Drinks", "Sides"];

// Real premium products mapped with uploaded assets
const FOOD_ITEMS = [
  { id: "1", name: "Premium Grilled Croaker", category: "Grilled", price: 15000, description: "Freshly roasted croaker fish with signature Febniks spices.", image: "/croaker-dish.jpg" },
  { id: "2", name: "Spicy Catfish Pepper Soup", category: "Pepper Soup", price: 8500, description: "Hot, deeply aromatic catfish pepper soup infused with traditional herbs.", image: "/catfish-dish.jpg" },
  { id: "3", name: "Gourmet Peppered Mangala Bowl", category: "Specials", price: 18000, description: "Dried Mangala fish smothered in signature hot peppers, garnished with cucumbers.", image: "/spicy-dish-watermark.jpg" },
  { id: "4", name: "Premium Dried Mangala Pack", category: "Specials", price: 12000, description: "Hygienically packaged premium dried Mangala fish sourced directly from Abuja smokehouses.", image: "/mangala-pack.jpg" },
  { id: "5", name: "Whole Smoked Catfish Glaze", category: "Grilled", price: 19500, description: "Whole roasted catfish glazed with our secret spice recipe, ideal for couples.", image: "/catfish-dish.jpg" },
  { id: "6", name: "Spicy Plated Tilapia Combo", category: "Fried", price: 14500, description: "Crispy fried tilapia fish fingers with spicy potatoes and chef's signature dips.", image: "/croaker-dish.jpg" },
  { id: "7", name: "Chilled Zobo Drink", category: "Drinks", price: 2000, description: "Refreshing homemade hibiscus drink with pineapple and ginger.", image: "/spicy-dish-watermark.jpg" },
  { id: "8", name: "Fried Plantain (Dodo)", category: "Sides", price: 1500, description: "Extra portion of sweet, golden fried plantains.", image: "/croaker-dish.jpg" },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart, triggerFlyToCart } = useCart();

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
        <div className="flex gap-2.5 overflow-x-auto pb-6 mb-4 snap-x hide-scrollbar">
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
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500 font-medium">
            <p className="text-xl mb-2">No dishes found 🎣</p>
            <p>Try adjusting your search or category filters.</p>
          </div>
        )}
      </main>

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
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
