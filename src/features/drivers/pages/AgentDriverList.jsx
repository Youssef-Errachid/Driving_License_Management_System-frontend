import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, Eye, ArrowLeft } from "lucide-react";
import { useDrivers } from "../hooks/useDrivers";
import { useSearchDriver } from "../hooks/useSearchDriver";
import { usePerson } from "../../persons/hooks/usePerson";
import { useRequests } from "../../requests/hooks/useRequests";
import { useDriverLicenses } from "../../licenses/hooks/useDriverLicenses";

const PAGE_SIZE = 10;

const GENDER_LABELS = {
    MALE: "Masculin",
    FEMALE: "Féminin",
};

const SERVICE_TYPE_LABELS = {
    NEW_LICENSE: "Nouveau Permis",
    EXAM_RETAKE: "Reprise d'examen",
    RENEWAL: "Renouvellement",
    LOST_DUPLICATE: "Duplicata perdu",
    DAMAGED_DUPLICATE: "Duplicata endommagé",
    UNBLOCKING: "Déblocage",
    INTERNATIONAL_LICENSE: "Permis international",
};

const REQUEST_STATUS_LABELS = {
    NEW: "Nouvelle",
    COMPLETE: "Terminée",
    CANCELLED: "Annulée",
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

const DriverProfile = ({ driver, onBack }) => {
    const { data: person, isLoading: personLoading } = usePerson(driver.personId);
    const { data: licenses, isLoading: licensesLoading } = useDriverLicenses(driver.id);
    const { data: requestsData, isLoading: requestsLoading } = useRequests({
        nationalNumber: person?.nationalNumber,
        size: 20,
        enabled: Boolean(person?.nationalNumber),
    });
    const requests = requestsData?.content ?? [];

    return (
        <div className="space-y-6">
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
            >
                <ArrowLeft className="h-4 w-4" />
                Retour à la liste
            </button>

            <div className="bg-[#efece5] rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-5">
                    <User className="h-5 w-5 text-dlms-navy" strokeWidth={1.75} />
                    <h3 className="text-base font-bold text-gray-900">Profil du conducteur</h3>
                    <span className="ml-auto text-xs font-semibold text-gray-500">
                        N° Conducteur : {driver.driverNumber}
                    </span>
                </div>

                {personLoading ? (
                    <p className="text-gray-400 text-sm">Chargement des informations...</p>
                ) : person ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Nom complet</p>
                            <Link
                                to={`/agent/persons/${person.id}`}
                                className="text-sm text-dlms-navy font-medium hover:underline"
                            >
                                {person.firstName} {person.lastName}
                            </Link>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Numéro national</p>
                            <p className="text-sm text-gray-800">{person.nationalNumber}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Date de naissance</p>
                            <p className="text-sm text-gray-800">{formatDate(person.birthDay)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Genre</p>
                            <p className="text-sm text-gray-800">{GENDER_LABELS[person.gender] || "-"}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Téléphone</p>
                            <p className="text-sm text-gray-800">{person.phoneNumber || "-"}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Conducteur depuis</p>
                            <p className="text-sm text-gray-800">{formatDate(driver.creationDate)}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">Informations indisponibles.</p>
                )}
            </div>

            <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">Permis ({licenses?.length ?? 0})</h3>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <th className="px-6 py-3 whitespace-nowrap">N° Permis</th>
                                <th className="px-6 py-3 whitespace-nowrap">Catégorie</th>
                                <th className="px-6 py-3 whitespace-nowrap">Délivré le</th>
                                <th className="px-6 py-3 whitespace-nowrap">Expire le</th>
                                <th className="px-6 py-3 whitespace-nowrap">Motif</th>
                                <th className="px-6 py-3 whitespace-nowrap">Statut</th>
                            </tr>
                            </thead>
                            <tbody>
                            {licensesLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        Chargement...
                                    </td>
                                </tr>
                            ) : licenses?.length ? (
                                licenses.map((license) => (
                                    <tr key={license.id} className="border-t border-gray-100">
                                        <td className="px-6 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                                            {license.licenseNumber}
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
                                            {SERVICE_TYPE_LABELS[license.issueReason] || license.issueReason}
                                        </td>
                                        <td className="px-6 py-3.5 whitespace-nowrap">
                                            <BlockingBadge status={license.blockingStatus} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        Aucun permis trouvé
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-base font-bold text-gray-900 mb-3">Demandes ({requests.length})</h3>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <th className="px-6 py-3 whitespace-nowrap">ID</th>
                                <th className="px-6 py-3 whitespace-nowrap">Service</th>
                                <th className="px-6 py-3 whitespace-nowrap">Statut</th>
                                <th className="px-6 py-3 whitespace-nowrap">Créée le</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {requestsLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                        Chargement...
                                    </td>
                                </tr>
                            ) : requests.length ? (
                                requests.map((request) => (
                                    <tr key={request.id} className="border-t border-gray-100">
                                        <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                            #REQ-{request.id}
                                        </td>
                                        <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                            {SERVICE_TYPE_LABELS[request.serviceType] || request.serviceType}
                                        </td>
                                        <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                            {REQUEST_STATUS_LABELS[request.requestStatus] || request.requestStatus}
                                        </td>
                                        <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                            {formatDate(request.creationDate)}
                                        </td>
                                        <td className="px-6 py-3.5 text-center">
                                            <Link
                                                to={`/agent/requests/${request.id}`}
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
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                        Aucune demande trouvée
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DriverList = () => {
    const [nationalNumber, setNationalNumber] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [page, setPage] = useState(0);
    const [selectedDriver, setSelectedDriver] = useState(null);

    const { data, isLoading, isError } = useDrivers({ page, size: PAGE_SIZE });
    const searchMutation = useSearchDriver();

    const drivers = data?.content ?? [];
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 1;

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmedNational = nationalNumber.trim();
        const trimmedLicense = licenseNumber.trim();
        if (!trimmedNational && !trimmedLicense) return;

        searchMutation.mutate(
            {
                nationalNumber: trimmedNational || undefined,
                licenseNumber: trimmedNational ? undefined : trimmedLicense || undefined,
            },
            {
                onSuccess: (response) => {
                    setSelectedDriver(response.data.data);
                },
            },
        );
    };

    const handleBack = () => {
        setSelectedDriver(null);
        setNationalNumber("");
        setLicenseNumber("");
    };

    return (
        <div className="flex-1 bg-[#faf8f5] px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des conducteurs</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Consultez les conducteurs ou recherchez-en un par numéro national ou numéro de permis.
                </p>
            </div>

            {!selectedDriver && (
                <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3 mb-6">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                            Numéro national
                        </label>
                        <input
                            type="text"
                            value={nationalNumber}
                            onChange={(e) => {
                                setNationalNumber(e.target.value);
                                if (e.target.value) setLicenseNumber("");
                            }}
                            placeholder="Ex: AB123456"
                            className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-dlms-navy/30"
                        />
                    </div>

                    <span className="pb-2.5 text-xs text-gray-400">ou</span>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                            Numéro de permis
                        </label>
                        <input
                            type="text"
                            value={licenseNumber}
                            onChange={(e) => {
                                setLicenseNumber(e.target.value);
                                if (e.target.value) setNationalNumber("");
                            }}
                            placeholder="Ex: PL-000123"
                            className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-dlms-navy/30"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={searchMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-dlms-navy text-white text-sm font-semibold
                         hover:bg-dlms-navy/90 transition-colors disabled:opacity-50"
                    >
                        <Search className="h-4 w-4" />
                        Rechercher
                    </button>
                </form>
            )}

            {searchMutation.isPending && (
                <p className="text-gray-400 text-center py-6">Recherche en cours...</p>
            )}

            {searchMutation.isError && !selectedDriver && (
                <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Aucun conducteur trouvé pour ces critères.
                </div>
            )}

            {selectedDriver ? (
                <DriverProfile driver={selectedDriver} onBack={handleBack} />
            ) : (
                <>
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
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
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
                                                {driver.personFullName}
                                            </td>
                                            <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                                {formatDate(driver.creationDate)}
                                            </td>
                                            <td className="px-6 py-3.5 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedDriver(driver)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                    aria-label="Voir le profil"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
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
                </>
            )}
        </div>
    );
};

export default DriverList;