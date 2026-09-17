import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileText, ClipboardList, Award } from "lucide-react";
import { toast } from "react-toastify";

import { useRequest } from "../hooks/useRequest";
import { useRequestExams } from "../hooks/useRequestExams";
import { useLicenseCategories } from "../hooks/useLicenseCategories";
import requestService from "../api/services/requestService";
import StatusBadge from "../components/StatusBadge";

const SERVICE_TYPE_LABELS = {
    NEW_LICENSE: "Nouveau Permis",
    EXAM_RETAKE: "Reprise d'examen",
    RENEWAL: "Renouvellement",
    LOST_DUPLICATE: "Duplicata perdu",
    DAMAGED_DUPLICATE: "Duplicata endommagé",
    UNBLOCKING: "Déblocage",
    INTERNATIONAL_LICENSE: "Permis international",
};

const EXAM_TYPE_LABELS = {
    VISION: "Vue",
    THEORY: "Théorique",
    PRACTICAL: "Pratique",
};

const EXAM_RESULT_LABELS = {
    PASSED: { label: "Réussi", className: "bg-green-50 text-green-700 border border-green-200" },
    FAILED: { label: "Échoué", className: "bg-red-50 text-red-700 border border-red-200" },
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
};

const RequestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: request, isLoading, isError } = useRequest(id);
    const { data: exams, isLoading: isLoadingExams } = useRequestExams(id);
    const { data: categories } = useLicenseCategories();

    const categoryMap = (categories || []).reduce((acc, c) => {
        acc[c.id] = c.name;
        return acc;
    }, {});

    const cancelMutation = useMutation({
        mutationFn: () => requestService.cancel(id),
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

    const handleCancel = () => {
        if (window.confirm("Voulez-vous vraiment annuler cette demande ?")) {
            cancelMutation.mutate();
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 bg-[#faf8f5] px-8 py-8">
                <p className="text-gray-500">Chargement...</p>
            </div>
        );
    }

    if (isError || !request) {
        return (
            <div className="flex-1 bg-[#faf8f5] px-8 py-8">
                <div className="rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger cette demande.
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-[#faf8f5] px-8 py-8">
            <div className="flex items-center gap-3 mb-6">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-gray-500 hover:text-gray-800"
                    aria-label="Retour"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                    Détail de la demande #REQ-{request.id}
                </h1>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
                <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                            <h3 className="text-base font-bold text-gray-900">Informations générales</h3>
                        </div>
                        <StatusBadge status={request.requestStatus} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Personne</p>
                            <p className="text-sm text-gray-800">
                                {request.personId ? (
                                    <Link
                                        to={`/agent/persons/${request.personId}`}
                                        className="text-dlms-amber hover:underline"
                                    >
                                        {request.personFullName || "-"}
                                    </Link>
                                ) : (
                                    request.personFullName || "-"
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                Type de service
                            </p>
                            <p className="text-sm text-gray-800">
                                {SERVICE_TYPE_LABELS[request.serviceType] || request.serviceType}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                Date de création
                            </p>
                            <p className="text-sm text-gray-800">{formatDate(request.creationDate)}</p>
                        </div>

                        {request.requestStatus === "CANCELLED" && (
                            <>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Date d'annulation
                                    </p>
                                    <p className="text-sm text-gray-800">
                                        {formatDate(request.cancellationDate)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                        Annulé par
                                    </p>
                                    <p className="text-sm text-gray-800">
                                        {request.cancelledByEmail || "-"}
                                    </p>
                                </div>
                            </>
                        )}

                        {request.licenseCategoryId && (
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                    Catégorie de permis
                                </p>
                                <p className="text-sm text-gray-800">
                                    {categoryMap[request.licenseCategoryId] ||
                                        `Catégorie #${request.licenseCategoryId}`}
                                </p>
                            </div>
                        )}

                        {request.licenseNumber && (
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                    Permis associé
                                </p>
                                <p className="text-sm text-gray-800">
                                    <Link
                                        to={`/agent/licenses/${request.licenseId}`}
                                        className="text-dlms-amber hover:underline"
                                    >
                                        {request.licenseNumber}
                                    </Link>
                                </p>
                            </div>
                        )}

                        {request.originalRequestId && (
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">
                                    Demande originale
                                </p>
                                <p className="text-sm text-gray-800">
                                    <Link
                                        to={`/agent/requests/${request.originalRequestId}`}
                                        className="text-dlms-amber hover:underline"
                                    >
                                        #REQ-{request.originalRequestId}
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>

                    {request.requestStatus === "NEW" && (
                        <div className="flex justify-end mt-5 pt-5 border-t border-gray-300">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={cancelMutation.isPending}
                                className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-semibold
                           hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                                {cancelMutation.isPending ? "..." : "Annuler la demande"}
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <ClipboardList className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                        <h3 className="text-base font-bold text-gray-900">Parcours des examens</h3>
                    </div>

                    {isLoadingExams ? (
                        <p className="text-sm text-gray-400">Chargement...</p>
                    ) : exams && exams.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="text-left text-xs font-semibold uppercase text-gray-500 border-b border-gray-300">
                                    <th className="py-2 pr-4">Type</th>
                                    <th className="py-2 pr-4">Rendez-vous</th>
                                    <th className="py-2 pr-4">Résultat</th>
                                    <th className="py-2 pr-4">Date résultat</th>
                                </tr>
                                </thead>
                                <tbody>
                                {exams.map((exam) => (
                                    <tr key={exam.id} className="border-b border-gray-200 last:border-0">
                                        <td className="py-2.5 pr-4 font-medium text-gray-800">
                                            {EXAM_TYPE_LABELS[exam.examType] || exam.examType}
                                        </td>
                                        <td className="py-2.5 pr-4 text-gray-600">
                                            {formatDate(exam.appointmentDate)}
                                        </td>
                                        <td className="py-2.5 pr-4">
                                            {exam.examResult ? (
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${EXAM_RESULT_LABELS[exam.examResult]?.className}`}
                                                >
                    {EXAM_RESULT_LABELS[exam.examResult]?.label}
                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">En attente</span>
                                            )}
                                        </td>
                                        <td className="py-2.5 pr-4 text-gray-600">
                                            {formatDate(exam.resultDate)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">Aucun examen planifié pour cette demande.</p>
                    )}
                </div>

                {request.licenseNumber && (
                    <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Award className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                            <h3 className="text-base font-bold text-gray-900">Permis délivré</h3>
                        </div>
                        <p className="text-sm text-gray-800">
                            Numéro:{" "}
                            <Link
                                to={`/agent/licenses/${request.licenseId}`}
                                className="text-dlms-amber font-medium hover:underline"
                            >
                                {request.licenseNumber}
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestDetail;