"use client";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/context/AuthContext";
import { User, MapPin, CreditCard, LogOut, ArrowRight, Save, Settings, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("info");
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  useEffect(() => {
    if (user === null && !isAuthenticated) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 500);
      return () => clearTimeout(timer);
    } else if (user) {
      setName(user.name);
      setPhone(user.phone);
    }
  }, [user, isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
      toast.success("Account deletion request submitted.");
      handleLogout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 max-w-5xl py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-64 shrink-0 space-y-2">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-50 text-[var(--color-primary)] flex items-center justify-center text-3xl font-black mb-4 shadow-inner">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-bold text-lg text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm font-medium">{user?.email}</p>
            </div>
            
            <nav className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
              <button 
                onClick={() => setActiveTab("info")}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-left ${activeTab === "info" ? "bg-red-50 text-[var(--color-primary)]" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <User className="w-5 h-5" /> Account Info
              </button>
              <Link
                href="/orders"
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-left text-gray-600 hover:bg-gray-50"
              >
                <div className="w-5 h-5 flex items-center justify-center"><span className="text-lg">📦</span></div> Order History
              </Link>
              <button 
                onClick={() => setActiveTab("addresses")}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-left ${activeTab === "addresses" ? "bg-red-50 text-[var(--color-primary)]" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <MapPin className="w-5 h-5" /> Addresses
              </button>
              <button 
                onClick={() => setActiveTab("payment")}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-left ${activeTab === "payment" ? "bg-red-50 text-[var(--color-primary)]" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <CreditCard className="w-5 h-5" /> Payments
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-left ${activeTab === "settings" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <Settings className="w-5 h-5" /> Settings
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3.5 mt-2 rounded-xl font-bold transition-all text-left text-red-500 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" /> Log Out
              </button>
            </nav>
          </div>

          <div className="flex-grow">
            {activeTab === "info" && (
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in duration-300">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Account Information</h2>
                <form onSubmit={handleSave} className="space-y-6 max-w-lg">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 tracking-wide">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 tracking-wide">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 tracking-wide">Email Address (Read-only)</label>
                    <input 
                      type="email" 
                      value={user?.email}
                      disabled
                      className="w-full px-4 py-3.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 font-medium cursor-not-allowed" 
                    />
                  </div>
                  
                  <button type="submit" className="px-8 py-4 mt-6 rounded-xl font-black text-lg flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 active:scale-[0.98]">
                    <Save className="w-5 h-5" /> Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in duration-300">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6">Saved Addresses</h2>
                <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-500 font-bold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-red-50/50 cursor-pointer transition-colors flex items-center justify-center">
                  + Add New Address
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in duration-300">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Payment Methods</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 border border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-white transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-9 bg-blue-900 rounded-lg flex items-center justify-center text-white text-xs font-black italic shadow-inner">VISA</div>
                      <div>
                        <p className="font-bold text-gray-900">•••• •••• •••• 4242</p>
                        <p className="text-xs font-bold text-gray-500 mt-0.5">Expires 12/28</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[var(--color-primary)] tracking-widest bg-red-50 px-3 py-1.5 rounded-full">DEFAULT</span>
                  </div>
                  <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl text-center text-[var(--color-primary)] font-bold hover:border-[var(--color-primary)] hover:bg-red-50/50 cursor-pointer transition-colors mt-4">
                    + Add New Payment Method
                  </div>
                </div>
              </div>
            )}

            {/* NEW SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in duration-300">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Account Settings</h2>
                
                <div className="space-y-6">
                  {/* Preferences */}
                  <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Email Notifications</h3>
                    <p className="text-sm text-gray-500 mb-4 font-medium max-w-md">Receive timely updates about your ongoing orders, deliveries, and exclusive promotional offers.</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                      <span className="ml-3 text-sm font-bold text-gray-900">Toggle Notifications</span>
                    </label>
                  </div>
                  
                  {/* Support link */}
                  <div className="p-6 border border-gray-200 rounded-2xl hover:border-gray-300 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
                    <p className="text-sm text-gray-500 mb-4 font-medium">Chat with our customer service team to resolve any issues.</p>
                    <Link href="/support" className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-sm">
                      Contact Support
                    </Link>
                  </div>

                  {/* Danger Zone */}
                  <div className="p-6 border border-red-200 bg-red-50/50 rounded-2xl mt-8">
                    <h3 className="text-lg font-black text-red-700 flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5" /> Danger Zone
                    </h3>
                    <p className="text-sm text-red-600/80 font-semibold mb-6 max-w-md">
                      Permanently delete your account and remove all of your data from our servers. Once processed, there is absolutely no going back.
                    </p>
                    <button 
                      onClick={handleDeleteAccount}
                      className="px-6 py-3 bg-white border-2 border-red-200 text-red-600 font-black rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors shadow-sm active:scale-95"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
