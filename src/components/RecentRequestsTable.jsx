import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";

const RecentRequestsTable = ({
                                 title = "Demandes récentes",
                                 requests,
                                 columns,
                                 viewAllPath,
                                 showActions = false,
                             }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">{title}</h2>
                {viewAllPath && (
                    <Link
                        to={viewAllPath}
                        className="text-sm font-medium text-dlms-amber hover:underline"
                    >
                        Voir tout
                    </Link>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {columns.map((col) => (
                            <th key={col.key} className="px-6 py-3 whitespace-nowrap">
                                {col.label}
                            </th>
                        ))}
                        {showActions && <th className="px-6 py-3" />}
                    </tr>
                    </thead>
                    <tbody>
                    {requests && requests.length > 0 ? (
                        requests.map((row) => (
                            <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-6 py-3.5 text-gray-700 whitespace-nowrap">
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                                {showActions && (
                                    <td className="px-6 py-3.5 text-right">
                                        <button
                                            type="button"
                                            className="text-gray-400 hover:text-gray-600"
                                            aria-label="Actions"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + (showActions ? 1 : 0)}
                                className="px-6 py-10 text-center text-gray-400"
                            >
                                Aucune demande récente
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentRequestsTable;







