"use client";

import React, { useState, useEffect } from "react";
import { useTestResult } from "../../../../context/TestResultContext";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function ProfilePage() {
  const { userData, setTestResult , testResult} = useTestResult(); // Import user data from context
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const router = useRouter(); // Initialize router

  if (!userData) {
    return <p className="text-center text-red-500 font-semibold">No user data found!</p>;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const uploadFile = async () => {
      if (!selectedFile) return;

      const formData = new FormData();
      formData.append("profileImage", selectedFile);
      formData.append("userId", userData.id);

      try {
        const response = await fetch("http://localhost:5000/profile/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setUploadStatus("File uploaded successfully!");
          console.log(data.user.image);
        } else {
          setUploadStatus("Failed to upload file.");
        }
      } catch (error) {
        setUploadStatus("An error occurred while uploading the file.");
        console.error("Error uploading file:", error);
      }
    };

    uploadFile();
  }, [selectedFile]);

  useEffect(() => {
    setPreviewImage(`http://localhost:5000/images/${userData.image}`);
  }, []);

  // Function to handle "See Result" button click
  const handleSeeResult = async(currentTopicId) => {
    console.log("Selected Test ID:", currentTopicId);
    try {
      const response = await fetch("http://localhost:5000/api/questions/getResult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentTopicId }),
      });

      if (!response.ok) throw new Error("Failed to submit answers");

      const data = await response.json();
      console.log("Test data", data);
      setTestResult({
        correctAnswers: data.correctAnswers,
        incorrectAnswers: data.incorrectAnswers,
        message: data.message,
        score: data.score,
        totalQuestions: data.totalQuestions,
      });
      
      router.push("/Student/Test/Result")
      console.log("test result after inserting in context : ", testResult);
      
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
        {/* Profile Photo Section */}
        <div className="absolute -top-10 left-6 cursor-pointer" onClick={() => document.getElementById("profileImage").click()}>
          <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
            {previewImage ? (
              <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">No Image</div>
            )}
          </div>
        </div>

        {/* Hidden File Input */}
        <input type="file" id="profileImage" name="profileImage" onChange={handleFileChange} className="hidden" />

        {/* User Profile Details */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">User Profile</h1>
        <div className="text-gray-700 space-y-3 mt-10">
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Designation:</strong> {userData.designation}</p>
        </div>

        {/* Display Tests */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Test History</h2>
          <div className="space-y-4">
            {userData.Tests && userData.Tests.length > 0 ? (
              userData.Tests.map((test) => (
                <div key={test._id} className="flex justify-between items-center bg-gray-200 p-3 rounded-md">
                  <span className="text-gray-800 font-medium">{test.topic}</span>
                  <button 
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() => handleSeeResult(test.currentTopicId)} // Pass test.currentTopicId to function
                  >
                    See Result
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No test history available.</p>
            )}
          </div>
        </div>

        {/* Upload Status */}
        {uploadStatus && <p className="mt-4 text-center text-sm text-gray-600">{uploadStatus}</p>}
      </div>
    </div>
  );
}
