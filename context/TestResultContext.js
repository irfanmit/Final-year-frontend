"use client"; // Required for client-side state

import { createContext, useContext, useState } from "react";

// Create the context
const TestResultContext = createContext();

// Provider component
export const TestResultProvider = ({ children }) => {
  const [testResult, setTestResult] = useState({
    correctAnswers: 0,
    incorrectAnswers: [],
    message: "",
    score: "",
    totalQuestions: 0,
  });

  const [userData, setUserData] = useState({
    id :"",
    email: "",
    image:"",
    username: "",
    designation: "",
    Tests : []
  });

  return (
    <TestResultContext.Provider value={{ testResult, setTestResult, userData, setUserData }}>
      {children}
    </TestResultContext.Provider>
  );
};

// Custom hook for easier use
export const useTestResult = () => {
  const context = useContext(TestResultContext);
  if (!context) {
    throw new Error("useTestResult must be used within a TestResultProvider");
  }
  return context;
};
