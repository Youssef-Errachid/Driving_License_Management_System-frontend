import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, User, Pencil, FilePlus2, Briefcase } from "lucide-react";

const PersonActionsMenu = ({ person }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const actions = [
        {
            label: "Voir le profil",
            icon: User,
            to: `/agent/persons/${person.id}`,
        },
        {
            label: "Modifier",
            icon: Pencil,
            to: `/agent/persons/${person.id}/edit`,
        },
        {
            label: "Nouvelle demande",
            icon: FilePlus2,
            to: `/agent/requests/new?personId=${person.id}`,
        },
        {
            label: "Délivrer un permis",
            icon: Briefcase,
            to: `/agent/licenses/new?personId=${person.id}`,
        },
    ];

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Actions"
            >
                <MoreVertical className="h-4 w-4" />
            </button>

            {open && (
                <div className="absolute right-0 z-30 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">
                            Actions pour <span className="font-semibold text-gray-800">#{person.id}</span>
                        </p>
                    </div>

                    <div className="py-1">
                        {actions.map(({ label, icon: Icon, to }) => (
                            <Link
                                key={label}
                                to={to}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-dlms-navy hover:bg-gray-50 transition-colors"
                            >
                                <Icon className="h-4 w-4 text-dlms-navy" strokeWidth={1.75} />
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonActionsMenu;