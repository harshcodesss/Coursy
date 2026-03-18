"use client";

import React from "react";
import { motion } from "framer-motion";
import { SendHorizonal } from "lucide-react";

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
  let buttonStyle = "bg-zinc-800/50 text-zinc-600 cursor-not-allowed";
  if (isLoading) {
    buttonStyle = "bg-white cursor-not-allowed";
  } else if (prompt.trim()) {
    buttonStyle = "bg-white text-zinc-900 hover:bg-zinc-200 cursor-pointer";
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full rounded-2xl border border-zinc-700/80 bg-zinc-800/40 p-4 shadow-lg transition-all duration-300 focus-within:border-zinc-500 focus-within:bg-zinc-800/60"
    >
      {/* Textarea */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a topic to generate your course (e.g., 'A beginner's guide to React')"
        disabled={isLoading}
        className="h-12 w-full resize-none overflow-y-auto bg-transparent pb-12 pr-14 text-zinc-100 placeholder-zinc-500 focus:outline-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-600"
      />

      {/* Button */}
      <motion.button
        type="submit"
        layout
        disabled={isLoading || !prompt.trim()}
        whileHover={!isLoading && prompt.trim() ? { scale: 1.05 } : {}}
        whileTap={!isLoading && prompt.trim() ? { scale: 0.95 } : {}}
        className={`absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition-all duration-200 ${buttonStyle}`}
      >
        {isLoading ? (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-zinc-900" 
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