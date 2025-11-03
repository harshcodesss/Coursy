"use client";

import React from "react";
import { motion } from "framer-motion";
import { SendHorizonal, Loader2 } from "lucide-react";

export const PromptBox = ({ 
  prompt, 
  setPrompt, 
  isLoading, 
  onSubmit 
}: {
  prompt: string,
  setPrompt: (value: string) => void,
  isLoading: boolean,
  onSubmit: (e: React.FormEvent) => void
}) => {
  return (
    <form 
      onSubmit={onSubmit} 
      className="relative w-full rounded-2xl border border-slate-700 bg-slate-800/50 p-4 shadow-lg"
    >
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a topic to generate your course (e.g., 'A beginner's guide to React')"
        className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none resize-none pr-16"
        rows={3}
        disabled={isLoading}
      />
      <motion.button
        type="submit"
        disabled={isLoading || !prompt}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500 text-black transition-colors duration-200 hover:bg-teal-400 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 size={20} />
          </motion.div>
        ) : (
          <SendHorizonal size={20} />
        )}
      </motion.button>
    </form>
  );
};
