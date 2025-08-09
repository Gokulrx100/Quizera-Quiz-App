import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useSocket } from "../Contexts/SocketContext";
import Navbar from "../components/Navbar";
import ParticipantsList from "../components/AdminRoom/ParticipantsList";
import QuestionSection from "../components/AdminRoom/QuestionSection";
import axios from "axios";

const AdminRoom = () => {
  const navigate = useNavigate();
  const { socketRef, safeSend } = useSocket();
  const { quizId } = useParams();

  const [roomCode, setRoomCode] = useState("");
  const [participants, setParticipants] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [leaderboard, setLeaderboard] = useState([]);
  const roomCreatedRef = useRef(false);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    if (!roomCreatedRef.current) {
      safeSend({ type: "createRoom", quizId: quizId });
      roomCreatedRef.current = true;
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
  }, [socketRef, safeSend, quizId, navigate]);

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
        <ParticipantsList participants={participants} />
        <QuestionSection
          leaderboard={leaderboard}
          questions={questions}
          currentIndex={currentIndex}
          handleSendQuestion={handleSendQuestion}
        />
      </div>
    </div>
  );
};

export default AdminRoom;