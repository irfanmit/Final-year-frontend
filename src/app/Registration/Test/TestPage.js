"use client"; // For Next.js client-side rendering

import React, { useEffect, useState } from "react";

export default function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/questions/getQuestion"); // Adjust to your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Submitted Questions
        </h2>
        <ul className="space-y-6">
          {questions.map((question, index) => (
            <li
              key={index}
              className="bg-gray-50 p-6 rounded-md shadow-md space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {question.question}
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                {question.options.map((option, idx) => (
                  <li key={idx}>{option}</li>
                ))}
              </ul>
              <p className="text-gray-600">
                <strong>Correct Answer:</strong> {question.answer}
              </p>
              {question.filePath ? (
                <img
                  src={`http://localhost:5000/uploads/images/${question.filePath}`}
                  alt="Uploaded visual"
                  className="w-full h-auto rounded-md shadow-md"
                />
              ) : (
                <p className="text-gray-500 italic">No image available</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
