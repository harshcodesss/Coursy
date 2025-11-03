"use client";

import React, { useState } from "react";
import { 
  Menu, 
  Plus, 
  MessageSquare, 
  Settings, // Added Settings
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  courses?: string[];
  onNewChat?: () => void;
  onCourseSelect?: (course: string) => void;
}

// Mock user data
const user = {
  name: "Harsh Rathi",
  avatar: "https://placehold.co/36x36/000000/FFFFFF?text=H" // Placeholder
};

export default function Sidebar({
  courses = ["DSA in C++", "Web Development", "Machine Learning"],
  onNewChat,
  onCourseSelect,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCourses, setShowCourses] = useState(true);

  // Animation variants for text
  const textVariants = {
    visible: { opacity: 1, x: 0, display: 'inline-block', transition: { delay: 0.1 } },
    hidden: { opacity: 0, x: -10, display: 'none' },
  };

  const getAnimateState = () => (isExpanded ? "visible" : "hidden");

  return (
    <div
      className={`relative h-screen flex flex-col bg-black text-neutral-200 transition-all duration-300 ease-in-out border-r border-neutral-800 ${
        isExpanded ? "w-64" : "w-20" // w-20 is the Gemini collapsed width
      }`}
    >
      {/* --- Top Section: Toggle & New Course --- */}
      <div className="flex-shrink-0 p-4 space-y-4">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-300 transition-colors"
          title={isExpanded ? "Collapse" : "Expand"}
        >
          <Menu size={20} />
        </button>

        {/* New Course Button */}
        <button
          onClick={onNewChat}
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

      {/* --- Middle Section: Courses (Disappears when collapsed) --- */}
      <nav className="flex-1 mt-4 px-3 overflow-y-auto">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col"
            >
              {/* "Courses" toggle */}
              <button
                onClick={() => setShowCourses(!showCourses)}
                className="flex items-center justify-between w-full p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <motion.span 
                  variants={textVariants}
                  animate={getAnimateState()}
                  className="whitespace-nowrap font-medium text-neutral-400"
                >
                  Courses
                </motion.span>
                <motion.div
                  variants={textVariants}
                  animate={getAnimateState()}
                >
                  {showCourses ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </motion.div>
              </button>
              
              {/* Course List */}
              <AnimatePresence>
                {showCourses && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {courses.length > 0 ? (
                      courses.map((course, index) => (
                        <button
                          key={index}
                          onClick={() => onCourseSelect?.(course)}
                          className="w-full flex items-center gap-3 p-2 pl-4 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg text-left transition-colors"
                          title={course}
                        >
                          <MessageSquare size={16} className="flex-shrink-0" />
                          <span className="truncate whitespace-nowrap text-sm">
                            {course}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-sm text-neutral-500">
                        No courses yet
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- Bottom Section: User & Settings --- */}
      <div className="flex-shrink-0 p-4 border-t border-neutral-800 space-y-3">
        {/* Settings Button */}
        <a
          href="#"
          className={`flex items-center gap-3 p-3 hover:bg-neutral-800 rounded-lg text-neutral-300 transition-colors
            ${!isExpanded && "justify-center"}
          `}
          title="Settings"
        >
          <Settings size={20} className="flex-shrink-0" />
          <motion.span 
            variants={textVariants}
            animate={getAnimateState()}
            className="whitespace-nowrap"
          >
            Settings
          </motion.span>
        </a>

        {/* User Button */}
        <a
          href="#"
          className={`flex items-center gap-3 p-2 hover:bg-neutral-800 rounded-lg
            ${!isExpanded && "justify-center"}
          `}
          title={user.name}
        >
          <img 
            src={user.avatar}
            alt="User avatar" 
            className="rounded-full flex-shrink-0"
            style={{ width: 28, height: 28 }} // Consistent size
          />
          <motion.span 
            variants={textVariants}
            animate={getAnimateState()}
            className="whitespace-nowrap font-semibold truncate text-sm"
          >
            {user.name}
          </motion.span>
        </a>
      </div>
    </div>
  );
}

