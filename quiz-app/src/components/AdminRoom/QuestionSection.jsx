import React from "react";
import Leaderboard from "./Leaderboard";
import QuestionCard from "./QuestionCard";

const QuestionSection = ({ 
  leaderboard, 
  questions, 
  currentIndex, 
  handleSendQuestion 
}) => (
  <div className="flex-1 bg-white rounded-xl p-4 shadow">
    <h3 className="text-lg font-semibold mb-4">Questions</h3>

    {leaderboard.length > 0 ? (
      <Leaderboard leaderboard={leaderboard} />
    ) : (
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            idx={idx}
            currentIndex={currentIndex}
          />
        ))}

        <button
          onClick={handleSendQuestion}
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-101 font-semibold"
        >
          {currentIndex === -1
            ? "Send Question"
            : currentIndex + 1 < questions.length
            ? "Send Next Question"
            : "Show Final Leaderboard"}
        </button>
      </div>
    )}
  </div>
);

export default QuestionSection;