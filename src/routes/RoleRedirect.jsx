import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

function RoleRedirect() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === "ADMIN") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "AGENT") {
        return <Navigate to="/agent/dashboard" replace />;
    }

    return <Navigate to="/access-denied" replace />;
}

export default RoleRedirect;