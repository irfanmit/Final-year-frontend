"use client";

import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTestResult } from "../../../../../context/TestResultContext";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ResultPage() {
  const { testResult } = useTestResult();
  const [showIncorrectAnswers, setShowIncorrectAnswers] = useState(false);

  const correctAnswers = testResult.correctAnswers || 0;
  const incorrectAnswers = testResult.incorrectAnswers?.length || 0;
  const totalQuestions = testResult.totalQuestions || 1; // Avoid division by zero
  const scorePercentage = parseFloat(testResult.score || "0");

  // Data for Pie Chart
  const data = {
    labels: ["Correct Answers", "Incorrect Answers"],
    datasets: [
      {
        label: "Answers Distribution",
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ["#4CAF50", "#FF5252"],
        borderColor: ["#388E3C", "#D32F2F"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">Test Results</h1>

        <div className="mb-8">
          <h2 className="text-6xl font-extrabold text-green-600">{scorePercentage}%</h2>
          <p className="text-xl font-medium text-gray-600 mt-2">Score Percentage</p>
        </div>

        <div className="mb-8">
          <Pie data={data} />
        </div>

        <div className="text-left space-y-4">
          <p>
            <strong>Total Questions:</strong> {totalQuestions}
          </p>
          <p>
            <strong>Correct Answers:</strong> {correctAnswers}
          </p>
          <button
            onClick={() => setShowIncorrectAnswers(!showIncorrectAnswers)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Show Incorrect Answers ({incorrectAnswers})
          </button>
        </div>
      </div>

      {showIncorrectAnswers && (
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl mt-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Incorrect Answers</h2>
          {testResult.incorrectAnswers.map((answer, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-50 rounded-md shadow-md mb-4"
            >
              <p className="font-semibold text-lg">
                <strong>Question {idx + 1}:</strong> {answer.question}
              </p>
              <div className="mt-2">
                {answer.options.map((option, optIdx) => (
                  <p
                    key={optIdx}
                    className={`py-1 px-2 rounded-md ${
                      option === answer.correctAnswer
                        ? "bg-green-200"
                        : option === answer.selectedOption
                        ? "bg-red-200"
                        : "bg-gray-100"
                    }`}
                  >
                    {option}
                  </p>
                ))}
              </div>
              <p className="mt-4">
                <strong>Your Answer:</strong> {answer.selectedOption}
              </p>
              <p>
                <strong>Correct Answer:</strong> {answer.correctAnswer}
              </p>
            </div>
          ))}
          <button
            onClick={() => setShowIncorrectAnswers(false)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
