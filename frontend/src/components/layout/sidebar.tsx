"use client";

import React, { useState } from "react";
import {
  Menu,
  Plus,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronRight,
  BookOpen,
  X,
} from "lucide-react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/Usercontext";

export default function Sidebar({
  isMobileOpen,
  setIsMobileOpen,
}: {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (val: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCourses, setShowCourses] = useState(true);
  const [showSuggested, setShowSuggested] = useState(true);
  const router = useRouter();

  const { user, loading } = useUser();

  const suggestedCourses = ["AI for Beginners", "React Basics", "Database Systems"];

  const textVariants = {
    visible: { opacity: 1, x: 0, display: "block", transition: { delay: 0.1 } },
    hidden: { opacity: 0, x: -10, display: "none", transition: { duration: 0.1 } },
  };

  const getAnimateState = () => (isExpanded || isMobileOpen ? "visible" : "hidden");

  const handleSettingsClick = () => {
    router.push("/settings");
    if (window.innerWidth < 768) setIsMobileOpen?.(false);
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/dashboard/course/${courseId}`);
    if (window.innerWidth < 768) setIsMobileOpen?.(false);
  };

  const isFullyVisible = isExpanded || isMobileOpen;

  // 1. Define a buttery-smooth spring transition for the Magic Move
  const smoothMorphTransition : Transition = {
    type: "spring",
    stiffness: 200,
    damping: 24,
    mass: 0.8,
  };

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}

      <motion.aside
        layout
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col overflow-x-hidden border-r border-zinc-800/50 bg-zinc-950 text-zinc-200 transition-[width,transform] duration-300 ease-in-out md:relative
          ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
          ${isExpanded ? "md:w-64" : "md:w-[72px]"} 
        `}
      >
        {/* --- Top Section --- */}
        <div className="flex-shrink-0 space-y-4 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-100 md:flex"
            >
              <Menu size={20} />
            </button>
            
            <button
              onClick={() => setIsMobileOpen?.(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-100 md:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <AnimatePresence>
            {isFullyVisible && (
              <motion.button
                layoutId="morphing-action-btn"
                transition={smoothMorphTransition} // Applied smooth physics
                onClick={() => {
                  router.push("/dashboard");
                  if (window.innerWidth < 768) setIsMobileOpen?.(false);
                }}
                // 2. Swapped bg-white to bg-zinc-100 for a softer look
                className="flex h-11 w-full items-center gap-3 rounded-xl bg-zinc-100 px-4 font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-200"
              >
                <Plus size={20} className="flex-shrink-0" />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.2 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className="whitespace-nowrap"
                >
                  New Course
                </motion.span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* --- Middle Section --- */}
        <nav className="mt-2 flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800">
          <AnimatePresence mode="wait">
            {isFullyVisible ? (
              <motion.div
                key="expanded-nav"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.15 } }}
                exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
                className="flex flex-col space-y-3"
              >
                {/* --- Your Courses --- */}
                <div>
                  <button
                    onClick={() => setShowCourses(!showCourses)}
                    className="flex w-full items-center justify-between rounded-lg p-2 transition-colors hover:bg-zinc-800/40"
                  >
                    <span className="whitespace-nowrap text-sm font-semibold text-zinc-400">
                      Your Courses
                    </span>
                    {showCourses ? <ChevronDown size={16} className="text-zinc-500" /> : <ChevronRight size={16} className="text-zinc-500" />}
                  </button>

                  <AnimatePresence>
                    {showCourses && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {user?.courses && user.courses.length > 0 ? (
                          user.courses.map((course) => (
                            <button
                              key={course._id}
                              onClick={() => handleCourseClick(course._id)}
                              className="mt-1 flex w-full items-center gap-3 rounded-lg p-2 pl-4 text-left text-zinc-400 transition-colors hover:bg-zinc-800/40 hover:text-zinc-100"
                            >
                              <MessageSquare size={16} className="flex-shrink-0" />
                              <span className="truncate whitespace-nowrap text-sm">
                                {course.title}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="px-4 py-2 text-xs text-zinc-600">No courses yet</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* --- Suggested Courses --- */}
                <div>
                  <button
                    onClick={() => setShowSuggested(!showSuggested)}
                    className="flex w-full items-center justify-between rounded-lg p-2 transition-colors hover:bg-zinc-800/40"
                  >
                    <span className="whitespace-nowrap text-sm font-semibold text-zinc-400">
                      Suggested
                    </span>
                    {showSuggested ? <ChevronDown size={16} className="text-zinc-500" /> : <ChevronRight size={16} className="text-zinc-500" />}
                  </button>

                  <AnimatePresence>
                    {showSuggested && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {suggestedCourses.map((course, index) => (
                          <button
                            key={index}
                            className="mt-1 flex w-full items-center gap-3 rounded-lg p-2 pl-4 text-left text-zinc-400 transition-colors hover:bg-zinc-800/40 hover:text-zinc-100"
                          >
                            <BookOpen size={16} className="flex-shrink-0" />
                            <span className="truncate whitespace-nowrap text-sm">{course}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-action"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                exit={{ opacity: 0 }}
                // The container is naturally centered via flex
                className="flex h-full w-full items-center justify-center py-4"
              >
                <motion.button
                  layoutId="morphing-action-btn"
                  transition={smoothMorphTransition} // Applied smooth physics
                  onClick={() => setIsExpanded(true)}
                  // 3. Shrunk to h-24 (96px) and matched the softer zinc-100 background
                  className="group flex h-24 w-11 flex-col items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 shadow-sm transition-colors hover:bg-zinc-200"
                  title="Expand Sidebar"
                >
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ChevronRight size={20} />
                  </motion.div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* --- Bottom Section --- */}
        <div className="flex-shrink-0 space-y-2 border-t border-zinc-800/50 p-3">
          <button
            onClick={handleSettingsClick}
            className={`flex items-center gap-3 rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800/40 hover:text-zinc-100
              ${isExpanded ? "w-full p-3" : "h-10 w-10 justify-center p-0 md:mx-auto"}
            `}
            title={!isExpanded ? "Settings" : ""}
          >
            <Settings size={20} className="flex-shrink-0" />
            <motion.span 
              variants={textVariants} 
              animate={getAnimateState()}
              className="whitespace-nowrap"
            >
              Settings
            </motion.span>
          </button>

          <div
            className={`flex items-center gap-3 rounded-lg transition-colors hover:bg-zinc-800/40
              ${isExpanded ? "w-full p-2" : "h-10 w-10 justify-center p-0 md:mx-auto"}
            `}
            title={!isExpanded ? (user?.fullname || "User") : ""}
          >
            <img
              src={user?.avatar?.startsWith("http") ? user.avatar : user?.avatar || "/avatarLocal.jpg"}
              alt="User avatar"
              className="h-8 w-8 flex-shrink-0 rounded-full object-cover ring-1 ring-zinc-700"
              onError={(e) => { e.currentTarget.src = "/avatarLocal.jpg"; }}
            />
            <motion.span
              variants={textVariants}
              animate={getAnimateState()}
              className="truncate whitespace-nowrap text-sm font-semibold text-zinc-200"
            >
              {loading ? "Loading..." : user?.fullname || "Guest"}
            </motion.span>
          </div>
        </div>
      </motion.aside>
    </>
  );
}