"use client";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, Phone } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      login({ name: formData.name, email: formData.email, phone: formData.phone });
      setIsLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-red-50 to-transparent pointer-events-none" />
      
      <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-500 fade-in z-10">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[var(--color-primary)] transition-colors mb-8 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 mb-2">Create an Account</h1>
          <p className="text-gray-500 font-medium tracking-wide">Join FEBNIKS KITCHEN today</p>
        </div>

        <form onSubmit={handleSignup} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-red-900/5 border border-gray-100/60 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 tracking-wide">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe" 
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:bg-white transition-all font-medium" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 tracking-wide">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="you@example.com" 
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:bg-white transition-all font-medium" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 tracking-wide">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+234 800 000 0000" 
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:bg-white transition-all font-medium" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••" 
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:bg-white transition-all font-medium" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 mt-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              isLoading ? "bg-red-400 text-white cursor-not-allowed" : "bg-[var(--color-primary)] text-white hover:bg-red-700 shadow-lg shadow-red-900/20"
            }`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : "Create Account"}
          </button>

          <div className="pt-6 text-center text-sm font-medium text-gray-500 border-t border-gray-100 mt-6 pointer-events-auto">
            Already have an account? <Link href="/login" className="text-[var(--color-primary)] font-bold hover:underline ml-1">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
