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

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <Link to="/" className="text-lg font-bold hover:text-blue-200">
        Quiz App
      </Link>

      <div className="flex items-center space-x-9">
        <span>Hi, {name}</span>
        <Link
          to="/profile"
          className="hover:text-blue-200 transition-colors duration-200"
        >
          Profile
        </Link>

        {role === "ADMIN" && (
          <Link
            to="/create-quiz"
            className="hover:text-blue-200 transition-colors duration-200"
          >
            Create Quiz
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
