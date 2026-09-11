import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { useAuth } from "../context/useAuth.js";

const NotFound = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleBack = () => {
        if (user?.role === "ADMIN") {
            navigate("/admin/dashboard");
        } else if (user?.role === "AGENT") {
            navigate("/agent/dashboard");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Compass className="h-8 w-8 text-gray-400" strokeWidth={2} />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Page introuvable
                </h1>

                <p className="text-gray-500 mb-8">
                    La page que vous recherchez n'existe pas ou a été déplacée.
                </p>

                <button
                    onClick={handleBack}
                    className="bg-dlms-amber text-white font-semibold text-sm px-6 py-2.5 rounded-lg
                     transition-colors duration-200 hover:bg-dlms-amber/90"
                >
                    Retour au tableau de bord
                </button>
            </div>
        </div>
    );
};

export default NotFound;