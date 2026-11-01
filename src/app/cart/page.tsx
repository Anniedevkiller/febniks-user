"use client";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FALLBACK_MEAL_IMAGE, formatNaira, getMealImageUrl } from "@/lib/supabase/meals";
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, totalItemsCount } = useCart();
  const { isAuthenticated } = useAuth();
  const serviceCharge = items.length > 0 ? 1500 : 0;
  const total = subtotal + serviceCharge;

  return (
    <div className="min-h-screen bg-[#FCFAF6] flex flex-col font-sans text-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 max-w-5xl py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/menu"
            className="inline-flex items-center text-sm font-bold text-gray-600 hover:text-[var(--color-primary)] transition-colors bg-white px-4 py-2 rounded-full shadow-2xs border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Clear Cart
            </button>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-8">
          Your Cart {totalItemsCount > 0 ? `(${totalItemsCount})` : ""}
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-500 font-medium mb-8">
              Explore our fresh farm-to-table fish meals and add your favorites to get started.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/menu"
                className="px-7 py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm hover:bg-red-700 transition-all shadow-md"
              >
                Browse Full Menu
              </Link>
              <Link
                href="/home"
                className="px-7 py-3.5 rounded-xl bg-gray-100 text-gray-800 font-bold text-sm hover:bg-gray-200 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-xs"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={getMealImageUrl(item.image) || FALLBACK_MEAL_IMAGE}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-grow justify-between py-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-base text-gray-900">{item.name}</h3>
                        {item.description && (
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="font-black text-[var(--color-primary)] text-base">
                        {formatNaira(item.price * item.quantity)}
                      </span>

                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs sticky top-28">
                <h2 className="text-xl font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="font-bold text-gray-900">{formatNaira(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Service Charge</span>
                    <span className="font-bold text-gray-900">{formatNaira(serviceCharge)}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <span className="font-black text-lg text-gray-900">Total</span>
                    <span className="font-black text-2xl text-[var(--color-primary)]">
                      {formatNaira(total)}
                    </span>
                  </div>
                </div>

                <Link
                  href={isAuthenticated ? "/checkout" : "/login?next=%2Fcheckout"}
                  className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-900/20"
                >
                  <span>{isAuthenticated ? "Proceed to Checkout" : "Sign in to Checkout"}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

