"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BorderBeam } from "@/components/ui/border-beam";

const FiMail = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const FiArrowLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage(""); 
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset link.");
      }

      setMessage("A password reset link has been sent.");
      setEmail("");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center p-4 font-sans">
      <a href="/login">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-6 left-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-lg transition-colors hover:bg-white/10"
          aria-label="Go back to login"
        >
          <FiArrowLeft />
        </motion.button>
      </a>

      {/* Background Gradient */}
      <div
        aria-hidden="true"
        className="absolute bottom-[-60vh] left-1/2 -translate-x-1/2 w-[220vw] max-w-[1900px] h-[120vh] rounded-full bg-gradient-to-tr from-cyan-400 to-teal-400 opacity-20 blur-3xl"
      />

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-black/20 p-8 shadow-lg backdrop-blur-lg"
      >
        <div className="text-left">
          <h2 className="text-xl font-bold tracking-tight mb-2">Forgot your password?</h2>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Reset with{" "}
            {/* Recreated AuroraText Style */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Coursy
            </span>
          </h1>
          <p className="text-slate-400">Enter your email to receive a reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email Input */}
          <div className="relative">
            <FiMail />
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-slate-700 bg-slate-700/50 py-3 pl-10 pr-4 text-white placeholder-slate-400 transition-colors duration-300 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center -my-2">{error}</p>
          )}
          
          {/* Success Message */}
          {message && (
            <p className="text-green-400 text-sm mb-4 text-center -my-2">{message}</p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-white py-3 font-semibold text-black transition-all duration-200 ease-in-out hover:text-white hover:bg-black disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {loading ? "Sending link..." : "Send Reset Link"}
          </motion.button>
        </form>

        <BorderBeam
          duration={6}
          size={400}
          className="from-transparent via-teal-500 to-transparent"
        />
        <BorderBeam
          duration={6}
          delay={3}
          size={400}
          borderWidth={2}
          className="from-transparent via-cyan-500 to-transparent"
        />
        
      </motion.div>
    </div>
  );
}
