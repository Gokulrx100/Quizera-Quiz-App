import React from "react";
import { useNavigate } from "react-router";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-200/30 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-200/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-200/50 w-full max-w-2xl text-center">
          
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            <span className="text-blue-600">Quizera</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Create engaging quizzes and host interactive sessions with real-time participation. 
            Join the future of learning and competition.
          </p>
          
          <div className="flex gap-6 justify-center mb-12">
            <button
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold text-lg"
            >
              Sign In
            </button>
          </div>
          
        </div>

        <div className="mt-16 w-full max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
            Key Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Real-Time</h4>
              <p className="text-gray-600">Live quiz sessions with instant results and dynamic leaderboards</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Easy to Use</h4>
              <p className="text-gray-600">Simple interface for creating quizzes and joining live sessions</p>
            </div>
        
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">🏆</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Competitive</h4>
              <p className="text-gray-600">Engage participants with scoring, rankings, and instant feedback</p>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Landing;