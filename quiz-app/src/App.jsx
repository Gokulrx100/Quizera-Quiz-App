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
import Landing from './pages/LandingPage';
import { SocketProvider } from "./Contexts/SocketContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Route path="/" element={<Landing />} />        
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
  
        {/* Common routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/join-quiz"
          element={
            <ProtectedRoute>
              <JoinQuiz />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-quiz"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <QuizEditor mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-quiz/:quizId"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <QuizEditor mode="edit" />
            </ProtectedRoute>
          }
        />

        {/* socket */}
        <Route element={<SocketRoutesWrapper />}>
          <Route
            path="/room/:roomCode"
            element={
              <ProtectedRoute>
                <UserRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminroom/:quizId"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminRoom />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
