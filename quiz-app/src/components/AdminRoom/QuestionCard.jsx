import React from "react";

const QuestionCard = ({ question, idx, currentIndex }) => (
  <div
    className={`
      relative p-6 rounded-xl mx-auto transition-all duration-300 ease-in-out
      ${
        idx === currentIndex
          ? "bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-blue-400  ring-4 ring-blue-200/50"
          : "bg-white/70 backdrop-blur-sm shadow-lg border border-gray-200/50 hover:shadow-xl hover:bg-white/80"
      }
    `}
  >
    <div
      className={`
        absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
        ${
          idx === currentIndex
            ? "bg-blue-500 text-white shadow-lg"
            : "bg-gray-300 text-gray-700"
        }
      `}
    >
      {idx + 1}
    </div>

    {idx === currentIndex && (
      <div className="absolute -top-2 -right-2">
        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md animate-pulse">
          LIVE
        </span>
      </div>
    )}

    <h4
      className={`
        font-bold mb-4 text-lg
        ${idx === currentIndex ? "text-blue-900" : "text-gray-800"}
      `}
    >
      {question.title}
    </h4>

    <div className="space-y-2">
      {question.options.map((opt) => (
        <div
          key={opt.id}
          className={`
            flex items-center p-3 rounded-lg transition-colors
            ${
              idx === currentIndex
                ? "bg-blue-50/80 border border-blue-200"
                : "bg-gray-50/60 border border-gray-200/80"
            }
          `}
        >
          <div
            className={`
              w-3 h-3 rounded-full mr-3 flex-shrink-0
              ${
                idx === currentIndex ? "bg-blue-400" : "bg-gray-400"
              }
            `}
          ></div>
          <span className="text-gray-700">{opt.text}</span>
        </div>
      ))}
    </div>

    <div className="mt-4 flex justify-end">
      <span
        className={`
          text-sm px-3 py-1 rounded-full
          ${
            idx === currentIndex
              ? "bg-blue-100 text-blue-700 font-semibold"
              : "bg-gray-100 text-gray-600"
          }
        `}
      >
        {question.points} points
      </span>
    </div>
  </div>
);

export default QuestionCard;