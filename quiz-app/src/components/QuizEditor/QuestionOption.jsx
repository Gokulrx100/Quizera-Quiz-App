import React from "react";

const QuestionOption = ({ 
  option, 
  optIndex, 
  qIndex, 
  handleOptionTextChange, 
  handleCorrectChange, 
  removeOption 
}) => (
  <div className="flex items-center gap-2">
    <input
      type="text"
      value={option.text}
      onChange={(e) => handleOptionTextChange(qIndex, optIndex, e.target.value)}
      placeholder={`Option ${optIndex + 1}`}
      className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <label className="flex items-center gap-1">
      <input
        type="radio"
        checked={option.isCorrect}
        onChange={() => handleCorrectChange(qIndex, optIndex)}
      />
      Correct
    </label>
    <button
      onClick={() => removeOption(qIndex, optIndex)}
      className="text-red-600 hover:underline text-sm"
    >
      Delete
    </button>
  </div>
);

export default QuestionOption;