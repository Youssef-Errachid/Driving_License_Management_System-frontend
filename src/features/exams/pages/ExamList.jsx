import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye } from "lucide-react";
import { useExams } from "../hooks/useExams";

const PAGE_SIZE = 10;

const EXAM_TYPE_LABELS = {
    VISION: "Examen de la Vue",
    THEORY: "Examen Théorique",
    PRACTICAL: "Examen Pratique",
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
};

const ExamResultBadge = ({ examResult }) => {
    if (examResult === "PASSED") {
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                Admis
            </span>
        );
    }
    if (examResult === "FAILED") {
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                Échoué
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            En attente
        </span>
    );
};

const ExamList = () => {
    const [examType, setExamType] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [pendingOnly, setPendingOnly] = useState(false);
    const [page, setPage] = useState(0);

    const { data, isLoading, isError } = useExams({
        examType: examType || undefined,
        appointmentDate: appointmentDate || undefined,
        pendingOnly,
        page,
        size: PAGE_SIZE,
    });

    const exams = data?.content ?? [];
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 1;

    const resetPage = () => setPage(0);

    return (
        <div className="flex-1 bg-[#faf8f5] px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des examens</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Consultez les examens planifiés et en attente de résultat.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
                <select
                    value={examType}
                    onChange={(e) => { setExamType(e.target.value); resetPage(); }}
                    className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-dlms-navy/30"
                >
                    <option value="">Tous les types</option>
                    <option value="VISION">Examen de la Vue</option>
                    <option value="THEORY">Examen Théorique</option>
                    <option value="PRACTICAL">Examen Pratique</option>
                </select>

                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => { setAppointmentDate(e.target.value); resetPage(); }}
                        className="pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-dlms-navy/30"
                    />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700 px-3 py-2.5 rounded-lg border border-gray-300 bg-white cursor-pointer">
                    <input
                        type="checkbox"
                        checked={pendingOnly}
                        onChange={(e) => { setPendingOnly(e.target.checked); resetPage(); }}
                    />
                    En attente uniquement
                </label>
            </div>

            {isError && (
                <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger la liste des examens. Veuillez réessayer.
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            <th className="px-6 py-3 whitespace-nowrap">Type d'examen</th>
                            <th className="px-6 py-3 whitespace-nowrap">Personne</th>
                            <th className="px-6 py-3 whitespace-nowrap">Demande</th>
                            <th className="px-6 py-3 whitespace-nowrap">Date</th>
                            <th className="px-6 py-3 whitespace-nowrap">Note</th>
                            <th className="px-6 py-3 whitespace-nowrap">Résultat</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                                    Chargement...
                                </td>
                            </tr>
                        ) : exams.length > 0 ? (
                            exams.map((exam) => (
                                <tr key={exam.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                    <td className="px-6 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                                        {EXAM_TYPE_LABELS[exam.examType] || exam.examType}
                                    </td>
                                    <td className="px-6 py-3.5 whitespace-nowrap">
                                        <p className="text-gray-800">{exam.personFullName || "-"}</p>
                                        <p className="text-xs text-gray-400">{exam.personNationalNumber}</p>
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        #REQ-{exam.requestId}
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        {formatDate(exam.examResult ? exam.resultDate : exam.appointmentDate)}
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        {exam.examType === "THEORY" && exam.score != null ? `${exam.score}/40` : "-"}
                                    </td>
                                    <td className="px-6 py-3.5 whitespace-nowrap">
                                        <ExamResultBadge examResult={exam.examResult} />
                                    </td>
                                    <td className="px-6 py-3.5 text-center">
                                        <Link
                                            to={`/agent/requests/${exam.requestId}`}
                                            className="text-gray-400 hover:text-gray-600"
                                            aria-label="Voir la demande"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                                    Aucun examen trouvé
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {totalElements > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-500">
                        <span>
                            Affichage de {page * PAGE_SIZE + 1} à{" "}
                            {Math.min((page + 1) * PAGE_SIZE, totalElements)} sur {totalElements} examens
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={page === 0}
                                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40"
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
                                className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamList;