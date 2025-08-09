import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Navbar from "../components/Common/Navbar";
import RoomHeader from "../components/UserRoom/RoomHeader";
import QuizTimer from "../components/UserRoom/QuizTimer";
import QuestionCard from "../components/UserRoom/QuestionCard";
import Leaderboard from "../components/Common/Leaderboard";
import { useSocket } from "../Contexts/SocketContext";

const UserRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { socketRef, safeSend } = useSocket();

  const [message, setMessage] = useState("Connecting to room...");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerResult, setAnswerResult] = useState("");
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("name");

    if (!userId || !name) {
      alert("No user info found. Please sign in.");
      navigate("/signin");
      return;
    }

    const socket = socketRef.current;
    if (!socket) return;

    console.log("[Room] Connecting with:", { userId, name });

    safeSend({
      type: "joinRoom",
      roomCode: roomCode.trim(),
      name,
      userId,
    });

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("[Room] Server says:", data);

      if (data.error) {
        setMessage(data.error);
        setTimeout(() => navigate("/join-quiz"), 2000);
        return;
      }

      switch (data.type) {
        case "joinedRoom":
          setMessage(`Joined Room: ${data.roomCode}. Waiting for question...`);
          break;
        case "newQuestion":
          setCurrentQuestion(data.question);
          setSelectedOption(null);
          setAnswerResult("");
          setMessage("");
          setIsTimeUp(false);
          setHasSubmitted(false);
          if (data.deadline) {
            const timeRemaining = Math.max(
              0,
              Math.floor((data.deadline - Date.now()) / 1000)
            );
            setTimeLeft(timeRemaining);
            setTotalTime(data.duration);
          }
          break;
        case "timeUp":
          setIsTimeUp(true);
          setTimeLeft(0);
          break;
        case "answerResult":
          setScore(data.score);
          setAnswerResult(data.correct ? "✅ Correct!" : "❌ Wrong!");
          setHasSubmitted(true);
          break;
        case "leaderboard":
          setLeaderboard(data.leaderboard);
          break;
        case "roomClosed":
          alert("Quiz ended.");
          navigate("/join-quiz");
          break;
        default:
          console.warn("Unknown:", data);
      }
    };
  }, [socketRef, roomCode, navigate, safeSend]);

  useEffect(() => {
    if (timeLeft > 0 && !hasSubmitted && !isTimeUp) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimeUp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, hasSubmitted, isTimeUp]);

  const submitAnswer = () => {
    if (!selectedOption || isTimeUp || hasSubmitted) return;
    safeSend({
      type: "submitAnswer",
      questionId: currentQuestion.id,
      selectedOption,
    });
    setHasSubmitted(true);
  };

  const isDisabled = isTimeUp || hasSubmitted;

  const getTimerColor = () => {
    const percentage = (timeLeft / totalTime) * 100;
    if (percentage > 50) return "text-green-700 bg-green-100 border-green-200";
    if (percentage > 20)
      return "text-yellow-700 bg-yellow-100 border-yellow-200";
    return "text-red-700 bg-red-100 border-red-200";
  };

  const getProgressColor = () => {
    const percentage = (timeLeft / totalTime) * 100;
    if (percentage > 50) return "bg-green-500";
    if (percentage > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="flex flex-col items-center p-8 space-y-6">
        <RoomHeader roomCode={roomCode} message={message} score={score} />

        {leaderboard.length > 0 ? (
          <Leaderboard
            leaderboard={leaderboard}
            title="Final Results"
            maxWidth={true}
          />
        ) : (
          <>
            {currentQuestion && (
              <QuizTimer
                timeLeft={timeLeft}
                totalTime={totalTime}
                getTimerColor={getTimerColor}
                getProgressColor={getProgressColor}
              />
            )}

            {currentQuestion && (
              <QuestionCard
                currentQuestion={currentQuestion}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                isDisabled={isDisabled}
                isTimeUp={isTimeUp}
                hasSubmitted={hasSubmitted}
                submitAnswer={submitAnswer}
                answerResult={answerResult}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserRoom;