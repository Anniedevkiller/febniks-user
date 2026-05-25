"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function DeconstructedBurger() {
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
  const topBunY = useTransform(smoothProgress, [0.1, 0.5], [-240, 0]);
  const lettuceY = useTransform(smoothProgress, [0.15, 0.5], [-150, 0]);
  const tomatoY = useTransform(smoothProgress, [0.2, 0.5], [-80, 0]);
  const cheeseY = useTransform(smoothProgress, [0.22, 0.5], [-20, 0]);
  const pattyY = useTransform(smoothProgress, [0.25, 0.5], [60, 0]);
  const bottomBunY = useTransform(smoothProgress, [0.1, 0.5], [180, 0]);

  // Rotations for natural drifting effect
  const topBunRot = useTransform(smoothProgress, [0.1, 0.5], [-12, 0]);
  const lettuceRot = useTransform(smoothProgress, [0.1, 0.5], [8, 0]);
  const tomatoRot = useTransform(smoothProgress, [0.1, 0.5], [-6, 0]);
  const cheeseRot = useTransform(smoothProgress, [0.1, 0.5], [10, 0]);
  const pattyRot = useTransform(smoothProgress, [0.1, 0.5], [-4, 0]);
  const bottomBunRot = useTransform(smoothProgress, [0.1, 0.5], [5, 0]);

  // Scales for breathing room
  const topBunScale = useTransform(smoothProgress, [0.1, 0.5], [0.9, 1]);
  const lettuceScale = useTransform(smoothProgress, [0.1, 0.5], [0.92, 1]);
  const tomatoScale = useTransform(smoothProgress, [0.1, 0.5], [0.95, 1]);
  const cheeseScale = useTransform(smoothProgress, [0.1, 0.5], [0.95, 1]);
  const pattyScale = useTransform(smoothProgress, [0.1, 0.5], [0.92, 1]);
  const bottomBunScale = useTransform(smoothProgress, [0.1, 0.5], [0.9, 1]);

  // Opacities for callout labels (appear when assembled, around 0.45 to 0.95 progress)
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
            <span className="text-[var(--color-primary)]">Gourmet Assembly</span>
          </h2>
          <p className="text-gray-600 font-semibold text-base sm:text-lg leading-relaxed mb-8">
            Scroll down to watch our signature burger parts float together. We stack every layer with absolute precision, farm-fresh ingredients, and hand-crafted smokehouse artistry.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-yellow-400/20 text-yellow-700 flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base">Toasted Brioche</h4>
                <p className="text-xs text-gray-500 font-medium">Artisan sweet brioche buns glazed with butter and sesame seeds.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-green-400/20 text-green-700 flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base">Abuja Smokehouse Patty</h4>
                <p className="text-xs text-gray-500 font-medium">100% premium beef infused with local spices and grilled over red-hot charcoal.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Burger Visualizer */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-[70vh] flex items-center justify-center relative select-none">
          
          {/* Visual assembly stack */}
          <div className="relative flex flex-col items-center justify-center w-full max-w-[320px] h-[400px]">
            
            {/* 1. TOP BUN */}
            <motion.div
              style={{ y: topBunY, rotate: topBunRot, scale: topBunScale }}
              className="absolute z-30"
            >
              <svg viewBox="0 0 300 120" fill="none" className="w-56 sm:w-64 h-auto drop-shadow-xl">
                <path d="M10 90 C10 40, 50 10, 150 10 C250 10, 290 40, 290 90 C290 100, 280 105, 150 105 C20 105, 10 100, 10 90 Z" fill="url(#bunGrad)" />
                <ellipse cx="80" cy="50" rx="3.5" ry="1.8" fill="#FFEAA7" transform="rotate(-15 80 50)" />
                <ellipse cx="120" cy="40" rx="3.5" ry="1.8" fill="#FFEAA7" transform="rotate(10 120 40)" />
                <ellipse cx="150" cy="35" rx="3.5" ry="1.8" fill="#FFEAA7" transform="rotate(-5 150 35)" />
                <ellipse cx="180" cy="45" rx="3.5" ry="1.8" fill="#FFEAA7" transform="rotate(20 180 45)" />
                <ellipse cx="220" cy="60" rx="3.5" ry="1.8" fill="#FFEAA7" transform="rotate(-10 220 60)" />
                <ellipse cx="100" cy="70" rx="3.5" ry="1.8" fill="#FFEAA7" transform="rotate(5 100 70)" />
                <ellipse cx="160" cy="65" rx="3.5" ry="1.8" fill="#FFEAA7" transform="rotate(-15 160 65)" />
                <ellipse cx="200" cy="75" rx="3.5" ry="1.8" fill="#FFEAA7" transform="rotate(15 200 75)" />
              </svg>
            </motion.div>

            {/* TOP BUN CALLOUT */}
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
                <span className="block text-[9px] font-black text-amber-600 uppercase tracking-widest leading-none">Bun</span>
                <span className="text-xs font-bold text-gray-800">Glazed Brioche</span>
              </div>
            </motion.div>


            {/* 2. LETTUCE */}
            <motion.div
              style={{ y: lettuceY, rotate: lettuceRot, scale: lettuceScale }}
              className="absolute top-[75px] z-20"
            >
              <svg viewBox="0 0 320 60" fill="none" className="w-[15rem] sm:w-[17rem] h-auto drop-shadow-md">
                <path d="M10 30 C15 15, 30 10, 45 25 C60 40, 75 15, 90 25 C105 35, 120 10, 135 20 C150 30, 165 15, 180 25 C195 35, 210 10, 225 20 C240 30, 255 15, 270 25 C285 35, 300 20, 310 30 C320 40, 305 50, 290 45 C275 40, 260 55, 245 45 C230 35, 215 50, 200 45 C185 40, 170 55, 155 45 C140 35, 125 50, 110 45 C95 40, 80 55, 65 45 C50 35, 35 50, 20 45 C5 40, 0 35, 10 30 Z" fill="url(#lettuceGrad)" />
              </svg>
            </motion.div>

            {/* LETTUCE CALLOUT */}
            <motion.div 
              style={{ opacity: labelOpacity }}
              className="absolute top-16 -left-28 z-40 hidden sm:flex items-center gap-3"
            >
              <div className="bg-white px-3 py-1.5 rounded-xl shadow-md border border-gray-100 text-right">
                <span className="block text-[9px] font-black text-green-600 uppercase tracking-widest leading-none">Greenery</span>
                <span className="text-xs font-bold text-gray-800">Crisp Lettuce</span>
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


            {/* 3. TOMATO */}
            <motion.div
              style={{ y: tomatoY, rotate: tomatoRot, scale: tomatoScale }}
              className="absolute top-[105px] z-10"
            >
              <svg viewBox="0 0 300 50" fill="none" className="w-[14rem] sm:w-[16rem] h-auto drop-shadow-md">
                <ellipse cx="90" cy="25" rx="60" ry="18" fill="url(#tomatoGrad)" />
                <ellipse cx="90" cy="25" rx="42" ry="10" fill="#FF7675" stroke="#D63031" strokeWidth="2" />
                <circle cx="75" cy="23" r="4.5" fill="#FFEAA7" opacity="0.8" />
                <circle cx="105" cy="27" r="4.5" fill="#FFEAA7" opacity="0.8" />
                
                <ellipse cx="210" cy="25" rx="60" ry="18" fill="url(#tomatoGrad)" />
                <ellipse cx="210" cy="25" rx="42" ry="10" fill="#FF7675" stroke="#D63031" strokeWidth="2" />
                <circle cx="195" cy="23" r="4.5" fill="#FFEAA7" opacity="0.8" />
                <circle cx="225" cy="27" r="4.5" fill="#FFEAA7" opacity="0.8" />
              </svg>
            </motion.div>


            {/* 4. CHEESE */}
            <motion.div
              style={{ y: cheeseY, rotate: cheeseRot, scale: cheeseScale }}
              className="absolute top-[125px] z-20"
            >
              <svg viewBox="0 0 300 60" fill="none" className="w-[14.5rem] sm:w-[16.5rem] h-auto drop-shadow-md">
                <path d="M15 15 L285 5 L270 45 C250 55, 230 40, 210 50 C180 60, 150 45, 120 55 C90 45, 60 50, 40 40 Z" fill="url(#cheeseGrad)" />
              </svg>
            </motion.div>


            {/* 5. PATTY */}
            <motion.div
              style={{ y: pattyY, rotate: pattyRot, scale: pattyScale }}
              className="absolute top-[145px] z-10"
            >
              <svg viewBox="0 0 300 80" fill="none" className="w-[15rem] sm:w-[17rem] h-auto drop-shadow-2xl">
                <path d="M10 40 C10 15, 40 10, 150 10 C260 10, 290 15, 290 40 C290 65, 260 70, 150 70 C40 70, 10 65, 10 40 Z" fill="url(#pattyGrad)" />
                <path d="M60 25 L80 55 M100 20 L120 60 M140 20 L160 60 M180 20 L200 60 M220 20 L240 55" stroke="#2D3436" strokeWidth="4.5" strokeLinecap="round" opacity="0.7" />
              </svg>
            </motion.div>

            {/* PATTY CALLOUT */}
            <motion.div 
              style={{ opacity: labelOpacity }}
              className="absolute top-[170px] -right-28 z-40 hidden sm:flex items-center gap-3"
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
                <span className="block text-[9px] font-black text-red-600 uppercase tracking-widest leading-none">Core</span>
                <span className="text-xs font-bold text-gray-800">Smoked Patty</span>
              </div>
            </motion.div>


            {/* 6. BOTTOM BUN */}
            <motion.div
              style={{ y: bottomBunY, rotate: bottomBunRot, scale: bottomBunScale }}
              className="absolute top-[205px] z-0"
            >
              <svg viewBox="0 0 300 80" fill="none" className="w-56 sm:w-64 h-auto drop-shadow-xl">
                <path d="M10 10 C10 10, 30 5, 150 5 C270 5, 290 10, 290 10 C290 35, 260 75, 150 75 C40 75, 10 35, 10 10 Z" fill="url(#bottomBunGrad)" />
              </svg>
            </motion.div>

            {/* Shared Definitions */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <linearGradient id="bunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F5B041" />
                  <stop offset="100%" stopColor="#C39BD3" />
                  {/* Overwrite for premium brown bread color */}
                  <stop offset="0%" stopColor="#DF8A25" />
                  <stop offset="100%" stopColor="#8E4F00" />
                </linearGradient>
                <linearGradient id="bottomBunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#DF8A25" />
                  <stop offset="100%" stopColor="#784200" />
                </linearGradient>
                <linearGradient id="lettuceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#58D68D" />
                  <stop offset="100%" stopColor="#28B463" />
                </linearGradient>
                <linearGradient id="tomatoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#EC7063" />
                  <stop offset="100%" stopColor="#CB4335" />
                </linearGradient>
                <linearGradient id="cheeseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F8C471" />
                  <stop offset="100%" stopColor="#F39C12" />
                </linearGradient>
                <linearGradient id="pattyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6E2C00" />
                  <stop offset="100%" stopColor="#4A1E00" />
                </linearGradient>
              </defs>
            </svg>

          </div>

        </div>

      </div>
    </section>
  );
}
