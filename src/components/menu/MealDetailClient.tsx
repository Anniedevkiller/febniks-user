"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCart } from "@/context/CartContext";
import {
  FALLBACK_MEAL_IMAGE,
  formatNaira,
  getMealImageUrl,
  Meal,
} from "@/lib/supabase/meals";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Fish,
} from "lucide-react";
import toast from "react-hot-toast";

export function MealDetailClient({ meal }: { meal: Meal }) {
  const { addToCart, triggerFlyToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(getMealImageUrl(meal.image_url));

  const unitPrice = Number(meal.price || 0);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = (e: React.MouseEvent) => {
    triggerFlyToCart(imgSrc, e.clientX, e.clientY);
    addToCart(
      {
        id: meal.id,
        name: meal.name,
        price: unitPrice,
        image: imgSrc,
        description: meal.description || undefined,
      },
      quantity
    );
    toast.success(`Added ${quantity}x ${meal.name} to your cart!`);
  };

  return (
    <div className="min-h-screen bg-[#FCFAF6] flex flex-col font-sans text-gray-900">
      <Header onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-grow container mx-auto px-4 max-w-5xl py-8 md:py-12">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Link
            href="/menu"
            className="inline-flex items-center text-sm font-bold text-gray-600 hover:text-[var(--color-primary)] transition-colors bg-white px-4 py-2 rounded-full shadow-2xs border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Link>
          {meal.categories?.slug && (
            <Link
              href={`/menu?category=${encodeURIComponent(meal.categories.slug)}`}
              className="inline-flex items-center text-xs font-black uppercase tracking-wider text-[var(--color-primary)] bg-red-50 px-3.5 py-2 rounded-full border border-red-100"
            >
              {meal.categories.name}
            </Link>
          )}
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6 relative min-h-[320px] sm:min-h-[420px] bg-gray-100">
            <Image
              src={imgSrc}
              alt={meal.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              onError={() => {
                if (imgSrc !== FALLBACK_MEAL_IMAGE) {
                  setImgSrc(FALLBACK_MEAL_IMAGE);
                }
              }}
            />
            {meal.is_featured && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-[var(--color-primary)] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> Featured Dish
              </span>
            )}
          </div>

          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)] bg-red-50 px-3 py-1 rounded-full">
                {meal.categories?.name || "Signature Meal"}
              </span>

              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 mb-2 tracking-tight">
                {meal.name}
              </h1>

              <p className="text-3xl font-black text-[var(--color-primary)] mb-6">
                {formatNaira(unitPrice)}
              </p>

              <p className="text-gray-600 font-medium leading-relaxed text-base mb-8">
                {meal.description ||
                  "Freshly harvested from our Abuja fish farm, seasoned with authentic spices, and prepared fresh to order."}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="p-3.5 rounded-2xl bg-[#FCFAF6] border border-gray-100 flex items-center gap-3">
                  <Fish className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                  <span className="text-xs font-bold text-gray-800">
                    Fresh Farm-to-Table
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FCFAF6] border border-gray-100 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-xs font-bold text-gray-800">
                    100% Hygienic &amp; Traceable
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">Quantity</span>
                <div className="flex items-center bg-gray-100 rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-gray-700 hover:text-gray-900 shadow-xs transition-transform active:scale-90"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-black text-lg">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-gray-700 hover:text-gray-900 shadow-xs transition-transform active:scale-90"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-grow py-4 px-6 rounded-2xl bg-[var(--color-primary)] hover:bg-red-700 text-white font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-lg shadow-red-900/20 transition-all active:scale-[0.98]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Order • {formatNaira(totalPrice)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

