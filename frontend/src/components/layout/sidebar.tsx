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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/Usercontext";

export default function Sidebar({
  onNewChat,
  onCourseSelect,
  onSuggestedCourseSelect,
}: {
  onNewChat?: () => void;
  onCourseSelect?: (courseId: string) => void;
  onSuggestedCourseSelect?: (course: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCourses, setShowCourses] = useState(true);
  const [showSuggested, setShowSuggested] = useState(true);
  const router = useRouter();

  const { user, loading } = useUser();

  const suggestedCourses = ["AI for Beginners", "React Basics", "Database Systems"];

  const textVariants = {
    visible: {
      opacity: 1,
      x: 0,
      display: "inline-block",
      transition: { delay: 0.1 },
    },
    hidden: { opacity: 0, x: -10, display: "none" },
  };

  const getAnimateState = () => (isExpanded ? "visible" : "hidden");

  const handleSettingsClick = () => router.push("/settings");

  return (
    <div
      className={`relative h-screen flex flex-col bg-black text-neutral-200 transition-all duration-300 ease-in-out border-r border-neutral-800 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* --- Top Section --- */}
      <div className="flex-shrink-0 p-4 space-y-4">
        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-300 transition-colors"
          title={isExpanded ? "Collapse" : "Expand"}
        >
          <Menu size={20} />
        </button>

        {/* New Course Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className={`flex items-center gap-3 p-3 text-black font-semibold rounded-lg transition-all duration-300 ease-in-out
            bg-gradient-to-r from-teal-400 via-green-200 to-cyan-600 hover:opacity-90
            ${isExpanded ? "w-full" : "w-12 justify-center"}
          `}
          title="New Course"
        >
          <Plus size={20} className="flex-shrink-0" />
          <motion.span
            variants={textVariants}
            animate={getAnimateState()}
            className="whitespace-nowrap"
          >
            New Course
          </motion.span>
        </button>

      </div>

      {/* --- Middle Section --- */}
      <nav className="flex-1 mt-4 px-3 overflow-y-auto">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col space-y-3"
            >
              {/* --- User Courses --- */}
              <div>
                <button
                  onClick={() => setShowCourses(!showCourses)}
                  className="flex items-center justify-between w-full p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <motion.span
                    variants={textVariants}
                    animate={getAnimateState()}
                    className="whitespace-nowrap font-medium text-neutral-400"
                  >
                    Your Courses
                  </motion.span>
                  <motion.div variants={textVariants} animate={getAnimateState()}>
                    {showCourses ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </motion.div>
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
                            onClick={() => onCourseSelect?.(course._id)}
                            className="w-full flex items-center gap-3 p-2 pl-4 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg text-left transition-colors"
                            title={course.title}
                          >
                            <MessageSquare size={16} />
                            <span className="truncate whitespace-nowrap text-sm">
                              {course.title}
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="px-4 py-2 text-sm text-neutral-500">No courses yet</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* --- Suggested Courses --- */}
              <div>
                <button
                  onClick={() => setShowSuggested(!showSuggested)}
                  className="flex items-center justify-between w-full p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <motion.span
                    variants={textVariants}
                    animate={getAnimateState()}
                    className="whitespace-nowrap font-medium text-neutral-400"
                  >
                    Suggested Courses
                  </motion.span>
                  <motion.div variants={textVariants} animate={getAnimateState()}>
                    {showSuggested ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </motion.div>
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
                          onClick={() => onSuggestedCourseSelect?.(course)}
                          className="w-full flex items-center gap-3 p-2 pl-4 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg text-left transition-colors"
                          title={course}
                        >
                          <BookOpen size={16} />
                          <span className="truncate whitespace-nowrap text-sm">{course}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- Bottom Section --- */}
      <div className="flex-shrink-0 p-4 border-t border-neutral-800 space-y-3">
        {/* Settings Button */}
        <button
          onClick={handleSettingsClick}
          className={`flex items-center gap-3 p-3 hover:bg-neutral-800 rounded-lg text-neutral-300 transition-colors ${
            !isExpanded && "justify-center"
          }`}
          title="Settings"
        >
          <Settings size={20} />
          <motion.span variants={textVariants} animate={getAnimateState()}>
            Settings
          </motion.span>
        </button>

        {/* User Info */}
        <div
          className={`flex items-center gap-3 p-2 hover:bg-neutral-800 rounded-lg ${
            !isExpanded && "justify-center"
          }`}
          title={user?.fullname || "User"}
        >
          <img
            src={
              user?.avatar?.startsWith("http")
                ? user.avatar
                : user?.avatar || "/avatarLocal.jpg"
            }
            alt="User avatar"
            className="rounded-full flex-shrink-0"
            style={{ width: 28, height: 28 }}
            onError={(e) => {
              console.warn("⚠️ Avatar failed to load, reverting to fallback.");
              e.currentTarget.src = "/avatarLocal.jpg";
            }}
          />
          <motion.span
            variants={textVariants}
            animate={getAnimateState()}
            className="whitespace-nowrap font-semibold truncate text-sm"
          >
            {loading ? "Loading..." : user?.fullname || "Guest"}
          </motion.span>
        </div>
      </div>
    </div>
  );
}
