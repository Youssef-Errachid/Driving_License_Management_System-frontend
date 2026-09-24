import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../../features/auth/pages/Login";
import AccessDenied from "../../shared/pages/AccessDenied";
import NotFound from "../../shared/pages/NotFound";
import ComingSoon from "../../shared/pages/ComingSoon";
import AdminDashboard from "../../features/dashboard/pages/AdminDashboard";
import AgentDashboard from "../../features/dashboard/pages/AgentDashboard";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";
import RoleRedirect from "./RoleRedirect";
import Layout from "../../shared/components/layout/Layout";
import PersonList from "../../features/persons/pages/PersonList.jsx";
import PersonForm from "../../features/persons/pages/PersonForm.jsx";
import PersonDetail from "../../features/persons/pages/PersonDetail.jsx";
import RequestList from "../../features/requests/pages/RequestList.jsx";
import RequestDetail from "../../features/requests/pages/RequestDetail.jsx";
import RequestForm from "../../features/requests/pages/RequestForm.jsx";
import ExamTypeSettings from "../../features/exams/pages/ExamTypeSettings.jsx";
import ExamList from "../../features/exams/pages/ExamList.jsx";
import DriverList from "../../features/drivers/pages/DriverList.jsx";
import UserList from "../../features/users/pages/UserList.jsx";
import UserForm from "../../features/users/pages/UserForm.jsx";
import LicenseForm from "../../features/licenses/pages/LicenseForm.jsx";
import LicenseList from "../../features/licenses/pages/LicenseList.jsx";
import LicenseDetail from "../../features/licenses/pages/LicenseDetail.jsx";
import PaymentForm from "../../features/payments/pages/PaymentForm.jsx";
import LicenseBlockForm from "../../features/licenses/pages/LicenseBlockForm.jsx";
import ChangePassword from "../../features/auth/pages/ChangePassword.jsx";
import AdminRequestList from "../../features/requests/pages/AdminRequestList.jsx";
import AdminExamList from "../../features/exams/pages/AdminExamList.jsx";
import AdminLicenseList from "../../features/licenses/pages/AdminLicenseList.jsx";

export default function AppRouter() {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<RoleRedirect />} />
                <Route path="/login" element={<Login />} />

                <Route element={<Layout />} >
                    <Route path="/access-denied" element={<AccessDenied />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/requests" element={<AdminRequestList />} />
                            <Route path="/admin/exams" element={<AdminExamList />} />
                            <Route path="/admin/licenses" element={<AdminLicenseList />} />
                            <Route path="/admin/drivers" element={<ComingSoon title="Gestion des conducteurs" />} />
                            <Route path="/admin/users" element={<UserList />} />
                            <Route path="/admin/users/new" element={<UserForm />} />
                            <Route path="/admin/settings" element={<ExamTypeSettings />} />
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
                            <Route path="/agent/drivers" element={<DriverList />} />

                            <Route path="/agent/requests/:id" element={<RequestDetail />} />
                            <Route path="/agent/requests/new" element={<RequestForm />} />
                            <Route path="/agent/licenses/new" element={<LicenseForm />} />
                            <Route path="/agent/licenses/block" element={<LicenseBlockForm />} />
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