import { useState } from "react";
import { Search } from "lucide-react";
import { useRequests } from "../hooks/useRequests";
import { useLicenseCategories } from "../../licenses/hooks/useLicenseCategories";
import StatusBadge from "../../../shared/components/ui/StatusBadge";

const PAGE_SIZE = 10;

const SERVICE_TYPE_LABELS = {
    NEW_LICENSE: "Nouveau Permis",
    EXAM_RETAKE: "Reprise d'examen",
    RENEWAL: "Renouvellement",
    LOST_DUPLICATE: "Duplicata perdu",
    DAMAGED_DUPLICATE: "Duplicata endommagé",
    UNBLOCKING: "Déblocage",
    INTERNATIONAL_LICENSE: "Permis international",
};

const STATUS_OPTIONS = [
    { value: "", label: "Tous les statuts" },
    { value: "NEW", label: "Nouveau" },
    { value: "COMPLETE", label: "Complété" },
    { value: "CANCELLED", label: "Annulé" },
];

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
};

const AdminRequestList = () => {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [page, setPage] = useState(0);

    const { data, isLoading, isError } = useRequests({
        nationalNumber: query.trim() || undefined,
        status: status || undefined,
        serviceType: serviceType || undefined,
        page,
        size: PAGE_SIZE,
    });

    const { data: categories } = useLicenseCategories();
    const categoryMap = (categories || []).reduce((acc, c) => {
        acc[c.id] = c.name;
        return acc;
    }, {});

    const requests = data?.content ?? [];
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 1;

    const resetPage = (setter) => (e) => {
        setter(e.target.value);
        setPage(0);
    };

    return (
        <div className="flex-1 bg-[#faf8f5] px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des demandes</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Consultez toutes les demandes de permis de conduire.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={resetPage(setQuery)}
                        placeholder="Rechercher par numéro national"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm
                       focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                    />
                </div>

                <select
                    value={status}
                    onChange={resetPage(setStatus)}
                    className="py-2.5 px-3 rounded-lg border border-gray-300 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                >
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <select
                    value={serviceType}
                    onChange={resetPage(setServiceType)}
                    className="py-2.5 px-3 rounded-lg border border-gray-300 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                >
                    <option value="">Tous les services</option>
                    {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {isError && (
                <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger la liste des demandes. Veuillez réessayer.
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto mb-6">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                    <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Personne</th>
                        <th className="px-6 py-3">Service</th>
                        <th className="px-6 py-3">Catégorie</th>
                        <th className="px-6 py-3">Statut</th>
                        <th className="px-6 py-3">Création</th>
                        <th className="px-6 py-3">Annulation</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={7} className="text-gray-400 text-center py-10">
                                Chargement...
                            </td>
                        </tr>
                    ) : requests.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-gray-400 text-center py-10">
                                Aucune demande trouvée
                            </td>
                        </tr>
                    ) : (
                        requests.map((request) => (
                            <tr key={request.id} className="border-t border-gray-100 text-gray-800">
                                <td className="px-6 py-4 font-semibold">REQ-{request.id}</td>
                                <td className="px-6 py-4">{request.personFullName || "-"}</td>
                                <td className="px-6 py-4">
                                    {SERVICE_TYPE_LABELS[request.serviceType] || request.serviceType}
                                </td>
                                <td className="px-6 py-4">
                                    {request.licenseCategoryId
                                        ? categoryMap[request.licenseCategoryId] ||
                                        `Catégorie #${request.licenseCategoryId}`
                                        : "-"}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={request.requestStatus} />
                                </td>
                                <td className="px-6 py-4">{formatDate(request.creationDate)}</td>
                                <td className="px-6 py-4">{formatDate(request.cancellationDate)}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {totalElements > 0 && (
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                        Affichage de {page * PAGE_SIZE + 1} à{" "}
                        {Math.min((page + 1) * PAGE_SIZE, totalElements)} sur {totalElements} demandes
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page === 0}
                            onClick={() => setPage((p) => Math.max(p - 1, 0))}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white disabled:opacity-40"
                        >
                            Précédent
                        </button>
                        <span className="px-3 py-1.5 rounded-lg bg-dlms-navy text-white">{page + 1}</span>
                        <button
                            type="button"
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white disabled:opacity-40"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRequestList;