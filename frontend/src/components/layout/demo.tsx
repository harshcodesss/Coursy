"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BorderBeam } from "../ui/border-beam";

export default function DemoSection() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Triggers earlier so it hits 100% scale quickly as it enters view
    offset: ["start 90%", "start 25%"], 
  });

  // Scale starts at 0.8 and grows to 1, but we'll keep opacity at 1
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]); 

  return (
    <section 
      ref={containerRef}
      className="relative flex flex-col items-center justify-center bg-zinc-950 pt-10 pb-32 overflow-hidden"
    >
      
      {/* Glowing background aura */}
      <div
        className="absolute top-1/4 w-[80%] max-w-3xl h-[200px] rounded-[100%] 
        bg-gradient-to-r from-teal-500 via-cyan-400 to-blue-500 
        opacity-20 blur-[100px] z-0 pointer-events-none"
      ></div>

      {/* Outer floating box - Opacity removed from style */}
      <motion.div 
        style={{ scale }}
        className="relative flex flex-col w-[90%] max-w-5xl rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-2 md:p-4 z-10 shadow-2xl backdrop-blur-md opacity-100"
      >
        
        {/* Inner box - Mockup Browser Window */}
        <div className="relative flex flex-col w-full overflow-hidden rounded-xl border border-zinc-800 bg-black shadow-inner">
          
          {/* macOS Style Window Header */}
          <div className="flex items-center gap-2 bg-zinc-900/80 px-4 py-3 border-b border-zinc-800">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-zinc-700 hover:bg-red-500 transition-colors"></div>
              <div className="h-3 w-3 rounded-full bg-zinc-700 hover:bg-yellow-500 transition-colors"></div>
              <div className="h-3 w-3 rounded-full bg-zinc-700 hover:bg-green-500 transition-colors"></div>
            </div>
            
            <div className="mx-auto flex h-6 items-center rounded-md bg-zinc-950 px-24 text-xs text-zinc-500 shadow-inner hidden md:flex border border-zinc-800/50">
              coursy.ai/generate
            </div>
            <div className="w-12 hidden md:block"></div> 
          </div>

          <video
            src="/coursy-demo.mp4" 
            poster="/dashboard.png" 
            autoPlay
            loop
            muted
            playsInline 
            className="w-full h-auto object-cover opacity-100 transition-opacity duration-700"
          />
        </div>

        {/* Border beams */}
        <BorderBeam
          duration={8}
          size={400}
          className="from-transparent via-teal-500 to-transparent"
        />
        <BorderBeam
          duration={8}
          delay={4}
          size={400}
          borderWidth={2}
          className="from-transparent via-cyan-500 to-transparent"
        />
      </motion.div>
    </section>
  );
}