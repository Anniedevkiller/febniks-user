"use client";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, Clock, Eye, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const MOCK_ORDERS = [
  { id: "FEB-84920", date: "Today, 10:42 AM", amount: 33500, status: "Cooking", items: ["1x Premium Grilled Croaker", "2x Spicy Catfish Pepper Soup"] },
  { id: "FEB-33821", date: "Oct 12, 2024", amount: 15000, status: "Delivered", items: ["1x Crispy Fried Tilapia"] },
  { id: "FEB-11409", date: "Sep 28, 2024", amount: 26500, status: "Delivered", items: ["1x Special Catfish Barbecue", "1x Pepper Soup"] },
];

export default function OrdersPage() {
  const router = useRouter();

  const handleReorder = () => {
    toast.success("Items added to your cart!");
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 max-w-4xl py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <Link href="/profile" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[var(--color-primary)] transition-colors mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Link>
        
        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Order History</h1>
        
        <div className="space-y-6">
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 hover:border-gray-300 hover:shadow-lg hover:shadow-black/5 transition-all">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-black text-xl text-gray-900 tracking-tight">#{order.id}</span>
                    <span className={`px-3 py-1 rounded-md text-xs font-black tracking-wider uppercase ${
                      order.status === 'Cooking' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <Clock className="w-4 h-4" /> {order.date}
                  </div>
                </div>
                <div className="text-2xl font-black text-[var(--color-primary)]">
                  ₦{order.amount.toLocaleString()}
                </div>
              </div>
              
              <div className="mb-8">
                <p className="text-sm font-bold text-gray-700 mb-3 tracking-wide">Items Ordered:</p>
                <ul className="space-y-2.5">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600 font-medium bg-gray-50/50 p-2 rounded-lg border border-gray-50">
                      <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] opacity-60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                {order.status === "Cooking" ? (
                  <Link href={`/track/${order.id}`} className="flex-1 sm:flex-none px-6 py-3.5 bg-[var(--color-primary)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all active:scale-[0.98] shadow-lg shadow-red-900/20">
                    <Eye className="w-5 h-5" /> Track Order Status
                  </Link>
                ) : (
                  <button onClick={handleReorder} className="flex-1 sm:flex-none px-6 py-3.5 bg-white border border-gray-200 text-gray-800 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-[0.98] shadow-sm">
                    <RefreshCw className="w-5 h-5" /> Reorder Items
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
