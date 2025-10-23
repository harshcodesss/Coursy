"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { BorderBeam } from "@/components/ui/border-beam";
import { AuroraText } from "@/components/ui/aurora-text";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Recommended: Loading state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Set loading to true

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      const verificationToken = data.data;

      if(!verificationToken){
        throw new Error("Verification token not found");
      }

      router.push(`/verify?token=${verificationToken}`);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center p-4">
      <Link href="/" passHref>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-6 left-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-lg transition-colors hover:bg-white/10"
          aria-label="Go back to homepage"
        >
          <FiArrowLeft size={20} />
        </motion.button>
      </Link>

      <div
        aria-hidden="true"
        className="absolute bottom-[-60vh] left-1/2 -translate-x-1/2 w-[220vw] max-w-[1900px] h-[120vh] rounded-full bg-gradient-to-tr from-cyan-400 to-teal-400 opacity-20 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-black/20 p-8 shadow-lg backdrop-blur-lg"
      >
        <div className="text-left">
          <h2 className="text-xl font-bold tracking-tight mb-2">Create an account</h2>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Welcome to <AuroraText>Coursy</AuroraText>
          </h1>
          <p className="text-slate-400">Join us and start your journey today.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="fullname"      // CORRECTED: Added name attribute
              value={form.fullname} // CORRECTED: Added value attribute
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full rounded-md border border-slate-700 bg-slate-700/50 py-3 pl-10 pr-4 text-white placeholder-slate-400 transition-colors duration-300 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>

          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              name="email"         // CORRECTED: Added name attribute
              value={form.email}    // CORRECTED: Added value attribute
              placeholder="Email address"
              onChange={handleChange}
              className="w-full rounded-md border border-slate-700 bg-slate-700/50 py-3 pl-10 pr-4 text-white placeholder-slate-400 transition-colors duration-300 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              name="password"      // CORRECTED: Added name attribute
              value={form.password} // CORRECTED: Added value attribute
              placeholder="Password"
              onChange={handleChange}
              className="w-full rounded-md border border-slate-700 bg-slate-700/50 py-3 pl-10 pr-4 text-white placeholder-slate-400 transition-colors duration-300 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>
          
          {/* CORRECTED: Displaying the error message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading} // Recommended: Disable button when loading
            className="w-full rounded-md bg-white py-3 font-semibold text-black transition-all duration-200 ease-in-out hover:text-white hover:bg-black disabled:bg-slate-600"
          >
            {loading ? "Signing up..." : "Sign up"}
          </motion.button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px w-full bg-slate-700"></div>
          <span className="text-sm text-slate-400">OR</span>
          <div className="h-px w-full bg-slate-700"></div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-700 bg-slate-800 py-3 font-semibold text-white transition-all duration-300 hover:border-slate-500 hover:bg-slate-700"
        >
          <FcGoogle size={22} />
          Sign up with Google
        </motion.button>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{" "}
          {/* CORRECTED: Replaced <a> with <Link> */}
          <Link href="/login" className="font-semibold text-teal-400 hover:underline">
            Log in
          </Link>
        </p>

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