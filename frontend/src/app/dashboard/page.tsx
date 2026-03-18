"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PromptBox } from "@/components/layout/prompt";
import { ExampleCard } from "@/components/layout/card";
import { useUser } from "@/context/Usercontext";
import LayoutTextFlipDemo from "@/components/ui/dashInputText";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [prompt, setPrompt] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setLoadingPrompt(true);
    console.log("Submitting prompt:", prompt);

    // setTimeout( () =>{
    //   setLoadingPrompt(false);
    // },5000);
    

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/courses/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ prompt }),
        }
      );

      const data = await res.json();
      console.log("Backend response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate course");
      }

      const newCourseId = data.data.courseId || data.data._id;
      console.log("✅ Course created! Redirecting to:", newCourseId);
      router.push(`/dashboard/course/${newCourseId}`);
    } catch (err) {
      console.error("❌ Error generating course:", err);
      alert("Failed to generate course. Try again later.");
    } finally {
      setLoadingPrompt(false);
    }
  };

  const examplePrompts = [
    {
      title: "Beginner's Python",
      description: "Learn variables, loops, and functions.",
      prompt:
        "Create a complete beginner's course on Python, focusing on variables, loops, and functions.",
    },
    {
      title: "React Hooks",
      description: "Master state and effects in React.",
      prompt:
        "Generate an advanced course on React Hooks, including custom hooks and performance optimization.",
    },
    {
      title: "History of Rome",
      description: "From Republic to Empire.",
      prompt:
        "Build a comprehensive course on the History of Rome, from its founding as a Republic to the fall of the Western Empire.",
    },
    {
      title: "Basics of AI",
      description: "Understand machine learning.",
      prompt:
        "Create a simple introductory course on the basics of Artificial Intelligence and Machine Learning for non-technical beginners.",
    },
  ];

  const handlePromptSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-black text-white">

      <main className="flex-1 overflow-y-auto flex flex-col justify-center mx-auto max-w-4xl p-4 md:p-8 lg:p-12">
        <div className="flex flex-col items-center w-full">

          <LayoutTextFlipDemo userName={user?.fullname?.split(" ")[0] || "Creator"} />

          {/* PROMPT INPUT BOX */}

          <div className="w-full mt-10">
            <PromptBox
              prompt={prompt}
              setPrompt={setPrompt}
              isLoading={loadingPrompt}
              onSubmit={handleSubmit}
            />
          </div>

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
