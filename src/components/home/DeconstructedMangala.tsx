"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function DeconstructedMangala() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of this section relative to viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smooth scroll progress using spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001
  });

  // Map scroll progress to vertical offsets for each ingredient
  // 0.2 to 0.6 is the active assembly phase
  const garnishY = useTransform(smoothProgress, [0.1, 0.5], [-240, 0]);
  const sauceY = useTransform(smoothProgress, [0.15, 0.5], [-140, 0]);
  const fishY = useTransform(smoothProgress, [0.2, 0.5], [-40, 0]);
  const dodoY = useTransform(smoothProgress, [0.25, 0.5], [60, 0]);
  const platterY = useTransform(smoothProgress, [0.1, 0.5], [160, 0]);

  // Rotations for natural drifting effect
  const garnishRot = useTransform(smoothProgress, [0.1, 0.5], [-12, 0]);
  const sauceRot = useTransform(smoothProgress, [0.1, 0.5], [5, 0]);
  const fishRot = useTransform(smoothProgress, [0.1, 0.5], [-8, 0]);
  const dodoRot = useTransform(smoothProgress, [0.1, 0.5], [10, 0]);
  const platterRot = useTransform(smoothProgress, [0.1, 0.5], [4, 0]);

  // Scales for breathing room
  const garnishScale = useTransform(smoothProgress, [0.1, 0.5], [0.88, 1]);
  const sauceScale = useTransform(smoothProgress, [0.1, 0.5], [0.92, 1]);
  const fishScale = useTransform(smoothProgress, [0.1, 0.5], [0.95, 1]);
  const dodoScale = useTransform(smoothProgress, [0.1, 0.5], [0.92, 1]);
  const platterScale = useTransform(smoothProgress, [0.1, 0.5], [0.9, 1]);

  // Opacities for callout labels (appear when assembled, around 0.42 to 0.95 progress)
  const labelOpacity = useTransform(smoothProgress, [0.42, 0.52], [0, 1]);
  const lineLength = useTransform(smoothProgress, [0.42, 0.52], [0, 1]);

  return (
    <section 
      ref={sectionRef} 
      className="relative h-[180vh] w-full bg-[#FCFAF6] border-y border-gray-100"
      id="ingredients-showcase"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col lg:flex-row items-center justify-between overflow-hidden py-16 px-4 sm:px-8 lg:px-16 max-w-[1400px] mx-auto gap-12">
        
        {/* Left Side: Story & Information */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-xl z-20">
          <span className="text-[11px] font-black uppercase tracking-widest text-[var(--color-primary)] bg-red-50 px-4 py-1.5 rounded-full self-start mb-6">
            Ingredient Transparency
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight mb-6">
            Deconstructed <br />
            <span className="text-[var(--color-primary)]">Gourmet Mangala Platter</span>
          </h2>
          <p className="text-gray-600 font-semibold text-base sm:text-lg leading-relaxed mb-8">
            Scroll down to watch our signature smoked Mangala fish dish layers float together. We stack every layer with absolute precision, farm-fresh ingredients, and hand-crafted smokehouse artistry.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-red-100 text-[var(--color-primary)] flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base">Hygienic Smoked Mangala</h4>
                <p className="text-xs text-gray-500 font-medium">Premium dried Mangala fish sourced directly from Abuja smokehouses, steamed to juicy tenderness.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base">Caramelized Dodo</h4>
                <p className="text-xs text-gray-500 font-medium">Ripe, sweet local plantains fried to golden perfection to complement the rich spicy notes.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base">Fresh Abuja Garnish</h4>
                <p className="text-xs text-gray-500 font-medium">Crisp cucumbers and traditional organic spices to refresh the palate.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Platter Visualizer */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-[70vh] flex items-center justify-center relative select-none">
          
          {/* Visual assembly stack */}
          <div className="relative flex flex-col items-center justify-center w-full max-w-[320px] h-[400px]">
            
            {/* 1. FRESH GARNISH LAYER */}
            <motion.div
              style={{ y: garnishY, rotate: garnishRot, scale: garnishScale }}
              className="absolute z-30"
            >
              <svg viewBox="0 0 300 50" fill="none" className="w-[13rem] sm:w-[15rem] h-auto drop-shadow-md">
                {/* Cucumber 1 */}
                <ellipse cx="65" cy="25" rx="32" ry="11" fill="#2ECC71" fillOpacity="0.85" stroke="#27AE60" strokeWidth="2.5" />
                <ellipse cx="65" cy="25" rx="18" ry="5" fill="#E8F8F5" stroke="#2ECC71" strokeWidth="1" strokeDasharray="2 1" />
                <circle cx="60" cy="23" r="1" fill="#1E824C" />
                <circle cx="70" cy="26" r="1" fill="#1E824C" />
                
                {/* Cucumber 2 */}
                <ellipse cx="235" cy="25" rx="32" ry="11" fill="#2ECC71" fillOpacity="0.85" stroke="#27AE60" strokeWidth="2.5" />
                <ellipse cx="235" cy="25" rx="18" ry="5" fill="#E8F8F5" stroke="#2ECC71" strokeWidth="1" strokeDasharray="2 1" />
                <circle cx="230" cy="23" r="1" fill="#1E824C" />
                <circle cx="240" cy="26" r="1" fill="#1E824C" />

                {/* Pepper Ring */}
                <path d="M130 18 C135 15, 165 15, 170 18 C175 22, 170 30, 160 32 C150 34, 140 32, 130 28 C120 24, 125 20, 130 18 Z" fill="#E74C3C" fillOpacity="0.85" stroke="#C0392B" strokeWidth="2" />
                <path d="M135 22 C138 20, 158 20, 162 22 C165 24, 162 28, 155 29 C148 30, 142 29, 138 27 C133 24, 133 22, 135 22 Z" fill="#FCF3CF" opacity="0.6" />
              </svg>
            </motion.div>

            {/* GARNISH CALLOUT */}
            <motion.div 
              style={{ opacity: labelOpacity }}
              className="absolute -top-16 -right-24 z-40 hidden sm:flex items-center gap-3"
            >
              <svg className="w-16 h-8 text-gray-400" fill="none">
                <motion.path 
                  style={{ pathLength: lineLength }}
                  d="M0,32 L30,32 L60,8" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 2"
                />
              </svg>
              <div className="bg-white px-3 py-1.5 rounded-xl shadow-md border border-gray-100 text-left">
                <span className="block text-[9px] font-black text-green-600 uppercase tracking-widest leading-none">Freshness</span>
                <span className="text-xs font-bold text-gray-800">Cucumber & Chili</span>
              </div>
            </motion.div>


            {/* 2. SIGNATURE PEPPER SAUCE DRIZZLE */}
            <motion.div
              style={{ y: sauceY, rotate: sauceRot, scale: sauceScale }}
              className="absolute top-[65px] z-20"
            >
              <svg viewBox="0 0 300 40" fill="none" className="w-[14.5rem] sm:w-[16.5rem] h-auto drop-shadow-sm">
                <path d="M10 20 C40 10, 80 35, 120 15 C160 -5, 200 30, 240 10 C270 -2, 280 22, 290 15 C280 30, 240 35, 200 25 C160 15, 120 38, 80 20 C40 2, 20 25, 10 20 Z" fill="url(#sauceGrad)" />
                <path d="M35 15 C60 10, 100 28, 130 18 C160 8, 190 22, 220 12" stroke="#FF7675" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
              </svg>
            </motion.div>

            {/* SAUCE CALLOUT */}
            <motion.div 
              style={{ opacity: labelOpacity }}
              className="absolute top-16 -left-28 z-40 hidden sm:flex items-center gap-3"
            >
              <div className="bg-white px-3 py-1.5 rounded-xl shadow-md border border-gray-100 text-right">
                <span className="block text-[9px] font-black text-red-600 uppercase tracking-widest leading-none">Drizzle</span>
                <span className="text-xs font-bold text-gray-800">Pepper Sauce</span>
              </div>
              <svg className="w-16 h-8 text-gray-400" fill="none">
                <motion.path 
                  style={{ pathLength: lineLength }}
                  d="M64,32 L34,32 L4,8" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 2"
                />
              </svg>
            </motion.div>


            {/* 3. SMOKED MANGALA FISH FILLET */}
            <motion.div
              style={{ y: fishY, rotate: fishRot, scale: fishScale }}
              className="absolute top-[90px] z-10"
            >
              <svg viewBox="0 0 300 80" fill="none" className="w-[15.5rem] sm:w-[17.5rem] h-auto drop-shadow-2xl">
                {/* Main fish body */}
                <path d="M20 40 C20 15, 50 10, 150 10 C250 10, 280 15, 280 40 C280 65, 250 70, 150 70 C50 70, 20 65, 20 40 Z" fill="url(#mangalaGrad)" />
                {/* Smokehouse Grill Textures */}
                <path d="M50 30 C70 20, 100 20, 120 30 M130 25 C150 15, 180 15, 200 25 M210 30 C230 20, 250 20, 260 30" stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
                <path d="M80 50 C100 45, 130 45, 150 50 M170 50 C190 45, 210 45, 230 50" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
                {/* Grill score marks */}
                <path d="M70 22 L90 58 M110 18 L130 62 M150 18 L170 62 M190 18 L210 62 M230 22 L250 58" stroke="#1A0D00" strokeWidth="4.5" strokeLinecap="round" opacity="0.5" />
              </svg>
            </motion.div>

            {/* MANGALA CALLOUT */}
            <motion.div 
              style={{ opacity: labelOpacity }}
              className="absolute top-[120px] -right-28 z-40 hidden sm:flex items-center gap-3"
            >
              <svg className="w-16 h-8 text-gray-400" fill="none">
                <motion.path 
                  style={{ pathLength: lineLength }}
                  d="M0,8 L30,8 L60,32" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 2"
                />
              </svg>
              <div className="bg-white px-3 py-1.5 rounded-xl shadow-md border border-gray-100 text-left">
                <span className="block text-[9px] font-black text-amber-800 uppercase tracking-widest leading-none">Smoked Fish</span>
                <span className="text-xs font-bold text-gray-800">Abuja Mangala</span>
              </div>
            </motion.div>


            {/* 4. CARAMELIZED PLANTANS (DODO) */}
            <motion.div
              style={{ y: dodoY, rotate: dodoRot, scale: dodoScale }}
              className="absolute top-[145px] z-10"
            >
              <svg viewBox="0 0 300 50" fill="none" className="w-[14rem] sm:w-[16rem] h-auto drop-shadow-md">
                {/* Plantain 1 */}
                <ellipse cx="65" cy="25" rx="35" ry="12" fill="url(#dodoGrad)" transform="rotate(-15 65 25)" />
                <ellipse cx="65" cy="25" rx="28" ry="7" fill="#F4D03F" transform="rotate(-15 65 25)" />
                
                {/* Plantain 2 */}
                <ellipse cx="150" cy="25" rx="35" ry="12" fill="url(#dodoGrad)" transform="rotate(10 150 25)" />
                <ellipse cx="150" cy="25" rx="28" ry="7" fill="#F4D03F" transform="rotate(10 150 25)" />
                
                {/* Plantain 3 */}
                <ellipse cx="235" cy="25" rx="35" ry="12" fill="url(#dodoGrad)" transform="rotate(-5 235 25)" />
                <ellipse cx="235" cy="25" rx="28" ry="7" fill="#F4D03F" transform="rotate(-5 235 25)" />
              </svg>
            </motion.div>


            {/* 5. TRADITIONAL CLAY PLATTER BASE */}
            <motion.div
              style={{ y: platterY, rotate: platterRot, scale: platterScale }}
              className="absolute top-[185px] z-0"
            >
              <svg viewBox="0 0 300 80" fill="none" className="w-56 sm:w-64 h-auto drop-shadow-2xl">
                <path d="M10 10 C10 10, 30 5, 150 5 C270 5, 290 10, 290 10 C290 35, 260 75, 150 75 C40 75, 10 35, 10 10 Z" fill="url(#clayGrad)" />
                <path d="M20 15 C40 10, 150 10, 280 15" stroke="#424242" strokeWidth="2.5" strokeDasharray="4 4" />
              </svg>
            </motion.div>

            {/* Shared Definitions */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <linearGradient id="sauceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E63946" />
                  <stop offset="100%" stopColor="#9B2226" />
                </linearGradient>
                <linearGradient id="mangalaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8A4A1C" />
                  <stop offset="40%" stopColor="#663300" />
                  <stop offset="100%" stopColor="#3E1F00" />
                </linearGradient>
                <linearGradient id="dodoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F39C12" />
                  <stop offset="100%" stopColor="#965A00" />
                </linearGradient>
                <linearGradient id="clayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#5D5C5B" />
                  <stop offset="100%" stopColor="#222221" />
                </linearGradient>
              </defs>
            </svg>

          </div>

        </div>

      </div>
    </section>
  );
}
