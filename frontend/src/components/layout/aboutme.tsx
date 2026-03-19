"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { Sparkles } from "lucide-react";

const contactInfo = [
  {
    id: 1,
    name: "LinkedIn",
    designation: "Professional Network",
    image: "/linkedIn.png", 
  },
  {
    id: 2,
    name: "GitHub",
    designation: "Code Repository",
    image: "/githubLogo.webp", 
  },
  {
    id: 3,
    name: "Gmail",
    designation: "Send an Email",
    image: "/gmail.png", 
  },
];

export default function AboutMePage() {
  const yourName = "Harsh Rathi";

  return (
    <section className="relative flex w-full flex-col items-center justify-center bg-zinc-950 px-4 py-16 md:py-24 overflow-hidden selection:bg-teal-500/30" id="about">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="relative w-full max-w-5xl rounded-[2rem] border border-zinc-800/60 bg-zinc-900/40 p-8 md:p-10 shadow-2xl backdrop-blur-md"
      >
        
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 mb-4 text-xs font-semibold text-teal-400 tracking-wider">
            <Sparkles size={14} /> THE FOUNDER
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Meet the mind behind <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Coursy</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          
          <div className="group relative flex w-full md:w-72 flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-white hover:border-white hover:shadow-2xl hover:shadow-teal-500/20 cursor-default">
            
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-zinc-800 transition-colors duration-500 group-hover:border-zinc-200">
              <Image
                src="/HarshImg.png"
                alt={`${yourName} Portrait`}
                fill 
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                priority 
              />
            </div>

            <h3 className="mt-5 text-2xl font-bold text-white transition-colors duration-500 group-hover:text-black">
              {yourName}
            </h3>
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
                I'm a passionate Full Stack Developer and UI/UX enthusiast dedicating to bridging the gap between complexity and effortless usability. My focus is on building robust modern web applications that prioritize user experience and clean code architecture. Coursy was built to solve the fragmentation of modern online learning.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800/50">
              <h4 className="mb-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                {"Let's connect"}
              </h4>
              <div className="flex flex-row items-center justify-start gap-2">
                <a href={`https://www.linkedin.com/in/harsh-rathi-3870012aa/`} target="_blank" rel="noopener noreferrer">
                  <AnimatedTooltip items={[contactInfo[0]]} />
                </a>
                <a href={`https://github.com/harshcodesss/Coursy`} target="_blank" rel="noopener noreferrer">
                  <AnimatedTooltip items={[contactInfo[1]]} />
                </a>
                <a href={`mailto:harshmail123@gamil.com`}>
                  <AnimatedTooltip items={[contactInfo[2]]} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}