// App.jsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import UserRoom from "./pages/UserRoom";
import QuizEditor from "./pages/QuizEditor";
import ErrorPage from "./pages/ErrorPage";
import JoinQuiz from "./pages/JoinQuiz";
import AdminRoom from "./pages/adminRoom";
import { SocketProvider } from "./Contexts/SocketContext";

function SocketRoutesWrapper() {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/create-quiz" element={<QuizEditor mode="create" />} />
        <Route path="/edit-quiz/:quizId" element={<QuizEditor mode="edit" />} />
        <Route path="/join-quiz" element={<JoinQuiz />} />

        <Route element={<SocketRoutesWrapper />}>
          <Route path="/room/:roomCode" element={<UserRoom />} />
          <Route path="/adminroom/:quizId" element={<AdminRoom />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
