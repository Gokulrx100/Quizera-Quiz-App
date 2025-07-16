import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import Navbar from "../components/Navbar";

const Room = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [message, setMessage] = useState("Connecting to room...");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerResult, setAnswerResult] = useState("");
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("name");

    if (!userId || !name) {
      alert("No user information found. Please sign in again.");
      navigate("/signin");
      return;
    }

    console.log("Connecting with:", { userId, name });

    const socket = new WebSocket("ws://localhost:3000");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      socket.send(
        JSON.stringify({
          type: "joinRoom",
          roomCode: roomCode.trim(),
          name,
          userId,
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message from server:", data);

      if (data.error) {
        alert(data.error);
        if (
          data.error === "Not authorized or room not found"
        ) {
          navigate("/join-quiz");
        }
        return;
      }

      switch (data.type) {
        case "joinedRoom":
          setMessage(
            `Joined Room: ${data.roomCode}. Waiting for the next question...`
          );
          break;

        case "newQuestion":
          setCurrentQuestion(data.question);
          setSelectedOption(null);
          setAnswerResult("");
          setMessage("");
          break;

        case "answerResult":
          setScore(data.score);
          setAnswerResult(data.correct ? "✅ Correct!" : "❌ Wrong!");
          break;

        case "leaderboard":
          setLeaderboard(data.leaderboard);
          break;

        case "roomClosed":
          alert("Quiz ended. Redirecting to join page.");
          navigate("/join-quiz");
          break;

        default:
          console.warn("Unknown message type:", data);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [roomCode, navigate]);

  const submitAnswer = () => {
    if (!selectedOption) {
      alert("Please select an option.");
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        type: "submitAnswer",
        questionId: currentQuestion.id,
        selectedOption: selectedOption,
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex flex-col items-center p-8">
        <h2 className="text-3xl font-bold mb-4">Room: {roomCode}</h2>
        <p className="text-lg mb-4">{message}</p>

        {currentQuestion && (
          <div className="bg-white p-6 rounded-xl shadow max-w-xl w-full mb-6">
            <h3 className="text-xl font-bold mb-4">{currentQuestion.text}</h3>

            <div className="space-y-2">
              {currentQuestion.options.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="option"
                    value={opt.id}
                    checked={selectedOption === opt.id}
                    onChange={() => setSelectedOption(opt.id)}
                  />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>

            <button
              onClick={submitAnswer}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit Answer
            </button>

            {answerResult && (
              <p className="mt-4 text-lg font-semibold">
                {answerResult} | Your Score: {score}
              </p>
            )}
          </div>
        )}

        {leaderboard.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow max-w-xl w-full">
            <h3 className="text-xl font-bold mb-4">Leaderboard</h3>
            <ul>
              {leaderboard
                .sort((a, b) => b.score - a.score)
                .map((entry, idx) => (
                  <li key={entry.userId} className="mb-1">
                    {idx + 1}. {entry.name} — {entry.score}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;
