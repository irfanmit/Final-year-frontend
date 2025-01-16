"use client"; // For Next.js client-side rendering

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentHomePage() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch topics from the backend
  const fetchTopics = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/questions/getTopic");
      if (!response.ok) {
        throw new Error("Failed to fetch topics");
      }
      const data = await response.json();
      setTopics(data.data); // Assuming topics are in `data.data`
    } catch (error) {
      console.error("Error fetching topics:", error);
      setError("Could not load topics. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch topics on component mount
  useEffect(() => {
    fetchTopics();
  }, []);

  const handleStartTest = (topicId) => {
    router.push(`/Student/Test?topicId=${topicId}`); // Pass the topic ID as a query parameter
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-500 to-blue-500 flex flex-col items-center justify-center p-4">
      <h1 className="text-lg text-white mb-8">Select a topic to start your test:</h1>
      {topics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {topics.map((topic) => (
            <div
              key={topic._id}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between"
            >
              <h2 className="text-xl font-bold text-blue-700 mb-4">{topic.topicName}</h2>
              <p className="text-gray-700 mb-6">
                Click the button below to start the test for this topic.
              </p>
              <button
                onClick={() => handleStartTest(topic._id)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300 text-lg">No topics available at the moment.</p>
      )}
    </div>
  );
}
