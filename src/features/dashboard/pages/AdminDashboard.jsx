import { FileText, Calendar, Award, Users, Lock, UserPlus, Settings } from "lucide-react";
import { useAuth } from "../../auth/context/useAuth.js";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import StatCard from "../components/StatCard";
import RecentRequestsTable from "../components/RecentRequestsTable";
import StatusBadge from "../../../shared/components/ui/StatusBadge";

const formattedToday = () =>
    new Date().toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

const AdminDashboard = () => {
    const { user } = useAuth();
    const { data, isLoading, isError } = useAdminDashboard();

    const columns = [
        { key: "nationalNumber", label: "Numéro national" },
        { key: "fullName", label: "Nom" },
        { key: "serviceType", label: "Type de service" },
        {
            key: "requestStatus",
            label: "Statut",
            render: (row) => <StatusBadge status={row.requestStatus} />,
        },
        { key: "date", label: "Date" },
    ];

    return (
        <div className="flex-1 bg-[#faf8f5] px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Bienvenue, {user?.fullName || "Admin"} - {formattedToday()}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <UserPlus className="h-4 w-4" />
                        Ajouter un utilisateur
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-dlms-navy text-white text-sm font-semibold hover:bg-dlms-navy/90 transition-colors"
                    >
                        <Settings className="h-4 w-4" />
                        Configurer les catégories
                    </button>
                </div>
            </div>

            {isError && (
                <div className="mb-6 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger les données du tableau de bord. Veuillez réessayer.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <StatCard
                    icon={FileText}
                    title="Demandes du jour"
                    value={isLoading ? "…" : data?.requestsToday ?? 0}
                />
                <StatCard
                    icon={Calendar}
                    title="Examens planifiés aujourd'hui"
                    value={isLoading ? "…" : data?.examsToday?.total ?? 0}
                    breakdown={
                        data?.examsToday
                            ? [
                                { label: "Vision", value: data.examsToday.vision },
                                { label: "Théorique", value: data.examsToday.theory },
                                { label: "Pratique", value: data.examsToday.practical },
                            ]
                            : []
                    }
                />
                <StatCard
                    icon={Award}
                    title="Permis délivrés"
                    value={isLoading ? "…" : data?.licensesIssuedThisWeek ?? 0}
                    subtitle="Cette semaine"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <StatCard
                    icon={Users}
                    title="Utilisateurs actifs"
                    value={isLoading ? "…" : data?.activeUsers ?? 0}
                />
                <StatCard
                    icon={Lock}
                    title="Permis bloqués"
                    value={isLoading ? "…" : data?.blockedLicenses ?? 0}
                    valueClassName="text-red-500"
                />
            </div>

            <RecentRequestsTable
                requests={data?.recentRequests}
                columns={columns}
                viewAllPath="/admin/requests"
            />
        </div>
    );
};

export default AdminDashboard;