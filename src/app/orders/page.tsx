"use client";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, Clock, Eye, RefreshCw, ShoppingBag, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/supabase/meals";

interface OrderItemRow {
  id: string;
  quantity: number;
  unit_price?: number;
  price?: number;
  meal_name?: string;
  meals?: {
    name: string;
  } | null;
}

interface OrderRow {
  id: string;
  status: string;
  total_amount?: number;
  total?: number;
  created_at: string;
  order_items?: OrderItemRow[];
}

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (authLoading) return;

    if (!isAuthenticated || !user?.id) {
      router.replace("/login?next=/orders");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, meals(name))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setOrders((data as unknown as OrderRow[]) ?? []);
    } catch (err: any) {
      setErrorMessage(err?.message || "Could not load your orders.");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isAuthenticated, authLoading, router]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="min-h-screen bg-[#FCFAF6] flex flex-col font-sans text-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 max-w-4xl py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Link
            href="/home"
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[var(--color-primary)] transition-colors bg-white px-4 py-2 rounded-full shadow-2xs border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center text-sm font-bold text-[var(--color-primary)] hover:underline bg-white px-4 py-2 rounded-full shadow-2xs border border-gray-200"
          >
            Browse Menu →
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 tracking-tight">
          My Orders
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-4"
              >
                <div className="h-6 w-40 rounded-md animate-shimmer" />
                <div className="h-4 w-28 rounded-md animate-shimmer" />
                <div className="h-12 w-full rounded-xl animate-shimmer" />
              </div>
            ))}
          </div>
        ) : errorMessage ? (
          <div className="bg-white rounded-3xl p-10 border border-red-100 text-center max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-black text-gray-900 mb-2">
              Unable to load orders
            </h2>
            <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
            <button
              type="button"
              onClick={loadOrders}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[var(--color-primary)] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-sm text-gray-500 font-medium mb-8">
              You haven&apos;t placed any orders yet. Once meals are added to the menu and you place an order, it will appear right here.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/menu"
                className="px-7 py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm hover:bg-red-700 transition-all shadow-md"
              >
                Explore Menu
              </Link>
              <Link
                href="/home"
                className="px-7 py-3.5 rounded-xl bg-gray-100 text-gray-800 font-bold text-sm hover:bg-gray-200 transition-all"
              >
                Go to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const amount = Number(order.total_amount ?? order.total ?? 0);
              const dateLabel = order.created_at
                ? new Date(order.created_at).toLocaleString()
                : "";
              const items = order.order_items ?? [];

              return (
                <div
                  key={order.id}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 hover:border-gray-300 hover:shadow-lg hover:shadow-black/5 transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-black text-xl text-gray-900 tracking-tight">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="px-3 py-1 rounded-md text-xs font-black tracking-wider uppercase bg-red-50 text-[var(--color-primary)]">
                          {order.status || "Pending"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Clock className="w-4 h-4" /> {dateLabel}
                      </div>
                    </div>
                    <div className="text-2xl font-black text-[var(--color-primary)]">
                      {formatNaira(amount)}
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-bold text-gray-700 mb-3 tracking-wide">
                        Items Ordered:
                      </p>
                      <ul className="space-y-2">
                        {items.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center gap-3 text-sm text-gray-600 font-medium bg-gray-50/50 p-2.5 rounded-lg border border-gray-50"
                          >
                            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] opacity-60" />
                            <span>
                              {item.quantity}x {item.meals?.name || item.meal_name || "Meal"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Link
                      href={`/track/${order.id}`}
                      className="flex-1 sm:flex-none px-6 py-3.5 bg-[var(--color-primary)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all active:scale-[0.98] shadow-lg shadow-red-900/20"
                    >
                      <Eye className="w-5 h-5" /> Track Order Status
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
