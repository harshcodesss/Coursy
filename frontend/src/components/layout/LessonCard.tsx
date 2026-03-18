"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, X } from "lucide-react";

export default function LessonCard({ lesson }: { lesson: any }) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <motion.div
      layout
      // Subtle background that sits perfectly inside the ModuleCard
      className="overflow-hidden rounded-xl border border-zinc-800/40 bg-zinc-900/40 p-2 transition-colors hover:border-zinc-700/50"
    >
      {/* --- Header Row (Always Visible) --- */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-3">
          {/* Animated icon background based on state */}
          <div
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
              showVideo ? "bg-teal-500/20 text-teal-400" : "bg-zinc-800 text-zinc-500"
            }`}
          >
            <PlayCircle size={16} />
          </div>
          <p className="text-sm font-medium text-zinc-200">{lesson.title}</p>
        </div>

        {/* Minimalist Action Button */}
        <button
          onClick={() => setShowVideo(!showVideo)}
          className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            showVideo
              ? "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
              : "bg-teal-500/10 text-teal-400 hover:bg-teal-500/20"
          }`}
        >
          {showVideo ? (
            <>
              <X size={14} /> Close
            </>
          ) : (
            "Watch"
          )}
        </button>
      </div>

      {/* --- Video Expansion Area --- */}
      <AnimatePresence initial={false}>
        {showVideo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="px-2 pb-2"
          >
            <div className="mt-2 aspect-video w-full overflow-hidden rounded-lg border border-zinc-800/50 bg-black shadow-inner">
              <iframe
                // Added ?autoplay=1 so it starts immediately when the card expands!
                src={`https://www.youtube.com/embed/${lesson.videoId}?autoplay=1`}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}