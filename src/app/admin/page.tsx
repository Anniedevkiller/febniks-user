"use client";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  RefreshCw,
  AlertCircle,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FALLBACK_MEAL_IMAGE,
  formatNaira,
  getMealImageUrl,
  Meal,
} from "@/lib/supabase/meals";

interface AdminOrderRow {
  id: string;
  customer_name?: string;
  status: string;
  total_amount?: number;
  total?: number;
  created_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadAdminData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const supabase = createClient();

      const [mealsRes, catsRes, ordersRes] = await Promise.all([
        supabase
          .from("meals")
          .select(
            "id, name, slug, description, price, image_url, category_id, is_available, is_featured, categories(id, name, slug)"
          )
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("id").eq("is_active", true),
        supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      if (mealsRes.error) throw new Error(mealsRes.error.message);
      if (catsRes.error) throw new Error(catsRes.error.message);

      setMeals((mealsRes.data as unknown as Meal[]) ?? []);
      setCategoriesCount(catsRes.data?.length ?? 0);
      setOrders((ordersRes.data as unknown as AdminOrderRow[]) ?? []);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to load admin data from Supabase.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total_amount ?? o.total ?? 0),
    0
  );

  const stats = [
    {
      label: "Total Revenue",
      value: formatNaira(totalRevenue),
      icon: DollarSign,
    },
    {
      label: "Total Orders",
      value: String(orders.length),
      icon: ShoppingBag,
    },
    {
      label: "Meals in Menu",
      value: String(meals.length),
      icon: UtensilsCrossed,
    },
    {
      label: "Active Categories",
      value: String(categoriesCount),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex bg-white p-2 text-gray-500 rounded-xl border border-gray-100 shadow-sm w-full md:w-max overflow-x-auto">
          <div className="flex gap-1 whitespace-nowrap">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === "overview"
                  ? "bg-gray-100 text-gray-900"
                  : "hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === "orders"
                  ? "bg-gray-100 text-gray-900"
                  : "hover:text-gray-900"
              }`}
            >
              Orders
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("menu")}
              className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === "menu"
                  ? "bg-gray-100 text-gray-900"
                  : "hover:text-gray-900"
              }`}
            >
              Menu Items
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={loadAdminData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {errorMessage && (
        <div className="bg-white rounded-2xl p-6 border border-red-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <span className="text-sm font-bold">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={loadAdminData}
            className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {activeTab === "overview" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-6">
            Dashboard Overview
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-red-50 text-[var(--color-primary)] rounded-xl">
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-gray-500 font-medium text-sm mb-1">
                  {stat.label}
                </h3>
                {isLoading ? (
                  <div className="h-8 w-24 rounded-md animate-shimmer mt-1" />
                ) : (
                  <p className="text-3xl font-black text-gray-900 tracking-tight">
                    {stat.value}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className="text-sm font-bold text-[var(--color-primary)] hover:text-red-700"
              >
                View All
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 w-full rounded-xl animate-shimmer" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="py-10 text-center text-gray-500 text-sm font-bold">
                No orders yet
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-sm">
                      <th className="pb-4 font-semibold px-4">Order ID</th>
                      <th className="pb-4 font-semibold px-4">Date</th>
                      <th className="pb-4 font-semibold px-4">Amount</th>
                      <th className="pb-4 font-semibold px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {orders.slice(0, 5).map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-4 font-bold text-gray-900">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-4 px-4 text-gray-500">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleString()
                            : "-"}
                        </td>
                        <td className="py-4 px-4 font-bold text-gray-900">
                          {formatNaira(order.total_amount ?? order.total ?? 0)}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-[var(--color-primary)]">
                            {order.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "menu" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Menu Items (Supabase)
            </h2>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 w-full rounded-xl animate-shimmer" />
              ))}
            </div>
          ) : meals.length === 0 ? (
            <div className="py-12 text-center text-gray-500 font-bold">
              No meals yet
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-sm bg-gray-50/50">
                    <th className="py-4 font-semibold px-4 rounded-tl-xl">Item</th>
                    <th className="py-4 font-semibold px-4">Category</th>
                    <th className="py-4 font-semibold px-4">Price</th>
                    <th className="py-4 font-semibold px-4 rounded-tr-xl">
                      Available
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {meals.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative border border-gray-200">
                          <Image
                            src={
                              getMealImageUrl(item.image_url) ||
                              FALLBACK_MEAL_IMAGE
                            }
                            alt={item.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <span className="line-clamp-1">{item.name}</span>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-500">
                        {item.categories?.name || "-"}
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-900">
                        {formatNaira(item.price)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.is_available
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item.is_available ? "Available" : "Unavailable"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">
            Orders
          </h2>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 w-full rounded-xl animate-shimmer" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-gray-500 font-bold">
              No orders yet
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-gray-50/30"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-900 text-lg">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-[var(--color-primary)]">
                        {order.status || "Pending"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : ""}
                    </span>
                  </div>
                  <span className="font-black text-xl text-gray-900">
                    {formatNaira(order.total_amount ?? order.total ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
