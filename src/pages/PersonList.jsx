import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, MoreVertical } from "lucide-react";
import { usePersons } from "../hooks/usePersons";
import PersonActionsMenu from "../components/PersonActionsMenu";

const PAGE_SIZE = 10;

const GENDER_LABELS = {
    MALE: "Homme",
    FEMALE: "Femme",
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
};

const PersonList = () => {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(0);

    const { data, isLoading, isError } = usePersons({ page, size: PAGE_SIZE, query });

    const persons = data?.content ?? [];
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 1;

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
        setPage(0);
    };

    return (
        <div className="flex-1 bg-[#faf8f5] px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des personnes</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Consultez et gérez les demandes de permis de conduire.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearchChange}
                        placeholder="Rechercher par nom ou numéro national"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm
                       focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 focus:border-dlms-navy"
                    />
                </div>

                <Link
                    to="/agent/persons/new"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-dlms-amber text-white text-sm font-semibold
                     hover:bg-dlms-amber/90 transition-colors whitespace-nowrap"
                >
                    <Plus className="h-4 w-4" />
                    Enregistrer une personne
                </Link>
            </div>

            {isError && (
                <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger la liste des personnes. Veuillez réessayer.
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            <th className="px-6 py-3 whitespace-nowrap">Numéro national</th>
                            <th className="px-6 py-3 whitespace-nowrap">Nom</th>
                            <th className="px-6 py-3 whitespace-nowrap">Date de naissance</th>
                            <th className="px-6 py-3 whitespace-nowrap">Genre</th>
                            <th className="px-6 py-3" >Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                    Chargement...
                                </td>
                            </tr>
                        ) : persons.length > 0 ? (
                            persons.map((person) => (
                                <tr key={person.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        {person.nationalNumber}
                                    </td>
                                    <td className="px-6 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                                        <Link to={`/agent/persons/${person.id}`} className="hover:text-dlms-amber">
                                            {person.firstName} {person.lastName}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        {formatDate(person.birthDay)}
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        {GENDER_LABELS[person.gender] || "-"}
                                    </td>
                                    <td className="px-6 py-3.5 text-center">
                                        <PersonActionsMenu person={person} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                    Aucune personne trouvée
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {!query && totalElements > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-500">
                        <span>
                            Affichage de {page * PAGE_SIZE + 1} à{" "}
                            {Math.min((page + 1) * PAGE_SIZE, totalElements)} sur {totalElements} personnes
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

export default PersonList;