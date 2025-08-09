import React, { useEffect, useState } from "react";
import Navbar from "../components/Common/Navbar";
import axios from "axios";
import { useNavigate } from "react-router";

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/quiz/getall", {
          headers: {
            authorization: token,
          },
        });
        setQuizzes(response.data.quizzes);
        if (!response.data.quizzes || response.data.quizzes.length === 0) {
          setMessage("No quizzes yet");
        } else {
          setMessage("");
        }
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleEdit = (quizId) => {
    navigate(`/edit-quiz/${quizId}`);
  };

  const handleStart = (quizId) => {
    console.log(`Start quiz ${quizId}`);
    localStorage.setItem("quizId",quizId);
    navigate(`/adminroom/${quizId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex flex-col items-center p-8">
        <h2 className="text-3xl font-bold mt-10 mb-15">Your Quizzes</h2>

        {loading && <p>Loading quizzes...</p>}
        {message && <p className="text-red-600">{message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 w-full max-w-5xl">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between items-center w-full h-45 hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-3 mt-3">{quiz.title}</h3>
              <div className="flex space-x-6 mb-2">
                <button
                  onClick={() => handleEdit(quiz.id)}
                  className="bg-blue-600 text-white px-10 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleStart(quiz.id)}
                  className="bg-green-600 text-white px-9 py-2 rounded hover:bg-green-700 transition-colors duration-200"
                >
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
