"use client"; // Ensure this is at the top for Next.js client-side components

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter hook

export default function QuestionForm() {
  const [formData, setFormData] = useState({
    topic : "",
    question: "",
    options: ["", "", "", ""],
    answer: "",
    image: null,
  });

  const router = useRouter(); // Initialize the router

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append("topic", formData.topic);
    submissionData.append("question", formData.question);
    submissionData.append("options", JSON.stringify(formData.options));
    submissionData.append("answer", formData.answer);
    if (formData.image) {
      submissionData.append("image", formData.image); // Attach the file
    }

    try {
      const response = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        body: submissionData, // Send FormData directly
      });

      const result = await response.json();
      if (response.ok) {
        alert("Question submitted successfully!");
        console.log("Server Response:", result);

        // Navigate to /test after successful submission
        // router.push("/Registration/Test");

        // Clear form after submission
        setFormData({
          topic : formData.topic,
          question: "",
          options: ["", "", "", ""],
          answer: "",
          image: null,
        });
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Add a New Question
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Input */}
          <div>
            <label htmlFor="question" className="block text-lg font-medium text-gray-700">
              Topic
            </label>
            <textarea
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="Enter your question here..."
              className="mt-2 w-full h-24 px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg resize-none"
            />
          </div>
          <div>
            <label htmlFor="question" className="block text-lg font-medium text-gray-700">
              Question
            </label>
            <textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              placeholder="Enter your question here..."
              className="mt-2 w-full h-24 px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg resize-none"
            />
          </div>
          {/* Options Input */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Options</label>
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                type="text"
                value={formData.options[index]}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="mt-2 w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg mb-4"
              />
            ))}
          </div>

          {/* Correct Answer Dropdown */}
          <div>
            <label htmlFor="answer" className="block text-lg font-medium text-gray-700">
              Correct Answer
            </label>
            <select
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              className="mt-2 w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
            >
              <option value="">Select the correct option</option>
              {formData.options.map((option, index) => (
                <option key={index} value={option}>
                  {option || `Option ${index + 1}`}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-lg font-medium text-gray-700">
              Upload Image (optional)
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageUpload}
              className="mt-2 w-full text-lg text-gray-500 file:mr-4 file:py-2 file:px-6 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
          >
            Submit Question
          </button>
        </form>
      </div>
    </div>
  );
}
