"use client";

import React, { useState } from "react";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { motion, AnimatePresence } from "framer-motion";

// --- CHILD: The FeatureCard Component ---
// This component is correct and does not need changes.
interface FeatureCardProps {
    title: string;
    description: string;
    isExpanded: boolean;
    onToggle: () => void;
    videoSrc: string;
  }
  

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, isExpanded, onToggle, videoSrc }) => {
  return (
    <motion.div
      layout
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex w-full flex-col justify-start overflow-hidden rounded-2xl border bg-card bg-white p-6 text-left"
    >
      <motion.div layout="position" className="mb-6 h-64 w-full overflow-hidden rounded-lg bg-black">
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </motion.div>

      <motion.div layout="position" className="flex w-full items-center justify-between">
        <h3 className="text-[18px] font-semibold text-black">{title}</h3>
        <button
          onClick={onToggle}
          aria-expanded={isExpanded}
          className="flex h-15 w-15 flex-shrink-0 items-center justify-center rounded-full border bg-background text-xl font-light text-muted-foreground transition-transform duration-300 ease-in-out hover:scale-110 focus:outline-none text-white"
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
            className="text-left text-sm text-muted-foreground"
          >
            {description}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


// --- PARENT: The Main Features Component ---
export default function Features() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const featuresData = [
    {
      title: "Seamless Course Creation",
      description: "Build and customize your course in minutes with an intuitive drag-and-drop editor making content creation smooth and hassle-free.",
      visual: "/feature-1.mp4"
    },
    {
      title: "Smart Quizzing Engine",
      description: "Automatically generate quizzes and assessments tailored to each course’s content helping learners test understanding instantly.",
      visual: "/feature-1.mp4"
    },
    {
      title: "One-Click Organization",
      description: "Manage lessons, media, and course structure with a single click simplifying teaching and content updates effortlessly.",
      visual: "/feature-1.mp4"
    },
  ];

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="relative flex w-full flex-col items-center justify-center px-4 py-24 text-center md:py-32 bg-background text-foreground">
      <motion.div
        className="relative mx-4 mb-3 flex flex-col items-center justify-center gap-3 sm:flex-row"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <LayoutTextFlip text="Coursy Provides " words={["Automation", "Simplicity", "Intelligence", "Structure"]} />
      </motion.div>

      <p className="mt-2 max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
        From AI-powered automation to effortless course design and built-in assessments <br />
        Coursy simplifies creation so you can focus on learning, not structuring.
      </p>

      {/* --- THE FIX IS HERE --- */}
      {/* Added 'md:items-start' to prevent cards in the same row from stretching to the same height */}
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
              videoSrc={feature.visual}
            />
          );
        })}
      </div>
    </section>
  );
}