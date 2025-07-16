import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";

const JoinQuiz = () => {
  const [roomCode, setRoomCode] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const name = localStorage.getItem("name");
  const userId = localStorage.getItem("userId");

  const handleJoin = () => {
    setMessage("");

    if (!roomCode.trim()) {
      setMessage("Please enter a room code.");
      return;
    }
    navigate(`/room/${roomCode.trim()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white shadow-2xl rounded-3xl p-12 w-full max-w-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Welcome, {name}!
          </h2>

          {message && (
            <p className="mb-4 text-center text-red-600 font-medium">
              {message}
            </p>
          )}

          <label className="block mb-2 font-semibold text-lg text-center">
            Enter Room Code
          </label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Room Code"
            className="w-full border border-gray-300 p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />

          <button
            onClick={handleJoin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinQuiz;
