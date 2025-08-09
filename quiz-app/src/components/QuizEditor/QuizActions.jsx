import React from "react";

const QuizActions = ({ 
  mode, 
  addQuestion, 
  handleSubmit, 
  handleDelete, 
  quizId 
}) => (
  <div className="space-y-3">
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
        onClick={() => handleDelete(quizId)}
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
      >
        Delete Quiz
      </button>
    )}
  </div>
);

export default QuizActions;