"use client"; // For Next.js client-side rendering

import React, { useEffect, useState } from "react";

export default function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // Track the current page
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Function to fetch questions from the API
  const fetchQuestions = async (page = 1) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/questions/getQuestion?page=${page}&limit=1`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();
      console.log("datas:", data); // Debugging the API response

      setQuestions(data.data); // Update with the questions array
      setTotalQuestions(data.meta.totalDocuments); // Update with the total document count
      setCurrentPage(data.meta.currentPage - 1); // Adjust the current page (0-based index)
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load the first page on component mount
  useEffect(() => {
    fetchQuestions(1);
  }, []);

  // Handle next page navigation
  const nextPage = () => {
    if (currentPage + 1 < totalQuestions) {
      fetchQuestions(currentPage + 2); // Move to the next page (1-based index)
    }
  };

  // Handle previous page navigation
  const prevPage = () => {
    if (currentPage > 0) {
      fetchQuestions(currentPage); // Move to the previous page (1-based index)
    }
  };

  // Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // No questions available
  if (questions.length === 0) {
    return <div>No questions available.</div>;
  }

  const currentQuestion = questions[0]; // Since one question is fetched per page

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Question {currentPage + 1} of {totalQuestions}
        </h2>
        <div className="space-y-6">
          {currentQuestion && (
            <div className="bg-gray-50 p-6 rounded-md shadow-md space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {currentQuestion.question}
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                {currentQuestion.options.map((option, idx) => (
                  <li key={idx}>{option}</li>
                ))}
              </ul>
              <p className="text-gray-600">
                <strong>Correct Answer:</strong> {currentQuestion.answer}
              </p>
              {currentQuestion.imagePath ? (
                <img
                  src={`http://localhost:5000/images/${currentQuestion.imagePath}`}
                  alt="Uploaded visual"
                  className="w-40 h-40 object-cover rounded-md shadow-md"
                />
              ) : (
                <p className="text-gray-500 italic">No image available</p>
              )}
            </div>
          )}
        </div>
        {/* Pagination Controls */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`px-6 py-2 rounded-md text-lg font-semibold ${
              currentPage === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalQuestions - 1}
            className={`px-6 py-2 rounded-md text-lg font-semibold ${
              currentPage === totalQuestions - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
