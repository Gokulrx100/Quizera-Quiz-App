import React from "react";

const Loading = ({ message = "Loading..." }) => (
  <div className="min-h-screen flex flex-col bg-gray-100">
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="bg-white shadow-md rounded-2xl p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-gray-600">{message}</p>
      </div>
    </div>
  </div>
);

export default Loading;