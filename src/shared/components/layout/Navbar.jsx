import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, ChevronDown, KeyRound } from "lucide-react";
import { useAuth } from "../../../features/auth/context/useAuth.js";
import dlmsLogo from "../../../assets/dlms-logo.png";

const ADMIN_LINKS = [
    { label: "Accueil", to: "/admin/dashboard" },
    { label: "Demandes", to: "/admin/requests" },
    { label: "Examens", to: "/admin/exams" },
    { label: "Permis", to: "/admin/licenses" },
    { label: "Conducteurs", to: "/admin/drivers" },
    { label: "Utilisateurs", to: "/admin/users" },
    { label: "Configuration", to: "/admin/settings" },
];

const AGENT_LINKS = [
    { label: "Accueil", to: "/agent/dashboard" },
    { label: "Personnes", to: "/agent/persons" },
    { label: "Demandes", to: "/agent/requests" },
    { label: "Examens", to: "/agent/exams" },
    { label: "Permis", to: "/agent/licenses" },
    { label: "Conducteurs", to: "/agent/drivers" },
];

const getInitials = (fullName) => {
    if (!fullName) return "";
    return fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");
};

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const links = user?.role === "ADMIN" ? ADMIN_LINKS : AGENT_LINKS;

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Fermer le menu si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="bg-[#031C57] border-b border-white/10 sticky top-0 z-20">
            <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
                <img
                    src={dlmsLogo}
                    alt="DLMS - Driving License Management System"
                    className="h-7 w-auto select-none pointer-events-none shrink-0"
                />

                <nav className="hidden lg:flex items-center gap-7">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `text-sm font-medium pb-1 border-b-2 transition-colors whitespace-nowrap ${
                                    isActive
                                        ? "text-dlms-amber border-dlms-amber"
                                        : "text-white/70 border-transparent hover:text-white"
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="relative shrink-0" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="flex items-center gap-3 focus:outline-none"
                    >
                        <div className="text-right leading-tight hidden sm:block">
                            <p className="text-sm font-semibold text-white">{user?.fullName}</p>
                            <p className="text-xs font-bold text-dlms-amber">{user?.role}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full border-2 border-dlms-amber flex items-center justify-center text-dlms-amber font-bold text-sm shrink-0">
                            {getInitials(user?.fullName)}
                        </div>
                        <ChevronDown
                            className={`h-4 w-4 text-white/70 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                                <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                                <p className="text-xs text-gray-500">{user?.role}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/change-password");
                                }}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <KeyRound className="h-4 w-4" />
                                Changer le mot de passe
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Se déconnecter
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;