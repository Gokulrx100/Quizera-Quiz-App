import React from "react";

const RoomHeader = ({ roomCode, message, score }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 w-full max-w-2xl">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Room: {roomCode}
      </h2>
      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <p className="text-lg text-gray-600">{message}</p>
      </div>
      <div className="mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-full inline-block font-semibold">
        Score: {score} points
      </div>
    </div>
  </div>
);

export default RoomHeader;