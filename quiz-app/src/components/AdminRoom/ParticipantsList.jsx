import React from "react";

const ParticipantsList = ({ participants }) => (
  <div className="w-1/4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">
      Participants
    </h3>

    {participants.length === 0 ? (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-gray-400 text-xl">👥</span>
        </div>
        <p className="text-gray-500 text-sm">Waiting for participants...</p>
      </div>
    ) : (
      <ul className="space-y-2">
        {participants.map((p, idx) => (
          <li
            key={idx}
            className="relative p-3 rounded-lg border border-gray-200/60 bg-white/70 backdrop-blur-sm transition-all duration-200"
          >
            <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold shadow-sm">
              {idx + 1}
            </div>
            <div className="flex items-center pl-3">
              <div className={"w-2 h-2 rounded-full mr-3 flex-shrink-0 bg-green-400"}></div>
              <span className="text-gray-700 font-medium truncate">
                {p.name || p}
              </span>
            </div>
          </li>
        ))}
      </ul>
    )}

    <div className="mt-4 pt-3 border-t border-gray-200/50">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Total Participants</span>
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
          {participants.length}
        </span>
      </div>
    </div>
  </div>
);

export default ParticipantsList;