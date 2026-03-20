"use client";
import { TrendingUp, Users, ShoppingBag, DollarSign, Plus, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const STATS = [
  { label: "Total Revenue", value: "₦1,458,000", trend: "+12.5%", icon: DollarSign },
  { label: "Orders Today", value: "84", trend: "+4.1%", icon: ShoppingBag },
  { label: "Active Diners", value: "32", trend: "-2.4%", icon: Users },
  { label: "Growth", value: "24.5%", trend: "+18.2%", icon: TrendingUp },
];

const RECENT_ORDERS = [
  { id: "#ORD-5921", customer: "John Doe", type: "Takeaway", amount: "₦33,500", status: "Pending", time: "10 mins ago" },
  { id: "#ORD-5920", customer: "Table 4", type: "Dine-in", amount: "₦45,000", status: "Cooking", time: "18 mins ago" },
  { id: "#ORD-5919", customer: "Jane Smith", type: "Delivery", amount: "₦21,000", status: "Ready", time: "32 mins ago" },
  { id: "#ORD-5918", customer: "Mike Johnson", type: "Delivery", amount: "₦15,000", status: "Delivered", time: "1 hour ago" },
];

const MENU_ITEMS = [
  { id: "1", name: "Premium Grilled Croaker", category: "Grilled", price: 15000, available: true },
  { id: "2", name: "Spicy Catfish Pepper Soup", category: "Pepper Soup", price: 8500, available: true },
  { id: "3", name: "Crispy Fried Tilapia", category: "Fried", price: 12000, available: true },
  { id: "4", name: "Febniks Special Catfish", category: "Specials", price: 18000, available: false },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center bg-white p-2 text-gray-500 rounded-xl border border-gray-100 shadow-sm w-full md:w-max overflow-x-auto">
        <div className="flex gap-1 whitespace-nowrap">
          <button onClick={() => setActiveTab("overview")} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "overview" ? "bg-gray-100 text-gray-900" : "hover:text-gray-900"}`}>Overview</button>
          <button onClick={() => setActiveTab("orders")} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "orders" ? "bg-gray-100 text-gray-900" : "hover:text-gray-900"}`}>Orders</button>
          <button onClick={() => setActiveTab("menu")} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "menu" ? "bg-gray-100 text-gray-900" : "hover:text-gray-900"}`}>Menu Items</button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-6">Dashboard Overview</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-red-50 text-[var(--color-primary)] rounded-xl">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-gray-500 font-medium text-sm mb-1">{stat.label}</h3>
                <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <button onClick={() => setActiveTab("orders")} className="text-sm font-bold text-[var(--color-primary)] hover:text-red-700">View All</button>
            </div>
            
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-sm">
                    <th className="pb-4 font-semibold px-4">Order ID</th>
                    <th className="pb-4 font-semibold px-4">Customer</th>
                    <th className="pb-4 font-semibold px-4">Type</th>
                    <th className="pb-4 font-semibold px-4">Amount</th>
                    <th className="pb-4 font-semibold px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {RECENT_ORDERS.slice(0, 4).map((order, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-gray-900">{order.id}</td>
                      <td className="py-4 px-4 font-medium text-gray-700">{order.customer}</td>
                      <td className="py-4 px-4 text-gray-500">{order.type}</td>
                      <td className="py-4 px-4 font-bold text-gray-900">{order.amount}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          order.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                          order.status === 'Cooking' ? 'bg-blue-50 text-blue-600' :
                          order.status === 'Ready' ? 'bg-green-50 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "menu" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Menu Management</h2>
            <button className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-md shadow-red-900/20 active:scale-95 w-full sm:w-auto justify-center">
              <Plus className="w-4 h-4" />
              Add New Item
            </button>
          </div>

          <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-sm bg-gray-50/50">
                  <th className="py-4 font-semibold px-4 rounded-tl-xl">Item</th>
                  <th className="py-4 font-semibold px-4">Category</th>
                  <th className="py-4 font-semibold px-4">Price</th>
                  <th className="py-4 font-semibold px-4">Availability</th>
                  <th className="py-4 font-semibold px-4 rounded-tr-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {MENU_ITEMS.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative border border-gray-200">
                        <Image src={"https://images.unsplash.com/photo-1544025162-83b92ee9fbce?q=80&w=800"} alt={item.name} fill className="object-cover" />
                      </div>
                      <span className="line-clamp-1">{item.name}</span>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-500">{item.category}</td>
                    <td className="py-4 px-4 font-bold text-gray-900">₦{item.price.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${item.available ? 'bg-green-500' : 'bg-gray-200'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${item.available ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-500 bg-white shadow-sm border border-gray-100 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2 text-gray-400 hover:text-red-500 bg-white shadow-sm border border-gray-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Orders</h2>
          </div>
          
          <div className="space-y-4">
            {RECENT_ORDERS.map((order, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-5 hover:border-[var(--color-primary)] hover:border-opacity-30 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center bg-gray-50/30 group">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-gray-900 text-lg group-hover:text-[var(--color-primary)] transition-colors">{order.id}</span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      order.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                      order.status === 'Cooking' ? 'bg-blue-50 text-blue-600' :
                      order.status === 'Ready' ? 'bg-green-50 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <span className="text-gray-500 font-medium">{order.customer} <span className="mx-1">•</span> <span className="text-gray-900">{order.type}</span></span>
                  <span className="text-xs text-gray-400 font-medium">{order.time}</span>
                </div>
                
                <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t border-gray-100 sm:border-0">
                  <span className="font-black text-xl text-gray-900">{order.amount}</span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm">Details</button>
                    {order.status === 'Pending' && <button className="flex-1 sm:flex-none px-4 py-2 bg-blue-500 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-md shadow-blue-500/20">Start Cooking</button>}
                    {order.status === 'Cooking' && <button className="flex-1 sm:flex-none px-4 py-2 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-all active:scale-95 shadow-md shadow-green-500/20">Mark Ready</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
