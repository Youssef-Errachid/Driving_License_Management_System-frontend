import { Link } from "react-router-dom";
import { FileText, Calendar, Briefcase, UserPlus, PlusCircle, CreditCard, Ban } from "lucide-react";
import { useAuth } from "../../auth/context/useAuth.js";
import { useAgentDashboard } from "../hooks/useAgentDashboard";
import StatCard from "../components/StatCard";
import RecentRequestsTable from "../components/RecentRequestsTable";
import StatusBadge from "../../../shared/components/ui/StatusBadge";

const formattedToday = () =>
    new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

const QUICK_ACTIONS = [
    { label: "Enregistrer une personne", icon: UserPlus, to: "/agent/persons/new" },
    { label: "Nouvelle demande", icon: PlusCircle, to: "/agent/requests/new" },
    { label: "Planifier un examen", icon: Calendar, to: "/agent/exams" },
    { label: "Délivrer un permis", icon: Briefcase, to: "/agent/licenses/new" },
    { label: "Enregistrer un paiement", icon: CreditCard, to: "/agent/payments/new" },
];

const AgentDashboard = () => {
    const { user } = useAuth();
    const { data, isLoading, isError } = useAgentDashboard();

    const columns = [
        {
            key: "requestNumber",
            label: "N° Demande",
            render: (row) => (
                <Link
                    to={`/agent/requests/${row.id}`}
                    className="text-dlms-amber font-medium hover:underline"
                >
                    {row.requestNumber}
                </Link>
            ),
        },
        { key: "applicantFullName", label: "Demandeur" },
        { key: "serviceType", label: "Type" },
        { key: "date", label: "Date" },
        {
            key: "requestStatus",
            label: "Statut",
            render: (row) => <StatusBadge status={row.requestStatus} />,
        },
    ];

    return (
        <div className="flex-1 bg-[#faf8f5] px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                    <p className="text-sm text-gray-500 mt-1 capitalize">
                        Bienvenue, {user?.fullName || "Agent"} - {formattedToday()}
                    </p>
                </div>

                <Link
                    to="/agent/licenses/block"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <Ban className="h-4 w-4" />
                    Bloquer un permis
                </Link>
            </div>

            {isError && (
                <div className="mb-6 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger les données du tableau de bord. Veuillez réessayer.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 rounded-2xl p-4">
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
                    icon={Briefcase}
                    title="Permis délivrés cette semaine"
                    value={isLoading ? "…" : data?.licensesIssuedThisWeek ?? 0}
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
                    <Link
                        key={label}
                        to={to}
                        className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm py-6 px-3 text-center hover:shadow-md transition-shadow"
                    >
                        <Icon className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                        <span className="text-xs font-medium text-gray-700">{label}</span>
                    </Link>
                ))}
            </div>

            <RecentRequestsTable
                requests={data?.recentRequests}
                columns={columns}
                viewAllPath="/agent/requests"
                showActions
            />
        </div>
    );
};

export default AgentDashboard;