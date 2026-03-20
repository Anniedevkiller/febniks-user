"use client";
import Link from "next/link";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      login({ name: "Tiffany", email, phone: "+2348000000000" });
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
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-500 font-medium tracking-wide">Log in to FEBNIKS KITCHEN to continue</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-red-900/5 border border-gray-100/60 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 tracking-wide">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:bg-white transition-all font-medium" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700 tracking-wide">Password</label>
              <a href="#" className="text-xs font-bold text-[var(--color-primary)] hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            ) : "Log In"}
          </button>

          <div className="pt-6 text-center text-sm font-medium text-gray-500 border-t border-gray-100 mt-6 pointer-events-auto">
            Don't have an account? <Link href="/signup" className="text-[var(--color-primary)] font-bold hover:underline ml-1">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
