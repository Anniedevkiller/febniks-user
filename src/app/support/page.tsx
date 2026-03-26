"use client";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, Send, Sparkles, User, Info } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

type Message = { id: string; text: string; sender: "user" | "bot" | "agent"; time: string };

export default function SupportPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: `Hi ${user?.name || 'there'}! I'm the Febniks Assistant. How can I help you today?`, sender: "bot", time: "10:00 AM" }
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), text: input, sender: "user", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInput("");

    // Simulate Agent Reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "Thanks for reaching out! A customer service agent will be with you shortly. Your priority ticket has been created.",
        sender: "agent",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 max-w-4xl py-6 md:py-10 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-100px)] flex flex-col">
        
        <div className="flex items-center justify-between mb-6">
          <Link href="/profile" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[var(--color-primary)] transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Support Online
          </div>
        </div>
        
        <div className="flex-grow bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/5 overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-900 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--color-accent)] rounded-full flex items-center justify-center shadow-inner shrink-0">
                <Sparkles className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Febniks Support</h2>
                <p className="text-xs text-gray-400 font-medium">Usually replies in under 5 minutes</p>
              </div>
            </div>
            <button className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 backdrop-blur-sm border border-white/10">
              <Info className="w-3 h-3" /> FAQs
            </button>
          </div>

          {/* Chat Flow */}
          <div className="flex-grow p-6 overflow-y-auto bg-gray-50/50 space-y-6">
            <div className="text-center text-xs font-bold text-gray-400 tracking-widest uppercase mb-8">Today</div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-auto ${
                    msg.sender === 'user' ? 'bg-gray-200' : 
                    msg.sender === 'bot' ? 'bg-gray-900' : 'bg-[var(--color-primary)]'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4 text-gray-600" /> : <Sparkles className="w-4 h-4 text-white" />}
                  </div>
                  
                  <div>
                    <div className={`p-4 rounded-2xl ${
                      msg.sender === 'user' 
                        ? 'bg-[var(--color-primary)] text-white rounded-br-sm shadow-md' 
                        : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm'
                    }`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    </div>
                    <span className={`text-[10px] font-bold text-gray-400 mt-1 block ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </span>
                  </div>
                  
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..." 
                className="flex-grow bg-gray-50 border border-gray-200 focus:border-[var(--color-primary)] transition-colors rounded-full py-3.5 px-6 text-sm font-medium outline-none"
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="w-12 h-12 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center shrink-0 hover:bg-red-700 transition-all active:scale-90 disabled:opacity-50 disabled:active:scale-100 shadow-sm"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
