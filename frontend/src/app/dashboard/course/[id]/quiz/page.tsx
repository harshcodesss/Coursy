"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("moduleId");

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  // 🔹 Fetch Quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

  // 🔹 Handle Answer Select
  const handleAnswer = (index: number) => {
    const updated = [...selectedAnswers];
    updated[currentQuestion] = index;
    setSelectedAnswers(updated);
  };

  // 🔹 Next Question
  const handleNext = () => {
    if (!quiz) return;

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  // 🔹 Score Calculation
  const calculateScore = () => {
    if (!quiz) return 0;

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswerIndex) {
        score++;
      }
    });

    return score;
  };

  // 🔹 Loading UI
  if (loading) return <div className="p-6">Loading quiz...</div>;

  // 🔹 No Quiz
  if (!quiz) return <div className="p-6">Quiz not found</div>;

  // 🔹 Result Screen
  if (showResult) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
        <h2 className="text-xl">
          Score: {calculateScore()} / {quiz.questions.length}
        </h2>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>

      <p className="mb-2">
        Question {currentQuestion + 1} / {quiz.questions.length}
      </p>

      <h2 className="text-lg font-semibold mb-4">{question.question}</h2>

      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            className={`block w-full text-left p-3 border rounded ${
              selectedAnswers[currentQuestion] === index
                ? "bg-blue-500 text-white"
                : "bg-black"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={selectedAnswers[currentQuestion] === undefined}
        className="mt-6 px-4 py-2 bg-black text-white rounded disabled:opacity-50"
      >
        {currentQuestion === quiz.questions.length - 1 ? "Submit" : "Next"}
      </button>
    </div>
  );
}
