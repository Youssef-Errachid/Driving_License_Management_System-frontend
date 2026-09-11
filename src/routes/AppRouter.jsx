import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import AccessDenied from "../pages/AccessDenied";
import NotFound from "../pages/NotFound";
import AdminDashboard from "../dashboards/AdminDashboard";
import AgentDashboard from "../dashboards/AgentDashboard";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";
import RoleRedirect from "./RoleRedirect";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RoleRedirect />} />

                <Route path="/login" element={<Login />} />
                <Route path="/access-denied" element={<AccessDenied />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>

                    <Route element={<RoleGuard allowedRoles={["AGENT"]} />}>
                        <Route path="/agent/dashboard" element={<AgentDashboard />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}