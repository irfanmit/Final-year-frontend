"use client";

import React, { useState, useEffect } from "react";
import { useTestResult } from "../../../../context/TestResultContext";

export default function ProfilePage() {
  const { userData } = useTestResult(); // Import user data from context
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [previewImage, setPreviewImage] = useState(null); // For image preview

  if (!userData) {
    return <p className="text-center text-red-500 font-semibold">No user data found!</p>;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  // Automatically upload the file when selectedFile changes
  useEffect(() => {
    const uploadFile = async () => {
      if (!selectedFile) {
        return; // Do nothing if no file is selected
      }

      const formData = new FormData();
      formData.append("profileImage", selectedFile);
      formData.append("userId" , userData.id)

      try {
        const response = await fetch("http://localhost:5000/profile/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {

      const data = await response.json();
          setUploadStatus("File uploaded successfully!");
          console.log(data.user.image);
          
          console.log(data);
          
        } else {
          setUploadStatus("Failed to upload file.");
        }
      } catch (error) {
        setUploadStatus("An error occurred while uploading the file.");
        console.error("Error uploading file:", error);
      }
    };

    uploadFile(); // Call the upload function
  }, [selectedFile]); // Run this effect whenever selectedFile changes

  const handleProfilePhotoClick = () => {
    // Programmatically click the hidden file input
    const fileInput = document.getElementById("profileImage");
    if (fileInput) {
      fileInput.click();
    }
  };
  useEffect(()=>{

    setPreviewImage(`http://localhost:5000/images/${userData.image}`)
  },[])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
        {/* Profile Photo Section */}
        <div
          className="absolute -top-10 left-6 cursor-pointer"
          onClick={handleProfilePhotoClick}
        >
          <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          id="profileImage"
          name="profileImage"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* User Profile Details */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">User Profile</h1>
        <div className="text-gray-700 space-y-3 mt-10">
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Designation:</strong> {userData.designation}</p>
        </div>

        {/* Upload Status */}
        {uploadStatus && <p className="mt-4 text-center text-sm text-gray-600">{uploadStatus}</p>}
      </div>
    </div>
  );
}