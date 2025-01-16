"use client"; // For Next.js client-side rendering

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is logged in
  const router = useRouter();

  // Check for token in localStorage on initial render
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token); // Set true if token exists
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token from localStorage
    setIsLoggedIn(false); // Update state
    router.push("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        {/* Left Side - App Name */}
        <div className="text-2xl font-bold text-blue-700">Quizify</div>

        {/* Right Side - Buttons */}
        <div className="space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/registration")}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to Quizify!</h1>
          <p className="text-gray-700 mb-6">
            Quizify is your ultimate test preparation platform. Practice, learn, and evaluate your
            knowledge with a variety of topics tailored to suit your needs. Get started now and
            achieve your learning goals!
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/registration")}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
