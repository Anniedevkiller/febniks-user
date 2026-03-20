"use client";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    tableOrAddress: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const totalAmount = 33500;

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        phone: user.phone
      }));
    }
  }, [user]);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.tableOrAddress) {
      toast.error("Please fill in all delivery details.");
      return;
    }
    
    if (paymentMethod === "paystack") {
      setShowPaymentModal(true);
    } else {
      toast.success("Order placed successfully!");
      router.push("/success");
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    router.push("/success");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 max-w-5xl py-8 md:py-12">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[var(--color-primary)] transition-colors mb-8 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Link>
        
        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          <div className="flex-grow">
            <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Checkout</h1>
            
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-red-50 text-[var(--color-primary)] flex items-center justify-center text-sm">1</span>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe" 
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+234 800 000 0000" 
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all font-medium" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-red-50 text-[var(--color-primary)] flex items-center justify-center text-sm">2</span>
                  Delivery Destination
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <label className="relative flex px-5 py-5 bg-red-50 border-2 border-[var(--color-primary)] rounded-2xl cursor-pointer">
                    <div className="flex-grow">
                      <span className="block text-base font-bold text-[var(--color-primary)] mb-1">Dine-in (Table)</span>
                      <span className="block text-sm text-red-700/70 font-medium">I'm at the restaurant</span>
                    </div>
                    <CheckCircle2 className="text-[var(--color-primary)] w-6 h-6 shrink-0" />
                  </label>
                  <label className="relative flex px-5 py-5 bg-white border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-gray-200 transition-all opacity-60">
                    <div className="flex-grow">
                      <span className="block text-base font-bold text-gray-800 mb-1">Takeaway / Delivery</span>
                      <span className="block text-sm text-gray-500 font-medium">Coming soon</span>
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Table Number</label>
                  <input 
                    type="text" 
                    value={formData.tableOrAddress}
                    onChange={(e) => setFormData({...formData, tableOrAddress: e.target.value})}
                    placeholder="e.g. Table 4" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all font-medium" 
                  />
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-red-50 text-[var(--color-primary)] flex items-center justify-center text-sm">3</span>
                  Payment Method
                </h2>
                
                <div className="space-y-3">
                  <label className={`flex items-center justify-between w-full px-5 py-4 border rounded-2xl cursor-pointer transition-colors ${paymentMethod === 'paystack' ? 'border-[var(--color-primary)] bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-blue-600 font-bold text-xs">CARD</span>
                      </div>
                      <span className="font-bold text-gray-800">Pay via Paystack</span>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'paystack'}
                      onChange={() => setPaymentMethod('paystack')}
                      className="w-5 h-5 text-[var(--color-primary)] focus:ring-[var(--color-primary)] accent-[var(--color-primary)]" 
                    />
                  </label>
                  <label className={`flex items-center justify-between w-full px-5 py-4 border rounded-2xl cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-[var(--color-primary)] bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <span className="text-green-600 font-bold text-xs">CASH</span>
                      </div>
                      <span className="font-bold text-gray-800">Pay on Delivery</span>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="w-5 h-5 text-[var(--color-primary)] focus:ring-[var(--color-primary)] accent-[var(--color-primary)]" 
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm lg:sticky lg:top-28">
              <h2 className="text-xl font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="font-bold text-sm text-gray-800 line-clamp-2">Premium Grilled Croaker</span>
                    <span className="block text-xs text-gray-500 font-medium mt-1">Qty: 1</span>
                  </div>
                  <span className="font-bold text-sm text-gray-900 whitespace-nowrap">₦15,000</span>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="font-bold text-sm text-gray-800 line-clamp-2">Spicy Catfish Pepper Soup</span>
                    <span className="block text-xs text-gray-500 font-medium mt-1">Qty: 2</span>
                  </div>
                  <span className="font-bold text-sm text-gray-900 whitespace-nowrap">₦17,000</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">₦32,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Service Charge</span>
                  <span className="font-bold text-gray-900">₦1,500</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <span className="font-black text-lg text-gray-900">Total</span>
                  <span className="font-black text-2xl text-[var(--color-primary)]">₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-all active:scale-[0.98] shadow-lg shadow-red-900/20 text-center"
              >
                Place Order
              </button>
              <p className="text-center text-xs text-gray-400 font-medium mt-4">By placing this order, you agree to our terms and conditions.</p>
            </div>
          </div>
        </form>
      </main>

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={totalAmount}
        email={user?.email}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
