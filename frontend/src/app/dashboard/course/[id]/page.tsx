"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
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

export default function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // percentage tracker

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/courses/${id}`,
            {
              credentials: "include",
            }
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

  // Calculate progress from completed lessons later
  useEffect(() => {
    if (!course) return;
    const totalLessons = course.modules.reduce(
      (acc, m) => acc + (m.lessons?.length || 0),
      0
    );
    const completedLessons = 0; // placeholder for now
    setProgress(Math.round((completedLessons / totalLessons) * 100) || 0);
  }, [course]);

  if (loading) return <CourseSkeleton />;

  if (!course)
    return (
      <div className="text-center text-white mt-20">
        Failed to load course.
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 via-green-200 to-cyan-600 bg-clip-text text-transparent">
          {course.title}
        </h1>
        <p className="text-neutral-400 mt-2">by {course.creator?.fullname}</p>

        {/* Progress */}
        <div className="mt-4 w-full bg-neutral-800 rounded-full h-3">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-sm text-neutral-400 mt-1">{progress}% Complete</p>
      </header>

      {/* Learning Objectives */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">🎯 Learning Objectives</h2>
        <p className="text-neutral-300 leading-relaxed bg-neutral-900 p-4 rounded-lg border border-neutral-800">
          {course.introduction.learningObjectives}
        </p>
      </section>

      {/* Syllabus */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">🧾 Syllabus</h2>
        <ul className="space-y-2">
          {course.introduction.syllabus.map((item, i) => (
            <li
              key={i}
              className="flex items-start bg-neutral-900 p-3 rounded-lg border border-neutral-800"
            >
              <span className="text-teal-400 mr-2 mt-1.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Modules */}
      <section>
        <h2 className="text-2xl font-semibold mb-5">📦 Modules</h2>
        {course.modules.length > 0 ? (
          course.modules.map((module, index) => (
            <ModuleCard
              key={module._id || index}
              module={module}
              index={index + 1}
            />
          ))
        ) : (
          <p className="text-neutral-500">No modules available.</p>
        )}
      </section>
    </div>
  );
}
