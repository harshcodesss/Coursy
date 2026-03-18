"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  BookOpen,
  PlayCircle, // Swapped Play for PlayCircle for a softer look
  ClipboardCheck,
} from "lucide-react";
import LessonCard from "./LessonCard";

export default function ModuleCard({
  module,
  index,
  courseId,
}: {
  module: any;
  index: number;
  courseId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter(); 

  return (
    // Replaced neutral with frosted zinc-900/40 and rounded-2xl to match the Course layout
    <motion.div 
      layout 
      className="mb-4 overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/40 shadow-sm transition-colors hover:border-zinc-700/50"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-zinc-800/40"
      >
        <div className="flex items-center gap-4">
          {/* Elegant circular badge for the module number instead of text */}
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
            {index}
          </div>
          <span className="text-lg font-semibold text-zinc-100">
            {module.title}
          </span>
        </div>
        
        {/* Smoothly rotating chevron (removed the hardcoded text arrows) */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex-shrink-0 text-zinc-500"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            {/* Added a subtle border to separate the header from the content */}
            <div className="border-t border-zinc-800/50 px-5 pb-6 pt-5 space-y-8">
              
              {/* --- Reading Section --- */}
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                  <BookOpen size={16} /> Reading
                </h3>
                {/* Deeper inset background for reading material */}
                <div className="rounded-xl bg-zinc-950/50 p-5 text-sm leading-relaxed text-zinc-300 border border-zinc-800/30">
                  {module.reading}
                </div>
              </section>

              {/* --- Lessons Section --- */}
              <section>
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                  <PlayCircle size={16} /> Lessons
                </h3>
                <div className="space-y-3">
                  {module.lessons?.length ? (
                    module.lessons.map((lesson: any, i: number) => (
                      <LessonCard key={lesson._id || i} lesson={lesson} />
                    ))
                  ) : (
                    <p className="text-sm italic text-zinc-500 pl-1">No lessons available.</p>
                  )}
                </div>
              </section>

              {/* --- Quiz Section --- */}
              <section className="pt-2">
                <button
                  onClick={() =>
                    router.push(`/dashboard/course/${courseId}/quiz?moduleId=${module._id}`)
                  }
                  // Swapped the loud gradient for the crisp white high-contrast button
                  className="flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-white px-6 py-2.5 font-semibold text-black shadow-sm transition-all hover:bg-zinc-200 active:scale-95"
                >
                  <ClipboardCheck size={18} />
                  Start Module Quiz
                </button>
              </section>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}