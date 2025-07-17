import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSocket } from "../Contexts/SocketContext";
import Navbar from "../components/Navbar";
import axios from "axios";

const AdminRoom = () => {
  const navigate = useNavigate();
  const {socketRef, safeSend}=useSocket();
  const {quizId}=useParams();

  const [roomCode, setRoomCode] = useState("");
  const [participants, setParticipants] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [roomCreated, setRoomCreated] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const socket=socketRef.current;
    if(!socket){
      return 
    }


    if (!roomCreated) {
      safeSend({ type: "createRoom", quizId:quizId });
      setRoomCreated(true);
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("AdminRoom received:", data);

      switch (data.type) {
        case "roomCreated":
          setRoomCode(data.roomCode);
          console.log("roomCreated : ",data.roomCode)
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

    return () => {
    };
  }, [socketRef, safeSend, roomCreated, quizId, navigate]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3000/quiz/${quizId}`,
          {
            headers: { authorization: token },
          }
        );
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
        type:"nextQuestion",
        questionId:nextQuestion.id
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
        <div className="w-1/4 bg-white rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-2">Participants</h3>
          <ul className="space-y-1">
            {participants.map((p, idx) => (
              <li key={idx} className="p-2 border rounded">{p}</li>
            ))}
          </ul>
        </div>

        <div className="flex-1 bg-white rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-4">Questions</h3>

          {leaderboard.length > 0 ? (
            <div>
              <h4 className="text-md font-bold mb-2">Leaderboard</h4>
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
          ) : (
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`border p-4 rounded ${
                    idx === currentIndex ? "shadow-lg border-blue-500" : ""
                  }`}
                >
                  <h4 className="font-bold mb-2">{q.title}</h4>
                  <ul className="ml-4 list-disc">
                    {q.options.map((opt) => (
                      <li key={opt.id}>{opt.text}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <button
                onClick={handleSendQuestion}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {currentIndex + 1 < questions.length
                  ? "Send Question"
                  : "Show Leaderboard"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRoom;
