"use client";

import React from "react";
import { motion } from "motion/react";
import { LampContainer } from "../ui/lamp";
import { HoverBorderGradient } from "../ui/hover-border-gradient";

export default function CTA() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LampContainer>
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-teal-500 to-cyan-300 py-4 bg-clip-text text-center text-3xl font-bold tracking-tight text-transparent md:text-6xl"
        >
          Meet your AI course assistant <br /> that builds while you teach
        </motion.h1>

        {/* Subheading */}
        <motion.h2
          initial={{ opacity: 0.5, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 text-center text-base md:text-xl text-neutral-400 max-w-2xl leading-relaxed"
        >
          Try Coursy and
          create smarter, not harder.
        </motion.h2>

        {/* Animated Button */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.8,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-10 flex justify-center"
        >
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="dark:bg-black bg-gray/80 text-white/80 dark:text-white flex items-center space-x-2 px-6 py-3 text-lg font-semibold"
          >
            <span>Get Started!</span>
          </HoverBorderGradient>
        </motion.div>
      </LampContainer>
    </div>
  );
}

/* Simple Icon beside text */
const CoursyLogo = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-black dark:text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="10"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
};
