"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NoiseBackground } from "@/components/ui/noise-background";

export default function CTA() {
  return (
    <section
      className="relative flex w-full flex-col items-center justify-center px-4 py-32 md:py-48 overflow-hidden text-center"
      id="cta"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 flex max-w-3xl flex-col items-center"
      >
        {/* 1. The Heading */}
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          Stop Planning. Start Creating. <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Generate Your Course Now.
          </span>
        </h2>

        {/* 2. The Subheading */}
        <p className="mt-6 text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl">
          Quit the tedious planning and fragmented tools. Let Coursy AI handle
          the architecture, so you can focus on the teaching.
        </p>

        {/* 3. The New Button UI (Theme Aligned) */}
        <motion.div 
          className="mt-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NoiseBackground
            containerClassName="w-fit p-[2px] rounded-full mx-auto"
            // Changed from pink/orange to Coursy's exact brand gradient
            gradientColors={[
              "rgb(45, 212, 191)", // teal-400
              "rgb(34, 211, 238)", // cyan-400
              "rgb(59, 130, 246)", // blue-500
            ]}
          >
            <button className="group relative flex items-center gap-2 h-full w-full cursor-pointer rounded-full bg-zinc-950 px-8 py-4 text-white text-lg font-semibold transition-colors duration-300 hover:bg-zinc-900 shadow-[0px_1px_0px_0px_var(--color-neutral-800)_inset]" 
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/login';
              }}>
              Start Creating
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </NoiseBackground>
        </motion.div>
      </motion.div>
    </section>
  );
}