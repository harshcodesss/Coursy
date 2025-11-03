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
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 255, 255, 0.1)" }}
      className="flex h-full w-full flex-col justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-left transition-all hover:border-teal-500"
    >
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      </div>
      <ArrowRight size={16} className="mt-4 self-end text-slate-500" />
    </motion.button>
  );
};
