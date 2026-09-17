import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Eye } from "lucide-react";
import { useRequests } from "../hooks/useRequests";
import { useLicenseCategories } from "../hooks/useLicenseCategories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import requestService from "../api/services/requestService";
import { toast } from "react-toastify";
import StatusBadge from "../components/StatusBadge";

const PAGE_SIZE = 12;

const SERVICE_TYPE_LABELS = {
    NEW_LICENSE: "Nouveau Permis",
    EXAM_RETAKE: "Reprise d'examen",
    RENEWAL: "Renouvellement",
    LOST_DUPLICATE: "Duplicata perdu",
    DAMAGED_DUPLICATE: "Duplicata endommagé",
    UNBLOCKING: "Déblocage",
    INTERNATIONAL_LICENSE: "Permis international",
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
};

const RequestList = () => {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(0);

    const { data, isLoading, isError } = useRequests({
        nationalNumber: query.trim() || undefined,
        page,
        size: PAGE_SIZE,
    });

    const { data: categories } = useLicenseCategories();
    const categoryMap = (categories || []).reduce((acc, c) => {
        acc[c.id] = c.name;
        return acc;
    }, {});

    const queryClient = useQueryClient();
    const cancelMutation = useMutation({
        mutationFn: (id) => requestService.cancel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["requests"] });
            toast.success("Demande annulée avec succès");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Impossible d'annuler cette demande.",
            );
        },
    });

    const requests = data?.content ?? [];
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 1;

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
        setPage(0);
    };

    const handleCancel = (id) => {
        if (window.confirm("Voulez-vous vraiment annuler cette demande ?")) {
            cancelMutation.mutate(id);
        }
    };

    return (
        <div className="flex-1 bg-[#faf8f5] px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des demandes</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Consultez et gérez les demandes de permis de conduire.
                </p>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearchChange}
                        placeholder="Rechercher par numéro national"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm
                       focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                    />
                </div>

                <Link
                    to="/agent/requests/new"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-dlms-navy text-white text-sm font-semibold
                     hover:bg-dlms-navy/90 transition-colors whitespace-nowrap"
                >
                    <Plus className="h-4 w-4" />
                    Nouvelle
                </Link>
            </div>

            {isError && (
                <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger la liste des demandes. Veuillez réessayer.
                </div>
            )}

            {isLoading ? (
                <p className="text-gray-400 text-center py-10">Chargement...</p>
            ) : requests.length === 0 ? (
                <p className="text-gray-400 text-center py-10">Aucune demande trouvée</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-gray-500">
                                            ID Demande
                                        </p>
                                        <p className="text-sm font-bold text-gray-900">
                                            #REQ-{request.id}
                                        </p>
                                    </div>
                                    <StatusBadge status={request.requestStatus} />
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <p className="text-xs text-gray-400">Personne</p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {request.personFullName || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Service</p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {SERVICE_TYPE_LABELS[request.serviceType] || request.serviceType}
                                        </p>
                                        {request.licenseCategoryId && (
                                            <p className="text-xs text-gray-500">
                                                {categoryMap[request.licenseCategoryId] || `Catégorie #${request.licenseCategoryId}`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <p className="text-xs text-gray-400">
                                    Créé le {formatDate(request.creationDate)}
                                </p>

                                <div className="flex items-center gap-2">
                                    {request.requestStatus === "NEW" && (
                                        <button
                                            type="button"
                                            onClick={() => handleCancel(request.id)}
                                            disabled={cancelMutation.isPending}
                                            className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 text-xs font-semibold
                               hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            Annuler
                                        </button>
                                    )}
                                    <Link
                                        to={`/agent/requests/${request.id}`}
                                        className="text-gray-400 hover:text-gray-600"
                                        aria-label="Voir le détail"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
                        <span className="px-3 py-1.5 rounded-lg bg-dlms-navy text-white">
                            {page + 1}
                        </span>
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

export default RequestList;