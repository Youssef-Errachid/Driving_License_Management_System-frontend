import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import AccessDenied from "../pages/AccessDenied";
import NotFound from "../pages/NotFound";
import ComingSoon from "../pages/ComingSoon";
import AdminDashboard from "../dashboards/AdminDashboard";
import AgentDashboard from "../dashboards/AgentDashboard";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";
import RoleRedirect from "./RoleRedirect";
import Layout from "../components/Layout";
import PersonList from "../pages/PersonList.jsx";
import PersonForm from "../pages/PersonForm.jsx";
import PersonDetail from "../pages/PersonDetail.jsx";
import RequestList from "../pages/RequestList.jsx";
import RequestDetail from "../pages/RequestDetail.jsx";
import RequestForm from "../pages/RequestForm.jsx";
import ExamTypeSettings from "../pages/ExamTypeSettings.jsx";
import ExamList from "../pages/ExamList.jsx";
import DriverList from "../pages/DriverList.jsx";
import UserList from "../pages/UserList.jsx";
import UserForm from "../pages/UserForm.jsx";
import LicenseForm from "../pages/LicenseForm.jsx";
import LicenseList from "../pages/LicenseList.jsx";
import LicenseDetail from "../pages/LicenseDetail.jsx";
import PaymentForm from "../pages/PaymentForm.jsx";

export default function AppRouter() {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<RoleRedirect />} />
                <Route path="/login" element={<Login />} />

                <Route element={<Layout />} >
                    <Route path="/access-denied" element={<AccessDenied />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/requests" element={<ComingSoon title="Gestion des demandes" />} />
                            <Route path="/admin/exams" element={<ComingSoon title="Gestion des examens" />} />
                            <Route path="/admin/licenses" element={<ComingSoon title="Gestion des permis" />} />
                            <Route path="/admin/drivers" element={<ComingSoon title="Gestion des conducteurs" />} />
                            <Route path="/admin/users" element={<UserList />} />
                            <Route path="/admin/users/new" element={<UserForm />} />                            <Route path="/admin/settings" element={<ExamTypeSettings />} />
                        </Route>

                        <Route element={<RoleGuard allowedRoles={["AGENT"]} />}>
                            <Route path="/agent/dashboard" element={<AgentDashboard />} />
                            <Route path="/agent/persons" element={<PersonList />} />
                            <Route path="/agent/persons/new" element={<PersonForm />} />
                            <Route path="/agent/persons/:id/edit" element={<PersonForm />} />
                            <Route path="/agent/persons/:id" element={<PersonDetail />} />
                            <Route path="/agent/requests" element={<RequestList />} />
                            <Route path="/agent/exams" element={<ExamList />} />
                            <Route path="/agent/licenses" element={<LicenseList />} />
                            +<Route path="/agent/drivers" element={<DriverList />} />

                            <Route path="/agent/requests/:id" element={<RequestDetail />} />
                            <Route path="/agent/requests/new" element={<RequestForm />} />
                            <Route path="/agent/exams/new" element={<ComingSoon title="Planifier un examen" />} />
                            <Route path="/agent/licenses/new" element={<LicenseForm />} />
                            <Route path="/agent/licenses/:id" element={<LicenseDetail />} />
                            <Route path="/agent/payments/new" element={<PaymentForm />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}