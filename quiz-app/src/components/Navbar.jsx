import React from "react";
import { Link, useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (role === "ADMIN") {
      navigate("/admin");
    } else if (role === "USER") {
      navigate("/join-quiz");
    } else {
      navigate("/signin");
    }
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <a
        onClick={handleHomeClick}
        className="text-2xl font-bold hover:text-blue-200 cursor-pointer transition-colors duration-200"
      >
        Quizera
      </a>

      <div className="flex items-center space-x-6">
        <span className="text-blue-100 font-medium">Hi, {name}</span>
        
        <Link
          to="/profile"
          className="px-3 py-2 rounded-lg hover:bg-blue-500/50 hover:text-white transition-all duration-200 font-medium"
        >
          Profile
        </Link>

        {role === "ADMIN" && (
          <>
            <Link
              to="/create-quiz"
              className="px-3 py-2 rounded-lg hover:bg-blue-500/50 hover:text-white transition-all duration-200 font-medium"
            >
              Create Quiz
            </Link>
            <Link
              to="/join-quiz"
              className="px-3 py-2 rounded-lg hover:bg-blue-500/50 hover:text-white transition-all duration-200 font-medium"
            >
              Join Quiz
            </Link>
          </>
        )}

        {role === "USER" && (
          <Link
            to="/join-quiz"
            className="px-3 py-2 rounded-lg hover:bg-blue-500/50 hover:text-white transition-all duration-200 font-medium"
          >
            Join Quiz
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
