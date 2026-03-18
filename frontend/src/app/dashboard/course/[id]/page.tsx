"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { Target, List, Layers, User, BookOpen } from "lucide-react";
import CourseSkeleton from "@/components/layout/CourseSkeleton";
import ModuleCard from "@/components/layout/ModuleCard";

interface Course {
  _id: string;
  title: string;
  creator: { fullname: string };
  introduction: {
    learningObjectives: string;
    syllabus: string[];
  };
  modules: any[];
}

const containerVariants : Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants : Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function CoursePage() {
  const params = useParams();
  const id = params.id as string; 
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/courses/${id}`,
            { credentials: "include" }
          );
          const data = await res.json();
          
          if (res.ok) {
            setCourse(data.data);
          } else {
            console.error(data.message);
          }
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (!course) return;
    const totalLessons = course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
    const completedLessons = 0; 
    setProgress(Math.round((completedLessons / totalLessons) * 100) || 0);
  }, [course]);

  if (loading) return <CourseSkeleton />;

  if (!course)
    return (
      <div className="flex h-full items-center justify-center text-zinc-400">
        Failed to load course.
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 md:px-8 md:py-12">
      <motion.div 
        className="mx-auto max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >

        <motion.header variants={itemVariants} className="mb-12">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-500">
            <BookOpen size={14} />
            Course Overview
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 md:text-5xl lg:text-6xl">
            {course.title}
          </h1>
          
          <div className="mt-4 flex items-center gap-2 text-zinc-400">
            <User size={16} />
            <span>
              Created by <span className="font-medium text-zinc-200">Coursy</span>
            </span>
          </div>

          {/* <div className="mt-8 flex items-center gap-4">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800/50">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              />
            </div>
            <span className="text-sm font-medium text-zinc-400">{progress}%</span>
          </div> */}
        </motion.header>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          
          <motion.section variants={itemVariants} className="md:col-span-2 flex flex-col rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-zinc-800/50 pb-4">
              <Target size={20} className="text-zinc-500" />
              <h2 className="text-lg font-semibold text-zinc-100">Learning Objectives</h2>
            </div>
            <p className="text-base leading-relaxed text-zinc-300">
              {course.introduction.learningObjectives}
            </p>
          </motion.section>

          <motion.section variants={itemVariants} className="md:col-span-1 flex flex-col rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-zinc-800/50 pb-4">
              <List size={20} className="text-zinc-500" />
              <h2 className="text-lg font-semibold text-zinc-100">Syllabus</h2>
            </div>
            <ul className="space-y-3">
              {course.introduction.syllabus.map((item, i) => (
                <li key={i} className="flex items-start text-sm text-zinc-300">
                  <span className="mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        </div>

        <motion.section variants={itemVariants}>
          <div className="mb-6 flex items-center gap-2">
            <Layers size={24} className="text-zinc-500" />
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Course Modules</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            {course.modules.length > 0 ? (
              course.modules.map((module, index) => (
                <ModuleCard
                  key={module._id || index}
                  module={module}
                  index={index + 1}
                  courseId={id}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
                No modules available yet.
              </div>
            )}
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}