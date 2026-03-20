"use client";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, MapPin, ChefHat, CheckCircle2, Bike } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const STAGES = [
  { label: "Order Placed", desc: "We have received your order", icon: CheckCircle2, status: "completed" },
  { label: "Cooking", desc: "Your meal is being prepared", icon: ChefHat, status: "current" },
  { label: "On the way", desc: "Rider is heading to you", icon: Bike, status: "upcoming" },
  { label: "Delivered", desc: "Enjoy your meal!", icon: MapPin, status: "upcoming" },
];

export default function TrackingPage() {
  const params = useParams();
  const orderId = params.id as string;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 max-w-3xl py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <Link href="/orders" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[var(--color-primary)] transition-colors mb-8 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>
        
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
          
          <div className="bg-gray-900 p-8 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 relative z-10 gap-4">
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1.5 block">Order Tracking</span>
                <h1 className="text-3xl sm:text-4xl font-black">{orderId}</h1>
              </div>
              <div className="sm:text-right bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1 block">Est. Delivery</span>
                <h2 className="text-3xl font-black text-[var(--color-primary)] drop-shadow-sm">12:45 PM</h2>
              </div>
            </div>
            
            <div className="relative mt-12 mb-4 px-2 sm:px-4 z-10">
              <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-800 -translate-y-1/2 rounded-full" />
              <div className="absolute top-1/2 left-0 w-[45%] h-1.5 bg-[var(--color-primary)] -translate-y-1/2 rounded-full shadow-[0_0_10px_rgba(230,57,70,0.5)]" />
              <div className="relative flex justify-between">
                {STAGES.map((stage, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center z-10 
                    ${stage.status === 'completed' ? 'bg-[var(--color-primary)] text-white' : 
                      stage.status === 'current' ? 'bg-[var(--color-primary)] text-white shadow-[0_0_0_6px_rgba(230,57,70,0.2)]' : 
                      'bg-gray-800 text-gray-500 border-2 border-gray-700'}`
                  }>
                    <stage.icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <h3 className="font-black text-2xl text-gray-900 mb-8 tracking-tight">Order Status Updates</h3>
            
            <div className="space-y-10 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-gray-200 before:via-gray-100 before:to-transparent">
              {STAGES.map((stage, i) => (
                <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                  
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 bg-white
                    ${stage.status === 'completed' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 
                      stage.status === 'current' ? 'border-[#0ba4db] text-[#0ba4db] shadow-[0_0_15px_rgba(11,164,219,0.2)]' : 
                      'border-gray-100 text-gray-300'}`
                  }>
                    <stage.icon className="w-5 h-5" />
                  </div>
                  
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl border transition-all duration-300
                    ${stage.status === 'current' ? 'bg-blue-50/50 border-[#0ba4db]/30 shadow-md translate-y-0 scale-100' : 
                      stage.status === 'completed' ? 'border-gray-200 bg-white opacity-90' : 'border-gray-100 bg-gray-50/50 opacity-60'}`}>
                    <h4 className={`font-black tracking-tight text-lg mb-1 ${stage.status === 'upcoming' ? 'text-gray-400' : 'text-gray-900'}`}>{stage.label}</h4>
                    <p className={`text-sm font-medium ${stage.status === 'upcoming' ? 'text-gray-400' : 'text-gray-500'}`}>{stage.desc}</p>
                    {stage.status === 'current' && (
                      <span className="inline-block mt-3 bg-blue-100 text-blue-700 text-xs font-black tracking-widest uppercase px-3 py-1 rounded-md mb-1 animate-pulse">Happening now</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
