import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
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
        alert(data.error);
        navigate("/join-quiz");
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
            const timeRemaining = Math.max(0, Math.floor((data.deadline - Date.now()) / 1000));
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
    if (percentage > 20) return "text-yellow-700 bg-yellow-100 border-yellow-200";
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
        {/* Room Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 w-full max-w-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Room: {roomCode}</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <p className="text-lg text-gray-600">{message}</p>
            </div>
            <div className="mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-full inline-block font-semibold">
              Score: {score} points
            </div>
          </div>
        </div>

        {/* Timer */}
        {currentQuestion && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50 w-full max-w-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center">
                  ⏱️
                </div>
                <span className="text-lg font-semibold text-gray-800">Time Remaining</span>
              </div>
              
              <div className={`px-4 py-2 rounded-full border font-bold text-lg ${getTimerColor()}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor()}`}
                style={{ width: `${Math.max(0, (timeLeft / totalTime) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Current Question */}
        {currentQuestion && (
          <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl border-2 border-blue-400 ring-4 ring-blue-200/50 w-full max-w-2xl transform transition-all duration-300">
            {/* Question indicator */}
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center shadow-lg">
              ?
            </div>

            {/* Status indicators */}
            {isTimeUp && (
              <div className="absolute -top-2 -right-2">
                <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow-md animate-pulse">
                  Time's up
                </span>
              </div>
            )}
            
            {hasSubmitted && !isTimeUp && (
              <div className="absolute -top-2 -right-2">
                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                  Submitted
                </span>
              </div>
            )}

            <h3 className="text-2xl font-bold mb-6 text-blue-900 pr-8">{currentQuestion.text}</h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => (
                <label 
                  key={opt.id} 
                  className={`
                    group flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 
                    ${isDisabled 
                      ? 'cursor-not-allowed opacity-50 bg-gray-100 border-gray-300' 
                      : 'cursor-pointer'
                    }
                    ${!isDisabled && selectedOption === opt.id 
                      ? 'bg-blue-50 border-blue-300 shadow-md transform scale-102' 
                      : !isDisabled 
                      ? 'bg-gray-50/60 border-gray-200 hover:bg-blue-50/50 hover:border-blue-200 hover:shadow-sm'
                      : ''
                    }
                  `}
                >
                  {/* Option indicator */}
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                    ${isDisabled 
                      ? 'bg-gray-400 text-gray-600' 
                      : selectedOption === opt.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-300 text-gray-600 group-hover:bg-blue-400 group-hover:text-white'
                    }
                  `}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  
                  <input
                    type="radio"
                    name="option"
                    value={opt.id}
                    checked={selectedOption === opt.id}
                    onChange={() => !isDisabled && setSelectedOption(opt.id)}
                    disabled={isDisabled}
                    className="sr-only"
                  />
                  
                  <span className={`text-lg ${
                    isDisabled 
                      ? 'text-gray-500' 
                      : selectedOption === opt.id 
                      ? 'text-blue-900 font-medium' 
                      : 'text-gray-700'
                  }`}>
                    {opt.text}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={submitAnswer}
              disabled={!selectedOption || isDisabled}
              className={`
                mt-6 w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg
                ${selectedOption && !isDisabled
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:scale-102' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isTimeUp 
                ? 'Time\'s up!' 
                : hasSubmitted
                ? 'Answer Submitted'
                : selectedOption 
                ? 'Submit Answer' 
                : 'Please select an option'
              }
            </button>

            {/* Answer Result */}
            {answerResult && (
              <div className={`
                mt-4 p-4 rounded-lg text-center font-semibold text-lg
                ${answerResult.includes('Correct') 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
                }
              `}>
                {answerResult}
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 w-full max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-yellow-500 text-white text-sm font-bold flex items-center justify-center">
                🏆
              </div>
              <h3 className="text-xl font-bold text-gray-800">Leaderboard</h3>
            </div>
            
            <div className="space-y-2">
              {leaderboard
                .sort((a, b) => b.score - a.score)
                .map((entry, idx) => (
                  <div 
                    key={entry.userId} 
                    className={`
                      flex items-center justify-between p-3 rounded-lg transition-all duration-200
                      ${idx === 0 
                        ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300' 
                        : idx === 1 
                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300'
                        : idx === 2
                        ? 'bg-gradient-to-r from-orange-100 to-orange-200 border border-orange-300'
                        : 'bg-gray-50 border border-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                        ${idx === 0 ? 'bg-yellow-500 text-white' 
                          : idx === 1 ? 'bg-gray-500 text-white'
                          : idx === 2 ? 'bg-orange-500 text-white'
                          : 'bg-blue-500 text-white'
                        }
                      `}>
                        {idx + 1}
                      </div>
                      <span className="font-medium text-gray-800">{entry.name}</span>
                    </div>
                    <span className="font-bold text-gray-700">{entry.score} pts</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRoom;
