import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Eye } from "lucide-react";
import { useLicenses } from "../hooks/useLicenses";

const PAGE_SIZE = 10;

const ISSUE_REASON_LABELS = {
    NEW: "Nouveau Permis",
    RENEWAL: "Renouvellement",
    REPLACEMENT_LOST: "Duplicata perdu",
    REPLACEMENT_DAMAGED: "Duplicata endommagé",
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
};

const BlockingBadge = ({ status }) => {
    const blocked = status === "BLOCKED";
    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border
                ${blocked ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}
        >
            {blocked ? "Bloqué" : "Actif"}
        </span>
    );
};

const LicenseList = () => {
    const [query, setQuery] = useState("");
    const [blockingStatus, setBlockingStatus] = useState("");
    const [issueReason, setIssueReason] = useState("");
    const [page, setPage] = useState(0);

    const { data, isLoading, isError } = useLicenses({
        query: query.trim() || undefined,
        blockingStatus: blockingStatus || undefined,
        issueReason: issueReason || undefined,
        page,
        size: PAGE_SIZE,
    });

    const licenses = data?.content ?? [];
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 1;

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
        setPage(0);
    };

    const handleBlockingStatusChange = (e) => {
        setBlockingStatus(e.target.value);
        setPage(0);
    };

    const handleIssueReasonChange = (e) => {
        setIssueReason(e.target.value);
        setPage(0);
    };

    return (
        <div className="flex-1 bg-[#faf8f5] px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des permis</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Consultez et recherchez les permis délivrés.
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearchChange}
                            placeholder="N° permis, N° national ou nom"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm
                           focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                        />
                    </div>

                    <select
                        value={blockingStatus}
                        onChange={handleBlockingStatusChange}
                        className="px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="UNBLOCKED">Actif</option>
                        <option value="BLOCKED">Bloqué</option>
                    </select>

                    <select
                        value={issueReason}
                        onChange={handleIssueReasonChange}
                        className="px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm
                       focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                    >
                        <option value="">Tous les motifs</option>
                        {Object.entries(ISSUE_REASON_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <Link
                    to="/agent/licenses/new"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-dlms-navy text-white text-sm font-semibold
                     hover:bg-dlms-navy/90 transition-colors whitespace-nowrap"
                >
                    <Plus className="h-4 w-4" />
                    Délivrer un permis
                </Link>
            </div>

            {isError && (
                <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger la liste des permis. Veuillez réessayer.
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            <th className="px-6 py-3 whitespace-nowrap">N° Permis</th>
                            <th className="px-6 py-3 whitespace-nowrap">Titulaire</th>
                            <th className="px-6 py-3 whitespace-nowrap">Catégorie</th>
                            <th className="px-6 py-3 whitespace-nowrap">Délivré le</th>
                            <th className="px-6 py-3 whitespace-nowrap">Expire le</th>
                            <th className="px-6 py-3 whitespace-nowrap">Motif</th>
                            <th className="px-6 py-3 whitespace-nowrap">Statut</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-10 text-center text-gray-400">
                                    Chargement...
                                </td>
                            </tr>
                        ) : licenses.length > 0 ? (
                            licenses.map((license) => (
                                <tr key={license.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                    <td className="px-6 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                                        {license.licenseNumber}
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        {license.holderFullName}
                                        <span className="block text-xs text-gray-400">
                                            {license.holderNationalNumber}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        {license.licenseCategoryName}
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        {formatDate(license.issueDate)}
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        {formatDate(license.expirationDate)}
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        {ISSUE_REASON_LABELS[license.issueReason] || license.issueReason}
                                    </td>
                                    <td className="px-6 py-3.5 whitespace-nowrap">
                                        <BlockingBadge status={license.blockingStatus} />
                                    </td>
                                    <td className="px-6 py-3.5 text-center">
                                        <Link
                                            to={`/agent/licenses/${license.id}`}
                                            className="text-gray-400 hover:text-gray-600"
                                            aria-label="Voir le détail"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-10 text-center text-gray-400">
                                    Aucun permis trouvé
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
                            {Math.min((page + 1) * PAGE_SIZE, totalElements)} sur {totalElements} permis
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

export default LicenseList;