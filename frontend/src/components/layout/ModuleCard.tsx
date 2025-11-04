"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, BookOpen, Play, ClipboardCheck } from "lucide-react";
import LessonCard from "./LessonCard";

export default function ModuleCard({ module, index }: { module: any; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-4 border border-neutral-800 rounded-lg bg-neutral-900">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex justify-between items-center w-full p-4 text-left hover:bg-neutral-800 rounded-lg"
      >
        <span className="font-semibold">
          {expanded ? "▼" : "▶"} Module {index}: {module.title}
        </span>
        {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-5 space-y-4"
          >
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
                <BookOpen size={16} /> Reading
              </h3>
              <p className="text-neutral-300 bg-neutral-800 p-3 rounded-lg border border-neutral-700">
                {module.reading}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <Play size={16} /> Lessons
              </h3>
              <div className="space-y-3">
                {module.lessons?.length ? (
                  module.lessons.map((lesson: any, i: number) => (
                    <LessonCard key={lesson._id || i} lesson={lesson} />
                  ))
                ) : (
                  <p className="text-neutral-500 pl-1">No lessons available.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <ClipboardCheck size={16} /> Quiz
              </h3>
              <button className="px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-600 rounded-lg text-black font-semibold hover:opacity-90">
                Start Quiz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
