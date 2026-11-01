"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { FoodCard } from "@/components/menu/FoodCard";
import { FoodModal, FoodItem } from "@/components/menu/FoodModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
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
import { Search, ArrowLeft, RefreshCw, AlertCircle, UtensilsCrossed } from "lucide-react";
import { AnimatePresence } from "framer-motion";

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category") || "all";
  const queryParam = searchParams.get("q") || "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { addToCart, triggerFlyToCart } = useCart();

  useEffect(() => {
    setActiveCategorySlug(categoryParam || "all");
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(queryParam || "");
  }, [queryParam]);

  const loadMenuData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [catsData, mealsData] = await Promise.all([
        fetchActiveCategories(),
        fetchAvailableMeals(),
      ]);
      setCategories(catsData);
      setMeals(mealsData);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to load menu from Supabase.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenuData();
  }, [loadMenuData]);

  const handleCategorySelect = (slug: string) => {
    setActiveCategorySlug(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    const qs = params.toString();
    router.replace(qs ? `/menu?${qs}` : "/menu", { scroll: false });
  };

  const filteredMeals = meals.filter((meal) => {
    const selectedCategory = categories.find((c) => c.slug === activeCategorySlug);
    const matchesCategory =
      activeCategorySlug === "all" ||
      meal.categories?.slug === activeCategorySlug ||
      (selectedCategory && meal.category_id === selectedCategory.id);

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      meal.name.toLowerCase().includes(q) ||
      (meal.description || "").toLowerCase().includes(q) ||
      (meal.categories?.name || "").toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

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

      <main className="flex-grow container mx-auto px-4 max-w-[1400px] py-8">
        <div className="mb-6">
          <Link
            href="/home"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-gray-600 hover:text-[var(--color-primary)] transition-colors bg-white px-4 py-2 rounded-full shadow-2xs border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900">
              Full Menu
            </h1>
            <p className="text-gray-500 font-medium mt-2 text-sm sm:text-base">
              Explore our complete collection of farm-fresh fish meals, grills, sides, and drinks.
            </p>
          </div>

          <div className="w-full md:w-auto flex items-center gap-3">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-[var(--color-primary)] transition-colors rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold outline-none shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Categories Pill Bar */}
        <div className="flex gap-2.5 overflow-x-auto pb-6 mb-4 snap-x">
          <button
            type="button"
            onClick={() => handleCategorySelect("all")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-200 snap-center shrink-0 border text-sm ${activeCategorySlug === "all"
              ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
              }`}
          >
            <span>🍽️</span>
            <span>All</span>
          </button>

          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-200 snap-center shrink-0 border text-sm ${activeCategorySlug === cat.slug
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                }`}
            >
              <span>{getCategoryIcon(cat.slug || cat.name)}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Meal Grid with Loading, Error, and Empty States */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-x-8 sm:gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
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
          <div className="bg-white rounded-3xl p-10 border border-red-100 text-center max-w-xl mx-auto my-8">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-black text-gray-900 mb-2">
              Failed to load menu
            </h2>
            <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
            <button
              type="button"
              onClick={loadMenuData}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Loading
            </button>
          </div>
        ) : filteredMeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-x-8 sm:gap-y-10">
            {filteredMeals.map((meal) => {
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
                  badge={meal.categories?.name || undefined}
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
        ) : (
          <div className="py-16 px-6 bg-white rounded-3xl border border-gray-100 text-center max-w-xl mx-auto my-6">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              No meals yet
            </h3>
            <p className="text-sm text-gray-500 font-medium mb-6">
              {searchQuery || activeCategorySlug !== "all"
                ? "Try clearing your category filter or search query to see all available dishes."
                : "Our kitchen menu is currently being updated in Supabase. Check back shortly!"}
            </p>
            {(searchQuery || activeCategorySlug !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  handleCategorySelect("all");
                }}
                className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm hover:bg-red-700 transition-colors"
              >
                Reset Filters
              </button>
            )}
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

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FCFAF6] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
