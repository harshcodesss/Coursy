"use client";

import React from "react";

export default function DemoSection() {
  return (
    <section className="relative flex flex-col items-center bg-background text-foreground overflow-visible min-h-screen -mt-15">
      {/* Outer box */}
      <div className="relative flex flex-col items-center justify-center w-10/12 bg-white/10 border border-gradient-to-r from-teal-400 to-cyan-400 rounded-xl p-4">
        {/* Inner box */}
        <div className="relative flex flex-col items-center justify-center w-full bg-white rounded-lg">
          <img
            src="/dashboard.png"
            alt="Course Demo"
            className="w-full h-auto rounded-md"
          />
        </div>
      </div>
    </section>
  );
}
