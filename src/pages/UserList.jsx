import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { useUsers } from "../hooks/useUsers";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useDeleteUser } from "../hooks/useDeleteUser";

const PAGE_SIZE = 10;

const ROLE_LABELS = {
    ADMIN: "Administrateur",
    AGENT: "Agent",
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
};

const StatusBadge = ({ status }) => {
    const suspended = status === "SUSPENDED";
    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border
                ${suspended ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}
        >
            {suspended ? "Suspendu" : "Actif"}
        </span>
    );
};

const UserList = () => {
    const [page, setPage] = useState(0);

    const { data, isLoading, isError } = useUsers({ page, size: PAGE_SIZE });
    const updateMutation = useUpdateUser();
    const deleteMutation = useDeleteUser();

    const users = data?.content ?? [];
    const totalElements = data?.totalElements ?? 0;
    const totalPages = data?.totalPages ?? 1;

    const handleRoleChange = (user, role) => {
        if (role === user.role) return;
        updateMutation.mutate({ id: user.id, role, userStatus: user.userStatus });
    };

    const handleToggleStatus = (user) => {
        const userStatus = user.userStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
        updateMutation.mutate({ id: user.id, role: user.role, userStatus });
    };

    const handleDelete = (user) => {
        if (window.confirm(`Voulez-vous vraiment supprimer le compte de ${user.personFullName} ?`)) {
            deleteMutation.mutate(user.id);
        }
    };

    return (
        <div className="flex-1 bg-[#faf8f5] px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gérez les comptes administrateurs et agents du système.
                    </p>
                </div>

                <Link
                    to="/admin/users/new"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-dlms-amber text-white text-sm font-semibold
                     hover:bg-dlms-amber/90 transition-colors whitespace-nowrap"
                >
                    <Plus className="h-4 w-4" />
                    Nouvel utilisateur
                </Link>
            </div>

            {isError && (
                <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
                    Impossible de charger la liste des utilisateurs. Veuillez réessayer.
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            <th className="px-6 py-3 whitespace-nowrap">Nom complet</th>
                            <th className="px-6 py-3 whitespace-nowrap">Email</th>
                            <th className="px-6 py-3 whitespace-nowrap">Rôle</th>
                            <th className="px-6 py-3 whitespace-nowrap">Statut</th>
                            <th className="px-6 py-3 whitespace-nowrap">Créé le</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                    Chargement...
                                </td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                    <td className="px-6 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                                        {user.personFullName}
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-3.5 whitespace-nowrap">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user, e.target.value)}
                                            disabled={updateMutation.isPending}
                                            className="px-2 py-1.5 rounded-lg border border-gray-300 text-sm bg-white
                                             focus:outline-none focus:ring-2 focus:ring-dlms-navy/30 disabled:opacity-50"
                                        >
                                            <option value="ADMIN">{ROLE_LABELS.ADMIN}</option>
                                            <option value="AGENT">{ROLE_LABELS.AGENT}</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-3.5 whitespace-nowrap">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleStatus(user)}
                                            disabled={updateMutation.isPending}
                                            className="disabled:opacity-50"
                                        >
                                            <StatusBadge status={user.userStatus} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-600 whitespace-nowrap">
                                        {formatDate(user.creationDate)}
                                    </td>
                                    <td className="px-6 py-3.5 text-center">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(user)}
                                            disabled={deleteMutation.isPending}
                                            className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                                            aria-label="Supprimer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                    Aucun utilisateur trouvé
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
                            {Math.min((page + 1) * PAGE_SIZE, totalElements)} sur {totalElements} utilisateurs
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

export default UserList;