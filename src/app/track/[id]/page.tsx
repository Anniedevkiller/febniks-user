"use client";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, MapPin, ChefHat, CheckCircle2, Bike, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function TrackingPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [currentStep, setCurrentStep] = useState(1); 
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Simulate delivery progress for demo rapidly
  useEffect(() => {
    if (currentStep < 3) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 4000); 
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const STAGES = [
    { label: "Order Placed", desc: "We have received your order", icon: CheckCircle2, status: currentStep > 0 ? "completed" : currentStep === 0 ? "current" : "upcoming" },
    { label: "Cooking", desc: "Your meal is being prepared", icon: ChefHat, status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "upcoming" },
    { label: "On the way", desc: "Rider is heading to you", icon: Bike, status: currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "upcoming" },
    { label: "Delivered", desc: "Enjoy your meal!", icon: MapPin, status: currentStep === 3 ? "completed" : "upcoming" },
  ];

  const submitReview = () => {
    if (rating === 0) return toast.error("Please select a rating first!");
    toast.success("Thank you for your review! 🌟");
    setReviewSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 max-w-3xl py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex justify-between items-center mb-8">
          <Link href="/orders" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[var(--color-primary)] transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <button 
            onClick={() => setCurrentStep(3)}
            className="text-xs font-bold text-gray-400 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            Simulate Delivery
          </button>
        </div>
        
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
                <h2 className="text-3xl font-black text-[var(--color-accent)] drop-shadow-sm">12:45 PM</h2>
              </div>
            </div>
            
            {/* Horizontal Tracker */}
            <div className="relative mt-8 mb-4 px-2 sm:px-4 z-10 h-10 flex items-center">
              <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-gray-800 -translate-y-1/2 rounded-full" />
              <div 
                className="absolute top-1/2 left-4 h-1.5 bg-[var(--color-accent)] -translate-y-1/2 rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(255,183,3,0.5)]" 
                style={{ width: `calc(${(currentStep / 3) * 100}% - 2rem)` }}
              />
              <div className="relative flex justify-between w-full z-10">
                {STAGES.map((stage, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500
                    ${stage.status === 'completed' || stage.status === 'current' ? 'bg-[var(--color-accent)] text-gray-900 shadow-[0_0_20px_rgba(255,183,3,0.3)]' : 
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
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-gray-200 before:via-gray-100 before:to-transparent">
              {STAGES.slice().reverse().map((stage, reverseIndex) => {
                const i = 3 - reverseIndex;
                if (i > currentStep) return null; // Don't show future steps in vertical log

                return (
                  <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active animate-in fade-in slide-in-from-top-4 duration-500`}>
                    
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 bg-white
                      ${stage.status === 'completed' && i < currentStep ? 'border-gray-200 text-gray-400' : 
                        i === currentStep ? 'border-[var(--color-accent)] text-[var(--color-primary)] shadow-[0_0_15px_rgba(255,183,3,0.3)]' : 
                        'border-gray-100 text-gray-300'}`
                    }>
                      <stage.icon className="w-5 h-5" />
                    </div>
                    
                    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl border transition-all duration-300
                      ${i === currentStep ? 'bg-yellow-50/50 border-[var(--color-accent)]/30 shadow-md translate-y-0 scale-100' : 
                        'border-gray-100 bg-white opacity-60'}`}>
                      <h4 className={`font-black tracking-tight text-lg mb-1 text-gray-900`}>{stage.label}</h4>
                      <p className={`text-sm font-medium text-gray-500`}>{stage.desc}</p>
                      {i === currentStep && i !== 3 && (
                        <span className="inline-block mt-3 bg-[var(--color-accent)] text-gray-900 text-xs font-black tracking-widest uppercase px-3 py-1 rounded-md mb-1 animate-pulse">Happening now</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leave a Review Section (Appears only when Delivered) */}
          {currentStep === 3 && (
            <div className="p-8 sm:p-10 bg-gray-50 border-t border-gray-100 animate-in fade-in zoom-in-95 duration-700">
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Order Delivered!</h3>
                <p className="text-gray-500 font-medium mb-8">How was your Febniks Kitchen experience?</p>
                
                {!reviewSubmitted ? (
                  <>
                    <div className="flex justify-center gap-2 mb-8">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform active:scale-90 hover:scale-110"
                        >
                          <Star 
                            className={`w-10 h-10 transition-colors duration-200 ${
                              star <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' : 'text-gray-200'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                    
                    <textarea 
                      placeholder="Leave a comment (optional)..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium outline-none focus:border-[var(--color-primary)] transition-colors mb-6 resize-none"
                      rows={3}
                    />
                    
                    <button 
                      onClick={submitReview}
                      className="w-full bg-gray-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all shadow-md active:scale-[0.98]"
                    >
                      Submit Review
                    </button>
                  </>
                ) : (
                  <div className="p-4 bg-green-50 text-green-700 font-bold rounded-xl border border-green-200">
                    Thank you! Your feedback helps us improve.
                  </div>
                )}
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}
