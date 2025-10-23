"use client";

import React, { useState, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { BorderBeam } from "@/components/ui/border-beam";

export default function Verify() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [error, setError] = useState<string>("");
  const [info, setInfo] = useState<string>(""); // For success messages
  const [isLoading, setIsLoading] = useState(false); // For main verify button
  const [isResending, setIsResending] = useState(false); // For resend button
  const [cooldown, setCooldown] = useState(0); // Cooldown timer
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    // Cleanup interval on component unmount or when cooldown reaches 0
    return () => clearInterval(timer);
  }, [cooldown]);

  // --- (handleChange, handleKeyDown, handlePaste are unchanged) ---
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    setInfo(""); // Clear info message on new input
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]!.focus();
    }
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]!.focus();
    }
  };
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 4);
    if (/^\d{4}$/.test(pasteData)) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      if (inputRefs.current[3]) {
        inputRefs.current[3]!.focus();
      }
    }
  };
  
  // --- handleVerify is unchanged ---
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    setIsLoading(true);
    setError("");
    setInfo("");

    if (fullOtp.length !== 4) {
      setError("Please enter a 4-digit OTP.");
      setIsLoading(false);
      return;
    }
    if (!token) {
      setError("No verification token found. Please try registering again.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/verify`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: fullOtp,
          token: token 
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Verification successful!", data);
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid OTP or token.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW: Resend OTP Logic ---
  const handleResendOTP = async () => {
    // Prevent resend if cooldown is active or already resending
    if (isResending || cooldown > 0) return;

    if (!token) {
      setError("No verification token found. Cannot resend OTP.");
      return;
    }

    setIsResending(true);
    setError("");
    setInfo("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/resendOTP`, { // User's specified route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token }) // Send the token
      });

      const data = await response.json();

      if (response.ok) {
        setInfo("A new OTP has been sent to your email.");
        setCooldown(30); // Start 30-second cooldown
      } else {
        // Handle errors, e.g., "Too many attempts"
        setError(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyLater = () => {
    router.push("/dashboard");
  };

  const isVerifyDisabled = otp.join('').length !== 4 || isLoading;
  const isResendDisabled = isResending || cooldown > 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center p-4">
      {/* --- Back Button --- */}
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

      {/* --- Background Gradient --- */}
      <div
        aria-hidden="true"
        className="absolute bottom-[-60vh] left-1/2 -translate-x-1/2 w-[220vw] max-w-[1900px] h-[120vh] rounded-full bg-gradient-to-tr from-cyan-400 to-teal-400 opacity-20 blur-3xl"
      />

      {/* --- Main Card --- */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-black/20 p-8 shadow-lg backdrop-blur-lg"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            Enter The OTP
          </h2>
          <p className="text-slate-400 text-sm">
            Check your registered email for a 4-digit code.
          </p>
        </div>

        {/* --- OTP Form --- */}
        <form onSubmit={handleVerify}>
          {/* --- OTP Input Blocks --- */}
          <div 
            className="flex justify-center gap-3 my-8"
            onPaste={handlePaste} // Apply paste handler to the container
          >
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el: HTMLInputElement | null) => {
                  inputRefs.current[index] = el;
                }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-14 bg-black/30 border border-white/20 rounded-lg text-center text-2xl font-semibold text-white transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
                           placeholder:text-slate-600"
              />
            ))}
          </div>

          {/* --- Info/Error Messages --- */}
          {error && (
            <p className="text-center text-sm text-red-400 mb-4">
              {error}
            </p>
          )}
          {info && (
            <p className="text-center text-sm text-green-400 mb-4">
              {info}
            </p>
          )}


          {/* --- Action Buttons --- */}
          <div className="flex flex-col gap-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              disabled={isVerifyDisabled}
              className={`w-full rounded-lg py-3 font-bold text-black transition-all duration-200
                          bg-gradient-to-r from-cyan-400 to-teal-400
                          hover:shadow-lg hover:shadow-cyan-500/20
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </motion.button>

            <motion.button
              type="button"
              onClick={handleVerifyLater}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-lg py-3 font-medium text-slate-300 transition-all duration-200
                         border border-white/20 bg-black/20
                         hover:bg-white/10 hover:text-white"
            >
              Verify Later
            </motion.button>
          </div>
        </form>

        {/* --- Resend Link --- */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Didn't receive the code?{" "}
          <button
            type="button" // Add type="button" to prevent form submission
            onClick={handleResendOTP}
            disabled={isResendDisabled} // Disable based on state
            className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors duration-150
                       disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            {/* Dynamic Button Text */}
            {isResending ? "Sending..." : 
              (cooldown > 0 ? `Resend in ${cooldown}s` : "Resend")
            }
          </button>
        </p>

        {/* --- Border Beams --- */}
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

