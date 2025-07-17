import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

const QuizEditor = ({ mode }) => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { quizId } = useParams();

  useEffect(() => {
    if (mode === "edit") {
      const fetchQuiz = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:3000/quiz/${quizId}`,
            {
              headers: {
                authorization: token,
              },
            }
          );
          setTitle(response.data.title);
          setQuestions(
            response.data.questions.map((q) => ({
              ...q,
              points: q.points ?? 1,
              options: q.options.map((opt) => ({
                ...opt,
                isCorrect: opt.isCorrect ?? false,
              })),
            }))
          );
        } catch (err) {
          console.error(err);
          setMessage("Failed to load quiz data.");
        }
      };
      fetchQuiz();
    }
  }, [mode, quizId]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        points: 1,
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "", isCorrect: false });
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(optIndex, 1);
    setQuestions(updated);
  };

  const handleCorrectChange = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.map((opt, i) => ({
      ...opt,
      isCorrect: i === optIndex,
    }));
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!title.trim() || questions.length === 0) {
      setMessage("Please add a title and at least one question.");
      return;
    }

    const payload = {
      title,
      questions: questions.map((q) => ({
        id: q.id,
        text: q.text,
        points: q.points ?? 1,
        options: q.options,
      })),
    };

    try {
      const token = localStorage.getItem("token");
      if (mode === "create") {
        await axios.post("http://localhost:3000/quiz", payload, {
          headers: { authorization: token },
        });
        navigate("/admin");
      } else {
        await axios.put(`http://localhost:3000/quiz/${quizId}`, payload, {
          headers: { authorization: token },
        });
        navigate("/admin");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to save quiz.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center p-8">
        <h2 className="text-3xl font-bold mb-6">
          {mode === "create" ? "Create Quiz" : "Edit Quiz"}
        </h2>

        {message && <p className="text-red-600 mb-4">{message}</p>}

        <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-6 space-y-6">
          <div>
            <label className="block font-semibold mb-1">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="border border-gray-300 rounded-xl p-4 space-y-4 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Question {qIndex + 1}</h3>
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>

              <input
                type="text"
                value={q.title}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[qIndex].text = e.target.value;
                  setQuestions(updated);
                }}
                placeholder="Question text"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div>
                <label className="block font-semibold mb-1">Points</label>
                <input
                  type="number"
                  value={q.points}
                  min={1}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[qIndex].points = parseInt(e.target.value) || 1;
                    setQuestions(updated);
                  }}
                  className="w-20 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3">
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIndex].options[optIndex].text = e.target.value;
                        setQuestions(updated);
                      }}
                      placeholder={`Option ${optIndex + 1}`}
                      className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        checked={opt.isCorrect}
                        onChange={() => handleCorrectChange(qIndex, optIndex)}
                      />
                      Correct
                    </label>
                    <button
                      onClick={() => removeOption(qIndex, optIndex)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addOption(qIndex)}
                className="text-blue-600 hover:underline text-sm"
              >
                + Add Option
              </button>
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            + Add Question
          </button>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {mode === "create" ? "Create Quiz" : "Save Changes"}
          </button>

          {mode === "edit" && (
            <button
              onClick={async () => {
                if (
                  window.confirm("Are you sure you want to delete this quiz?")
                ) {
                  try {
                    const token = localStorage.getItem("token");
                    await axios.delete(`http://localhost:3000/quiz/${quizId}`, {
                      headers: { authorization: token },
                    });
                    navigate("/admin");
                  } catch (err) {
                    setMessage("Failed to delete quiz.");
                  }
                }
              }}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition mt-3"
            >
              Delete Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;
