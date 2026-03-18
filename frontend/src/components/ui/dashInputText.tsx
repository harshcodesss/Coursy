"use client";

import React from "react";
import { motion } from "framer-motion";

export default function WelcomeHeader({ userName }: { userName: string }) {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-zinc-100"
      >
        Hello,{" "}
        <span className="relative whitespace-nowrap">
          <span className="text-white">{userName}</span>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "circOut" }}
            className="absolute -bottom-1.5 left-0 h-[3px] w-full origin-left rounded-full bg-teal-500/80"
          />
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="mt-4 text-center text-lg text-zinc-400 md:text-xl"
      >
        What amazing course will you create today?
      </motion.p>

    </div>
  );
}
