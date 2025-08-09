import React from "react";
import QuestionOption from "./QuestionOption";

const QuestionCard = ({
  question,
  qIndex,
  handleQuestionTextChange,
  handlePointsChange,
  handleOptionTextChange,
  handleCorrectChange,
  removeQuestion,
  addOption,
  removeOption,
}) => (
  <div className="border border-gray-300 rounded-xl p-4 space-y-4 bg-gray-50">
    <div className="flex justify-between items-center">
      <h3 className="font-semibold">Question {qIndex + 1}</h3>
      <button
        onClick={() => removeQuestion(qIndex)}
        className="text-red-600 hover:underline text-sm"
      >
        Remove
      </button>
    </div>

    <input
      type="text"
      value={question.text || ""}
      onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
      placeholder="Question text"
      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <div>
      <label className="block font-semibold mb-1">Points</label>
      <input
        type="number"
        value={question.points}
        min={1}
        onChange={(e) => handlePointsChange(qIndex, e.target.value)}
        className="w-20 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="space-y-3">
      {question.options.map((opt, optIndex) => (
        <QuestionOption
          key={optIndex}
          option={opt}
          optIndex={optIndex}
          qIndex={qIndex}
          handleOptionTextChange={handleOptionTextChange}
          handleCorrectChange={handleCorrectChange}
          removeOption={removeOption}
        />
      ))}
    </div>

    <button
      onClick={() => addOption(qIndex)}
      className="text-blue-600 hover:underline text-sm"
    >
      + Add Option
    </button>
  </div>
);

export default QuestionCard;