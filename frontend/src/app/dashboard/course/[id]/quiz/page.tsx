"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Trophy, X, AlertCircle } from "lucide-react";

type Question = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
};

type Quiz = {
  title: string;
  questions: Question[];
};

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  
  const moduleId = searchParams.get("moduleId");
  const courseId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}/api/quiz/${moduleId}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setQuiz(data.data);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchQuiz();
  }, [moduleId]);

  const handleSelect = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optionIndex }));
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((prev) => prev - 1);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
        <p className="font-medium animate-pulse">Loading your quiz...</p>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-center text-zinc-400">
        <AlertCircle size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-semibold text-zinc-200">Quiz not found</h2>
        <p className="mt-2 text-sm">We couldn't load the questions for this module.</p>
        <button
          onClick={() => router.push(`/dashboard/course/${courseId}`)}
          className="mt-6 rounded-lg bg-zinc-800 px-6 py-2 text-white transition hover:bg-zinc-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIdx];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = Math.round((answeredCount / quiz.questions.length) * 100);

  let score = 0;
  Object.entries(selectedAnswers).forEach(([qIdx, ansIdx]) => {
    if (ansIdx === quiz.questions[Number(qIdx)].correctAnswerIndex) {
      score += 1;
    }
  });
  const scorePercentage = Math.round((score / quiz.questions.length) * 100);

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-8 text-center shadow-2xl"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal-500/10 text-teal-400">
            {scorePercentage >= 70 ? <Trophy size={40} /> : <AlertCircle size={40} />}
          </div>
          <h2 className="mb-2 text-3xl font-bold text-zinc-100">
            {scorePercentage >= 70 ? "Great Job!" : "Keep Practicing"}
          </h2>
          <p className="mb-8 text-zinc-400">
            You scored <span className="font-bold text-white">{score}</span> out of {quiz.questions.length} ({scorePercentage}%)
          </p>
          
          <button
            onClick={() => router.push(`/dashboard/course/${courseId}`)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black shadow-sm transition-all hover:bg-zinc-200 active:scale-95"
          >
            <CheckCircle2 size={18} />
            Back to Course
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800/50 bg-zinc-950/80 px-4 backdrop-blur-md md:px-8">
        <button
          onClick={() => router.push(`/dashboard/course/${courseId}`)}
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
        >
          <X size={18} /> Exit
        </button>
        <span className="font-semibold text-zinc-200">{quiz.title}</span>
        <div className="w-[72px]" />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          
          <div className="mb-8">
            <div className="mb-3 flex justify-between text-sm font-medium text-zinc-400">
              <span>Question {currentIdx + 1} of {quiz.questions.length}</span>
              <span className="text-teal-500">{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800/50">
              <motion.div
                className="h-full rounded-full bg-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute inset-0"
              >
                <h2 className="mb-8 text-2xl font-semibold leading-relaxed text-zinc-100 md:text-3xl">
                  {currentQuestion.question}
                </h2>

                <div className="flex flex-col gap-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedAnswers[currentIdx] === idx;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelect(idx)}
                        className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                          isSelected
                            ? "border-teal-500 bg-teal-500/10 text-teal-50"
                            : "border-zinc-800/50 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50"
                        }`}
                      >
                        <span className="text-base md:text-lg pr-4">{option}</span>
                        <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                          isSelected ? "border-teal-500 bg-teal-500" : "border-zinc-600"
                        }`}>
                          {isSelected && <div className="h-2 w-2 rounded-full bg-zinc-950" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </main>

      <footer className="shrink-0 border-t border-zinc-800/50 bg-zinc-950/80 p-4 backdrop-blur-md md:px-8 md:py-6">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-zinc-400 transition-colors hover:text-zinc-100 disabled:invisible"
          >
            <ArrowLeft size={18} /> Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentIdx] === undefined}
            className={`flex items-center gap-2 rounded-xl px-8 py-3 font-semibold shadow-sm transition-all ${
              selectedAnswers[currentIdx] === undefined
                ? "cursor-not-allowed bg-zinc-800 text-zinc-500"
                : "bg-white text-black hover:bg-zinc-200 active:scale-95"
            }`}
          >
            {currentIdx === quiz.questions.length - 1 ? "Submit Quiz" : "Next Question"}
            {currentIdx !== quiz.questions.length - 1 && <ArrowRight size={18} />}
          </button>
        </div>
      </footer>
      
    </div>
  );
}