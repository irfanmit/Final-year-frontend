"use client"; // For Next.js client-side rendering

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTestResult } from "../../../context/TestResultContext";
import Navbar from "../../../components/navbar";
import Spinner from "../../../components/spinner";

function TestPageContent() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [LoadingSpinner, setLoadingSpinner] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [alertDetected, setAlertDetected] = useState(false);

  let chances = 4; // Not using state, since it's reset on re-render

  const router = useRouter();
  const searchParams = useSearchParams(); // This must be inside a Suspense boundary
  const topicId = searchParams.get("topicId");
  const topicName = searchParams.get("topicName");

  const { setTestResult, testResult, userData } = useTestResult();

  // Fetch questions
  const fetchQuestions = async (page = 1) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/questions/getQuestion?topicId=${topicId}&page=${page}&limit=1`
      );
      if (!response.ok) throw new Error("Failed to fetch questions");

      const data = await response.json();
      setQuestions(data.data);
      setTotalQuestions(data.meta.totalDocuments);
      setCurrentPage(data.meta.currentPage - 1);
      setSelectedAnswer(null);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // WebSocket and object detection
  const socketreq = async () => {
    --chances;
    console.log(chances);
    
    if (chances < 1) {
      console.log("closing");
      router.push("/Student/StudentHome");
    }

    fetch("http://127.0.0.1:8000/video_feed/", { method: "GET" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to start object detection");
        console.log("Object detection started");
      })
      .catch((error) => {
        console.error("Error starting object detection:", error);
      });
  };

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/video_feed/");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      alert(`${data.message} ${chances} chances remaining`);
      socketreq();
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    socketreq();
  }, [alertDetected]);

  useEffect(() => {
    fetchQuestions(1);
  }, []);

  const nextPage = () => {
    if (selectedAnswer !== null && questions.length > 0) {
      const currentQuestion = questions[0];
      setSelectedAnswers((prev) => [
        ...prev,
        { questionId: currentQuestion._id, selectedOption: selectedAnswer },
      ]);
    }

    if (currentPage + 1 < totalQuestions) {
      fetchQuestions(currentPage + 2);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      fetchQuestions(currentPage);
    }
  };

  const submitTest = async () => {
    setLoadingSpinner(true);
    if (selectedAnswer !== null && questions.length > 0) {
      const currentQuestion = questions[0];
      const finalAnswers = [
        ...selectedAnswers,
        { questionId: currentQuestion._id, selectedOption: selectedAnswer },
      ];

      try {
        const response = await fetch("http://localhost:5000/api/correct_answer/checking_answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentTopicId: topicId, answers: finalAnswers, userId: userData.id, topicName }),
        });

        if (!response.ok) throw new Error("Failed to submit answers");

        const data = await response.json();
        setTestResult({
          correctAnswers: data.correctAnswers,
          incorrectAnswers: data.incorrectAnswers,
          message: data.message,
          score: data.score,
          totalQuestions: data.totalQuestions,
        });

        router.push("/Student/Test/Result");
      } catch (error) {
        console.error("Error submitting answers:", error);
      }
    } else {
      console.error("No answer selected for the last question.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (questions.length === 0) return <div>No questions available.</div>;

  const currentQuestion = questions[0];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            Question {currentPage + 1} of {totalQuestions}
          </h2>
          <div className="space-y-6">
            {currentQuestion && (
              <div className="bg-gray-50 p-6 rounded-md shadow-md space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">{currentQuestion.question}</h3>
                {currentQuestion.imagePath && (
                  <img
                    src={`http://localhost:5000/images/${currentQuestion.imagePath}`}
                    alt="Uploaded visual"
                    className="w-40 h-40 object-cover rounded-md shadow-md mb-4"
                  />
                )}
                <div className="space-y-2">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAnswer(option)}
                      className={`block w-full text-left px-4 py-2 rounded-md border ${
                        selectedAnswer === option ? "bg-blue-600 text-white" : "bg-white text-gray-800"
                      } hover:bg-blue-100`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <button onClick={prevPage} disabled={currentPage === 0} className="px-6 py-2 rounded-md text-lg font-semibold bg-blue-600 text-white">
              Previous
            </button>
            <button onClick={nextPage} disabled={selectedAnswer === null || currentPage === totalQuestions - 1} className="px-6 py-2 rounded-md text-lg font-semibold bg-green-600 text-white">
              Next
            </button>
            <button onClick={submitTest} disabled={currentPage !== totalQuestions - 1 || selectedAnswer === null} className="px-6 py-2 rounded-md text-lg font-semibold bg-red-600 text-white">
              {LoadingSpinner ? <Spinner /> : "Submit Test"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Wrap inside Suspense
export default function TestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestPageContent />
    </Suspense>
  );
}
