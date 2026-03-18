"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const ExampleCard = ({ 
  title, 
  description, 
  onSelect 
}: { 
  title: string, 
  description: string, 
  onSelect: () => void 
}) => {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -4 }}
      className="group flex h-full w-full flex-col justify-between rounded-2xl border border-zinc-700/80 bg-zinc-800/40 p-5 text-left transition-colors duration-300 hover:border-white hover:bg-white hover:shadow-xl hover:shadow-white/5"
    >
      <div>
        <h3 className="font-semibold text-zinc-100 transition-colors duration-300 group-hover:text-zinc-900">
          {title}
        </h3>
        
        <p className="mt-2 text-sm text-zinc-400 transition-colors duration-300 group-hover:text-zinc-600">
          {description}
        </p>
      </div>

      <ArrowRight 
        size={18} 
        className="mt-4 self-end text-zinc-500 transition-colors duration-300 group-hover:text-zinc-900" 
      />
    </motion.button>
  );
};