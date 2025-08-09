import React, { useState, useEffect } from "react";
import Navbar from "../components/Common/Navbar";
import QuizTitleInput from "../components/QuizEditor/QuizTitleInput";
import QuestionCard from "../components/QuizEditor/QuestionCard";
import QuizActions from "../components/QuizEditor/QuizActions";
import ErrorMessage from "../components/QuizEditor/ErrorMessage";
import Loading from "../components/Common/Loading";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

const QuizEditor = ({ mode }) => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { quizId } = useParams();

  useEffect(() => {
    if (mode === "edit") {
      const fetchQuiz = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:3000/quiz/${quizId}`,
            {
              headers: { authorization: token },
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
        } finally {
          setLoading(false);
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

  const handleQuestionTextChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].text = value;
    setQuestions(updated);
  };

  const handlePointsChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].points = parseInt(value) || 1;
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

  const handleOptionTextChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex].text = value;
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

  const handleDelete = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
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
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading message="Loading quiz details..." />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center p-8">
        <h2 className="text-3xl font-bold mb-6">
          {mode === "create" ? "Create Quiz" : "Edit Quiz"}
        </h2>

        <ErrorMessage message={message} />

        <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-6 space-y-6">
          <QuizTitleInput title={title} setTitle={setTitle} />

          {questions.map((q, qIndex) => (
            <QuestionCard
              key={qIndex}
              question={q}
              qIndex={qIndex}
              handleQuestionTextChange={handleQuestionTextChange}
              handlePointsChange={handlePointsChange}
              handleOptionTextChange={handleOptionTextChange}
              handleCorrectChange={handleCorrectChange}
              removeQuestion={removeQuestion}
              addOption={addOption}
              removeOption={removeOption}
            />
          ))}

          <QuizActions
            mode={mode}
            addQuestion={addQuestion}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            quizId={quizId}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;
