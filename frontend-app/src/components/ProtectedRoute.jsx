import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = jwtDecode(token);
    // Check if the user's role is in the allowed list
    if (allowedRoles.includes(user.role)) {
      return children;
    } else {
      // Role is not authorized, send to a safe place
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    // Token is invalid/malformed
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}