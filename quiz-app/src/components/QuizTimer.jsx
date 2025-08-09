import React from "react";

const QuizTimer = ({ timeLeft, totalTime, getTimerColor, getProgressColor }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50 w-full max-w-2xl">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center">
          ⏱️
        </div>
        <span className="text-lg font-semibold text-gray-800">
          Time Remaining
        </span>
      </div>

      <div
        className={`px-4 py-2 rounded-full border font-bold text-lg ${getTimerColor()}`}
      >
        {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </div>
    </div>

    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor()}`}
        style={{
          width: `${Math.max(0, (timeLeft / totalTime) * 100)}%`,
        }}
      ></div>
    </div>
  </div>
);

export default QuizTimer;