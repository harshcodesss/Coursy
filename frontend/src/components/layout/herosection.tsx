"use client";
import React from "react";
import { motion } from "motion/react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-background text-foreground px-6">
      {/* Animated spotlight background */}
      <Spotlight />

      {/* Foreground content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-50 text-center max-w-3xl"
      >
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          Intelligent AI That <br />{" "}
          <span className="bg-gradient-to-r from-teal-400 via-green-200 to-cyan-600 bg-clip-text text-transparent">
            Builds Courses
          </span>{" "}
          For You
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
          Coursy is a smart course-building platform that creates and structures
          courses for you.
          <br />
          it turns your ideas into personalized learning paths saving time and
          making teaching effortless.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </motion.div>

      {/* Gradient overlay (optional aesthetic touch) */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
    </section>
  );
}
