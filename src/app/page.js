"use client"; // For Next.js client-side rendering

import React from "react";
import { useRouter } from "next/navigation";

export default function SelectRolePage() {
  const router = useRouter(); // Initialize the router

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Welcome!</h1>
        <p className="text-gray-700 mb-8">Please select your role to proceed:</p>
        
        {/* Role Selection Buttons */}
        <div className="space-y-6">
          {/* Student Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => router.push("/Student/Login")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login as Student
            </button>
            <button
              onClick={() => router.push("/Student/Registration")}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Register as Student
            </button>
          </div>

          {/* Teacher Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => router.push("/Teacher/Login")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login as Teacher
            </button>
            <button
              onClick={() => router.push("/Teacher/Registration")}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Register as Teacher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
