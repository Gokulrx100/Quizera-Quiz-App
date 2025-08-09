import React from "react";

const QuestionCard = ({
  currentQuestion,
  selectedOption,
  setSelectedOption,
  isDisabled,
  isTimeUp,
  hasSubmitted,
  submitAnswer,
  answerResult,
}) => (
  <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl border-2 border-blue-400 ring-4 ring-blue-200/50 w-full max-w-2xl transform transition-all duration-300">
    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center shadow-lg">
      ?
    </div>

    {isTimeUp && (
      <div className="absolute -top-2 -right-2">
        <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow-md animate-pulse">
          Time's up
        </span>
      </div>
    )}

    {hasSubmitted && !isTimeUp && (
      <div className="absolute -top-2 -right-2">
        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
          Submitted
        </span>
      </div>
    )}

    <h3 className="text-2xl font-bold mb-6 text-blue-900 pr-8">
      {currentQuestion.text}
    </h3>

    <div className="space-y-3">
      {currentQuestion.options.map((opt, idx) => (
        <label
          key={opt.id}
          className={`
            group flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 
            ${
              isDisabled
                ? "cursor-not-allowed opacity-50 bg-gray-100 border-gray-300"
                : "cursor-pointer"
            }
            ${
              !isDisabled && selectedOption === opt.id
                ? "bg-blue-50 border-blue-300 shadow-md transform scale-102"
                : !isDisabled
                ? "bg-gray-50/60 border-gray-200 hover:bg-blue-50/50 hover:border-blue-200 hover:shadow-sm"
                : ""
            }
          `}
        >
          <div
            className={`
              w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors
              ${
                isDisabled
                  ? "bg-gray-400 text-gray-600"
                  : selectedOption === opt.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-600 group-hover:bg-blue-400 group-hover:text-white"
              }
            `}
          >
            {String.fromCharCode(65 + idx)}
          </div>

          <input
            type="radio"
            name="option"
            value={opt.id}
            checked={selectedOption === opt.id}
            onChange={() => !isDisabled && setSelectedOption(opt.id)}
            disabled={isDisabled}
            className="sr-only"
          />

          <span
            className={`text-lg ${
              isDisabled
                ? "text-gray-500"
                : selectedOption === opt.id
                ? "text-blue-900 font-medium"
                : "text-gray-700"
            }`}
          >
            {opt.text}
          </span>
        </label>
      ))}
    </div>

    <button
      onClick={submitAnswer}
      disabled={!selectedOption || isDisabled}
      className={`
        mt-6 w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg
        ${
          selectedOption && !isDisabled
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:scale-102"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }
      `}
    >
      {isTimeUp
        ? "Time's up!"
        : hasSubmitted
        ? "Answer Submitted"
        : selectedOption
        ? "Submit Answer"
        : "Please select an option"}
    </button>

    {answerResult && (
      <div
        className={`
          mt-4 p-4 rounded-lg text-center font-semibold text-lg
          ${
            answerResult.includes("Correct")
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }
        `}
      >
        {answerResult}
      </div>
    )}
  </div>
);

export default QuestionCard;