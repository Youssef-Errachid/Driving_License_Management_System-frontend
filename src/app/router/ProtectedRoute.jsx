import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/context/useAuth.js";

function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
