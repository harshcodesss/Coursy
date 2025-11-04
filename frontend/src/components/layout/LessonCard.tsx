"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

export default function LessonCard({ lesson }: { lesson: any }) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="bg-neutral-800 p-3 rounded-lg border border-neutral-700">
      <p className="font-medium mb-2">{lesson.title}</p>
      {!showVideo ? (
        <button
          onClick={() => setShowVideo(true)}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-teal-400 to-cyan-600 text-black rounded-md font-semibold hover:opacity-90"
        >
          <PlayCircle size={18} />
          Watch Lesson
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full mt-3 aspect-video"
        >
          <iframe
            src={`https://www.youtube.com/embed/${lesson.videoId}`}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          />
        </motion.div>
      )}
    </div>
  );
}
