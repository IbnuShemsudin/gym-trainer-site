import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 1. If no token, kick them to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If a specific role is required (like 'admin') and user doesn't have it
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />; 
  }

  // 3. Otherwise, show the content (works for general logged-in users)
  return children;
};

export default ProtectedRoute;