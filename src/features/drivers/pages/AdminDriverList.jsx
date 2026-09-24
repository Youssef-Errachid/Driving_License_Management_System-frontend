import { useState } from "react";
import { useDrivers } from "../hooks/useDrivers";

const PAGE_SIZE = 10;

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
};

const AdminDriverList = () => {
    const [page, setPage] = useState(0);

    const { data, isLoading, isError } = useDrivers({ page, size: PAGE_SIZE });

    const drivers = data?.content ?? [];
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 1;

    return (
        <div className="flex-1 bg-[#faf8f5] px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des conducteurs</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Consultez la liste de tous les conducteurs enregistrés.
                </p>
            </div>

            {isError && (
                <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger la liste des conducteurs. Veuillez réessayer.
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            <th className="px-6 py-3 whitespace-nowrap">N° Conducteur</th>
                            <th className="px-6 py-3 whitespace-nowrap">Nom complet</th>
                            <th className="px-6 py-3 whitespace-nowrap">Conducteur depuis</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-center text-gray-400">
                                    Chargement...
                                </td>
                            </tr>
                        ) : drivers.length > 0 ? (
                            drivers.map((driver) => (
                                <tr key={driver.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                    <td className="px-6 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                                        {driver.driverNumber}
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        {driver.personFullName || "-"}
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        {formatDate(driver.creationDate)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-center text-gray-400">
                                    Aucun conducteur trouvé
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
                            {Math.min((page + 1) * PAGE_SIZE, totalElements)} sur {totalElements} conducteurs
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

export default AdminDriverList;