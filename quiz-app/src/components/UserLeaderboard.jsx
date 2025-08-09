import React from "react";

const UserLeaderboard = ({ leaderboard }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 w-full max-w-2xl">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-yellow-500 text-white text-sm font-bold flex items-center justify-center">
        🏆
      </div>
      <h3 className="text-xl font-bold text-gray-800">Final Results</h3>
    </div>

    <div className="space-y-2">
      {leaderboard
        .sort((a, b) => b.score - a.score)
        .map((entry, idx) => (
          <div
            key={entry.userId}
            className={`
              flex items-center justify-between p-3 rounded-lg transition-all duration-200
              ${
                idx === 0
                  ? "bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300"
                  : idx === 1
                  ? "bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300"
                  : idx === 2
                  ? "bg-gradient-to-r from-orange-100 to-orange-200 border border-orange-300"
                  : "bg-gray-50 border border-gray-200"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                  ${
                    idx === 0
                      ? "bg-yellow-500 text-white"
                      : idx === 1
                      ? "bg-gray-500 text-white"
                      : idx === 2
                      ? "bg-orange-500 text-white"
                      : "bg-blue-500 text-white"
                  }
                `}
              >
                {idx + 1}
              </div>
              <span className="font-medium text-gray-800">
                {entry.name}
              </span>
            </div>
            <span className="font-bold text-gray-700">
              {entry.score} pts
            </span>
          </div>
        ))}
    </div>
  </div>
);

export default UserLeaderboard;