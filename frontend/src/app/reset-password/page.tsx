"use client";

import React, { useState, useEffect } from "react";
import { BorderBeam } from "@/components/ui/border-beam";

const FiArrowLeft = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

// FiLock
const FiLock = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const AuroraText = ({ children }: { children: React.ReactNode }) => (
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
    {children}
  </span>
);

export default function ResetPasswordPage() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    if (!tokenFromUrl) {
      setError("Invalid or missing password reset token.");
      setIsTokenInvalid(true);
      setToken(null);
    } else {
      setError("");
      setIsTokenInvalid(false);
      setToken(tokenFromUrl);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error === "Passwords do not match.") {
      setError("");
    }
  };

  const handlePasswordBlur = () => {
    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      setError("Passwords do not match.");
    } else if (error === "Passwords do not match.") {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (isTokenInvalid || !token) {
      setError(
        "No valid token found. Please use the link from your email again."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/users/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            password: form.password,
            confirmPassword: form.confirmPassword,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to reset password. The link may be invalid or expired."
        );
      }

      setSuccess("Password reset successfully! Redirecting to login...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordErrorClass =
    error === "Passwords do not match."
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-slate-700 focus:border-teal-400 focus:ring-teal-400";

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center p-4">
      {/* Replaced Link with <a> tag */}
      <a
        href="/login"
        className="absolute top-6 left-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-lg transition-colors hover:bg-white/10"
        aria-label="Go back to login"
      >
        <FiArrowLeft size={20} />
      </a>

      {/* Background Gradient */}
      <div
        aria-hidden="true"
        className="absolute bottom-[-60vh] left-1/2 -translate-x-1/2 w-[220vw] max-w-[1900px] h-[120vh] rounded-full bg-gradient-to-tr from-cyan-400 to-teal-400 opacity-20 blur-3xl"
      />

      {/* Removed motion.div */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-black/20 p-8 shadow-lg backdrop-blur-lg">
        <div className="text-left">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            <AuroraText>Reset Password</AuroraText>
          </h1>
          <p className="text-slate-400">Enter your new password below.</p>
        </div>

        {success ? (
          <div className="mt-8 text-center text-lg font-medium text-green-400">
            {success}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="relative">
              <FiLock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="password"
                name="password"
                value={form.password}
                placeholder="New Password"
                onChange={handleChange}
                onBlur={handlePasswordBlur}
                required
                /* --- UPDATED className --- */
                className={`w-full rounded-md bg-slate-700/50 py-3 pl-10 pr-4 text-white placeholder-slate-400 transition-colors duration-300 focus:outline-none focus:ring-1 ${passwordErrorClass}`}
              />
            </div>

            <div className="relative">
              <FiLock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                placeholder="Confirm New Password"
                onChange={handleChange}
                onBlur={handlePasswordBlur}
                required
                className={`w-full rounded-md bg-slate-700/50 py-3 pl-10 pr-4 text-white placeholder-slate-400 transition-colors duration-300 focus:outline-none focus:ring-1 ${passwordErrorClass}`}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || isTokenInvalid}
              className="w-full rounded-md bg-white py-3 font-semibold text-black transition-all duration-200 ease-in-out hover:text-white hover:bg-black disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Set New Password"}
            </button>
          </form>
        )}

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
      </div>
    </div>
  );
}
