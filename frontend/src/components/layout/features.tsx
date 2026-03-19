"use client";

import React, { useState } from "react";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { motion, AnimatePresence } from "framer-motion";

// --- Magic UI Imports ---
import { Tree } from "@/components/ui/file-tree";
import type { TreeViewElement } from "@/components/ui/file-tree";

// ==========================================
// 1. INTERACTIVE VISUAL COMPONENTS
// ==========================================

const CourseCreationVisual = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-[#0a0a0a] p-6">
      <div className="flex w-full flex-col gap-4">
        {[
          { w: "w-3/4", delay: 0 },
          { w: "w-full", delay: 0.4 },
          { w: "w-5/6", delay: 0.8 },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: item.delay,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "backOut",
            }}
            className="flex h-12 w-full items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/80 px-4"
          >
            <div className="h-5 w-5 rounded bg-zinc-700" />
            <div className={`h-2.5 rounded-full bg-zinc-600 ${item.w}`} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const QuizEngineVisual = () => {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[#0a0a0a] p-6">
      <motion.div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
        <div className="mb-5 flex gap-3">
          <div className="h-4 w-4 rounded-full bg-teal-500/30" />
          <div className="h-4 w-2/3 rounded-full bg-zinc-700" />
        </div>
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={
                i === 1
                  ? {
                      backgroundColor: ["rgba(39, 39, 42, 0.8)", "rgba(20, 184, 166, 0.15)", "rgba(39, 39, 42, 0.8)"],
                      borderColor: ["rgba(63, 63, 70, 1)", "rgba(20, 184, 166, 0.5)", "rgba(63, 63, 70, 1)"],
                    }
                  : {}
              }
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-10 w-full items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900 px-3"
            >
              <motion.div 
                animate={
                  i === 1 
                    ? { backgroundColor: ["rgba(63, 63, 70, 1)", "rgba(20, 184, 166, 1)", "rgba(63, 63, 70, 1)"] } 
                    : {}
                }
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="h-3 w-3 rounded-full border border-zinc-500 bg-transparent" 
              />
              <div className="h-2 w-1/2 rounded-full bg-zinc-600" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const ELEMENTS: TreeViewElement[] = [
  {
    id: "src",
    type: "folder",
    isSelectable: true,
    name: "Course Root",
    children: [
      {
        id: "module-1",
        type: "folder",
        isSelectable: true,
        name: "Module 1: Basics",
        children: [
          { id: "reading", isSelectable: true, name: "Reading Material" },
          { id: "video", isSelectable: true, name: "Video Lesson" },
        ],
      },
      {
        id: "module-2",
        type: "folder",
        isSelectable: true,
        name: "Module 2: Advanced",
        children: [
          { id: "quiz", isSelectable: true, name: "Interactive Quiz" },
        ],
      },
    ],
  },
];

const FileTreeVisual = () => (
  <div className="relative flex h-full w-full items-start justify-start bg-[#0a0a0a] p-4 overflow-hidden">
    <Tree
      className="h-full w-full bg-transparent overflow-y-auto text-sm text-zinc-300 [&_svg]:text-zinc-400"
      initialSelectedId="module-1"
      initialExpandedItems={["src", "module-1"]}
      elements={ELEMENTS}
    />
  </div>
);

// ==========================================
// 2. FEATURE CARD (RESTORED TO YOUR ORIGINAL LAYOUT)

interface FeatureCardProps {
  title: string;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
  visual: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  isExpanded,
  onToggle,
  visual,
}) => {
  return (
    <motion.div
      layout
      transition={{ duration: 0.3, ease: "easeInOut" }}
      // Dynamic background and border based on isExpanded state
      className={`relative flex w-full flex-col justify-start overflow-hidden rounded-2xl border p-6 text-left shadow-lg transition-colors duration-300 ${
        isExpanded
          ? "border-zinc-200 bg-white"
          : "border-zinc-800 bg-zinc-900/40"
      }`}
    >
      {/* Inner frame stays permanently dark to protect the visuals */}
      <motion.div 
        layout="position" 
        className="mb-6 h-64 w-full overflow-hidden rounded-lg bg-black border border-zinc-800/50"
      >
        {visual}
      </motion.div>

      <motion.div layout="position" className="flex w-full items-center justify-between">
        {/* Dynamic text color for the title */}
        <h3 
          className={`text-[18px] font-semibold transition-colors duration-300 ${
            isExpanded ? "text-black" : "text-white"
          }`}
        >
          {title}
        </h3>
        
        {/* Dynamic colors for the toggle button */}
        <button
          onClick={onToggle}
          aria-expanded={isExpanded}
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border text-xl font-light transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none ${
            isExpanded 
              ? "border-black bg-black text-white hover:bg-zinc-800" 
              : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
          }`}
        >
          <motion.div
            key={isExpanded ? "minus" : "plus"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? "−" : "+"}
          </motion.div>
        </button>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.p
            key="description"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            // Text turns to a dark gray so it's readable on the new white background
            className="text-left text-sm text-zinc-600"
          >
            {description}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ==========================================
// 3. PARENT FEATURES SECTION
// ==========================================

export default function Features() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const featuresData = [
    {
      title: "Seamless Course Creation",
      description:
        "Build and customize your course in minutes with an intuitive editor making content creation smooth and hassle-free.",
      visual: <CourseCreationVisual />,
    },
    {
      title: "Smart Quizzing Engine",
      description:
        "Automatically generate quizzes and assessments tailored to each course’s content helping learners test understanding instantly.",
      visual: <QuizEngineVisual />,
    },
    {
      title: "One-Click Organization",
      description:
        "Manage lessons, media, and course structure with a single click simplifying teaching and content updates effortlessly.",
      visual: <FileTreeVisual />,
    },
  ];

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="relative flex w-full flex-col items-center justify-center px-4 py-24 text-center md:py-32 bg-zinc-950 text-white" id="features">
      <motion.div
        className="relative mx-4 mb-3 flex flex-col items-center justify-center gap-3 sm:flex-row"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <LayoutTextFlip 
          text="Coursy Provides " 
          words={["Automation", "Simplicity", "Intelligence", "Structure"]} 
          // className="text-3xl md:text-5xl font-bold"
        />
      </motion.div>

      <p className="mt-2 max-w-2xl text-sm md:text-base text-zinc-400 leading-relaxed">
        From AI-powered automation to effortless course design and built-in assessments <br />
        Coursy simplifies creation so you can focus on learning, not structuring.
      </p>

      <div className="mt-20 grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
        {featuresData.map((feature, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              isExpanded={isExpanded}
              onToggle={() => handleToggle(index)}
              visual={feature.visual}
            />
          );
        })}
      </div>
    </section>
  );
}