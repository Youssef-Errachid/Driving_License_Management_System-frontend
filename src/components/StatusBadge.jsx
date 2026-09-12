const STATUS_STYLES = {
    NEW: {
        label: "Nouveau",
        className: "bg-blue-50 text-blue-700 border border-blue-200",
    },
    COMPLETE: {
        label: "Complété",
        className: "bg-green-50 text-green-700 border border-green-200",
    },
    CANCELLED: {
        label: "Annulé",
        className: "bg-red-50 text-red-700 border border-red-200",
    },
};

const StatusBadge = ({ status }) => {
    const style = STATUS_STYLES[status] || {
        label: status ?? "-",
        className: "bg-gray-100 text-gray-600 border border-gray-200",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${style.className}`}
        >
      {style.label}
    </span>
    );
};

export default StatusBadge;