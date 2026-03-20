import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Header } from "@/components/layout/Header";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 flex items-center justify-center py-12">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-red-900/5 max-w-lg w-full text-center border border-gray-100 animate-in zoom-in-95 duration-500 slide-in-from-bottom-4">
          
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-14 h-14 animate-[bounce_1s_ease-in-out]" />
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Order Confirmed!</h1>
          <p className="text-gray-500 mb-8 text-lg font-medium">Your order is being prepared at FEBNIKS KITCHEN.</p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 text-left">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Order ID</span>
              <span className="font-bold text-gray-900 tracking-wider">#FEB-84920</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Estimated Time</span>
              <span className="font-bold text-[var(--color-primary)]">30 - 45 mins</span>
            </div>
          </div>

          <div className="space-y-4">
            <Link 
              href="/"
              className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-all active:scale-[0.98] shadow-lg shadow-red-900/20"
            >
              Track Order Status
            </Link>
            <Link 
              href="/"
              className="w-full py-4 rounded-xl bg-gray-100 text-gray-900 font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-[0.98]"
            >
              <ShoppingBag className="w-5 h-5" />
              Back to Menu
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
