import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSocket } from "../Contexts/SocketContext";
import Navbar from "../components/Navbar";
import axios from "axios";

const AdminRoom = () => {
  const navigate = useNavigate();
  const { socketRef, safeSend } = useSocket();
  const { quizId } = useParams();

  const [roomCode, setRoomCode] = useState("");
  const [participants, setParticipants] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [roomCreated, setRoomCreated] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    if (!roomCreated) {
      safeSend({ type: "createRoom", quizId: quizId });
      setRoomCreated(true);
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("AdminRoom received:", data);

      switch (data.type) {
        case "roomCreated":
          setRoomCode(data.roomCode);
          console.log("roomCreated : ", data.roomCode);
          break;

        case "participantUpdate":
          setParticipants(data.participants);
          break;

        case "leaderboard":
          setLeaderboard(data.leaderboard);
          break;

        case "roomClosed":
          alert("Quiz ended. Returning to dashboard.");
          navigate("/admin");
          break;

        default:
          console.warn("Unknown message type:", data);
      }
    };

    return () => {};
  }, [socketRef, safeSend, roomCreated, quizId, navigate]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/quiz/${quizId}`, {
          headers: { authorization: token },
        });
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch questions");
      }
    };

    fetchQuestions();
  }, [quizId]);

  const handleSendQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      const nextIndex = currentIndex + 1;
      const nextQuestion = questions[nextIndex];
      safeSend({
        type: "nextQuestion",
        questionId: nextQuestion.id,
      });
      setCurrentIndex(nextIndex);
    } else {
      safeSend({ type: "showLeaderboard" });
    }
  };

  const handleEndQuiz = () => {
    safeSend({ type: "endQuiz" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl font-bold">Room Code: {roomCode}</h2>
        <button
          onClick={handleEndQuiz}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          End Quiz
        </button>
      </div>

      <div className="flex flex-grow p-4 gap-4">
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
                  {/* Participant number */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold shadow-sm">
                    {idx + 1}
                  </div>

                  {/* Participant name */}
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

          {/* Participant count */}
          <div className="mt-4 pt-3 border-t border-gray-200/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Participants</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                {participants.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-4">Questions</h3>

          {leaderboard.length > 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-yellow-500 text-white text-sm font-bold flex items-center justify-center">
                  🏆
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Final Leaderboard
                </h3>
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
          ) : (
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`
                    relative p-6 rounded-xl mx-auto transition-all duration-300 ease-in-out
                    ${
                      idx === currentIndex
                        ? "bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-blue-400  ring-4 ring-blue-200/50"
                        : "bg-white/70 backdrop-blur-sm shadow-lg border border-gray-200/50 hover:shadow-xl hover:bg-white/80"
                    }
                  `}
                >
                  {/* question number */}
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

                  {/* Current question */}
                  {idx === currentIndex && (
                    <div className="absolute -top-2 -right-2">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md animate-pulse">
                        LIVE
                      </span>
                    </div>
                  )}

                  {/* Question content */}
                  <h4
                    className={`
                    font-bold mb-4 text-lg
                    ${idx === currentIndex ? "text-blue-900" : "text-gray-800"}
                  `}
                  >
                    {q.title}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options.map((opt) => (
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

                  {/* Points*/}
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
                      {q.points} points
                    </span>
                  </div>
                </div>
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
      </div>
    </div>
  );
};

export default AdminRoom;
