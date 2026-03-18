"use client";

import React from "react";
import { motion } from "framer-motion";
import { SendHorizonal, Loader2 } from "lucide-react";

export const PromptBox = ({
  prompt,
  setPrompt,
  isLoading,
  onSubmit,
}: {
  prompt: string;
  setPrompt: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full rounded-2xl border border-slate-700 bg-slate-800/50 p-4 shadow-lg"
    >
      {/* Textarea */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a topic to generate your course (e.g., 'A beginner's guide to React')"
        className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none resize-none pr-20 pb-12"
        rows={3}
        disabled={isLoading}
      />

      {/* Button */}
      <motion.button
        type="submit"
        layout
        disabled={isLoading || !prompt.trim()}
        whileHover={!isLoading ? { scale: 1.05 } : {}}
        whileTap={!isLoading ? { scale: 0.95 } : {}}
        className="absolute bottom-3 right-3 flex h-11 items-center justify-center rounded-xl bg-teal-500 px-3 text-black transition-colors duration-200 hover:bg-teal-400 disabled:bg-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-slate-400"
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        ) : (
          <SendHorizonal size={20} />
        )}
      </motion.button>
    </form>
  );
};
