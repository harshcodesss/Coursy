"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Layers, PlayCircle, ClipboardCheck } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Enter Your Prompt",
    description: "Tell Coursy what you want to learn. From broad topics like 'Machine Learning' to niche skills, just type it in.",
    icon: Sparkles,
    align: "left",
  },
  {
    id: 2,
    title: "AI Architect At Work",
    description: "Coursy instantly structures your curriculum, breaking it down into logical modules and generating comprehensive reading materials.",
    icon: Layers,
    align: "right",
  },
  {
    id: 3,
    title: "Interactive Modules",
    description: "Dive into beautifully formatted lessons. Coursy seamlessly integrates the perfect video for every topic.",
    icon: PlayCircle,
    align: "left",
  },
  {
    id: 4,
    title: "Smart Knowledge Checks",
    description: "Solidify your understanding. At the end of every module, take an auto-generated, interactive quiz tailored to exactly what you just learned.",
    icon: ClipboardCheck,
    align: "right",
  },
];

export default function Workflow() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative flex w-full flex-col items-center justify-center bg-zinc-950 px-4 py-12 md:py-16 overflow-hidden" id="workflow">
      
      <div className="mb-20 text-center md:mb-24 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-semibold tracking-wide"
        >
          <Sparkles size={16} /> THE WORKFLOW
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-white md:text-6xl tracking-tight"
        >
          From Prompt to <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Masterclass.
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-6 text-zinc-400 md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Experience the magic of AI-driven education. A seamless, four-step journey that transforms your curiosity into a complete, interactive curriculum.
        </motion.p>
      </div>

      <div className="relative w-full max-w-5xl" ref={containerRef}>
        
        <div className="absolute left-[28px] top-0 bottom-0 w-1 bg-zinc-800 md:left-1/2 md:-translate-x-1/2 rounded-full" />
        
        <motion.div 
          className="absolute left-[28px] top-0 w-1 bg-gradient-to-b from-teal-400 via-cyan-500 to-blue-500 md:left-1/2 md:-translate-x-1/2 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)] origin-top z-0"
          style={{ height: lineHeight }}
        />

        <div className="relative z-10 flex flex-col gap-12 md:gap-24">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 ${
                step.align === "right" ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="hidden md:block md:w-1/2" />

              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2, type: "spring", stiffness: 200 }}
                viewport={{ once: true, margin: "-100px" }}
                className="absolute left-0 md:left-1/2 flex h-14 w-14 -translate-x-0 md:-translate-x-1/2 items-center justify-center rounded-full border-4 border-zinc-950 bg-zinc-900 shadow-[0_0_0_2px_rgba(63,63,70,1)] z-20"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-teal-500/20 blur-md"
                />
                <step.icon size={24} className="text-teal-400 relative z-10" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: step.align === "left" ? -50 : 50, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`ml-20 md:ml-0 md:w-1/2 flex ${
                  step.align === "left" ? "md:pr-16 md:justify-end" : "md:pl-16 md:justify-start"
                }`}
              >
                <div className="w-full max-w-md rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:bg-zinc-800/60 hover:border-zinc-700/80 hover:shadow-2xl hover:shadow-teal-500/20 cursor-default">
                  
                  <div className="mb-4 text-sm font-bold tracking-wider text-teal-500">
                    STEP 0{step.id}
                  </div>
                  
                  <h3 className="mb-3 text-2xl font-bold text-white">
                    {step.title}
                  </h3>
                  
                  <p className="text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                  
                </div>
              </motion.div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}