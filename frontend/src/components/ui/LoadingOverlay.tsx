"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoadingOverlay({ message = "Generating your course..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="mx-auto mb-6 text-teal-400"
        >
          <Loader2 size={48} />
        </motion.div>
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-teal-400 via-green-200 to-cyan-600 bg-clip-text text-transparent">
          {message}
        </h2>
        <p className="text-neutral-400 mt-2 text-sm">
          This might take a few seconds...
        </p>
      </motion.div>
    </div>
  );
}
