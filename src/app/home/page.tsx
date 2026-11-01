"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { FoodCard } from "@/components/menu/FoodCard";
import { FoodModal, FoodItem } from "@/components/menu/FoodModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { DeconstructedMangala } from "@/components/home/DeconstructedMangala";
import {
  ShoppingCart,
  Search,
  UtensilsCrossed,
  ClipboardList,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  Category,
  Meal,
  fetchActiveCategories,
  fetchAvailableMeals,
  getCategoryIcon,
  getMealImageUrl,
} from "@/lib/supabase/meals";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

export default function CustomerHomePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, totalItemsCount, triggerFlyToCart } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const loadHomeData = useCallback(async () => {
    setIsLoadingCategories(true);
    setIsLoadingMeals(true);
    setErrorMessage(null);

    try {
      const [catsData, mealsData] = await Promise.all([
        fetchActiveCategories(),
        fetchAvailableMeals(),
      ]);
      setCategories(catsData);
      setMeals(mealsData);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to load menu data from Supabase.");
    } finally {
      setIsLoadingCategories(false);
      setIsLoadingMeals(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const firstName = user?.name?.trim().split(" ")[0] || "Guest";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/menu?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/menu");
    }
  };

  const popularMeals = meals
    .filter((m) =>
      searchQuery.trim()
        ? m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.description || "").toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .slice(0, 8);

  const toFoodItem = (meal: Meal): FoodItem => ({
    id: meal.id,
    name: meal.name,
    description:
      meal.description ||
      "Freshly prepared farm-to-table fish delicacy with signature Febniks spices.",
    price: Number(meal.price || 0),
    image: getMealImageUrl(meal.image_url),
    category: meal.categories?.name || "Fish Meals",
  });

  return (
    <div className="min-h-screen bg-[#FCFAF6] flex flex-col relative font-sans text-gray-900">
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-grow container mx-auto px-4 max-w-[1400px] py-6 md:py-10">
        {/* TOP BAR: GREETING + MY ORDERS + CART */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[var(--color-primary)] bg-red-50 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Ready to Order
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                {isAuthenticated ? `Hi, ${firstName} 👋` : "Hi there! What are you craving today?"}
              </h1>
              <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
                Find fresh farm-to-table fish meals, grills, sides, and chilled drinks fast.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-sm transition-colors"
              >
                <ClipboardList className="w-4 h-4 text-[var(--color-primary)]" />
                <span>My Orders</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-sm transition-colors shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart</span>
                <span className="bg-[var(--color-primary)] text-white text-xs font-black px-2 py-0.5 rounded-full">
                  {totalItemsCount}
                </span>
              </button>

              <Link
                href="/cart"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-bold text-xs transition-colors"
              >
                <span>Full Cart Page</span>
              </Link>
            </div>
          </div>

          {/* SEARCH BAR + PROMINENT FULL MENU CTA */}
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <form onSubmit={handleSearchSubmit} className="lg:col-span-8 flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search grilled croaker, catfish pepper soup, mangala..."
                  className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-[var(--color-primary)] rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold text-gray-900 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition-colors shrink-0"
              >
                Search
              </button>
            </form>

            <div className="lg:col-span-4">
              <Link
                href="/menu"
                className="w-full py-3.5 px-6 rounded-2xl bg-[var(--color-primary)] hover:bg-red-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-red-900/20 transition-all active:scale-[0.98]"
              >
                <UtensilsCrossed className="w-5 h-5" />
                <span>EXPLORE FULL MENU</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* PROMINENT MENU BANNER CARD */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-[#3a1215] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full">
                Full Kitchen Catalog
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-3 tracking-tight">
                Browse the Complete FEBNIKS Menu
              </h2>
              <p className="text-sm text-gray-300 font-medium mt-1 max-w-xl">
                Filter by category, search any dish, customize add-ons, and build your order in seconds.
              </p>
            </div>
            <Link
              href="/menu"
              className="px-7 py-4 rounded-2xl bg-[var(--color-primary)] hover:bg-red-700 text-white font-black text-sm sm:text-base flex items-center gap-2.5 shrink-0 shadow-md transition-all"
            >
              <UtensilsCrossed className="w-5 h-5" />
              <span>Open Menu (/menu)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* CATEGORY CHIPS (FROM SUPABASE -> /menu?category=<slug>) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Categories
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Tap a category to filter dishes on the menu
              </p>
            </div>
            <Link
              href="/menu"
              className="text-xs sm:text-sm font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoadingCategories ? (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-36 rounded-full animate-shimmer shrink-0"
                />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 text-sm text-gray-500 font-medium">
              No categories found.{" "}
              <Link href="/menu" className="text-[var(--color-primary)] font-bold underline">
                Open Menu
              </Link>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-3 pt-1 snap-x">
              <Link
                href="/menu"
                className="flex items-center gap-2.5 px-5 py-3 rounded-full font-bold whitespace-nowrap bg-[var(--color-primary)] text-white shadow-sm shrink-0 text-sm"
              >
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-base">
                  🍽️
                </span>
                <span>All Dishes</span>
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/menu?category=${encodeURIComponent(cat.slug)}`}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-full font-bold whitespace-nowrap bg-white hover:bg-red-50 hover:border-red-200 text-gray-800 border border-gray-200 transition-all shrink-0 text-sm shadow-2xs"
                >
                  <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-base">
                    {getCategoryIcon(cat.slug || cat.name)}
                  </span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* FEATURED / POPULAR MEALS ROW */}
        <section className="mb-16" id="popular-meals">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Featured &amp; Popular Meals
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Freshly prepared meals from our Supabase catalog
              </p>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-sm font-black text-[var(--color-primary)] hover:underline"
            >
              <span>See All in Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingMeals ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[1.5rem] p-3 border border-gray-100 flex flex-col h-full"
                >
                  <div className="h-48 sm:h-52 w-full rounded-[1.25rem] mb-4 animate-shimmer" />
                  <div className="px-1.5 space-y-3 pb-2">
                    <div className="h-5 w-2/3 rounded-md animate-shimmer" />
                    <div className="h-4 w-5/6 rounded-md animate-shimmer" />
                    <div className="h-5 w-1/3 rounded-md animate-shimmer mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : errorMessage ? (
            <div className="bg-white rounded-3xl p-8 border border-red-100 text-center max-w-xl mx-auto">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-black text-gray-900 mb-1">
                Unable to load meals right now
              </h3>
              <p className="text-sm text-gray-500 mb-5">{errorMessage}</p>
              <button
                type="button"
                onClick={loadHomeData}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          ) : popularMeals.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center max-w-xl mx-auto">
              <p className="text-lg font-black text-gray-900 mb-2">
                {searchQuery
                  ? `No meals matching "${searchQuery}"`
                  : "No meals yet"}
              </p>
              <p className="text-sm text-gray-500 font-medium mb-6">
                {searchQuery
                  ? "Try clearing your search or view all categories on the full menu."
                  : "Add available meals to the Supabase meals table to see them here immediately."}
              </p>
              <div className="flex justify-center gap-3">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-800 text-sm font-bold hover:bg-gray-200"
                  >
                    Clear Search
                  </button>
                )}
                <Link
                  href="/menu"
                  className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-red-700"
                >
                  Go to Full Menu
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularMeals.map((meal) => {
                const foodItem = toFoodItem(meal);
                return (
                  <FoodCard
                    key={meal.id}
                    id={meal.id}
                    slug={meal.slug}
                    name={meal.name}
                    description={meal.description}
                    price={Number(meal.price || 0)}
                    image={meal.image_url}
                    badge={
                      meal.is_featured
                        ? "Featured"
                        : meal.categories?.name || undefined
                    }
                    onClick={() => setSelectedItem(foodItem)}
                    onAdd={(e) => {
                      if (e) {
                        triggerFlyToCart(foodItem.image, e.clientX, e.clientY);
                      }
                      addToCart({
                        id: foodItem.id,
                        name: foodItem.name,
                        price: foodItem.price,
                        image: foodItem.image,
                        description: foodItem.description,
                      });
                      toast.success(`Added ${foodItem.name} to order.`);
                    }}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Deconstructed Mangala Storytelling Showcase */}
      <DeconstructedMangala />

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
              addToCart(
                {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  description: item.description,
                },
                quantity
              );
              toast.success(`Added ${quantity} ${item.name}(s) to order.`);
              setSelectedItem(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Floating Cart Pill */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[45]">
        <button
          id="cart-icon-mobile"
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="bg-gray-900 text-white px-6 py-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex items-center justify-center gap-3 active:scale-95 transition-all text-sm font-bold tracking-wide"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>
            View Cart{" "}
            {totalItemsCount > 0
              ? `• ${totalItemsCount} Item${totalItemsCount > 1 ? "s" : ""}`
              : ""}
          </span>
        </button>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

