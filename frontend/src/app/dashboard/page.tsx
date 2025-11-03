"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { PromptBox } from "@/components/layout/prompt";
import { ExampleCard } from "@/components/layout/card";
import  Sidebar  from "@/components/layout/sidebar";

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const examplePrompts = [
    {
      title: "Beginner's Python",
      description: "Learn variables, loops, and functions.",
      prompt: "Create a complete beginner's course on Python, focusing on variables, loops, and functions.",
    },
    {
      title: "React Hooks",
      description: "Master state and effects in React.",
      prompt: "Generate an advanced course on React Hooks, including custom hooks and performance optimization.",
    },
    {
      title: "History of Rome",
      description: "From Republic to Empire.",
      prompt: "Build a comprehensive course on the History of Rome, from its founding as a Republic to the fall of the Western Empire.",
    },
    {
      title: "Basics of AI",
      description: "Understand machine learning.",
      prompt: "Create a simple introductory course on the basics of Artificial Intelligence and Machine Learning for non-technical beginners.",
    },
  ];

  const handlePromptSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    console.log("Submitting prompt:", prompt);

    try {
      // --- REAL API CALL ---
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/courses/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // This assumes your login set an httpOnly cookie
          body: JSON.stringify({ prompt }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate course");
      }
      
      const newCourseId = data.data.courseId;
      console.log("Course created! Redirecting to:", newCourseId);
      
      // Redirect to the new course page
      router.push(`/dashboard/course/${newCourseId}`);

    } catch (err: any) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar added to the page */}
      <Sidebar />
      
      {/* --- MODIFICATION HERE ---
        This <main> tag is now a flex container that centers its child vertically.
      */}
      <main className="flex-1 overflow-y-auto flex flex-col justify-center mx-auto max-w-4xl p-4 md:p-8 lg:p-12">
        
        {/* --- MODIFICATION HERE ---
          This <div> no longer needs to force a minimum height.
        */}
        <div className="flex flex-col items-center w-full">
          
          {/* Greeting */}
          <h1 className="text-4xl md:text-5xl font-bold text-center">
              Hello, 
          <span className="bg-gradient-to-r from-teal-400 via-green-200 to-cyan-600 bg-clip-text text-transparent">
              Harsh
            </span>{" "}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300 text-center">
            What amazing course will you create today?
          </p>

          {/* Prompt Box */}
          <div className="w-full mt-10">
            <PromptBox
              prompt={prompt}
              setPrompt={setPrompt}
              isLoading={loading}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Example Cards */}
          <div className="mt-16 w-full">
            <h2 className="text-xl font-semibold text-white">
              Start with an example
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {examplePrompts.map((item) => (
                <ExampleCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  onSelect={() => handlePromptSelect(item.prompt)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}