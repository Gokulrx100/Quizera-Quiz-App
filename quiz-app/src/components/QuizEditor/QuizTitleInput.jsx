import React from "react";

const QuizTitleInput = ({ title, setTitle }) => (
  <div>
    <label className="block font-semibold mb-1">Quiz Title</label>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Enter quiz title"
      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default QuizTitleInput;