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
                            <Route path="/admin/users" element={<ComingSoon title="Gestion des utilisateurs" />} />
                            <Route path="/admin/settings" element={<ComingSoon title="Configuration du systeme" />} />
                        </Route>

                        <Route element={<RoleGuard allowedRoles={["AGENT"]} />}>
                            <Route path="/agent/dashboard" element={<AgentDashboard />} />
                            <Route path="/agent/persons" element={<PersonList />} />
                            <Route path="/agent/persons/new" element={<PersonForm />} />
                            <Route path="/agent/persons/:id/edit" element={<PersonForm />} />
                            <Route path="/agent/persons/:id" element={<PersonDetail />} />
                            <Route path="/agent/requests" element={<RequestList />} />
                            <Route path="/agent/exams" element={<ComingSoon title="Gestion des examens" />} />
                            <Route path="/agent/licenses" element={<ComingSoon title="Gestion des permis" />} />
                            <Route path="/agent/drivers" element={<ComingSoon title="Gestion des conducteurs" />} />

                            <Route path="/agent/requests/:id" element={<RequestDetail />} />
                            <Route path="/agent/exams/new" element={<ComingSoon title="Planifier un examen" />} />
                            <Route path="/agent/licenses/new" element={<ComingSoon title="Delivrer un permis" />} />
                            <Route path="/agent/payments/new" element={<ComingSoon title="Enregistrer un paiement" />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}