"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { FoodCard } from "@/components/menu/FoodCard";
import { FoodModal, FoodItem } from "@/components/menu/FoodModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import {
  ArrowRight,
  QrCode,
  UtensilsCrossed,
  Bike,
  Fish,
  ShieldCheck,
  Lock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { fetchFeaturedMeals, getMealImageUrl, Meal } from "@/lib/supabase/meals";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const { addToCart, triggerFlyToCart } = useCart();

  const [featuredMeals, setFeaturedMeals] = useState<Meal[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);
  const [mealsError, setMealsError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const loadFeatured = useCallback(async () => {
    setIsLoadingMeals(true);
    setMealsError(null);
    try {
      const data = await fetchFeaturedMeals(4);
      setFeaturedMeals(data);
    } catch (err: any) {
      setMealsError(err?.message || "Failed to load featured meals from Supabase.");
    } finally {
      setIsLoadingMeals(false);
    }
  }, []);

  useEffect(() => {
    loadFeatured();
  }, [loadFeatured]);

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
    <div className="min-h-screen bg-[#FCFAF6] flex flex-col font-sans text-gray-900">
      <Header onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-grow">
        {/* SECTION 1: HERO */}
        <section className="relative bg-[#FAF8F5] border-b border-gray-100 overflow-hidden">
          <div className="container mx-auto px-4 max-w-[1400px] py-12 md:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-7 flex flex-col items-start z-10">
                <span className="inline-flex items-center gap-2 bg-red-50 text-[var(--color-primary)] border border-red-100 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  Abuja&apos;s Premier Farm-to-Table Kitchen
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.08] mb-6">
                  Fresh Farm-to-Table{" "}
                  <span className="text-[var(--color-primary)]">Fish Meals</span>,
                  Grilled &amp; Smoked Daily.
                </h1>

                <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mb-8">
                  Harvested fresh from our own fish farm, seasoned with authentic
                  Abuja spices, and flame-grilled to order. Experience traceable,
                  hygienic gourmet fish meals delivered hot to your table or doorstep.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/home"
                    className="px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-black text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 active:scale-[0.98]"
                  >
                    <span>{isAuthenticated ? "Continue to Menu" : "Order Now"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  {!isAuthenticated ? (
                    <Link
                      href="/login"
                      className="px-7 py-4 rounded-2xl bg-white text-gray-900 font-bold text-base border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-xs active:scale-[0.98]"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 12.3s.6 3.3 1.6 5.3l3.7-2.8z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5L1.6 16c1.9 3.9 5.8 7 10.4 7z"
                        />
                      </svg>
                      <span>Sign in with Google</span>
                    </Link>
                  ) : (
                    <Link
                      href="/menu"
                      className="px-7 py-4 rounded-2xl bg-white text-gray-900 font-bold text-base border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>Browse Full Menu</span>
                    </Link>
                  )}
                </div>

                {isAuthenticated && user && (
                  <p className="mt-4 text-xs font-bold text-gray-500">
                    Signed in as <span className="text-gray-900">{user.name}</span> •{" "}
                    <Link href="/orders" className="text-[var(--color-primary)] hover:underline">
                      View My Orders
                    </Link>
                  </p>
                )}
              </div>

              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] sm:aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-gray-100">
                  <Image
                    src="/croaker-dish.jpg"
                    alt="Fresh Farm-to-Table Grilled Croaker Fish"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] block">
                        Chef&apos;s Signature
                      </span>
                      <p className="font-black text-gray-900 text-sm sm:text-base">
                        Flame-Grilled Croaker &amp; Spicy Mangala
                      </p>
                    </div>
                    <span className="bg-green-50 text-green-700 text-xs font-black px-3 py-1.5 rounded-full border border-green-200 shrink-0">
                      100% Farm Fresh
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: HOW IT WORKS IN 3 STEPS */}
        <section className="py-16 md:py-20 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[11px] font-black uppercase tracking-widest text-[var(--color-primary)] bg-red-50 px-4 py-1.5 rounded-full">
                Simple &amp; Fast
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-4 tracking-tight">
                How It Works in 3 Easy Steps
              </h2>
              <p className="text-gray-500 font-medium mt-2 text-sm sm:text-base">
                From our pond and smokehouse to your plate in minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  step: "01",
                  title: "Scan or Visit",
                  desc: "Scan the QR code at your restaurant table or visit Febniks Kitchen online from anywhere in Abuja.",
                  icon: QrCode,
                },
                {
                  step: "02",
                  title: "Choose Your Meal",
                  desc: "Pick from our fresh grilled fish, aromatic catfish pepper soup, smoked Mangala platters, and sides.",
                  icon: UtensilsCrossed,
                },
                {
                  step: "03",
                  title: "We Prepare & Deliver",
                  desc: "Our chefs prepare your meal fresh to order and bring it straight to your table or doorstep.",
                  icon: Bike,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-[#FCFAF6] p-8 rounded-3xl border border-gray-100 hover:border-red-100 hover:shadow-lg transition-all flex flex-col items-start"
                >
                  <div className="w-full flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 text-[var(--color-primary)] flex items-center justify-center">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black text-gray-200">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: FEATURED MEALS (FROM SUPABASE is_featured = true) */}
        <section className="py-16 md:py-20 bg-[#FCFAF6] border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[var(--color-primary)] bg-red-50 px-4 py-1.5 rounded-full">
                  Chef&apos;s Picks
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-4 tracking-tight">
                  Featured Meals
                </h2>
                <p className="text-gray-500 font-medium mt-1 text-sm sm:text-base">
                  Customer favorites prepared fresh from our farm harvest.
                </p>
              </div>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-sm font-black text-[var(--color-primary)] hover:text-red-700 bg-white px-5 py-3 rounded-full border border-gray-200 shadow-xs self-start sm:self-auto"
              >
                <span>Explore Full Menu</span>
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
            ) : mealsError ? (
              <div className="bg-white rounded-3xl p-8 border border-red-100 text-center max-w-xl mx-auto">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  Could not load featured meals
                </h3>
                <p className="text-sm text-gray-500 mb-5">{mealsError}</p>
                <button
                  type="button"
                  onClick={loadFeatured}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            ) : featuredMeals.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center max-w-xl mx-auto shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
                  <Fish className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  No meals yet
                </h3>
                <p className="text-sm text-gray-500 font-medium mb-6">
                  Our chefs are updating today&apos;s featured specials. Head to the ordering
                  homepage or full menu to browse all categories.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href="/home"
                    className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold hover:bg-red-700 transition-all"
                  >
                    Go to Ordering Home
                  </Link>
                  <Link
                    href="/menu"
                    className="px-6 py-3 rounded-xl bg-gray-100 text-gray-800 text-sm font-bold hover:bg-gray-200 transition-all"
                  >
                    Open Full Menu
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredMeals.map((meal) => {
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
                      badge={meal.categories?.name || "Featured"}
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
                        toast.success(`Added ${foodItem.name} to cart.`);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 4: WHY FEBNIKS */}
        <section className="py-16 md:py-20 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[11px] font-black uppercase tracking-widest text-[var(--color-primary)] bg-red-50 px-4 py-1.5 rounded-full">
                The Febniks Promise
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-4 tracking-tight">
                Why Diners Trust FEBNIKS KITCHEN
              </h2>
              <p className="text-gray-500 font-medium mt-2 text-sm sm:text-base">
                Uncompromising quality from our own ponds straight to your plate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="p-8 rounded-3xl bg-[#FCFAF6] border border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[var(--color-primary)] flex items-center justify-center mb-5">
                  <Fish className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  Fresh From Our Own Farm
                </h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  We raise and harvest our fish directly from our own farm in Abuja,
                  ensuring peak freshness, clean water standards, and rich natural flavor.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#FCFAF6] border border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  100% Traceable &amp; Hygienic
                </h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Every single fish meal is traceable from harvest to our modern,
                  dust-free smokehouse and kitchen—prepared under strict food-safety standards.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#FCFAF6] border border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-5">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  Pay Securely &amp; Easily
                </h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Checkout in seconds with Paystack-secured card or transfer payments,
                  or pay conveniently when your meal arrives.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 5: FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-14 px-4">
        <div className="container mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-gray-800">
            <div className="md:col-span-2">
              <Link href="/" className="text-2xl font-black tracking-tighter text-white inline-block mb-3">
                FEBNIKS <span className="text-[var(--color-primary)]">KITCHEN</span>
              </Link>
              <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-5">
                Fresh farm-to-table fish meals, hygienically smoked Mangala, and
                signature Abuja grills prepared daily.
              </p>
              <div className="flex flex-wrap gap-3 text-xs font-bold">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full bg-gray-800 text-gray-200 hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full bg-gray-800 text-gray-200 hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                  X (Twitter)
                </a>
                <a
                  href="https://wa.me/2348000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full bg-gray-800 text-gray-200 hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-sm font-medium">
                <li>
                  <Link href="/home" className="hover:text-white transition-colors">
                    Ordering Homepage (/home)
                  </Link>
                </li>
                <li>
                  <Link href="/menu" className="hover:text-white transition-colors">
                    Full Menu (/menu)
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-white transition-colors">
                    My Orders (/orders)
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-white transition-colors">
                    Your Cart (/cart)
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Sign In (/login)
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-4">
                Contact Us
              </h4>
              <ul className="space-y-3 text-sm font-medium">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-1" />
                  <span>Wuse II, Abuja, Nigeria</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <span>+234 800 FEBNIKS</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <span>hello@febnikskitchen.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <p>&copy; {new Date().getFullYear()} Febniks Kitchen. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/support" className="hover:text-gray-300">
                Help &amp; Support
              </Link>
              <Link href="/profile" className="hover:text-gray-300">
                Account
              </Link>
            </div>
          </div>
        </div>
      </footer>

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
