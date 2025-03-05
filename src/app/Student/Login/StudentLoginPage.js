"use client"; // For Next.js client-side rendering

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTestResult } from "../../../context/TestResultContext";
import Spinner from "../../../components/spinner";

export default function StudentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const router = useRouter(); // Initialize the router
  const {setUserData, userData} = useTestResult();

  const handleLogin = async (e) => {
    setLoadingSpinner(true);
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("authToken"); // Retrieve token from local storage

      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          Authorization:  token, // Add token only if it exists
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const { token: newToken } = data;
     console.log(data);
     setUserData({
      id : data.user.id,
      email : data.user.email,
      image : data.user.image,
      designation : data.user.designation,
      username : data.user.username,
      Tests : data.user.Tests
     })
     
     console.log("user data", userData);
     

      // Save new token in local storage
      localStorage.setItem("authToken", newToken);

      setSuccessMessage("Login successful!");

      // Redirect to home page
      router.push("/Student/StudentHome");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-500 to-purple-600 flex items-center justify-center">
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">Login as Student</h1>
        {errorMessage && (
          <p className="text-red-600 text-center font-semibold">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-600 text-center font-semibold">{successMessage}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loadingSpinner? <Spinner/> : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-700 font-bold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
