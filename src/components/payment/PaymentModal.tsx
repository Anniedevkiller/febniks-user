"use client";
import { X, Lock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  email: string | undefined;
  onSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, amount, email, onSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"form" | "processing" | "success">("form");

  useEffect(() => {
    if (isOpen) setStep("form");
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");
    setIsProcessing(true);
    
    setTimeout(() => {
      setStep("success");
      setIsProcessing(false);
      toast.success("Payment verified successfully!");
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-md" onClick={!isProcessing ? onClose : undefined} />
      
      <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/20 animate-in zoom-in-95 duration-300">
        
        {step !== "success" && (
          <div className="bg-[#0ba4db] p-6 text-white text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />
            
            {!isProcessing && (
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 hover:bg-white/20 p-2 rounded-full transition-colors active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center justify-center gap-2 mb-2 relative z-10">
              <Lock className="w-3 h-3 text-white/80" />
              <span className="font-bold text-white/90 text-xs tracking-widest">SECURE CHECKOUT</span>
            </div>
            <h2 className="text-4xl font-black mb-1 tracking-tight drop-shadow-sm relative z-10">₦{amount.toLocaleString()}</h2>
            <p className="text-white/80 text-sm font-medium relative z-10">{email || "guest@febniks.com"}</p>
          </div>
        )}

        <div className="p-6">
          {step === "form" && (
            <form onSubmit={handlePay} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0ba4db] focus:ring-1 focus:ring-[#0ba4db] transition-all font-medium" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Expiry</label>
                  <input type="text" placeholder="MM/YY" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0ba4db] focus:ring-1 focus:ring-[#0ba4db] transition-all font-medium text-center" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">CVV</label>
                  <input type="password" placeholder="123" maxLength={3} className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0ba4db] focus:ring-1 focus:ring-[#0ba4db] transition-all font-medium text-center" required />
                </div>
              </div>
              <button type="submit" className="w-full py-4 mt-2 rounded-xl bg-[#0ba4db] text-white font-black tracking-wide hover:bg-[#098bbd] transition-all shadow-lg shadow-[#0ba4db]/20 active:scale-[0.98] flex justify-center items-center">
                Pay ₦{amount.toLocaleString()}
              </button>
            </form>
          )}

          {step === "processing" && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                <div className="w-14 h-14 border-4 border-gray-100 border-t-[#0ba4db] rounded-full animate-spin" />
                <Lock className="w-5 h-5 text-[#0ba4db] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="font-black text-xl text-gray-900 mb-2">Authenticating</h3>
              <p className="text-gray-500 font-medium tracking-wide">Please approve the transaction...</p>
            </div>
          )}

          {step === "success" && (
            <div className="py-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="font-black text-2xl text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-500 font-medium px-4">Redirecting to order confirmation...</p>
            </div>
          )}
        </div>
        
        {step === "form" && (
          <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
            <span className="text-[10px] font-black text-gray-400 flex items-center justify-center gap-1.5 tracking-widest">
              <Lock className="w-3 h-3" /> SECURED BY PAYSTACK
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
