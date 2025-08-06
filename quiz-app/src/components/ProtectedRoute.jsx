import React from 'react';
import { Navigate } from 'react-router';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    if (userRole === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/join-quiz" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;