import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 1. If no token, kick them to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If they have a token but aren't an admin, kick them out
  if (role !== "admin") {
    return <Navigate to="/" replace />; 
  }

  // 3. Otherwise, show the dashboard
  return children;
};

export default ProtectedRoute;