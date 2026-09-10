import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AccessDenied from "../pages/AccessDenied";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}></Route>

          <Route element={<RoleGuard allowedRoles={["AGENT"]} />}></Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
