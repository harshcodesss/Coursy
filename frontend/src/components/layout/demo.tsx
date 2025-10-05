"use client";

import React from "react";
import { BorderBeam } from "../ui/border-beam";

export default function DemoSection() {
  return (
    <section className="relative flex flex-col items-center bg-background text-foreground overflow-visible min-h-screen -mt-15">
      
      {/* Outer box */}
      <div className="relative flex flex-col items-center justify-center w-10/12 bg-white/10 rounded-xl p-4 z-10">
        {/* Inner box */}
        <div className="relative flex flex-col items-center justify-center w-full bg-white rounded-lg">
          <img
            src="/dashboard.png"
            alt="Course Demo"
            className="w-full h-auto rounded-md"
          />
        </div>

        {/* Border beams */}
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

      {/* Glowing oval behind the outer box */}
      <div
        className="absolute -top-[1%] w-[80%] h-[180px] rounded-full 
        bg-gradient-to-r from-teal-400 via-green-200 to-cyan-600 
        opacity-30 blur-3xl z-0"
      ></div>

    </section>
  );
}
